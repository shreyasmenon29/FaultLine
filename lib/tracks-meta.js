export const TRACKS = [
  "Banking",
  "Fin-Tech",
  "E-Commerce",
  "Food Delivery",
  "Dating App",
  "Job Portal",
  "Fin-Tech"
];

export const TRACK_SPECS = {
  Banking: "Users must complete core banking flows: accounts, transactions, and OTP verification.",
  "Fin-Tech": "Users must manage financial services, payments, investments, and wallet transactions.",
  "E-Commerce": "Users must browse products, add to cart, checkout, and view order status.",
  "Food Delivery": "Users must browse a menu, place an order, and see order tracking.",
  "Dating App": "Users must create a profile, match with others, and use a chat flow.",
  "Job Portal": "Users must browse job listings, apply, and manage applications.",
  "Fin-Tech": "Users must complete financial tech workflows: payments, wallets, and transactions."
};

export const TRACK_META = {
  Banking: { icon: "🏦", desc: "Accounts, transactions, OTPs" },
  "Fin-Tech": { icon: "💳", desc: "Wallets, payments, investments" },
  "E-Commerce": { icon: "🛒", desc: "Cart, orders, payments" },
  "Food Delivery": { icon: "🍔", desc: "Menu, orders, tracking" },
  "Dating App": { icon: "💘", desc: "Profiles, matching, chat" },
  "Job Portal": { icon: "💼", desc: "Listings, apply, resume" },
  "Fin-Tech": { icon: "💳", desc: "Payments, wallets, transactions" }
};

export function getTrackMeta(name) {
  return TRACK_META[name] || { icon: "⚡", desc: name || "Track" };
}
