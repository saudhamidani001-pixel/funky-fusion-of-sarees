// ===== Store settings: edit these =====
// The saree list is in catalog.js, which is generated from the Shopify export.
const STORE = {
  name: "Funky Fusion Of Sarees",
  // WhatsApp number that receives orders: country code + number, digits only.
  whatsapp: "923013603636",
  currency: "Rs.",

  // Delivery charges by city.
  deliveryFeeKarachi: 250,
  deliveryFeeOtherCities: 300,
  deliveryDays: "about 40 days",

  // Booking: the share of the saree price paid in advance. The rest is paid on delivery.
  bookingPercent: 10,

  // Sarees to hide from the whole site. Add or remove a saree's id (the part after "product.html?id=") to hide or show it.
  hidden: [
    "glamour-net-cocktail-saree",                    // Cocktail Party
    "royal-kani-munga-silk-saree",                   // Hertiage Kani
    "pearly-girly",                                  // Pearly girly
    "katan-bliss",                                   // Katan bliss
    "desert-royal-edit-designer-modal-silk-saree",   // Desert Royal Edit
    "elegant-banarasi-soft-tissue-silk-saree",       // Tissue Banarasi
  ],

  // Exchange and returns text, shown on every saree page. Leave it as "" to hide it until the policy is decided.
  exchangePolicy: "",

  // Celebrities and creators seen in our sarees. Each needs a name and either "video" or "photo". "note" is one short line. "poster" is the still picture shown before a video plays.
  // Use only people who posted or agreed to it. Videos must be in the H.264 format to play on every phone.
  spotted: [
    { name: "Hina Chaudhary", note: "Worn for a drama shoot", video: "images/celebs/hina-chaudhary.mp4", poster: "images/celebs/hina-chaudhary.jpg" },
    { name: "Juvaria Abbasi", note: "Worn in Meri Zindagi Hai Tu", video: "images/celebs/juvaria-abbasi.mp4", poster: "images/celebs/juvaria-abbasi.jpg" },
    { name: "Arisha Anwer", note: "Model", video: "images/celebs/arisha-anwer.mp4", poster: "images/celebs/arisha-anwer.jpg" },
    { name: "Birjees Farooqui", note: "Spotted in our saree", photo: "images/celebs/birjees-farooqui.jpg" },
    { name: "Erum Ali", note: "In our saree", video: "images/celebs/erum-ali.mp4", poster: "images/celebs/erum-ali.jpg" },
    { name: "Simra Farooqui", note: "Content creator", video: "images/celebs/simra-farooqui.mp4", poster: "images/celebs/simra-farooqui.jpg" },
    { name: "Anum Nadeem", note: "Content creator", video: "images/celebs/anum-nadeem.mp4", poster: "images/celebs/anum-nadeem.jpg" },
    { name: "Afsa Jay", note: "In our red sequin saree", photo: "images/celebs/afsa-jay.jpg" },
  ],

  // Customer reviews. Real ones only. "via" says where she sent it. "name", "city" and "saree" are optional.
  reviews: [
    { text: "Absolutely stunning sarees. They are as beautiful as I thought of them.", via: "Instagram" },
    { text: "Got the parcel. Thank you, the sarees are beautiful.", via: "WhatsApp" },
    { text: "Bohttt khoobsurat haiii.", via: "Instagram" },
    { text: "Received my parcel last night. It looks great. Thanks.", via: "Instagram" },
    { text: "Mil gya parcel, thank you so much. Bhut pyra dress tha.", via: "Instagram" },
    { text: "Everyone liked the saree. Thanks.", via: "Instagram" },
  ],

  // Photos customers sent of themselves in their sarees. Faces and names are left out on purpose.
  customerPhotos: [
    { src: "images/reviews/pink-organza.jpg", alt: "A customer in a pink organza saree at a wedding" },
    { src: "images/reviews/black-sequin.jpg", alt: "A customer in a black saree with silver sequin work" },
    { src: "images/reviews/navy-maroon.jpg", alt: "A customer in a navy and maroon saree with a gold border" },
    { src: "images/reviews/pink-sequin.jpg", alt: "A customer in a pink sequin saree at a dinner" },
    { src: "images/reviews/black-banarasi.jpg", alt: "A customer in a black and gold Banarasi saree" },
    { src: "images/reviews/purple-gold.jpg", alt: "A customer in a purple saree with a gold border" },
    { src: "images/reviews/striped-handloom.jpg", alt: "A customer in a striped handloom saree" },
    { src: "images/reviews/happy-customer.jpg", alt: "A customer holding her Funky Fusion parcel" },
  ],

  instagram: "https://www.instagram.com/funkyfusionof_sarees",
  facebook: "https://www.facebook.com/share/1KomM9KRsz/",

  // ===== Where customers send the advance =====
  payments: {
    bank: { bankName: "Meezan Bank", accountTitle: "Uzma Ibrahim", accountNumber: "01580103344937", iban: "PK04MEZN0001580103344937" },
    wallet: { jazzcash: "03013603636", easypaisa: "", accountTitle: "" },
  },
};
