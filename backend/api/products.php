<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

try {
    $stmt = $pdo->query('SELECT id, name, category, price, image FROM products ORDER BY id ASC');
    $products = $stmt->fetchAll();

    foreach ($products as &$product) {
        $product['id'] = (int) $product['id'];
        $product['price'] = (float) $product['price'];
    }

    echo json_encode($products, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Could not load products from database']);
}
