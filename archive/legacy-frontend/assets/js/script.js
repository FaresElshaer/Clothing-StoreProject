let cart = JSON.parse(localStorage.getItem("stylehub_cart")) || [];

function saveCart() {
  localStorage.setItem("stylehub_cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const countElements = document.querySelectorAll(".cart-count");
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  countElements.forEach(el => el.textContent = totalQuantity);
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
  const product = products.find(p => p.id === id);
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  alert(`${product.name} added to cart`);
}

function increaseQuantity(id) {
  const item = cart.find(item => item.id === id);
  if (item) item.quantity += 1;
  saveCart();
  displayCartPage();
}

function decreaseQuantity(id) {
  const item = cart.find(item => item.id === id);
  if (!item) return;
  item.quantity -= 1;
  if (item.quantity <= 0) {
    cart = cart.filter(cartItem => cartItem.id !== id);
  }
  saveCart();
  displayCartPage();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  displayCartPage();
}

function clearCart() {
  cart = [];
  saveCart();
  displayCartPage();
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
      <div class="cart-item d-flex align-items-center gap-3">
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

function updateTotals() {
  const subtotalEl = document.getElementById("subtotal");
  const shippingEl = document.getElementById("shipping");
  const grandTotalEl = document.getElementById("grand-total");
  if (!subtotalEl || !shippingEl || !grandTotalEl) return;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 10 : 0;
  const grandTotal = subtotal + shipping;

  subtotalEl.textContent = subtotal;
  shippingEl.textContent = shipping;
  grandTotalEl.textContent = grandTotal;
}

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty");
    return;
  }
  alert("Order placed successfully! This is a front-end demo.");
  clearCart();
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  displayFeaturedProducts();
  displayProducts();
  displayCartPage();

  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");

  if (searchInput) searchInput.addEventListener("input", filterProducts);
  if (categoryFilter) categoryFilter.addEventListener("change", filterProducts);
});
