let products = [];
let cart = JSON.parse(localStorage.getItem("stylehub_cart")) || [];
let appliedDiscount = JSON.parse(localStorage.getItem("stylehub_discount")) || { code: "", rate: 0 };

function saveCart() {
  localStorage.setItem("stylehub_cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const countElements = document.querySelectorAll(".cart-count");
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  countElements.forEach(el => el.textContent = totalQuantity);
}

async function loadProducts() {
  try {
    const response = await fetch("backend/api/products.php");
    if (!response.ok) throw new Error("Failed to load products");
    products = await response.json();
  } catch (error) {
    console.error(error);
    const container = document.getElementById("products-container") || document.getElementById("featured-products");
    if (container) {
      container.innerHTML = `<div class="col-12"><div class="empty-cart"><h3>Could not load products</h3><p class="text-muted">Please run the project using a PHP server.</p></div></div>`;
    }
  }
}

function productCard(product) {
  return `
    <div class="col-sm-6 col-lg-4 col-xl-3 mb-4">
      <div class="card product-card h-100 position-relative">
        <span class="badge bg-dark category-badge">${product.category}</span>
        <img src="${product.image}" class="card-img-top" alt="${product.name}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${product.name}</h5>
          <p class="text-muted mb-2">High quality clothing product.</p>
          <p class="product-price mb-3">$${product.price}</p>
          <button class="btn btn-warning mt-auto" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
      </div>
    </div>
  `;
}

function displayFeaturedProducts() {
  const container = document.getElementById("featured-products");
  if (!container) return;
  container.innerHTML = products.slice(0, 4).map(productCard).join("");
}

function displayProducts(list = products) {
  const container = document.getElementById("products-container");
  if (!container) return;
  if (list.length === 0) {
    container.innerHTML = `<div class="col-12"><div class="empty-cart"><h3>No products found</h3></div></div>`;
    return;
  }
  container.innerHTML = list.map(productCard).join("");
}

function filterProducts() {
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  if (!searchInput || !categoryFilter) return;

  const searchValue = searchInput.value.toLowerCase();
  const categoryValue = categoryFilter.value;

  const filtered = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchValue);
    const matchesCategory = categoryValue === "all" || product.category === categoryValue;
    return matchesSearch && matchesCategory;
  });

  displayProducts(filtered);
}

function addToCart(id) {
  const product = products.find(p => Number(p.id) === Number(id));
  if (!product) return;

  const existingItem = cart.find(item => Number(item.id) === Number(id));

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  alert(`${product.name} added to cart`);
}

function increaseQuantity(id) {
  const item = cart.find(item => Number(item.id) === Number(id));
  if (item) item.quantity += 1;
  saveCart();
  displayCartPage();
}

function decreaseQuantity(id) {
  const item = cart.find(item => Number(item.id) === Number(id));
  if (!item) return;
  item.quantity -= 1;
  if (item.quantity <= 0) {
    cart = cart.filter(cartItem => Number(cartItem.id) !== Number(id));
  }
  saveCart();
  displayCartPage();
}

function removeFromCart(id) {
  cart = cart.filter(item => Number(item.id) !== Number(id));
  saveCart();
  displayCartPage();
}

function clearCart() {
  cart = [];
  appliedDiscount = { code: "", rate: 0 };
  localStorage.removeItem("stylehub_discount");
  saveCart();
  displayCartPage();
  hideCheckoutForm();
  hideOrderConfirmation();
}

function displayCartPage() {
  const container = document.getElementById("cart-page-items");
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <h3>Your cart is empty</h3>
        <p class="text-muted">Go to products page and add clothes.</p>
        <a href="products.html" class="btn btn-warning">Shop Products</a>
      </div>
    `;
  } else {
    container.innerHTML = cart.map(item => `
      <div class="cart-item d-flex align-items-center gap-3 flex-wrap">
        <img src="${item.image}" alt="${item.name}">
        <div class="flex-grow-1">
          <h5 class="mb-1">${item.name}</h5>
          <p class="mb-1 text-muted">${item.category}</p>
          <strong>$${item.price}</strong>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-sm btn-outline-dark" onclick="decreaseQuantity(${item.id})">-</button>
          <span class="fw-bold">${item.quantity}</span>
          <button class="btn btn-sm btn-outline-dark" onclick="increaseQuantity(${item.id})">+</button>
        </div>
        <button class="btn btn-sm btn-danger" onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `).join("");
  }

  updateTotals();
}

function calculateTotals() {
  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  const shipping = subtotal > 0 ? 10 : 0;
  const discountRate = appliedDiscount.rate || 0;
  const discountAmount = Math.round(subtotal * discountRate * 100) / 100;
  const grandTotal = Math.max(0, subtotal + shipping - discountAmount);

  return {
    subtotal,
    shipping,
    discountCode: appliedDiscount.code || "",
    discountRate,
    discountAmount,
    grandTotal
  };
}

function updateTotals() {
  const subtotalEl = document.getElementById("subtotal");
  const shippingEl = document.getElementById("shipping");
  const discountAmountEl = document.getElementById("discount-amount");
  const grandTotalEl = document.getElementById("grand-total");
  const discountCodeInput = document.getElementById("discount-code");
  const discountMessage = document.getElementById("discount-message");

  if (!subtotalEl || !shippingEl || !grandTotalEl) return;

  const { subtotal, shipping, discountAmount, grandTotal, discountCode, discountRate } = calculateTotals();
  subtotalEl.textContent = subtotal.toFixed(2);
  shippingEl.textContent = shipping.toFixed(2);
  if (discountAmountEl) discountAmountEl.textContent = discountAmount.toFixed(2);
  grandTotalEl.textContent = grandTotal.toFixed(2);

  if (discountCodeInput && discountCode) discountCodeInput.value = discountCode;
  if (discountMessage && discountCode) {
    discountMessage.textContent = `${discountCode} applied: ${Math.round(discountRate * 100)}% discount.`;
    discountMessage.className = "text-success d-block mt-2";
  }
}

function applyDiscount() {
  const discountCodeInput = document.getElementById("discount-code");
  const discountMessage = document.getElementById("discount-message");
  if (!discountCodeInput) return;

  const code = discountCodeInput.value.trim().toUpperCase();
  const availableDiscounts = {
    STYLE10: 0.10,
    STUDENT15: 0.15
  };

  if (!code) {
    appliedDiscount = { code: "", rate: 0 };
    localStorage.removeItem("stylehub_discount");
    if (discountMessage) {
      discountMessage.textContent = "No discount code applied.";
      discountMessage.className = "text-muted d-block mt-2";
    }
    updateTotals();
    return;
  }

  if (!availableDiscounts[code]) {
    appliedDiscount = { code: "", rate: 0 };
    localStorage.removeItem("stylehub_discount");
    if (discountMessage) {
      discountMessage.textContent = "Invalid discount code.";
      discountMessage.className = "text-danger d-block mt-2";
    }
    updateTotals();
    return;
  }

  appliedDiscount = { code, rate: availableDiscounts[code] };
  localStorage.setItem("stylehub_discount", JSON.stringify(appliedDiscount));
  updateTotals();
}

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty");
    return;
  }

  const checkoutForm = document.getElementById("checkout-form-wrapper");
  if (checkoutForm) {
    checkoutForm.classList.remove("d-none");
    checkoutForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function hideCheckoutForm() {
  const checkoutForm = document.getElementById("checkout-form-wrapper");
  if (checkoutForm) checkoutForm.classList.add("d-none");
}

function hideOrderConfirmation() {
  const wrapper = document.getElementById("order-confirmation-wrapper");
  if (wrapper) wrapper.classList.add("d-none");
}

async function submitOrder(event) {
  event.preventDefault();

  if (cart.length === 0) {
    alert("Your cart is empty");
    return;
  }

  const form = event.target;
  const customer = {
    name: form.customerName.value.trim(),
    phone: form.customerPhone.value.trim(),
    email: form.customerEmail.value.trim(),
    address: form.customerAddress.value.trim(),
    notes: form.customerNotes.value.trim()
  };

  if (!customer.name || !customer.phone || !customer.address) {
    alert("Please enter name, phone and address");
    return;
  }

  const order = {
    customer,
    items: cart,
    totals: calculateTotals(),
    deliveryMessage: "Your order will arrive within two days."
  };

  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Sending...";

  try {
    const response = await fetch("backend/api/orders.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order)
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Could not submit order");
    }

    if (result.totals) {
      order.totals = result.totals;
    }
    showOrderConfirmation(result.order_id, order);
    form.reset();
    cart = [];
    appliedDiscount = { code: "", rate: 0 };
    localStorage.removeItem("stylehub_cart");
    localStorage.removeItem("stylehub_discount");
    updateCartCount();
    displayCartPage();
    hideCheckoutForm();
  } catch (error) {
    alert(error.message);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Place Order";
  }
}

function showOrderConfirmation(orderId, order) {
  const wrapper = document.getElementById("order-confirmation-wrapper");
  const details = document.getElementById("order-confirmation-details");
  if (!wrapper || !details) return;

  const totals = order.totals;
  const discountText = totals.discountAmount > 0
    ? `$${totals.discountAmount.toFixed(2)} discount applied (${totals.discountCode}).`
    : "No discount was applied.";

  details.innerHTML = `
    <div class="invoice-line"><span>Order Number</span><strong>${orderId}</strong></div>
    <div class="invoice-line"><span>Customer Name</span><strong>${order.customer.name}</strong></div>
    <div class="invoice-line"><span>Subtotal</span><strong>$${totals.subtotal.toFixed(2)}</strong></div>
    <div class="invoice-line"><span>Shipping</span><strong>$${totals.shipping.toFixed(2)}</strong></div>
    <div class="invoice-line text-success"><span>Discount Applied</span><strong>-$${totals.discountAmount.toFixed(2)}</strong></div>
    <hr>
    <div class="invoice-line fs-4"><span>Amount to Pay</span><strong>$${totals.grandTotal.toFixed(2)}</strong></div>
    <div class="alert alert-success mt-3 mb-0">
      ${discountText}<br>
      Your order will arrive within two days.
    </div>
  `;

  wrapper.classList.remove("d-none");
  wrapper.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.addEventListener("DOMContentLoaded", async () => {
  updateCartCount();
  await loadProducts();
  displayFeaturedProducts();
  displayProducts();
  displayCartPage();

  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const orderForm = document.getElementById("customer-order-form");

  if (searchInput) searchInput.addEventListener("input", filterProducts);
  if (categoryFilter) categoryFilter.addEventListener("change", filterProducts);
  if (orderForm) orderForm.addEventListener("submit", submitOrder);
});
