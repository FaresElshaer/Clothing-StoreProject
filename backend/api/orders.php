<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data || empty($data['customer']) || empty($data['items']) || !is_array($data['items'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid order data']);
    exit;
}

$customer = $data['customer'];
$requiredFields = ['name', 'phone', 'address'];
foreach ($requiredFields as $field) {
    if (empty(trim($customer[$field] ?? ''))) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Customer $field is required"]);
        exit;
    }
}

$availableDiscounts = [
    'STYLE10' => 0.10,
    'STUDENT15' => 0.15,
];

$discountCode = strtoupper(trim($data['totals']['discountCode'] ?? ''));
$discountRate = $availableDiscounts[$discountCode] ?? 0;
if ($discountRate === 0) {
    $discountCode = '';
}

try {
    $pdo->beginTransaction();

    $subtotal = 0;
    $validatedItems = [];

    $productStmt = $pdo->prepare('SELECT id, name, category, price, image FROM products WHERE id = ?');

    foreach ($data['items'] as $item) {
        $productId = (int) ($item['id'] ?? 0);
        $quantity = (int) ($item['quantity'] ?? 0);

        if ($productId <= 0 || $quantity <= 0) {
            continue;
        }

        $productStmt->execute([$productId]);
        $product = $productStmt->fetch();

        if (!$product) {
            continue;
        }

        $unitPrice = (float) $product['price'];
        $lineTotal = $unitPrice * $quantity;
        $subtotal += $lineTotal;

        $validatedItems[] = [
            'product_id' => (int) $product['id'],
            'product_name' => $product['name'],
            'category' => $product['category'],
            'unit_price' => $unitPrice,
            'quantity' => $quantity,
            'line_total' => $lineTotal,
        ];
    }

    if (count($validatedItems) === 0) {
        $pdo->rollBack();
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'No valid products in order']);
        exit;
    }

    $shipping = $subtotal > 0 ? 10 : 0;
    $discountAmount = round($subtotal * $discountRate, 2);
    $grandTotal = max(0, $subtotal + $shipping - $discountAmount);
    $deliveryMessage = 'Your order will arrive within two days.';
    $orderCode = 'ORD-' . date('Ymd-His') . '-' . random_int(1000, 9999);

    $orderStmt = $pdo->prepare('
        INSERT INTO orders
        (order_code, customer_name, customer_phone, customer_email, customer_address, customer_notes,
         subtotal, shipping, discount_code, discount_rate, discount_amount, grand_total, delivery_message)
        VALUES
        (:order_code, :customer_name, :customer_phone, :customer_email, :customer_address, :customer_notes,
         :subtotal, :shipping, :discount_code, :discount_rate, :discount_amount, :grand_total, :delivery_message)
    ');

    $orderStmt->execute([
        ':order_code' => $orderCode,
        ':customer_name' => trim($customer['name']),
        ':customer_phone' => trim($customer['phone']),
        ':customer_email' => trim($customer['email'] ?? ''),
        ':customer_address' => trim($customer['address']),
        ':customer_notes' => trim($customer['notes'] ?? ''),
        ':subtotal' => $subtotal,
        ':shipping' => $shipping,
        ':discount_code' => $discountCode,
        ':discount_rate' => $discountRate,
        ':discount_amount' => $discountAmount,
        ':grand_total' => $grandTotal,
        ':delivery_message' => $deliveryMessage,
    ]);

    $orderDbId = (int) $pdo->lastInsertId();

    $itemStmt = $pdo->prepare('
        INSERT INTO order_items
        (order_id, product_id, product_name, category, unit_price, quantity, line_total)
        VALUES
        (:order_id, :product_id, :product_name, :category, :unit_price, :quantity, :line_total)
    ');

    foreach ($validatedItems as $item) {
        $itemStmt->execute([
            ':order_id' => $orderDbId,
            ':product_id' => $item['product_id'],
            ':product_name' => $item['product_name'],
            ':category' => $item['category'],
            ':unit_price' => $item['unit_price'],
            ':quantity' => $item['quantity'],
            ':line_total' => $item['line_total'],
        ]);
    }

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'order_id' => $orderCode,
        'totals' => [
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'discountCode' => $discountCode,
            'discountRate' => $discountRate,
            'discountAmount' => $discountAmount,
            'grandTotal' => $grandTotal,
        ],
        'deliveryMessage' => $deliveryMessage,
    ]);
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Could not save order in database']);
}
