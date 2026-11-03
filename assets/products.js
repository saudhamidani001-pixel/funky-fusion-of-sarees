// ===== Store settings — edit these =====
const STORE = {
  name: "Funky Fusion Of Sarees",
  // WhatsApp number that receives orders: country code + number, digits only.
  // CHANGE THIS before going live.
  whatsapp: "923000000000",
  currency: "Rs.",
  deliveryFee: 250,
  freeDeliveryOver: 10000,
  instagram: "https://instagram.com/",
  email: "saudhamidani001@gmail.com",
};

// ===== Products =====
// To use a real photo, add  image: "images/your-photo.jpg"  to a product.
// Without an image, a patterned saree illustration is drawn from `colors`.
const PRODUCTS = [
  { id: "banarasi-maroon", name: "Royal Banarasi Silk", category: "Silk", price: 18500, compareAt: 21000,
    colors: ["#7a1f2b", "#d4af37"], fabric: "Pure Banarasi silk with zari weave", badge: "Bestseller",
    description: "A deep maroon Banarasi with a heavy gold zari border and woven buti all over. Made for weddings and big days." },
  { id: "kanjeevaram-emerald", name: "Emerald Kanjeevaram", category: "Silk", price: 22000,
    colors: ["#0f5c4a", "#e0b04c"], fabric: "Kanjeevaram silk, contrast border",
    description: "Rich emerald green body with a temple-motif gold border and a grand pallu." },
  { id: "organza-blush", name: "Blush Organza Floral", category: "Party Wear", price: 9800,
    colors: ["#f2c4c4", "#b85c6e"], fabric: "Organza with hand-painted florals", badge: "New",
    description: "Light, sheer blush organza with painted florals and a scalloped edge. Perfect for daytime events." },
  { id: "georgette-midnight", name: "Midnight Sequin Georgette", category: "Party Wear", price: 12500, compareAt: 14500,
    colors: ["#1c2340", "#c0c6e0"], fabric: "Georgette with sequin work",
    description: "A navy georgette scattered with silver sequins that catch the light on every move." },
  { id: "chiffon-mustard", name: "Mustard Chiffon Lehariya", category: "Casual", price: 5400,
    colors: ["#d9a227", "#8a3b12"], fabric: "Soft chiffon, lehariya print",
    description: "Easy-drape chiffon in a sunny mustard with rust lehariya waves." },
  { id: "cotton-indigo", name: "Indigo Handloom Cotton", category: "Casual", price: 4200,
    colors: ["#2b3f73", "#f1e7d0"], fabric: "Handloom cotton, block print",
    description: "Breathable handloom cotton in indigo with hand block-printed borders. Everyday elegance." },
  { id: "fusion-predraped", name: "Pre-Draped Fusion Saree", category: "Fusion", price: 11000, badge: "Fusion",
    colors: ["#5b2a6e", "#f0a8c8"], fabric: "Crepe, stitched pleats",
    description: "Ready to wear in a minute — pre-stitched pleats in plum crepe with a pink belt detail." },
  { id: "fusion-cape", name: "Saree with Cape Blouse", category: "Fusion", price: 13800, compareAt: 15500,
    colors: ["#0d0d0d", "#d4af37"], fabric: "Satin saree, embroidered cape",
    description: "Black satin saree paired with a sheer embroidered cape. Modern drape, traditional soul." },
  { id: "silk-peacock", name: "Peacock Paithani Silk", category: "Silk", price: 19500,
    colors: ["#1e6f8f", "#9bc53d"], fabric: "Paithani silk, peacock pallu",
    description: "Peacock blue silk with a green and gold peacock-motif pallu, woven the traditional way." },
  { id: "party-wine", name: "Wine Velvet Border Saree", category: "Party Wear", price: 10500,
    colors: ["#5e1224", "#e8c07d"], fabric: "Silk-blend with velvet border",
    description: "Wine silk-blend with a plush velvet border and gota detailing for winter weddings." },
  { id: "casual-mint", name: "Mint Linen Saree", category: "Casual", price: 4900,
    colors: ["#a8d5c2", "#3f6b5c"], fabric: "Linen with tassel pallu",
    description: "Crisp mint linen with a tasselled pallu. Light, cool and office-ready." },
  { id: "fusion-dhoti", name: "Dhoti-Style Fusion Drape", category: "Fusion", price: 9600, badge: "New",
    colors: ["#c2492c", "#f6d27a"], fabric: "Cotton silk, dhoti drape",
    description: "Burnt orange cotton silk in a dhoti-style drape — bold, comfy and very funky." },
];

const CATEGORIES = ["Silk", "Party Wear", "Casual", "Fusion"];
