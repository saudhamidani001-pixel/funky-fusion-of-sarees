// ===== Store settings — edit these =====
const STORE = {
  name: "Funky Fusion Of Sarees",
  // WhatsApp number that receives orders: country code + number, digits only.
  whatsapp: "923013603636",
  currency: "Rs.",
  deliveryFee: 250,
  freeDeliveryOver: 10000,
  instagram: "https://instagram.com/",
  email: "saudhamidani001@gmail.com",
};

// ===== Products =====
// price: a number, e.g. 12500. Leave it as null to show "Price on request"
//        with an "Ask on WhatsApp" button instead of "Add to bag".
// images: photos in the images/ folder. The first one is the main photo.
const PRODUCTS = [
  { id: "tissue-blush", name: "Blush Pink Tissue Silk Saree", category: "Tissue Silk", price: null, badge: "New",
    images: ["images/tissue-blush.jpg"],
    fabric: "Tissue silk with sequin & thread embroidery",
    description: "Soft blush pink tissue silk scattered with hand-embroidered floral motifs, finished with a shimmering gold pallu of large sequinned flower bunches. Comes with a matching gold tissue blouse piece." },
  { id: "tissue-ice-blue", name: "Ice Blue Tissue Silk Saree", category: "Tissue Silk", price: null, badge: "New",
    images: ["images/tissue-ice-blue.jpg"],
    fabric: "Tissue silk with sequin & thread embroidery, tasselled pallu",
    description: "A cool ice blue tissue silk with peach and mint floral embroidery, a rich gold embroidered pallu and hand-knotted tassels. Comes with a gold tissue blouse piece." },
  { id: "tissue-mauve", name: "Mauve Tissue Silk Saree", category: "Tissue Silk", price: null,
    images: ["images/tissue-mauve.jpg"],
    fabric: "Tissue silk with sequin & thread embroidery",
    description: "Elegant mauve tissue silk with delicate embroidered florals and a gold pallu featuring large wine and pink sequinned bouquets. Comes with an embroidered gold blouse piece." },
  { id: "banarasi-black", name: "Black Banarasi with Ghungroo Lace", category: "Banarasi", price: null, badge: "Bestseller",
    images: ["images/banarasi-black-1.jpg", "images/banarasi-black-2.jpg", "images/banarasi-black-3.jpg"],
    fabric: "Banarasi silk, zari weave, gota lace with ghungroo",
    description: "Classic black Banarasi with woven buti, a wide antique-gold zari border and pallu, finished with gota lace and tiny ghungroo bells all around. Statement wear for weddings and dholkis." },
  { id: "jamawar-peacock", name: "Peacock Blue Jamawar Saree", category: "Jamawar", price: null,
    images: ["images/jamawar-blue-1.jpg", "images/jamawar-blue-2.jpg", "images/jamawar-blue-3.jpg"],
    fabric: "Jamawar weave, paisley pallu, contrast teal blouse piece",
    description: "Deep peacock blue with all-over floral buti and a grand multi-colour paisley pallu and border. Paired with a contrasting teal blouse piece. Perfect for winter events." },
];

// Collections shown in the menu, in this order (only ones with products appear).
const CATEGORIES = ["Tissue Silk", "Banarasi", "Jamawar"].filter((c) => PRODUCTS.some((p) => p.category === c));
