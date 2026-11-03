# Funky Fusion Of Sarees

Online saree store: catalogue, cart and Cash on Delivery checkout. Orders are sent to the store's WhatsApp.
Plain HTML/CSS/JS, so it runs free on GitHub Pages.

## Before going live
1. Open `assets/products.js` and set `whatsapp` to your number (country code + number, digits only, e.g. `923001234567`).
2. Set your Instagram link and email in the same place.

## Adding or editing sarees
Everything is in `assets/products.js` → `PRODUCTS`. Copy one entry, give it a unique `id`, and change the name, price and description.

To use real photos, put them in an `images/` folder and add `image: "images/photo.jpg"` to the product.
Portrait photos (3:4) look best.

## Preview locally
```
python -m http.server 8080
```
Then open http://localhost:8080
