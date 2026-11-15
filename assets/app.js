// Shop logic: catalog, bag, 10% booking, city delivery, saved orders.
// Settings are in store.js. Sarees are in catalog.js (generated from the Shopify export).

const money = (n) => `${STORE.currency} ${Math.round(Number(n)).toLocaleString("en-US")}`;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const waLink = (text) => `https://wa.me/${STORE.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
// Small copy of a photo for grids. Photos from Sanity are resized by their address; local photos have a "-s" file.
const small = (src) => (src.includes("cdn.sanity.io") ? src.replace("w=1100", "w=520") : src.replace(/\.webp$/, "-s.webp"));
const bookingOf = (amount) => Math.round((amount * STORE.bookingPercent) / 100);

const WA_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>';

// ---------- Catalog ----------
const HIDDEN = STORE.hidden || [];
const SAREES = CATALOG.filter((p) => p.images.length > 0 && !HIDDEN.includes(p.id)); // sarees without photos, and those listed as hidden in store.js, stay off the site
const findSaree = (id) => SAREES.find((p) => p.id === id);
const FABRICS = [...new Set(SAREES.map((p) => p.fabric))];
const OCCASIONS = ["Bridal and Walima", "Mehndi and Mayun", "Wedding Guest", "Farewell and Party", "Daily Wear"].filter((o) => SAREES.some((p) => p.occasions.includes(o)));
const priceOf = (p, colour) => (p.colours.find((c) => c.name === colour) || {}).price || p.price;
const askLink = (p) => waLink(`Assalam o Alaikum! I'm interested in "${p.name}" (${money(p.price)}). Is it available?`);

const CHEVRON = (d) => `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
const X_ICON = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M3 3l10 10M13 3 3 13"/></svg>`;
function gallery(p, big) {
  const n = p.images.length;
  return `<div class="track">${p.images.map((src, i) => `<a href="product.html?id=${p.id}"${i ? ' tabindex="-1"' : ""} aria-label="${esc(p.name)}, photo ${i + 1} of ${n}"><img src="${big ? src : small(src)}" alt="" loading="lazy" width="520" height="693"></a>`).join("")}</div>
      ${n > 1 ? `<button type="button" class="car-btn prev" aria-label="Previous photo" hidden>${CHEVRON("M10 3 5 8l5 5")}</button>
      <button type="button" class="car-btn next" aria-label="Next photo">${CHEVRON("M6 3l5 5-5 5")}</button>
      <span class="car-count" aria-hidden="true">1 / ${n}</span>` : ""}`;
}
function sareeCard(p) {
  const fromPrice = p.colours.some((c) => c.price !== p.price);
  return `<article class="card">
    <div class="card-media">
      ${gallery(p, false)}
      ${p.soldOut ? `<span class="badge out">Sold out</span>` : p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ""}
      <button type="button" class="quick-btn" data-quick="${p.id}" aria-label="Quick look at ${esc(p.name)}"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M8 3v10M3 8h10"/></svg></button>
    </div>
    <div class="card-body">
      <h3><a href="product.html?id=${p.id}">${esc(p.name)}</a></h3>
      <p class="card-fabric">${esc(p.fabric)}</p>
      <p class="price">${fromPrice ? "From " : ""}${money(p.price)}${p.compareAt ? `<s>${money(p.compareAt)}</s>` : ""}</p>
    </div>
  </article>`;
}
// Photo swipe on cards: arrows on a computer, a finger swipe on a phone. The counter follows either.
document.addEventListener("click", (e) => {
  const b = e.target.closest(".car-btn");
  if (!b) return;
  const t = b.parentElement.querySelector(".track");
  t.scrollBy({ left: (b.classList.contains("next") ? 1 : -1) * t.clientWidth, behavior: "smooth" });
});
document.addEventListener("scroll", (e) => {
  const t = e.target;
  if (!t.classList || !t.classList.contains("track")) return;
  const m = t.parentElement, n = t.children.length;
  const i = Math.min(n - 1, Math.max(0, Math.round(t.scrollLeft / t.clientWidth)));
  const count = m.querySelector(".car-count");
  if (!count) return;
  count.textContent = `${i + 1} / ${n}`;
  m.querySelector(".prev").hidden = i === 0;
  m.querySelector(".next").hidden = i === n - 1;
}, true);

// ---------- Movement: sections rise into place as they scroll into view ----------
const CAN_MOVE = "IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches;
if (CAN_MOVE) document.documentElement.classList.add("rv-on");
const revealer = CAN_MOVE ? new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); revealer.unobserve(en.target); } });
}, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }) : null;
function reveal(root = document, instant = false) {
  if (!CAN_MOVE) return;
  root.querySelectorAll(".section-head, .tile, .card, .steps li, .faq details, .promise li, .split-copy, .story, .socials, .footer-top > div, .faq-h, .quote, .wall figure, .why li, .celeb").forEach((el) => {
    if (el.classList.contains("rv")) return;
    el.classList.add("rv");
    if (instant) { el.classList.add("in"); return; }
    const i = [...el.parentElement.children].indexOf(el);
    el.style.setProperty("--d", `${Math.min(i, 7) * 0.07}s`);
    revealer.observe(el);
  });
  root.querySelectorAll(".panel, .split figure").forEach((el) => {
    if (el.classList.contains("zoom-in")) return;
    el.classList.add("zoom-in");
    revealer.observe(el);
  });
}

// ---------- Reviews (real ones only, listed in store.js) ----------
const REVIEWS = (STORE.reviews || []).filter((r) => r && r.text);
const CUSTOMER_PHOTOS = STORE.customerPhotos || [];
function reviewCard(r) {
  const p = r.saree ? findSaree(r.saree) : null;
  return `<figure class="quote">
    <svg viewBox="0 0 32 24" aria-hidden="true"><path d="M0 24V13.6C0 5.9 4.2 1.300 12 0l1.300 3.300C9.300 4.400 7.300 6.800 7 10h6v14H0Zm18 0V13.600C18 5.900 22.200 1.300 30 0l1.300 3.300C27.300 4.400 25.300 6.800 25 10h6v14H18Z" fill="currentColor"/></svg>
    <blockquote>${esc(r.text)}</blockquote>
    <figcaption><b>${esc(r.name || "A customer")}</b>${r.city ? `, ${esc(r.city)}` : ""}${r.via ? `<span>Sent on ${esc(r.via)}</span>` : ""}${p ? `<a href="product.html?id=${p.id}">${esc(p.name)}</a>` : ""}</figcaption>
  </figure>`;
}
const WHY = [
  ["10% advance booking", '<circle cx="20" cy="20" r="15"/><path d="M14 26 26 14"/><circle cx="15" cy="15.500" r="2"/><circle cx="25" cy="24.500" r="2"/>'],
  ["Blouse piece included", '<path d="M14 6l-8 5 3 6 4-2v19h14V15l4 2 3-6-8-5c-1 3-3 4.500-6 4.500S15 9 14 6z"/>'],
  ["See it on video first", '<rect x="5" y="11" width="21" height="18" rx="3"/><path d="M26 18l9-5v14l-9-5z"/>'],
  ["Delivery across Pakistan", '<path d="M4 12h20v16H4zM24 17h7l5 5v6H24z"/><circle cx="11" cy="30" r="3"/><circle cx="29" cy="30" r="3"/>'],
  ["WhatsApp updates", '<path d="M20 5a15 15 0 0 0-12.800 22.800L5 35l7.500-2A15 15 0 1 0 20 5z"/><path d="M14 18h12M14 23h8"/>'],
];
const whyRow = () => `<div class="why"><h2>Why choose ${esc(STORE.name)}</h2><ul>${WHY.map(([t, d]) => `<li><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>${t}</li>`).join("")}</ul></div>`;

// ---------- Bag (stored in this browser) ----------
const CART_KEY = "ffs-bag-v2";
const getCart = () => { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; } };
function saveCart(cart) {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {}
  updateCartCount();
}
const sameLine = (l, id, colour) => l.id === id && (l.colour || "") === (colour || "");
function addToCart(id, colour, qty = 1, quiet = false) {
  const cart = getCart();
  const line = cart.find((l) => sameLine(l, id, colour));
  if (line) line.qty += qty; else cart.push({ id, colour: colour || "", qty });
  saveCart(cart);
  if (quiet) return;
  const page = document.body.dataset.page;
  if (page === "cart" || page === "checkout") toast(`Added to your bag: ${findSaree(id).name}`);
  else openDrawer();
}
function setQty(id, colour, qty) {
  let cart = getCart();
  if (qty <= 0) cart = cart.filter((l) => !sameLine(l, id, colour));
  else cart.find((l) => sameLine(l, id, colour)).qty = qty;
  saveCart(cart);
}
function cartLines() {
  return getCart()
    .map((l) => ({ ...l, saree: findSaree(l.id) }))
    .filter((l) => l.saree && !l.saree.soldOut)
    .map((l) => {
      const colour = l.saree.colours.find((c) => c.name === l.colour);
      return { ...l, price: priceOf(l.saree, l.colour), image: (colour && colour.image) || l.saree.images[0] };
    });
}
const cartSubtotal = () => cartLines().reduce((s, l) => s + l.price * l.qty, 0);
function updateCartCount() {
  const n = cartLines().reduce((s, l) => s + l.qty, 0);
  document.querySelectorAll(".cart-count").forEach((el) => (el.textContent = n));
}
const lineLabel = (l) => `${l.saree.name}${l.colour ? ` (${l.colour})` : ""}`;

function toast(msg) {
  let t = document.querySelector(".toast");
  if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove("show"), 2600);
}

// ---------- Slide-in bag and quick look (pop-ups that open on top of the page) ----------
function ensureSheets() {
  if (document.getElementById("drawer")) return;
  document.body.insertAdjacentHTML("beforeend", `<dialog class="sheet drawer" id="drawer" aria-label="Your bag"><div class="sheet-in" id="drawer-in"></div></dialog>
    <dialog class="sheet quick" id="quick" aria-label="Quick look"><div class="sheet-in" id="quick-in"></div></dialog>`);
  document.querySelectorAll("dialog.sheet").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d || e.target.closest("[data-close]")) d.close(); }));
}
function drawDrawer() {
  const lines = cartLines();
  const subtotal = cartSubtotal();
  document.getElementById("drawer-in").innerHTML = `<header class="sheet-head"><h2>Your bag</h2><button type="button" class="icon-btn" data-close aria-label="Close">${X_ICON}</button></header>` + (lines.length
    ? `<div class="drawer-list">${lines.map((l, i) => `<div class="mini-line">
        <a href="product.html?id=${l.id}" tabindex="-1" aria-hidden="true"><img src="${small(l.image)}" alt=""></a>
        <div><b>${esc(l.saree.name)}</b><span class="note">${l.colour ? `${esc(l.colour)}, ` : ""}${money(l.price)}</span>
          <div class="qty"><button type="button" data-di="${i}" data-dd="-1" aria-label="One less">&minus;</button><input value="${l.qty}" readonly aria-label="Quantity"><button type="button" data-di="${i}" data-dd="1" aria-label="One more">+</button></div></div>
        <button type="button" class="remove" data-di="${i}" data-dd="0">Remove</button></div>`).join("")}</div>
      <footer class="sheet-foot">
        <div class="row"><span>Sarees</span><span>${money(subtotal)}</span></div>
        <div class="row today"><span>To book today (${STORE.bookingPercent}%)</span><span>${money(bookingOf(subtotal))}</span></div>
        <a class="btn block" href="checkout.html">Checkout</a>
        <button type="button" class="btn-line block" data-close>Keep shopping</button>
      </footer>`
    : `<div class="empty"><h2>Your bag is empty.</h2><p>Find a saree you love.</p><a class="btn" href="shop.html">See all sarees</a></div>`);
}
function openDrawer() {
  ensureSheets();
  const q = document.getElementById("quick");
  if (q.open) q.close();
  drawDrawer();
  const d = document.getElementById("drawer");
  if (!d.open) d.showModal();
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-di]");
  if (!b) return;
  const l = cartLines()[Number(b.dataset.di)];
  const d = Number(b.dataset.dd);
  setQty(l.id, l.colour, d === 0 ? 0 : l.qty + d);
  drawDrawer();
});
function openQuick(id) {
  const p = findSaree(id);
  if (!p) return;
  ensureSheets();
  let colour = p.colours.length ? p.colours[0].name : "";
  const box = document.getElementById("quick-in");
  box.innerHTML = `<button type="button" class="icon-btn sheet-x" data-close aria-label="Close">${X_ICON}</button>
    <div class="quick-grid">
      <div class="card-media">${gallery(p, true)}</div>
      <div class="quick-info">
        <p class="card-fabric">${esc(p.fabric)}</p>
        <h2>${esc(p.name)}</h2>
        <p class="price" id="q-price"></p>
        <p class="booking" id="q-booking"></p>
        ${p.colours.length ? `<span class="field-label" id="q-colour-label">Colour</span>
          <div class="colours" role="group" aria-labelledby="q-colour-label">${p.colours.map((c, i) => `<button type="button" class="chip" data-qcolour="${esc(c.name)}" aria-pressed="${i === 0}">${esc(c.name)}</button>`).join("")}</div>` : ""}
        ${p.soldOut ? `<p class="note" style="margin-top:16px">This saree is sold out.</p>` : `<div class="buy stack"><button class="btn" id="q-buy" type="button">Book this saree</button><button class="btn-line" id="q-add" type="button">Add to bag</button></div>`}
        <p class="note" style="margin-top:16px">Delivery in ${STORE.deliveryDays}. Blouse piece included.</p>
        <a class="link" href="product.html?id=${p.id}">See full details</a>
      </div>
    </div>`;
  const price = () => {
    const amount = priceOf(p, colour);
    box.querySelector("#q-price").innerHTML = `${money(amount)}${p.compareAt ? `<s>${money(p.compareAt)}</s>` : ""}`;
    box.querySelector("#q-booking").textContent = p.soldOut ? "" : `Book today for ${money(bookingOf(amount))}, then ${money(amount - bookingOf(amount))} on delivery.`;
  };
  price();
  box.querySelectorAll("[data-qcolour]").forEach((b) => b.addEventListener("click", () => {
    colour = b.dataset.qcolour;
    box.querySelectorAll("[data-qcolour]").forEach((x) => x.setAttribute("aria-pressed", x === b));
    const c = p.colours.find((x) => x.name === colour);
    const i = c && c.image ? p.images.indexOf(c.image) : -1;
    const t = box.querySelector(".track");
    if (i >= 0) t.scrollTo({ left: i * t.clientWidth, behavior: "smooth" });
    price();
  }));
  box.querySelector("#q-add")?.addEventListener("click", () => addToCart(p.id, colour, 1));
  box.querySelector("#q-buy")?.addEventListener("click", () => { addToCart(p.id, colour, 1, true); location.href = "checkout.html"; });
  document.getElementById("quick").showModal();
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-quick]");
  if (!b) return;
  e.preventDefault();
  openQuick(b.dataset.quick);
});

function openReviews() {
  ensureSheets();
  if (!document.getElementById("reviews-sheet")) {
    document.body.insertAdjacentHTML("beforeend", `<dialog class="sheet drawer left" id="reviews-sheet" aria-label="Customer reviews"><div class="sheet-in">
      <header class="sheet-head"><h2>Customer reviews</h2><button type="button" class="icon-btn" data-close aria-label="Close">${X_ICON}</button></header>
      <div class="drawer-list">
        <p class="note" style="margin:16px 0">Photos and messages our customers sent us after their sarees arrived.</p>
        <div class="rv-photos">${CUSTOMER_PHOTOS.map((ph) => `<img src="${esc(ph.src)}" alt="${esc(ph.alt || "A customer in her saree")}" loading="lazy">`).join("")}</div>
        <div class="rv-quotes">${REVIEWS.map(reviewCard).join("")}</div>
      </div>
      <footer class="sheet-foot"><a class="btn block" href="shop.html">Shop sarees</a></footer>
    </div></dialog>`);
    const d = document.getElementById("reviews-sheet");
    d.addEventListener("click", (e) => { if (e.target === d || e.target.closest("[data-close]")) d.close(); });
  }
  document.querySelectorAll("dialog.sheet[open]").forEach((d) => d.close());
  document.getElementById("reviews-sheet").showModal();
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-open-reviews]");
  if (!b) return;
  e.preventDefault();
  openReviews();
});

// ---------- Payment details ----------
const ICON = (body) => `<span class="pay-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true">${body}</svg></span>`;
const PAY_METHODS = [
  { id: "bank", name: "Bank transfer", note: `Send to our ${STORE.payments.bank.bankName} account.`, icon: ICON('<path d="M3 9.5 12 4l9 5.5V11H3zM5 11v7M9.5 11v7M14.5 11v7M19 11v7M3 20.5h18M4 18h16"/>') },
  { id: "jazzcash", name: "JazzCash", note: "Send to our JazzCash number.", icon: ICON('<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/><circle cx="12" cy="10" r="2.8"/>') },
];
function payRows(id) {
  const P = STORE.payments;
  const rows = id === "bank"
    ? [["Bank", P.bank.bankName], ["Account title", P.bank.accountTitle], ["Account no.", P.bank.accountNumber], ["IBAN", P.bank.iban]]
    : [["JazzCash", P.wallet.jazzcash], ["Account title", P.wallet.accountTitle]];
  return rows.filter(([, v]) => v);
}
function payDetailsHtml(id) {
  const copyable = ["Account no.", "IBAN", "JazzCash"];
  return `<div class="pay-details">${payRows(id).map(([k, v]) =>
    `<div><span>${k}</span><span class="pv"><strong>${esc(v)}</strong>${copyable.includes(k) ? `<button type="button" class="copy" data-copy="${esc(v)}">Copy</button>` : ""}</span></div>`).join("")}</div>`;
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
  b.textContent = "Copied";
  setTimeout(() => (b.textContent = "Copy"), 1600);
});

// ---------- Shared layout (header and footer are written in each HTML page) ----------
function wireLayout() {
  document.querySelectorAll("[data-wa]").forEach((a) => (a.href = waLink(a.dataset.wa)));
  document.querySelectorAll("[data-ig]").forEach((a) => (a.href = STORE.instagram));
  document.querySelectorAll("[data-fb]").forEach((a) => (a.href = STORE.facebook));
  document.querySelectorAll("[data-year]").forEach((s) => (s.textContent = new Date().getFullYear()));
  const btn = document.querySelector(".menu-btn");
  const nav = document.getElementById("nav");
  const closeMenu = () => { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); };
  btn?.addEventListener("click", () => btn.setAttribute("aria-expanded", nav.classList.toggle("open")));
  nav?.addEventListener("click", (e) => { if (e.target.closest("a")) closeMenu(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav?.classList.contains("open")) { closeMenu(); btn.focus(); } });
  if (document.body.dataset.page === "shop") document.querySelector('.mast-nav a[href="shop.html"]')?.setAttribute("aria-current", "page");
  // Mark the collection being browsed in the maroon bar.
  const here = new URLSearchParams(location.search).get("occasion");
  if (document.body.dataset.page === "shop") document.querySelectorAll(".browse a").forEach((l) => {
    const o = new URLSearchParams(l.search).get("occasion");
    if (o === here) l.setAttribute("aria-current", "true");
  });
  document.querySelector(".mast .bag")?.addEventListener("click", (e) => {
    const page = document.body.dataset.page;
    if (page === "cart" || page === "checkout") return;
    e.preventDefault();
    openDrawer();
  });
  // A "Reviews" button sits on the left edge of every page and opens the customer reviews panel.
  if ((REVIEWS.length || CUSTOMER_PHOTOS.length) && document.body.dataset.page !== "checkout") {
    document.body.insertAdjacentHTML("beforeend", `<button type="button" class="side-tab" data-open-reviews><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.500l2.900 6.200 6.600.8-4.900 4.600 1.300 6.600L12 17.400l-5.900 3.300 1.300-6.600L2.500 9.500l6.600-.8z"/></svg><span>Reviews</span></button>`);
  }
  // Search: the magnifier opens a search row under the header.
  const sBtn = document.querySelector(".search-btn");
  const sBar = document.getElementById("searchbar");
  sBtn?.addEventListener("click", () => {
    sBar.hidden = !sBar.hidden;
    sBtn.setAttribute("aria-expanded", String(!sBar.hidden));
    if (!sBar.hidden) sBar.querySelector("input").focus();
  });
  sBar?.addEventListener("keydown", (e) => { if (e.key === "Escape") { sBar.hidden = true; sBtn.setAttribute("aria-expanded", "false"); sBtn.focus(); } });
  updateCartCount();
}

// ---------- Pages ----------
const pages = {
  home() {
    const byLove = (a, b) => (a.soldOut - b.soldOut) || ((a.featured < 0) - (b.featured < 0)) || (a.featured - b.featured);

    // Sarees first: best sellers lead, and "Show more" adds the next row without leaving the page.
    const grid = document.getElementById("saree-grid"), more = document.getElementById("more-sarees");
    const all = [...SAREES].sort(byLove);
    let shown = 0;
    const addSarees = (n) => {
      grid.insertAdjacentHTML("beforeend", all.slice(shown, shown + n).map(sareeCard).join(""));
      shown = Math.min(all.length, shown + n);
      if (shown >= all.length) more.hidden = true;
      reveal(grid);
    };
    more.addEventListener("click", () => addSarees(8));
    addSarees(8);

    document.querySelectorAll("[data-occasion-count]").forEach((el) => {
      const o = el.dataset.occasionCount;
      const n = o === "*" ? SAREES.length : SAREES.filter((s) => s.occasions.includes(o)).length;
      el.textContent = `${n} sarees`;
    });

    // Celebrities and creators: a swipeable row of photos and short videos. A video plays when tapped.
    const SPOTTED = (STORE.spotted || []).filter((c) => c && c.name && (c.video || c.photo));
    const reel = document.getElementById("spotted-reel");
    if (reel && SPOTTED.length) {
      const PLAY = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.500v13l11-6.500z"/></svg>`;
      reel.innerHTML = SPOTTED.map((c) => `<figure class="celeb${c.video ? " has-video" : ""}">
        <div class="celeb-media">${c.video
          ? `<video src="${esc(c.video)}${c.poster ? "" : "#t=0.1"}" ${c.poster ? `poster="${esc(c.poster)}" preload="none"` : `preload="metadata"`} playsinline loop aria-label="${esc(c.name)} in our saree"></video><button type="button" class="play" aria-label="Play the video of ${esc(c.name)}">${PLAY}</button>`
          : `<img src="${esc(c.photo)}" alt="${esc(c.name)} in our saree" loading="lazy">`}</div>
        <figcaption><b>${esc(c.name)}</b>${c.note ? `<span>${esc(c.note)}</span>` : ""}</figcaption>
      </figure>`).join("");
      document.getElementById("spotted").hidden = false;
      // Some phones cannot play some video files. Those cards are removed so nobody sees a broken video.
      reel.querySelectorAll("video").forEach((v) => {
        const drop = () => { v.closest(".celeb")?.remove(); requestAnimationFrame(() => reel.dispatchEvent(new Event("scroll"))); };
        v.addEventListener("error", drop);
        v.addEventListener("loadedmetadata", () => { if (!v.videoWidth) drop(); });
      });
      reel.addEventListener("click", (e) => {
        const card = e.target.closest(".has-video");
        if (!card) return;
        const v = card.querySelector("video");
        reel.querySelectorAll("video").forEach((o) => { if (o !== v) { o.pause(); o.closest(".celeb").classList.remove("playing"); } });
        if (v.paused) { v.play().then(() => card.classList.add("playing")).catch(() => {}); }
        else { v.pause(); card.classList.remove("playing"); }
      });
      const prev = document.querySelector(".reel-prev"), next = document.querySelector(".reel-next");
      const step = (d) => reel.scrollBy({ left: d * reel.clientWidth * 0.8, behavior: "smooth" });
      prev.addEventListener("click", () => step(-1));
      next.addEventListener("click", () => step(1));
      const ends = () => { prev.hidden = reel.scrollLeft < 8; next.hidden = reel.scrollLeft + reel.clientWidth > reel.scrollWidth - 8; };
      reel.addEventListener("scroll", () => requestAnimationFrame(ends), { passive: true });
      ends();
    }

    // Hero: three short videos. Each plays only while it is on screen, so phones never load more than they show.
    const track = document.getElementById("hs-track");
    if (track) {
      const reels = [...track.children], dots = document.getElementById("hs-dots");
      const vids = reels.map((r) => r.querySelector("video"));
      if (!CAN_MOVE) vids.forEach((v) => { v.removeAttribute("autoplay"); v.pause(); });
      else if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((entries) => entries.forEach((en) => {
          if (en.isIntersecting) en.target.play().catch(() => {}); else en.target.pause();
        }), { root: null, threshold: 0.55 });
        vids.forEach((v) => io.observe(v));
        // On a computer all three are on screen together, so start them straight away.
        if (matchMedia("(min-width: 861px)").matches) vids.forEach((v) => v.play().catch(() => {}));
      }
      dots.innerHTML = reels.map((_, i) => `<button type="button" aria-label="Video ${i + 1} of ${reels.length}" aria-pressed="${i === 0}"></button>`).join("");
      const mark = () => {
        const mid = track.scrollLeft + track.clientWidth / 2;
        let at = 0, best = Infinity;
        reels.forEach((r, k) => { const d = Math.abs(r.offsetLeft + r.offsetWidth / 2 - mid); if (d < best) { best = d; at = k; } });
        [...dots.children].forEach((d, k) => d.setAttribute("aria-pressed", k === at));
      };
      track.addEventListener("scroll", () => requestAnimationFrame(mark), { passive: true });
      dots.addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        const r = reels[[...dots.children].indexOf(b)];
        track.scrollTo({ left: r.offsetLeft - (track.clientWidth - r.offsetWidth) / 2, behavior: "smooth" });
      });
    }
  },

  shop() {
    const params = new URLSearchParams(location.search);
    const state = { fabric: params.get("fabric") || "All", occasion: params.get("occasion") || "All", sort: "featured", q: (params.get("q") || "").trim() };
    const qInput = document.getElementById("q");
    if (qInput) qInput.value = state.q;
    let drawn = false;
    const el = { fabric: document.getElementById("f-fabric"), occasion: document.getElementById("f-occasion"), grid: document.getElementById("grid"), count: document.getElementById("count"), title: document.getElementById("shop-title") };
    const chips = (key, values) => ["All", ...values].map((v) => `<button class="chip" type="button" data-key="${key}" data-value="${esc(v)}" aria-pressed="${state[key] === v}">${esc(v)}</button>`).join("");
    const draw = () => {
      el.fabric.innerHTML = `<span>Fabric</span>` + chips("fabric", FABRICS);
      el.occasion.innerHTML = `<span>Occasion</span>` + chips("occasion", OCCASIONS);
      const words = state.q.toLowerCase().split(/\s+/).filter(Boolean);
      const hay = (p) => [p.name, p.fabric, p.occasions.join(" "), p.intro, p.points.join(" "), p.colours.map((c) => c.name).join(" ")].join(" ").toLowerCase();
      let list = SAREES.filter((p) => (state.fabric === "All" || p.fabric === state.fabric) && (state.occasion === "All" || p.occasions.includes(state.occasion)) && words.every((w) => hay(p).includes(w)));
      if (state.sort === "low") list = [...list].sort((a, b) => a.price - b.price);
      else if (state.sort === "high") list = [...list].sort((a, b) => b.price - a.price);
      else list = [...list].sort((a, b) => (a.soldOut - b.soldOut) || ((a.featured < 0) - (b.featured < 0)) || (a.featured - b.featured));
      el.grid.innerHTML = list.length ? list.map(sareeCard).join("")
        : `<div class="empty"><h2>No sarees found.</h2><p>Try another word, or a different fabric or occasion.</p><a class="btn" href="shop.html">See all sarees</a></div>`;
      reveal(el.grid, drawn);
      drawn = true;
      const title = state.q ? `Results for \u201c${state.q}\u201d` : state.occasion !== "All" ? `${state.occasion} sarees` : state.fabric !== "All" ? `${state.fabric} sarees` : "All sarees";
      el.title.textContent = title;
      el.count.textContent = `${list.length} ${list.length === 1 ? "saree" : "sarees"}`;
      document.title = `${title} | ${STORE.name}`;
      const q = new URLSearchParams();
      if (state.fabric !== "All") q.set("fabric", state.fabric);
      if (state.occasion !== "All") q.set("occasion", state.occasion);
      if (state.q) q.set("q", state.q);
      history.replaceState(null, "", "shop.html" + (q.toString() ? "?" + q : ""));
    };
    document.getElementById("filters").addEventListener("click", (e) => {
      const b = e.target.closest("[data-key]");
      if (!b) return;
      state[b.dataset.key] = b.dataset.value;
      draw();
    });
    document.getElementById("sort").addEventListener("change", (e) => { state.sort = e.target.value; draw(); });
    document.getElementById("shop-search")?.addEventListener("submit", (e) => { e.preventDefault(); state.q = qInput.value.trim(); draw(); });
    draw();
  },

  product() {
    const p = findSaree(new URLSearchParams(location.search).get("id"));
    const root = document.getElementById("product");
    if (!p) {
      root.innerHTML = `<div class="empty"><h2>We couldn't find that saree.</h2><p>It may have sold out, or the link is old.</p><a class="btn" href="shop.html">See all sarees</a></div>`;
      document.getElementById("related-wrap").hidden = true;
      return;
    }
    document.title = `${p.name}, ${p.fabric} saree | ${STORE.name}`;
    // Product details for Google (rich results).
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "Product", name: p.name, category: `${p.fabric} saree`,
      description: [p.intro, ...p.points].join(" ").slice(0, 500), image: p.images.slice(0, 4).map((src) => new URL(src, location.href).href),
      brand: { "@type": "Brand", name: STORE.name },
      offers: { "@type": "Offer", priceCurrency: "PKR", price: p.price, url: location.href, availability: `https://schema.org/${p.soldOut ? "OutOfStock" : "InStock"}` },
    });
    document.head.appendChild(ld);
    let colour = p.colours.length ? p.colours[0].name : "";
    root.innerHTML = `<div class="product">
      <div class="gallery">
        <div class="thumbs">${p.images.map((src, i) => `<button type="button" aria-pressed="${i === 0}" data-img="${src}" aria-label="Photo ${i + 1} of ${p.images.length}"><img src="${small(src)}" alt="" loading="lazy"></button>`).join("")}</div>
        <div class="main-img">${p.soldOut ? `<span class="badge out">Sold out</span>` : `<span class="badge">On order</span>${p.badge ? `<span class="badge second">${esc(p.badge)}</span>` : ""}`}<img id="main-img" src="${p.images[0]}" alt="${esc(p.name)}, ${esc(p.fabric)} saree"></div>
      </div>
      <div class="product-info">
        <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><a href="shop.html?fabric=${encodeURIComponent(p.fabric)}">${esc(p.fabric)}</a></nav>
        <h1>${esc(p.name)}</h1>
        <p class="price" id="p-price"></p>
        <p class="booking" id="p-booking"></p>
        ${p.colours.length ? `<span class="field-label" id="colour-label">Colour</span>
          <div class="colours" role="group" aria-labelledby="colour-label">${p.colours.map((c, i) => `<button type="button" class="chip" data-colour="${esc(c.name)}" aria-pressed="${i === 0}">${esc(c.name)}</button>`).join("")}</div>` : ""}
        ${p.soldOut
          ? `<div class="buy"><button class="btn" disabled>Sold out</button><a class="btn-line" href="${waLink(`Assalam o Alaikum! Will "${p.name}" be restocked?`)}" target="_blank" rel="noopener">Ask about restock</a></div>`
          : `<div class="buy">
              <div class="qty"><button type="button" data-q="-1" aria-label="One less">&minus;</button><input id="qty" type="number" min="1" value="1" aria-label="Quantity"><button type="button" data-q="1" aria-label="One more">+</button></div>
              <button class="btn" id="buy" type="button">Book this saree</button>
              <button class="btn-line" id="add" type="button">Add to bag</button>
            </div>
            <p class="buy-note"><a class="text-link" href="${waLink(`Assalam o Alaikum! Could I see "${p.name}" on a WhatsApp video call?`)}" target="_blank" rel="noopener">See it on a WhatsApp video call first</a></p>`}
        ${whyRow()}
        <div class="faq acc">
          ${p.intro || p.points.length ? `<details open><summary>Description</summary><div>${p.intro ? `<p>${esc(p.intro)}</p>` : ""}${p.points.length ? `<ul class="points">${p.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}</div></details>` : ""}
          <details><summary>Delivery and payment</summary><div><ul class="assure">
            <li>Pay ${STORE.bookingPercent}% in advance to book. The rest is paid when it's delivered.</li>
            <li>Imported on order: delivery takes ${STORE.deliveryDays}, with WhatsApp updates.</li>
            <li>Blouse piece included with every saree.</li>
            <li>Delivery ${money(STORE.deliveryFeeKarachi)} in Karachi, ${money(STORE.deliveryFeeOtherCities)} to other cities.</li>
          </ul></div></details>
          ${STORE.exchangePolicy ? `<details><summary>Exchange and returns</summary><div><p>${esc(STORE.exchangePolicy)}</p></div></details>` : ""}
        </div>
        <div class="p-reviews">
          ${REVIEWS.filter((r) => r.saree === p.id).map(reviewCard).join("")}
          <p class="note">Bought this saree? <a class="text-link" href="${waLink(`Assalam o Alaikum! Here is my review of "${p.name}":`)}" target="_blank" rel="noopener">Send us your review on WhatsApp</a></p>
        </div>
      </div></div>`;

    const showImage = (src) => {
      document.getElementById("main-img").src = src;
      root.querySelectorAll("[data-img]").forEach((x) => x.setAttribute("aria-pressed", x.dataset.img === src));
    };
    const showPrice = () => {
      const price = priceOf(p, colour);
      document.getElementById("p-price").innerHTML = `${money(price)}${p.compareAt ? `<s>${money(p.compareAt)}</s>` : ""}`;
      document.getElementById("p-booking").textContent = p.soldOut ? "" : `Book today for ${money(bookingOf(price))}, then ${money(price - bookingOf(price))} on delivery.`;
      const bar = document.getElementById("buybar-price");
      if (bar) bar.textContent = `${money(bookingOf(price))} today`;
    };
    // On phones the Book button scrolls out of view under the photo, so keep one at the bottom of the screen.
    if (!p.soldOut) {
      document.body.insertAdjacentHTML("beforeend", `<div class="buybar"><span><b>${esc(p.name)}</b><span id="buybar-price"></span></span><button class="btn" id="buybar-btn" type="button">Book this saree</button></div>`);
      document.body.classList.add("has-buybar");
      document.getElementById("buybar-btn").addEventListener("click", () => document.getElementById("buy").click());
    }
    showPrice();
    root.querySelectorAll("[data-img]").forEach((b) => b.addEventListener("click", () => showImage(b.dataset.img)));
    root.querySelectorAll("[data-colour]").forEach((b) => b.addEventListener("click", () => {
      colour = b.dataset.colour;
      root.querySelectorAll("[data-colour]").forEach((x) => x.setAttribute("aria-pressed", x === b));
      const c = p.colours.find((x) => x.name === colour);
      if (c.image) showImage(c.image);
      showPrice();
    }));

    const related = SAREES.filter((x) => x.id !== p.id && !x.soldOut)
      .sort((a, b) => (b.fabric === p.fabric) - (a.fabric === p.fabric) || Math.abs(a.price - p.price) - Math.abs(b.price - p.price)).slice(0, 4);
    document.getElementById("related").innerHTML = related.map(sareeCard).join("");
    if (p.soldOut) return;
    const qty = document.getElementById("qty");
    const n = () => Math.max(1, parseInt(qty.value) || 1);
    root.querySelectorAll("[data-q]").forEach((b) => b.addEventListener("click", () => (qty.value = Math.max(1, n() + Number(b.dataset.q)))));
    document.getElementById("add").addEventListener("click", () => addToCart(p.id, colour, n()));
    document.getElementById("buy").addEventListener("click", () => { addToCart(p.id, colour, n(), true); location.href = "checkout.html"; });
  },

  cart() {
    const root = document.getElementById("cart");
    const draw = () => {
      const lines = cartLines();
      if (!lines.length) {
        root.innerHTML = `<div class="empty"><h2>Your bag is empty.</h2><p>Find a saree you love.</p><a class="btn" href="shop.html">See all sarees</a></div>`;
        return;
      }
      const subtotal = cartSubtotal();
      root.innerHTML = `<div class="cart-layout">
        <div>${lines.map((l, i) => `<div class="cart-item">
          <a href="product.html?id=${l.id}" tabindex="-1" aria-hidden="true"><img src="${small(l.image)}" alt=""></a>
          <div><h3><a class="text-link" href="product.html?id=${l.id}">${esc(l.saree.name)}</a></h3>
            <p class="note">${esc(l.saree.fabric)}${l.colour ? `, ${esc(l.colour)}` : ""}</p>
            <p class="price">${money(l.price)}</p>
            <div class="qty"><button type="button" data-i="${i}" data-d="-1" aria-label="One less">&minus;</button><input value="${l.qty}" readonly aria-label="Quantity"><button type="button" data-i="${i}" data-d="1" aria-label="One more">+</button></div>
            <div><button type="button" class="remove" data-i="${i}" data-d="0">Remove</button></div></div>
          <p class="line-total">${money(l.price * l.qty)}</p></div>`).join("")}
        </div>
        <aside class="summary"><h2>Order summary</h2>
          <div class="row"><span>Sarees</span><span>${money(subtotal)}</span></div>
          <div class="row"><span>Delivery</span><span>${money(STORE.deliveryFeeKarachi)} to ${money(STORE.deliveryFeeOtherCities)}</span></div>
          <div class="row today"><span>To book today (${STORE.bookingPercent}%)</span><span>${money(bookingOf(subtotal))}</span></div>
          <p class="note">The rest is paid when your order is delivered. Delivery depends on your city.</p>
          <a href="checkout.html" class="btn block">Checkout</a>
          <a href="shop.html" class="btn-line block">Keep shopping</a>
        </aside></div>`;
    };
    root.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-i]");
      if (!b) return;
      const l = cartLines()[Number(b.dataset.i)];
      const d = Number(b.dataset.d);
      setQty(l.id, l.colour, d === 0 ? 0 : l.qty + d);
      draw();
    });
    draw();
  },

  checkout() {
    const root = document.getElementById("checkout");
    const lines = cartLines();
    if (!lines.length) {
      root.innerHTML = `<div class="empty"><h2>Your bag is empty.</h2><p>Add a saree first, then come back here.</p><a class="btn" href="shop.html">See all sarees</a></div>`;
      return;
    }
    const subtotal = cartSubtotal();
    const advance = bookingOf(subtotal);
    const cities = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Hyderabad", "Quetta", "Sialkot", "Gujranwala"];
    root.innerHTML = `<div class="cart-layout">
      <form id="form" novalidate>
        <h2 class="form-h">Delivery details</h2>
        <div class="form-grid">
          <div class="full"><label for="name">Full name</label><input id="name" required autocomplete="name"></div>
          <div><label for="phone">Phone or WhatsApp</label><input id="phone" required type="tel" autocomplete="tel" placeholder="03xx xxxxxxx"></div>
          <div><label for="city">City</label><select id="city" required><option value="">Choose your city</option>${cities.map((c) => `<option>${c}</option>`).join("")}<option value="other">Another city</option></select></div>
          <div class="full" id="other-city-wrap" hidden><label for="other-city">Your city</label><input id="other-city" autocomplete="address-level2"></div>
          <div class="full"><label for="address">Full address</label><textarea id="address" rows="3" required autocomplete="street-address"></textarea></div>
          <div class="full"><label for="notes">Order notes, if any</label><input id="notes" placeholder="Blouse stitching, event date"></div>
        </div>

        <h2 class="form-h" style="margin-top:48px">How much would you like to pay now?</h2>
        <div class="options">
          <label class="option"><input type="radio" name="payamount" value="advance" checked>
            <span><strong>Book with ${STORE.bookingPercent}% <span class="tag">Most chosen</span></strong>
            <span class="note">Pay ${money(advance)} now. Pay the rest in cash when your order is delivered.</span></span></label>
          <label class="option"><input type="radio" name="payamount" value="full">
            <span><strong>Pay in full now</strong><span class="note">Nothing to pay on delivery.</span></span></label>
        </div>

        <h2 class="form-h" style="margin-top:48px">Send the payment by</h2>
        <div class="options">
          ${PAY_METHODS.map((m, i) => `<label class="option"><input type="radio" name="paymethod" value="${m.id}" ${i ? "" : "checked"}>
            <span><strong>${m.icon}${m.name}</strong><span class="note">${m.note}</span>
            <span data-pd="${m.id}" ${i ? "hidden" : ""}>${payDetailsHtml(m.id)}</span></span></label>`).join("")}
        </div>
        <p id="err" class="err" role="alert"></p>
        <button class="btn block" type="submit" id="place">Place order</button>
        <p class="note" style="margin-top:12px">After you place the order, send the payment and share the screenshot on WhatsApp. We confirm every order there.</p>
      </form>
      <aside class="summary"><h2>Your order</h2>
        ${lines.map((l) => `<div class="mini-item"><img src="${small(l.image)}" alt=""><span>${esc(lineLabel(l))} &times; ${l.qty}</span><span>${money(l.price * l.qty)}</span></div>`).join("")}
        <div class="row" style="margin-top:12px"><span>Sarees</span><span>${money(subtotal)}</span></div>
        <div class="row"><span>Delivery</span><span id="s-delivery">Choose city</span></div>
        <div class="row total"><span>Total</span><span id="s-total">${money(subtotal)}</span></div>
        <div class="row today"><span>Pay now</span><span id="s-now">${money(advance)}</span></div>
        <div class="row"><span>Pay on delivery</span><span id="s-later">${money(subtotal - advance)}</span></div>
      </aside></div>`;

    const form = document.getElementById("form");
    const $ = (id) => document.getElementById(id);
    const v = (id) => $(id).value.trim();
    const cityName = () => ($("city").value === "other" ? v("other-city") : $("city").value);
    const deliveryFee = () => (!$("city").value ? null : $("city").value === "Karachi" ? STORE.deliveryFeeKarachi : STORE.deliveryFeeOtherCities);
    const sums = () => {
      const delivery = deliveryFee() ?? 0;
      const total = subtotal + delivery;
      const payNow = form.payamount.value === "full" ? total : advance;
      return { delivery, total, payNow, later: total - payNow };
    };
    const redraw = () => {
      const s = sums();
      $("other-city-wrap").hidden = $("city").value !== "other";
      $("s-delivery").textContent = deliveryFee() === null ? "Choose city" : money(s.delivery);
      $("s-total").textContent = money(s.total);
      $("s-now").textContent = money(s.payNow);
      $("s-later").textContent = money(s.later);
      form.querySelectorAll("[data-pd]").forEach((el) => (el.hidden = el.dataset.pd !== form.paymethod.value));
    };
    form.addEventListener("change", redraw);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const err = $("err");
      const required = ["name", "phone", "city", "address", ...($("city").value === "other" ? ["other-city"] : [])];
      required.forEach((id) => $(id).setAttribute("aria-invalid", !v(id)));
      if (required.some((id) => !v(id))) { err.textContent = "Please fill in your name, phone, city and address."; return; }
      if (v("phone").replace(/\D/g, "").length < 10) { $("phone").setAttribute("aria-invalid", true); err.textContent = "Please enter a phone number with at least 10 digits."; return; }
      err.textContent = "";
      const s = sums();
      const method = PAY_METHODS.find((m) => m.id === form.paymethod.value);
      const orderNo = "FFS-" + Date.now().toString().slice(-6);
      const itemsText = lines.map((l) => `${lineLabel(l)} x ${l.qty} = ${money(l.price * l.qty)}`).join("\n");
      const order = {
        order_no: orderNo, name: v("name"), phone: v("phone"), city: cityName(), address: v("address"), notes: v("notes"),
        items: itemsText, subtotal: subtotal, delivery: s.delivery, total: s.total,
        pay_now: s.payNow, pay_on_delivery: s.later, payment_method: method.name,
      };
      $("place").disabled = true;
      $("place").textContent = "Placing your order…";
      // Save the order with Netlify Forms. If that fails (offline, or not on Netlify), the WhatsApp message still carries it.
      let saved = false;
      try {
        const res = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ "form-name": "order", "bot-field": "", subject: `New order ${orderNo} from ${order.name} (${money(s.total)})`, ...order }).toString(),
        });
        saved = res.ok;
      } catch { saved = false; }

      const msg = [
        `*New order ${orderNo}* from ${STORE.name}`, "",
        ...lines.map((l) => `• ${lineLabel(l)} × ${l.qty} = ${money(l.price * l.qty)}`), "",
        `Sarees: ${money(subtotal)}`, `Delivery (${order.city}): ${money(s.delivery)}`, `*Total: ${money(s.total)}*`,
        `Paying now: ${money(s.payNow)} by ${method.name}`, `On delivery: ${money(s.later)}`, "",
        `Name: ${order.name}`, `Phone: ${order.phone}`, `City: ${order.city}`, `Address: ${order.address}`,
        order.notes ? `Notes: ${order.notes}` : null,
      ].filter((x) => x !== null).join("\n");
      const wa = waLink(msg);
      saveCart([]);
      scrollTo({ top: 0 });
      root.innerHTML = `<div class="success">
        <h1>Thank you, ${esc(order.name.split(" ")[0])}.</h1>
        <p>Your order <strong>${orderNo}</strong> is ${saved ? "saved" : "ready"}. Two steps finish the booking:</p>
        <p><strong>1. Send ${money(s.payNow)} by ${method.name}.</strong></p>
        ${payDetailsHtml(method.id)}
        <p><strong>2. Send us the order and your payment screenshot on WhatsApp.</strong> We confirm there and keep you updated until delivery.</p>
        <a class="btn" href="${wa}" target="_blank" rel="noopener">${WA_ICON}Send order on WhatsApp</a>
        <p class="note">${s.later ? `${money(s.later)} is paid in cash when your order is delivered, in ${STORE.deliveryDays}.` : `Nothing more to pay. Delivery takes ${STORE.deliveryDays}.`}</p>
      </div>`;
    });
    redraw();
  },
};

function boot() {
  wireLayout();
  const page = document.body.dataset.page;
  if (pages[page]) pages[page]();
  reveal();
}
// This file is added to the page by cms.js, sometimes after the page has finished loading.
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
