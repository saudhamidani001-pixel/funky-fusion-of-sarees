// Shared store logic: header/footer, cart, product art, page rendering.

const money = (n) => `${STORE.currency} ${Number(n).toLocaleString("en-US")}`;
const findProduct = (id) => PRODUCTS.find((p) => p.id === id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// ---------- Saree illustration (used until real photos are added) ----------
function sareeArt(c1, c2, seed = 1) {
  const motifs = [];
  for (let y = 40; y < 520; y += 46) {
    for (let x = 30 + ((y / 46) % 2) * 23; x < 300; x += 46) {
      motifs.push(`<circle cx="${x}" cy="${y}" r="${2.5 + (seed % 3)}" fill="${c2}" opacity=".55"/>`);
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${shade(c1, -25)}"/>
      </linearGradient>
      <linearGradient id="sh" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#000" stop-opacity=".18"/><stop offset=".5" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity=".2"/>
      </linearGradient>
      <pattern id="b" width="16" height="16" patternUnits="userSpaceOnUse">
        <rect width="16" height="16" fill="${c2}"/><path d="M8 2 L14 8 L8 14 L2 8Z" fill="${shade(c2, -30)}"/>
      </pattern>
    </defs>
    <rect width="300" height="400" fill="url(#g)"/>
    <g transform="rotate(-8 150 200)">${motifs.join("")}</g>
    <path d="M0 250 Q150 ${200 + (seed % 5) * 8} 300 230 L300 400 L0 400Z" fill="${shade(c1, -12)}"/>
    <path d="M0 250 Q150 ${200 + (seed % 5) * 8} 300 230 L300 262 Q150 ${232 + (seed % 5) * 8} 0 282Z" fill="url(#b)"/>
    <path d="M190 0 L230 0 L170 400 L130 400Z" fill="url(#b)" opacity=".9"/>
    <rect width="300" height="400" fill="url(#sh)"/>
    <rect x="8" y="8" width="284" height="384" fill="none" stroke="${c2}" stroke-opacity=".5"/>
  </svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
function shade(hex, pct) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.max(0, Math.min(255, Math.round(v + (pct / 100) * 255)));
  return "#" + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => f(v).toString(16).padStart(2, "0")).join("");
}
const productImg = (p) => p.image || sareeArt(p.colors[0], p.colors[1], PRODUCTS.indexOf(p) + 1);

// ---------- Cart (stored in this browser) ----------
const CART_KEY = "ffs-cart";
function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
}
function saveCart(cart) {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {}
  updateCartCount();
}
function addToCart(id, qty = 1) {
  const cart = getCart();
  const line = cart.find((l) => l.id === id);
  if (line) line.qty += qty; else cart.push({ id, qty });
  saveCart(cart);
  toast(`Added to bag — ${findProduct(id).name}`);
}
function setQty(id, qty) {
  let cart = getCart();
  if (qty <= 0) cart = cart.filter((l) => l.id !== id);
  else cart.find((l) => l.id === id).qty = qty;
  saveCart(cart);
}
function cartLines() {
  return getCart().map((l) => ({ ...l, product: findProduct(l.id) })).filter((l) => l.product);
}
function cartTotals() {
  const subtotal = cartLines().reduce((s, l) => s + l.product.price * l.qty, 0);
  const delivery = subtotal === 0 || subtotal >= STORE.freeDeliveryOver ? 0 : STORE.deliveryFee;
  return { subtotal, delivery, total: subtotal + delivery };
}
function updateCartCount() {
  const n = getCart().reduce((s, l) => s + l.qty, 0);
  document.querySelectorAll(".cart-count").forEach((el) => (el.textContent = n));
}

// ---------- UI helpers ----------
function toast(msg) {
  let t = document.querySelector(".toast");
  if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove("show"), 2200);
}

function productCard(p) {
  const sale = p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0;
  return `<div class="card">
    <a href="product.html?id=${p.id}" class="img-wrap">
      <img src="${productImg(p)}" alt="${esc(p.name)}" loading="lazy">
      ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ""}
      ${sale ? `<span class="badge sale">-${sale}%</span>` : ""}
    </a>
    <div class="info">
      <div class="cat">${esc(p.category)}</div>
      <a href="product.html?id=${p.id}"><h3>${esc(p.name)}</h3></a>
      <div class="price">${money(p.price)}${p.compareAt ? `<s>${money(p.compareAt)}</s>` : ""}</div>
      <button class="btn outline quick" data-add="${p.id}">Add to bag</button>
    </div>
  </div>`;
}

function renderLayout() {
  const page = document.body.dataset.page;
  const link = (href, label, key) => `<a href="${href}" class="${page === key ? "active" : ""}">${label}</a>`;
  document.body.insertAdjacentHTML("afterbegin", `
    <div class="topbar">FREE DELIVERY ON ORDERS OVER ${money(STORE.freeDeliveryOver).toUpperCase()} · CASH ON DELIVERY NATIONWIDE</div>
    <header class="header"><div class="container">
      <button class="menu-btn" aria-label="Menu">&#9776;</button>
      <a href="index.html" class="logo"><span class="main">Funky Fusion</span><span class="sub">Of Sarees</span></a>
      <nav class="nav">
        ${link("index.html", "Home", "home")}
        ${link("shop.html", "Shop All", "shop")}
        ${CATEGORIES.map((c) => `<a href="shop.html?cat=${encodeURIComponent(c)}">${c}</a>`).join("")}
      </nav>
      <a href="cart.html" class="cart-link">Bag <span class="cart-count">0</span></a>
    </div></header>`);
  document.body.insertAdjacentHTML("beforeend", `
    <div class="motif"></div>
    <footer class="footer"><div class="container">
      <div class="cols">
        <div><h4>${esc(STORE.name)}</h4><p>Handpicked sarees where tradition meets a funky twist. Every drape tells a story — make it yours.</p></div>
        <div><h4>Shop</h4>${CATEGORIES.map((c) => `<a href="shop.html?cat=${encodeURIComponent(c)}">${c}</a>`).join("")}</div>
        <div><h4>Contact</h4>
          <a href="https://wa.me/${STORE.whatsapp}" target="_blank" rel="noopener">WhatsApp us</a>
          <a href="${STORE.instagram}" target="_blank" rel="noopener">Instagram</a>
          <a href="mailto:${STORE.email}">Email</a>
        </div>
      </div>
      <div class="copy">© ${new Date().getFullYear()} ${esc(STORE.name)}. All rights reserved.</div>
    </div></footer>`);
  const btn = document.querySelector(".menu-btn");
  btn.addEventListener("click", () => document.querySelector(".nav").classList.toggle("open"));
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-add]");
    if (b) addToCart(b.dataset.add, 1);
  });
  updateCartCount();
}

// ---------- Pages ----------
const pages = {
  home() {
    document.getElementById("hero-img").src = productImg(PRODUCTS[0]);
    document.getElementById("story-img").src = productImg(PRODUCTS[6]);
    document.getElementById("collections").innerHTML = CATEGORIES.map((c) => {
      const p = PRODUCTS.find((x) => x.category === c);
      const count = PRODUCTS.filter((x) => x.category === c).length;
      return `<a class="collection" href="shop.html?cat=${encodeURIComponent(c)}">
        <img src="${productImg(p)}" alt="${c} sarees"><div class="label"><span>${count} styles</span><h3>${c}</h3></div></a>`;
    }).join("");
    const featured = PRODUCTS.filter((p) => p.badge).concat(PRODUCTS.filter((p) => !p.badge)).slice(0, 8);
    document.getElementById("featured").innerHTML = featured.map(productCard).join("");
  },

  shop() {
    const params = new URLSearchParams(location.search);
    let cat = params.get("cat") || "All";
    let sort = "featured";
    const filters = document.getElementById("filters");
    const grid = document.getElementById("grid");
    const count = document.getElementById("count");
    const draw = () => {
      filters.innerHTML = ["All", ...CATEGORIES].map((c) => `<button class="chip ${c === cat ? "active" : ""}" data-cat="${c}">${c}</button>`).join("");
      let list = PRODUCTS.filter((p) => cat === "All" || p.category === cat);
      if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
      if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
      grid.innerHTML = list.map(productCard).join("");
      count.textContent = `${list.length} saree${list.length === 1 ? "" : "s"}`;
      document.getElementById("shop-title").textContent = cat === "All" ? "Shop All Sarees" : `${cat} Sarees`;
    };
    filters.addEventListener("click", (e) => {
      const b = e.target.closest("[data-cat]");
      if (!b) return;
      cat = b.dataset.cat;
      history.replaceState(null, "", cat === "All" ? "shop.html" : `shop.html?cat=${encodeURIComponent(cat)}`);
      draw();
    });
    document.getElementById("sort").addEventListener("change", (e) => { sort = e.target.value; draw(); });
    draw();
  },

  product() {
    const p = findProduct(new URLSearchParams(location.search).get("id"));
    const root = document.getElementById("product");
    if (!p) { root.innerHTML = `<div class="empty"><h2>Saree not found</h2><a class="btn" href="shop.html">Back to shop</a></div>`; return; }
    document.title = `${p.name} · ${STORE.name}`;
    root.innerHTML = `<div class="product">
      <div class="main-img"><img src="${productImg(p)}" alt="${esc(p.name)}"></div>
      <div>
        <div class="crumbs"><a href="index.html">Home</a> / <a href="shop.html?cat=${encodeURIComponent(p.category)}">${esc(p.category)}</a></div>
        <h1>${esc(p.name)}</h1>
        <div class="price">${money(p.price)}${p.compareAt ? `<s>${money(p.compareAt)}</s>` : ""}</div>
        <p class="desc">${esc(p.description)}</p>
        <div class="spec">
          <div><span>Fabric</span><span>${esc(p.fabric)}</span></div>
          <div><span>Length</span><span>5.5 m saree + 0.8 m blouse piece</span></div>
          <div><span>Care</span><span>Dry clean recommended</span></div>
        </div>
        <div class="qty"><button data-q="-1">−</button><input id="qty" type="number" min="1" value="1"><button data-q="1">+</button></div>
        <div class="buy-row">
          <button class="btn" id="add">Add to bag</button>
          <button class="btn gold" id="buy">Buy now</button>
        </div>
        <p class="note">✦ Cash on Delivery available · Delivery in 3–5 working days</p>
      </div></div>`;
    const qty = document.getElementById("qty");
    root.querySelectorAll("[data-q]").forEach((b) => b.addEventListener("click", () => {
      qty.value = Math.max(1, (parseInt(qty.value) || 1) + Number(b.dataset.q));
    }));
    const n = () => Math.max(1, parseInt(qty.value) || 1);
    document.getElementById("add").addEventListener("click", () => addToCart(p.id, n()));
    document.getElementById("buy").addEventListener("click", () => { addToCart(p.id, n()); location.href = "checkout.html"; });
    const related = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
    document.getElementById("related").innerHTML = related.map(productCard).join("");
  },

  cart() {
    const root = document.getElementById("cart");
    const draw = () => {
      const lines = cartLines();
      if (!lines.length) {
        root.innerHTML = `<div class="empty"><h2>Your bag is empty</h2><p>Find a saree you love.</p><a class="btn" href="shop.html">Start shopping</a></div>`;
        return;
      }
      const t = cartTotals();
      root.innerHTML = `<div class="cart-layout">
        <div>${lines.map((l) => `<div class="cart-item">
          <a href="product.html?id=${l.id}"><img src="${productImg(l.product)}" alt=""></a>
          <div><h3>${esc(l.product.name)}</h3><div class="price">${money(l.product.price)}</div>
            <div class="qty" style="margin-top:8px"><button data-dec="${l.id}">−</button><input value="${l.qty}" readonly><button data-inc="${l.id}">+</button></div>
            <div><button class="remove" data-remove="${l.id}">Remove</button></div></div>
          <div class="line-total">${money(l.product.price * l.qty)}</div></div>`).join("")}
        </div>
        <aside class="summary"><h2>Order summary</h2>
          <div class="row"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
          <div class="row"><span>Delivery</span><span>${t.delivery ? money(t.delivery) : "Free"}</span></div>
          ${t.delivery ? `<p class="note">Add ${money(STORE.freeDeliveryOver - t.subtotal)} more for free delivery.</p>` : ""}
          <div class="row total"><span>Total</span><span>${money(t.total)}</span></div>
          <a href="checkout.html" class="btn block">Checkout</a>
          <a href="shop.html" class="btn outline block" style="margin-top:10px">Continue shopping</a>
        </aside></div>`;
    };
    root.addEventListener("click", (e) => {
      const t = e.target;
      const line = (id) => getCart().find((l) => l.id === id);
      if (t.dataset.inc) setQty(t.dataset.inc, line(t.dataset.inc).qty + 1);
      else if (t.dataset.dec) setQty(t.dataset.dec, line(t.dataset.dec).qty - 1);
      else if (t.dataset.remove) setQty(t.dataset.remove, 0);
      else return;
      draw();
    });
    draw();
  },

  checkout() {
    const root = document.getElementById("checkout");
    const lines = cartLines();
    if (!lines.length) {
      root.innerHTML = `<div class="empty"><h2>Your bag is empty</h2><a class="btn" href="shop.html">Start shopping</a></div>`;
      return;
    }
    const t = cartTotals();
    root.innerHTML = `<div class="cart-layout">
      <form id="form" novalidate>
        <h2 style="color:var(--maroon);font-size:30px">Delivery details</h2>
        <div class="form-grid">
          <div class="full"><label for="name">Full name *</label><input id="name" required autocomplete="name"></div>
          <div><label for="phone">Phone number *</label><input id="phone" required type="tel" autocomplete="tel" placeholder="03xx xxxxxxx"></div>
          <div><label for="city">City *</label><input id="city" required autocomplete="address-level2"></div>
          <div class="full"><label for="address">Full address *</label><textarea id="address" rows="3" required autocomplete="street-address"></textarea></div>
          <div class="full"><label for="notes">Order notes (optional)</label><input id="notes" placeholder="e.g. blouse stitching size, delivery time"></div>
        </div>
        <h2 style="color:var(--maroon);font-size:30px;margin-top:30px">Payment</h2>
        <label class="pay-option"><input type="radio" checked> <span><strong>Cash on Delivery</strong><br><span class="note">Pay when your saree arrives at your door.</span></span></label>
        <p id="err" class="note" style="color:#b3261e;min-height:1.5em"></p>
        <button class="btn block" type="submit">Place order · ${money(t.total)}</button>
        <p class="note" style="text-align:center">Your order will be sent to us on WhatsApp to confirm.</p>
      </form>
      <aside class="summary"><h2>Your order</h2>
        ${lines.map((l) => `<div class="mini-item"><span>${esc(l.product.name)} × ${l.qty}</span><span>${money(l.product.price * l.qty)}</span></div>`).join("")}
        <div class="row" style="margin-top:10px"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
        <div class="row"><span>Delivery</span><span>${t.delivery ? money(t.delivery) : "Free"}</span></div>
        <div class="row total"><span>Total</span><span>${money(t.total)}</span></div>
      </aside></div>`;

    document.getElementById("form").addEventListener("submit", (e) => {
      e.preventDefault();
      const v = (id) => document.getElementById(id).value.trim();
      const err = document.getElementById("err");
      if (!v("name") || !v("phone") || !v("city") || !v("address")) { err.textContent = "Please fill in all required fields."; return; }
      if (v("phone").replace(/\D/g, "").length < 10) { err.textContent = "Please enter a valid phone number."; return; }
      const orderNo = "FFS-" + Date.now().toString().slice(-6);
      const msg = [
        `*New order ${orderNo}* — ${STORE.name}`, "",
        ...lines.map((l) => `• ${l.product.name} × ${l.qty} = ${money(l.product.price * l.qty)}`), "",
        `Subtotal: ${money(t.subtotal)}`, `Delivery: ${t.delivery ? money(t.delivery) : "Free"}`, `*Total: ${money(t.total)}*`,
        `Payment: Cash on Delivery`, "",
        `Name: ${v("name")}`, `Phone: ${v("phone")}`, `City: ${v("city")}`, `Address: ${v("address")}`,
        v("notes") ? `Notes: ${v("notes")}` : "",
      ].filter((x, i, a) => x !== "" || a[i - 1] !== "").join("\n");
      const wa = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(msg)}`;
      saveCart([]);
      root.innerHTML = `<div class="success"><div class="tick">✓</div>
        <h1>Thank you, ${esc(v("name").split(" ")[0])}!</h1>
        <p>Your order <strong>${orderNo}</strong> is ready. Tap below to send it to us on WhatsApp — we'll confirm it right away.</p>
        <a class="btn" href="${wa}" target="_blank" rel="noopener">Send order on WhatsApp</a>
        <p class="note" style="margin-top:18px"><a href="shop.html" style="text-decoration:underline">Continue shopping</a></p></div>`;
      window.open(wa, "_blank", "noopener");
    });
  },
};

document.addEventListener("DOMContentLoaded", () => {
  renderLayout();
  const page = document.body.dataset.page;
  if (pages[page]) pages[page]();
});
