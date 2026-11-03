// Shared store logic: header/footer, cart, payments, page rendering.

const money = (n) => `${STORE.currency} ${Number(n).toLocaleString("en-US")}`;
const findProduct = (id) => PRODUCTS.find((p) => p.id === id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const waLink = (text) => `https://wa.me/${STORE.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

// ---------- Icons ----------
const ICON = {
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 7h18M3 12h18M3 17h12"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M2 6h12v10H2zM14 10h4l3 3v3h-7z"/><circle cx="6" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6l-8-3Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 8h4l2-3h6l2 3h4v11H3z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  swap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 8h14l-3-3M20 16H6l3 3"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 5h16v11H9l-5 4z"/></svg>',
};

// ---------- Traditional ornaments ----------
const ORNAMENT = '<svg viewBox="0 0 150 22" fill="currentColor" aria-hidden="true"><path d="M0 11h52M98 11h52" stroke="currentColor" stroke-width="1" fill="none"/><circle cx="56" cy="11" r="1.8"/><circle cx="94" cy="11" r="1.8"/><path d="M75 1c3 4 7 7 12 10-5 3-9 6-12 10-3-4-7-7-12-10 5-3 9-6 12-10Z" fill="none" stroke="currentColor" stroke-width="1.1"/><path d="M75 6.5c1.6 2 3.4 3.4 5.6 4.5-2.2 1.1-4 2.5-5.6 4.5-1.6-2-3.4-3.4-5.6-4.5 2.2-1.1 4-2.5 5.6-4.5Z"/><path d="M62 11c2-3 5-4 8-3M88 11c-2-3-5-4-8-3M62 11c2 3 5 4 8 3M88 11c-2 3-5 4-8 3" stroke="currentColor" stroke-width=".9" fill="none"/></svg>';
function mandalaSvg() {
  const ring = (n, fn) => Array.from({ length: n }, (_, i) => fn((360 / n) * i)).join("");
  return `<svg viewBox="-100 -100 200 200" fill="none" stroke="currentColor" stroke-width=".5">
    <circle r="97"/><circle r="93"/><circle r="62"/><circle r="58"/><circle r="30"/><circle r="12"/>
    ${ring(48, (a) => `<circle cx="0" cy="-95" r="1.3" fill="currentColor" transform="rotate(${a})"/>`)}
    ${ring(24, (a) => `<path d="M0 -62 C9 -72 9 -84 0 -92 C-9 -84 -9 -72 0 -62Z" transform="rotate(${a})"/>`)}
    ${ring(24, (a) => `<path d="M0 -66 C4 -72 4 -80 0 -86 C-4 -80 -4 -72 0 -66Z" transform="rotate(${a + 7.5})"/>`)}
    ${ring(16, (a) => `<path d="M0 -30 C12 -38 12 -50 0 -58 C-12 -50 -12 -38 0 -30Z" transform="rotate(${a})"/>`)}
    ${ring(16, (a) => `<circle cx="0" cy="-44" r="2" fill="currentColor" transform="rotate(${a})"/>`)}
    ${ring(8, (a) => `<path d="M0 -12 L6 -22 L0 -30 L-6 -22Z" transform="rotate(${a})"/>`)}
    ${ring(8, (a) => `<path d="M0 0 L0 -12" transform="rotate(${a + 22.5})"/>`)}
  </svg>`;
}
function addOrnaments() {
  document.querySelectorAll(".section-head h2, .page-title h1").forEach((h) => {
    if (h.nextElementSibling?.classList.contains("ornament")) return;
    h.insertAdjacentHTML("afterend", `<div class="ornament">${ORNAMENT}</div>`);
  });
}

// ---------- Product helpers ----------
const productImages = (p) => (p.images && p.images.length ? p.images : p.image ? [p.image] : []);
const productImg = (p) => productImages(p)[0] || "";
const hasPrice = (p) => typeof p.price === "number" && p.price > 0;
const salePct = (p) => (hasPrice(p) && p.compareAt > p.price ? Math.round((1 - p.price / p.compareAt) * 100) : 0);
const priceHtml = (p) => hasPrice(p)
  ? `${money(p.price)}${p.compareAt ? `<s>${money(p.compareAt)}</s>` : ""}`
  : `<span class="on-request">Price on request</span>`;
const askLink = (p) => waLink(`Hi! I'm interested in the "${p.name}". Is it available?`);

// ---------- Payment methods ----------
const PAY_METHODS = [
  { id: "cod", name: "Cash on Delivery", note: "Pay in cash when your saree arrives.", tag: "Most popular" },
  { id: "bank", name: "Bank Transfer", note: "Transfer to our bank account and send the screenshot on WhatsApp." },
  { id: "wallet", name: "JazzCash / Easypaisa", note: "Send to our mobile wallet and share the screenshot on WhatsApp." },
];
function payDetailsRows(id) {
  const P = STORE.payments || {};
  const rows = id === "bank"
    ? [["Bank", P.bank?.bankName], ["Account title", P.bank?.accountTitle], ["Account no.", P.bank?.accountNumber], ["IBAN", P.bank?.iban]]
    : id === "wallet"
    ? [["JazzCash", P.wallet?.jazzcash], ["Easypaisa", P.wallet?.easypaisa], ["Account title", P.wallet?.accountTitle]]
    : [];
  return rows.filter(([, v]) => v);
}
function payDetailsHtml(id) {
  if (id === "cod") return "";
  const rows = payDetailsRows(id);
  const copyable = ["Account no.", "IBAN", "JazzCash", "Easypaisa"];
  return `<div class="pay-details">${rows.length
    ? rows.map(([k, v]) => `<div><span>${k}</span><span class="pv"><strong>${esc(v)}</strong>${copyable.includes(k) ? `<button type="button" class="copy" data-copy="${esc(v)}">Copy</button>` : ""}</span></div>`).join("")
      + `<p class="pd-note">Send the exact total and share the payment screenshot on WhatsApp.</p>`
    : `Our account details will be sent to you on WhatsApp when we confirm your order.`}</div>`;
}
document.addEventListener("click", async (e) => {
  const b = e.target.closest("[data-copy]");
  if (!b) return;
  e.preventDefault();
  try { await navigator.clipboard.writeText(b.dataset.copy); }
  catch {
    const t = document.createElement("textarea"); t.value = b.dataset.copy; document.body.appendChild(t); t.select();
    try { document.execCommand("copy"); } catch {} t.remove();
  }
  b.textContent = "Copied ✓";
  setTimeout(() => (b.textContent = "Copy"), 1600);
});
const payChips = () => PAY_METHODS.map((m) => `<span>${m.id === "wallet" ? "JazzCash · Easypaisa" : m.name}</span>`).join("");

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
  return getCart().map((l) => ({ ...l, product: findProduct(l.id) })).filter((l) => l.product && hasPrice(l.product));
}
function cartTotals() {
  const subtotal = cartLines().reduce((s, l) => s + l.product.price * l.qty, 0);
  const delivery = subtotal === 0 || subtotal >= STORE.freeDeliveryOver ? 0 : STORE.deliveryFee;
  return { subtotal, delivery, total: subtotal + delivery };
}
function updateCartCount() {
  const n = cartLines().reduce((s, l) => s + l.qty, 0);
  document.querySelectorAll(".cart-count").forEach((el) => (el.textContent = n));
}

// ---------- UI helpers ----------
function toast(msg) {
  let t = document.querySelector(".toast");
  if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove("show"), 2400);
}

function productCard(p, i = 0) {
  const imgs = productImages(p);
  const sale = salePct(p);
  return `<div class="card reveal d${i % 4}">
    <div class="media">
      <a href="product.html?id=${p.id}" class="img-wrap">
        <img src="${imgs[0]}" alt="${esc(p.name)}" loading="lazy">
        ${imgs[1] ? `<img class="alt" src="${imgs[1]}" alt="" loading="lazy">` : ""}
        ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ""}
        ${sale ? `<span class="badge sale">−${sale}%</span>` : ""}
      </a>
      ${hasPrice(p)
        ? `<button class="quick" data-add="${p.id}">+ Add to bag</button>`
        : `<a class="quick" href="${askLink(p)}" target="_blank" rel="noopener">Ask on WhatsApp</a>`}
    </div>
    <div class="info">
      <div class="cat">${esc(p.category)}</div>
      <h3><a href="product.html?id=${p.id}">${esc(p.name)}</a></h3>
      <div class="price">${priceHtml(p)}</div>
    </div>
  </div>`;
}

function observeReveals() {
  const els = document.querySelectorAll(".reveal:not(.in)");
  if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  els.forEach((e) => io.observe(e));
}

function renderLayout() {
  const page = document.body.dataset.page;
  const link = (href, label, key) => `<a href="${href}" class="${page === key ? "active" : ""}">${label}</a>`;
  document.body.insertAdjacentHTML("afterbegin", `
    <div class="topbar">Free delivery over ${money(STORE.freeDeliveryOver)} &nbsp;✦&nbsp; Cash on Delivery nationwide</div>
    <header class="header"><div class="container">
      <button class="menu-btn" aria-label="Menu">${ICON.menu}</button>
      <nav class="nav">
        ${link("shop.html", "Shop All", "shop")}
        ${CATEGORIES.map((c) => `<a href="shop.html?cat=${encodeURIComponent(c)}">${c}</a>`).join("")}
      </nav>
      <a href="index.html" class="logo" aria-label="${esc(STORE.name)} home"><span class="main">Funky <em>Fusion</em></span><span class="sub">Of Sarees</span></a>
      <div class="header-right">
        <a class="wa-link" href="${waLink()}" target="_blank" rel="noopener">${ICON.wa}<span>Help</span></a>
        <a href="cart.html" class="cart-link" aria-label="Bag">${ICON.bag}<span class="cart-count">0</span></a>
      </div>
    </div></header>`);
  document.body.insertAdjacentHTML("beforeend", `
    <footer class="footer"><div class="container">
      <p class="footer-big">Drape it <em>your</em> way.</p>
      <div class="cols">
        <div><h4>${esc(STORE.name)}</h4><p style="margin:0;max-width:320px">Handpicked sarees where tradition meets a funky twist. Real photos, honest prices, delivered to your door.</p></div>
        <div><h4>Shop</h4><a href="shop.html">All sarees</a>${CATEGORIES.map((c) => `<a href="shop.html?cat=${encodeURIComponent(c)}">${c}</a>`).join("")}</div>
        <div><h4>Contact</h4>
          <a href="${waLink()}" target="_blank" rel="noopener">WhatsApp</a>
          <a href="${STORE.instagram}" target="_blank" rel="noopener">Instagram</a>
          <a href="mailto:${STORE.email}">Email</a>
        </div>
        <div><h4>We accept</h4><div class="pay-chips">${payChips()}</div></div>
      </div>
      <div class="copy"><span>© ${new Date().getFullYear()} ${esc(STORE.name)}</span><span>Delivery in 3–5 working days, nationwide</span></div>
    </div></footer>
    <a class="wa-float" href="${waLink("Hi! I have a question about a saree.")}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${ICON.wa}</a>`);

  document.querySelector(".menu-btn").addEventListener("click", () => document.querySelector(".nav").classList.toggle("open"));
  const header = document.querySelector(".header");
  const onScroll = () => header.classList.toggle("scrolled", scrollY > 10);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-add]");
    if (b) { e.preventDefault(); addToCart(b.dataset.add, 1); }
  });
  updateCartCount();
}

// ---------- Pages ----------
const pages = {
  home() {
    const pick = (id, i) => findProduct(id) || PRODUCTS[i % PRODUCTS.length];
    document.getElementById("mandala").innerHTML = mandalaSvg();
    const hero = pick("tissue-blush", 0);
    document.getElementById("hero-1").src = productImg(hero);
    document.getElementById("hero-2").src = productImg(pick("banarasi-black", 1));
    document.getElementById("hero-3").src = productImages(pick("jamawar-peacock", 2)).slice(-1)[0];
    document.getElementById("hero-tag").href = `product.html?id=${hero.id}`;
    document.getElementById("hero-tag").innerHTML = `<img src="${productImg(hero)}" alt=""><span><small>Just in</small><b>${hasPrice(hero) ? money(hero.price) : "New"}</b></span>`;

    const words = ["Tissue Silk", "Banarasi", "Jamawar", "Cash on Delivery", "Hand Embroidered", "Delivered Nationwide", "Real Photos"];
    const run = words.map((w) => `<span>${w}</span>`).join("");
    document.getElementById("marquee").innerHTML = run + run;

    document.getElementById("featured").innerHTML = PRODUCTS.slice(0, 5).map(productCard).join("");

    document.getElementById("collections").innerHTML = CATEGORIES.map((c, i) => {
      const list = PRODUCTS.filter((x) => x.category === c);
      return `<a class="collection reveal d${i}" href="shop.html?cat=${encodeURIComponent(c)}">
        <div class="frame"><div><img src="${productImg(list[0])}" alt="${c} sarees" loading="lazy"></div></div>
        <h3>${c}</h3><span>${list.length} ${list.length === 1 ? "piece" : "pieces"} · Explore →</span></a>`;
    }).join("");

    const s = pick("banarasi-black", 1);
    const si = productImages(s);
    document.getElementById("spot").innerHTML = `
      <div class="spot-media reveal">
        <div class="main"><img src="${si[0]}" alt="${esc(s.name)}" loading="lazy"></div>
        ${si[2] ? `<div class="mini"><img src="${si[2]}" alt="" loading="lazy"></div>` : ""}
      </div>
      <div class="spot-copy reveal d1">
        <span class="kicker">Saree of the week</span>
        <h2>${esc(s.name).replace("with", "<em>with</em>")}</h2>
        <p>${esc(s.description)}</p>
        <ul class="spot-list"><li>${esc(s.fabric)}</li><li>5.5 m saree + 0.8 m blouse piece</li><li>Ready to ship · 3–5 working days</li></ul>
        <div class="price">${priceHtml(s)}${salePct(s) ? `<span class="save">Save ${salePct(s)}%</span>` : ""}</div>
        <div class="hero-actions">
          ${hasPrice(s) ? `<button class="btn" data-add="${s.id}">Add to bag <span class="arrow">→</span></button>` : ""}
          <a class="btn outline" href="product.html?id=${s.id}">View details</a>
        </div>
      </div>`;

    const trust = [
      [ICON.camera, "Real photos", "Every saree is photographed as it is. No stock images, no filters."],
      [ICON.truck, "Cash on Delivery", `Pay at your door. Free delivery on orders over ${money(STORE.freeDeliveryOver)}.`],
      [ICON.swap, "Easy exchange", "Not the right one? Exchange within 7 days of delivery."],
      [ICON.chat, "Real people on WhatsApp", "Ask for more photos or a video before you buy."],
    ];
    document.getElementById("trust").innerHTML = trust.map(([ic, h, p], i) => `<div class="reveal d${i}">${ic}<h4>${h}</h4><p>${p}</p></div>`).join("");

    document.getElementById("lookbook").innerHTML = PRODUCTS.flatMap((p) => productImages(p).map((src) => ({ p, src })))
      .map(({ p, src }) => `<a href="product.html?id=${p.id}"><img src="${src}" alt="${esc(p.name)}" loading="lazy"><span>${esc(p.name)}</span></a>`).join("");
    document.getElementById("pay-chips").innerHTML = payChips();
    document.getElementById("cta-wa").href = waLink("Hi! I'd like help choosing a saree.");
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
      const pv = (p, dir) => (hasPrice(p) ? p.price : dir * Infinity);
      if (sort === "low") list = [...list].sort((a, b) => pv(a, 1) - pv(b, 1));
      if (sort === "high") list = [...list].sort((a, b) => pv(b, -1) - pv(a, -1));
      grid.innerHTML = list.map(productCard).join("");
      count.textContent = `${list.length} piece${list.length === 1 ? "" : "s"} · Cash on Delivery available`;
      document.getElementById("shop-title").innerHTML = cat === "All" ? "All <em>Sarees</em>" : `${esc(cat)} <em>Sarees</em>`;
      observeReveals();
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
    const imgs = productImages(p);
    const buy = hasPrice(p)
      ? `<div class="qty"><button data-q="-1" aria-label="Less">−</button><input id="qty" type="number" min="1" value="1" aria-label="Quantity"><button data-q="1" aria-label="More">+</button></div>
        <div class="buy-row">
          <button class="btn" id="add">Add to bag</button>
          <button class="btn gold" id="buy">Buy now <span class="arrow">→</span></button>
        </div>
        <a class="text-link" href="${askLink(p)}" target="_blank" rel="noopener">Ask for a video on WhatsApp</a>`
      : `<div class="buy-row"><a class="btn gold" href="${askLink(p)}" target="_blank" rel="noopener">Ask price on WhatsApp</a></div>`;
    root.innerHTML = `<div class="product">
      <div>
        <div class="main-img"><img id="main-img" src="${imgs[0]}" alt="${esc(p.name)}"></div>
        ${imgs.length > 1 ? `<div class="thumbs">${imgs.map((src, i) => `<button class="${i ? "" : "active"}" data-img="${src}" aria-label="Photo ${i + 1}"><img src="${src}" alt=""></button>`).join("")}</div>` : ""}
      </div>
      <div class="product-info">
        <div class="crumbs"><a href="index.html">Home</a> / <a href="shop.html?cat=${encodeURIComponent(p.category)}">${esc(p.category)}</a></div>
        <h1>${esc(p.name)}</h1>
        <div class="price">${priceHtml(p)}${salePct(p) ? `<span class="save">Save ${salePct(p)}%</span>` : ""}</div>
        <p class="desc">${esc(p.description)}</p>
        ${buy}
        <div class="spec">
          <div><span>Fabric</span><span>${esc(p.fabric)}</span></div>
          <div><span>Length</span><span>5.5 m saree + 0.8 m blouse piece</span></div>
          <div><span>Care</span><span>Dry clean recommended</span></div>
        </div>
        <div class="assure">
          <div>${ICON.truck}Cash on Delivery · Delivered in 3–5 working days</div>
          <div>${ICON.shield}Pay by COD, bank transfer, JazzCash or Easypaisa</div>
          <div>${ICON.swap}Easy exchange within 7 days</div>
        </div>
      </div></div>`;
    root.querySelectorAll("[data-img]").forEach((b) => b.addEventListener("click", () => {
      document.getElementById("main-img").src = b.dataset.img;
      root.querySelectorAll("[data-img]").forEach((x) => x.classList.toggle("active", x === b));
    }));
    const related = PRODUCTS.filter((x) => x.id !== p.id)
      .sort((a, b) => (b.category === p.category) - (a.category === p.category)).slice(0, 4);
    document.getElementById("related").innerHTML = related.map(productCard).join("");
    if (!hasPrice(p)) return;
    const qty = document.getElementById("qty");
    root.querySelectorAll("[data-q]").forEach((b) => b.addEventListener("click", () => {
      qty.value = Math.max(1, (parseInt(qty.value) || 1) + Number(b.dataset.q));
    }));
    const n = () => Math.max(1, parseInt(qty.value) || 1);
    document.getElementById("add").addEventListener("click", () => addToCart(p.id, n()));
    document.getElementById("buy").addEventListener("click", () => { addToCart(p.id, n()); location.href = "checkout.html"; });
  },

  cart() {
    const root = document.getElementById("cart");
    const draw = () => {
      const lines = cartLines();
      if (!lines.length) {
        root.innerHTML = `<div class="empty"><h2>Your bag is <em>empty</em></h2><p>Find a saree you love.</p><a class="btn" href="shop.html">Start shopping <span class="arrow">→</span></a></div>`;
        return;
      }
      const t = cartTotals();
      root.innerHTML = `<div class="cart-layout">
        <div>${lines.map((l) => `<div class="cart-item">
          <a href="product.html?id=${l.id}"><img src="${productImg(l.product)}" alt=""></a>
          <div><h3>${esc(l.product.name)}</h3><div class="price">${money(l.product.price)}</div>
            <div class="qty" style="margin-top:10px"><button data-dec="${l.id}">−</button><input value="${l.qty}" readonly><button data-inc="${l.id}">+</button></div>
            <div><button class="remove" data-remove="${l.id}">Remove</button></div></div>
          <div class="line-total">${money(l.product.price * l.qty)}</div></div>`).join("")}
        </div>
        <aside class="summary"><h2>Order summary</h2>
          <div class="row"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
          <div class="row"><span>Delivery</span><span>${t.delivery ? money(t.delivery) : "Free"}</span></div>
          ${t.delivery ? `<p class="note">Add ${money(STORE.freeDeliveryOver - t.subtotal)} more for free delivery.</p>` : ""}
          <div class="row total"><span>Total</span><span>${money(t.total)}</span></div>
          <a href="checkout.html" class="btn block">Checkout <span class="arrow">→</span></a>
          <a href="shop.html" class="btn outline block" style="margin-top:10px">Continue shopping</a>
          <div class="pay-chips">${payChips()}</div>
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
      root.innerHTML = `<div class="empty"><h2>Your bag is <em>empty</em></h2><a class="btn" href="shop.html">Start shopping</a></div>`;
      return;
    }
    const t = cartTotals();
    root.innerHTML = `<div class="cart-layout">
      <form id="form" novalidate>
        <h2 class="form-h">Delivery details</h2>
        <div class="form-grid">
          <div class="full"><label for="name">Full name *</label><input id="name" required autocomplete="name"></div>
          <div><label for="phone">Phone / WhatsApp *</label><input id="phone" required type="tel" autocomplete="tel" placeholder="03xx xxxxxxx"></div>
          <div><label for="city">City *</label><input id="city" required autocomplete="address-level2"></div>
          <div class="full"><label for="address">Full address *</label><textarea id="address" rows="3" required autocomplete="street-address"></textarea></div>
          <div class="full"><label for="notes">Order notes (optional)</label><input id="notes" placeholder="e.g. blouse stitching, best time to deliver"></div>
        </div>
        <h2 class="form-h" style="margin-top:40px">Payment method</h2>
        <div class="pay-methods">
          ${PAY_METHODS.map((m, i) => `<label class="pay-option"><input type="radio" name="pay" value="${m.id}" ${i ? "" : "checked"}>
            <span><strong>${m.name}${m.tag ? `<span class="tag">${m.tag}</span>` : ""}</strong><span class="note">${m.note}</span>
            <span class="pd" data-pd="${m.id}" ${i ? "hidden" : ""}>${payDetailsHtml(m.id)}</span></span></label>`).join("")}
        </div>
        <p id="err" class="note" style="color:#b3261e;min-height:1.5em;margin-top:14px"></p>
        <button class="btn block" type="submit">Place order · ${money(t.total)}</button>
        <p class="note" style="text-align:center">Your order is sent to us on WhatsApp and we confirm it right away.</p>
      </form>
      <aside class="summary"><h2>Your order</h2>
        ${lines.map((l) => `<div class="mini-item"><img src="${productImg(l.product)}" alt=""><span class="n">${esc(l.product.name)} × ${l.qty}</span><span>${money(l.product.price * l.qty)}</span></div>`).join("")}
        <div class="row" style="margin-top:12px"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
        <div class="row"><span>Delivery</span><span>${t.delivery ? money(t.delivery) : "Free"}</span></div>
        <div class="row total"><span>Total</span><span>${money(t.total)}</span></div>
      </aside></div>`;

    const form = document.getElementById("form");
    form.addEventListener("change", (e) => {
      if (e.target.name !== "pay") return;
      form.querySelectorAll("[data-pd]").forEach((el) => (el.hidden = el.dataset.pd !== e.target.value));
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = (id) => document.getElementById(id).value.trim();
      const err = document.getElementById("err");
      if (!v("name") || !v("phone") || !v("city") || !v("address")) { err.textContent = "Please fill in all required fields."; return; }
      if (v("phone").replace(/\D/g, "").length < 10) { err.textContent = "Please enter a valid phone number."; return; }
      const payId = form.querySelector("input[name=pay]:checked").value;
      const pay = PAY_METHODS.find((m) => m.id === payId);
      const orderNo = "FFS-" + Date.now().toString().slice(-6);
      const msg = [
        `*New order ${orderNo}* — ${STORE.name}`, "",
        ...lines.map((l) => `• ${l.product.name} × ${l.qty} = ${money(l.product.price * l.qty)}`), "",
        `Subtotal: ${money(t.subtotal)}`, `Delivery: ${t.delivery ? money(t.delivery) : "Free"}`, `*Total: ${money(t.total)}*`,
        `Payment: ${pay.name}`, "",
        `Name: ${v("name")}`, `Phone: ${v("phone")}`, `City: ${v("city")}`, `Address: ${v("address")}`,
        v("notes") ? `Notes: ${v("notes")}` : null,
      ].filter((x) => x !== null).join("\n").trim();
      const wa = waLink(msg);
      saveCart([]);
      scrollTo({ top: 0 });
      root.innerHTML = `<div class="success"><div class="tick">✓</div>
        <h1>Thank you, ${esc(v("name").split(" ")[0])}!</h1>
        <p>Your order <strong>${orderNo}</strong> (${money(t.total)}) is ready. Tap below to send it to us on WhatsApp — we'll confirm it right away.</p>
        ${payId !== "cod" ? `<p><strong>Paying by ${pay.name}:</strong> please send ${money(t.total)} and share the payment screenshot in the same WhatsApp chat.</p>${payDetailsHtml(payId)}` : ""}
        <a class="btn gold" href="${wa}" target="_blank" rel="noopener">${ICON.wa.replace("<svg", '<svg width="18" height="18"')} Send order on WhatsApp</a>
        <p class="note" style="margin-top:20px"><a href="shop.html" class="text-link">Continue shopping</a></p></div>`;
      window.open(wa, "_blank", "noopener");
    });
  },
};

document.addEventListener("DOMContentLoaded", () => {
  renderLayout();
  const page = document.body.dataset.page;
  if (pages[page]) pages[page]();
  addOrnaments();
  observeReveals();
});
