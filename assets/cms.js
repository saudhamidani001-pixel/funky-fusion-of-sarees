// Reads the sarees, celebrities, reviews and shop settings from Sanity (the owner's admin page),
// then starts the shop. If Sanity is not connected, or cannot be reached within a few seconds,
// the shop starts with the copy saved in store.js and catalog.js, so the site never shows empty.
(function () {
  var me = document.currentScript;
  var appSrc = me.getAttribute("data-app");
  var cfg = (typeof STORE !== "undefined" && STORE.sanity) || {};
  var started = false;

  function start() {
    if (started) return;
    started = true;
    var s = document.createElement("script");
    s.src = appSrc;
    document.body.appendChild(s);
  }

  if (!cfg.projectId) { start(); return; }

  var KEY = "ffs-cms-v1:" + cfg.projectId;
  var FRESH_FOR = 5 * 60 * 1000; // five minutes: a change in the admin shows on the site within this time
  var pic = function (url, w) { return url ? url + "?w=" + w + "&auto=format&q=78&fit=max" : null; };

  function apply(d) {
    if (!d) return;
    if (d.sarees && d.sarees.length) {
      CATALOG.length = 0;
      d.sarees.forEach(function (p) {
        if (!p.id || !p.name || !p.price) return;
        var images = (p.images || []).filter(Boolean).map(function (u) { return pic(u, 1100); });
        CATALOG.push({
          id: p.id, name: p.name, price: p.price, compareAt: p.compareAt || null,
          fabric: p.fabric || "", occasions: p.occasions || [], badge: p.badge || null, soldOut: !!p.soldOut,
          intro: p.intro || "", points: p.points || [], images: images,
          colours: (p.colours || []).filter(function (c) { return c && c.name; }).map(function (c) {
            return { name: c.name, price: c.price || p.price, image: pic(c.image, 1100) };
          }),
          featured: typeof p.featured === "number" ? p.featured : -1,
        });
      });
      STORE.hidden = []; // hidden sarees are already left out by Sanity
    }
    var st = d.settings;
    if (st) {
      ["whatsapp", "deliveryDays", "deliveryFeeKarachi", "deliveryFeeOtherCities", "bookingPercent", "instagram", "facebook", "exchangePolicy"].forEach(function (k) {
        if (st[k] !== undefined && st[k] !== null && st[k] !== "") STORE[k] = st[k];
      });
      if (st.exchangePolicy === "") STORE.exchangePolicy = "";
      var bank = STORE.payments.bank, wallet = STORE.payments.wallet;
      if (st.bankName) bank.bankName = st.bankName;
      if (st.accountTitle) bank.accountTitle = st.accountTitle;
      if (st.accountNumber) bank.accountNumber = st.accountNumber;
      if (st.iban) bank.iban = st.iban;
      if (st.jazzcash) wallet.jazzcash = st.jazzcash;
    }
    if (d.spotted && d.spotted.length) {
      STORE.spotted = d.spotted.filter(function (c) { return c.name && (c.photo || c.video); }).map(function (c) {
        return c.video
          ? { name: c.name, note: c.note || "", video: c.video, poster: pic(c.photo, 720) }
          : { name: c.name, note: c.note || "", photo: pic(c.photo, 720) };
      });
    }
    if (d.reviews && d.reviews.length) STORE.reviews = d.reviews.filter(function (r) { return r.text; });
    if (d.photos && d.photos.length) {
      STORE.customerPhotos = d.photos.filter(function (p) { return p.src; }).map(function (p) { return { src: pic(p.src, 720), alt: p.alt || "" }; });
    }
  }

  try {
    var saved = JSON.parse(sessionStorage.getItem(KEY));
    if (saved && Date.now() - saved.t < FRESH_FOR) { apply(saved.d); start(); return; }
  } catch (e) {}

  var query = '{' +
    '"sarees": *[_type == "saree" && defined(slug.current) && hidden != true]{' +
      '"id": slug.current, name, price, compareAt, fabric, occasions,' +
      '"badge": select(bestSeller == true => "Best seller", null),' +
      '"soldOut": soldOut == true, intro, points,' +
      '"images": photos[].asset->url,' +
      '"colours": colours[]{name, price, "image": photo.asset->url},' +
      '"featured": coalesce(featuredOrder, 0) - 1},' +
    '"settings": *[_id == "settings"][0],' +
    '"spotted": *[_type == "celebrity"] | order(coalesce(order, 999) asc){name, note, "photo": photo.asset->url, "video": video.asset->url},' +
    '"reviews": *[_type == "review"] | order(coalesce(order, 999) asc){text, via, name, city, "saree": saree->slug.current},' +
    '"photos": *[_type == "customerPhoto"] | order(coalesce(order, 999) asc){"src": photo.asset->url, alt}' +
  '}';
  var url = "https://" + cfg.projectId + ".apicdn.sanity.io/v2024-10-01/data/query/" + (cfg.dataset || "production") + "?query=" + encodeURIComponent(query);

  var giveUp = setTimeout(start, 5000);
  fetch(url)
    .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error("Sanity answered " + r.status)); })
    .then(function (j) {
      if (started) return; // too late: the shop already started with the saved copy
      apply(j.result);
      try { sessionStorage.setItem(KEY, JSON.stringify({ t: Date.now(), d: j.result })); } catch (e) {}
    })
    .catch(function (e) { if (window.console) console.warn("Using the saved saree list.", e && e.message); })
    .then(function () { clearTimeout(giveUp); start(); });
})();
