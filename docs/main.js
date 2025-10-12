// --------------------
// Products Data
// --------------------
const products = [
  { id: 1, name: "Wireless Headphones", price: 89.99, cur_count: 0, type: "Audio", image: "images/WirelessHeadphones.jpg" },
  { id: 2, name: "Smart Watch", price: 129.99, cur_count: 0, type: "Wearables", image: "images/SmartWatch.webp" },
  { id: 3, name: "Bluetooth Speaker", price: 49.99, cur_count: 0, type: "Audio", image: "images/BluetoothSpeaker.jpg" },
  { id: 4, name: "Gaming Mouse", price: 39.99, cur_count: 0, type: "Gaming", image: "images/GamingMouse.jpg" },
  { id: 5, name: "Mechanical Keyboard", price: 99.99, cur_count: 0, type: "Gaming", image: "images/MechanicalKeyboard.jpg" },
  { id: 6, name: "Portable Charger", price: 29.99, cur_count: 0, type: "Accessories", image: "images/PortableCharger.webp" },
];

// Load cart from localStorage if exists
if (localStorage.getItem('cartProducts')) {
  const savedProducts = JSON.parse(localStorage.getItem('cartProducts'));
  savedProducts.forEach((p, i) => products[i].cur_count = p.cur_count);
}

// --------------------
// DOM Elements (may not exist on every page)
// --------------------
const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const cartCountEl = document.getElementById("cartCount");
const yearEl = document.getElementById("year");
const filterBtn = document.getElementById('filterBtn');
const filterMenu = document.getElementById('filterMenu');
const cartGrid = document.getElementById("cartGrid");
const cartTotalEl = document.getElementById("cartTotal");

let cartCount = products.reduce((sum, p) => sum + p.cur_count, 0);
if (cartCountEl) cartCountEl.textContent = cartCount;

// --------------------
// Functions
// --------------------
function saveCart() {
  localStorage.setItem('cartProducts', JSON.stringify(products));
}

function AddItemCount(pIndex) {
  const p = products[pIndex];
  p.cur_count += 1;
  cartCount = products.reduce((sum, p) => sum + p.cur_count, 0);
  if (cartCountEl) cartCountEl.textContent = cartCount;
  saveCart();
  if (grid) renderProducts();
  if (cartGrid) renderCartProducts();
}

function subtractItemCount(pIndex) {
  const p = products[pIndex];
  if (p.cur_count > 0) {
    p.cur_count -= 1;
    cartCount = products.reduce((sum, p) => sum + p.cur_count, 0);
    if (cartCountEl) cartCountEl.textContent = cartCount;
    saveCart();
    if (grid) renderProducts();
    if (cartGrid) renderCartProducts();
  }
}

// --------------------
// Render Products (Index Page)
// --------------------
function renderProducts(searchFilter = "", typeFilter = "") {
  if (!grid) return;

  grid.innerHTML = "";
  let filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchFilter.toLowerCase()) &&
    (typeFilter === "" || p.type === typeFilter)
  );

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "product";
    card.innerHTML = `
      <img src="${p.image}" alt='${p.name}'>
      <div class="product-info">
        <div class="product-title">${p.name}</div>
        <div class="product-price">€${p.price.toFixed(2)}</div>
        <button class="defbutton">Add to Cart</button>
        <div class="item-controls">
          <button class="plusbutton">+</button>
          <div class="item-count">${p.cur_count}</div>
          <button class="minusbutton">-</button>
        </div>
      </div>
    `;

    const defBtn = card.querySelector('.defbutton');
    const plusBtn = card.querySelector('.plusbutton');
    const minusBtn = card.querySelector('.minusbutton');
    const countDiv = card.querySelector('.item-count');
    const controls = card.querySelector('.item-controls');

    if (p.cur_count <= 0) {
      controls.style.display = "none";
      defBtn.style.display = "block";
    } else {
      controls.style.display = "flex";
      defBtn.style.display = "none";
    }

    defBtn.addEventListener('click', () => AddItemCount(products.indexOf(p)));
    plusBtn.addEventListener('click', () => AddItemCount(products.indexOf(p)));
    minusBtn.addEventListener('click', () => subtractItemCount(products.indexOf(p)));

    grid.appendChild(card);
  });
}

// --------------------
// Render Cart (Cart Page)
// --------------------
function renderCartProducts() {
  if (!cartGrid || !cartTotalEl) return;

  cartGrid.innerHTML = "";
  let total = 0;

  products.forEach(p => {
    if (p.cur_count > 0) {
      total += p.price * p.cur_count;
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <div class="cart-item-info">
          <div class="cart-item-title">${p.name}</div>
          <div class="cart-item-price">€${p.price.toFixed(2)} x ${p.cur_count} = €${(p.price * p.cur_count).toFixed(2)}</div>
        </div>
        <div class="cart-item-controls">
          <button class="plus">+</button>
          <div class="cart-item-count">${p.cur_count}</div>
          <button class="minus">-</button>
        </div>
      `;

      const plusBtn = row.querySelector('.plus');
      const minusBtn = row.querySelector('.minus');
      plusBtn.addEventListener('click', () => AddItemCount(products.indexOf(p)));
      minusBtn.addEventListener('click', () => subtractItemCount(products.indexOf(p)));

      cartGrid.appendChild(row);
    }
  });

  cartTotalEl.textContent = `Total: €${total.toFixed(2)}`;
}

// --------------------
// Filter Menu (Index Page)
// --------------------
if (filterBtn && filterMenu) {
  filterBtn.addEventListener('click', () => filterMenu.classList.toggle('active'));
  document.querySelectorAll('.filter-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-filter');
      renderProducts("", type);
      filterMenu.classList.remove('active');
    });
  });
}

// --------------------
// Search
// --------------------
if (searchInput) {
  searchInput.addEventListener('input', e => renderProducts(e.target.value));
}

// --------------------
// Year
// --------------------
if (yearEl) yearEl.textContent = new Date().getFullYear();

// --------------------
// Initial Render
// --------------------
renderProducts();
renderCartProducts();
