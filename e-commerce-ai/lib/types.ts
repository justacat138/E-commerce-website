export type GeoPoint = {
  lat: number;
  lng: number;
  label: string;
};

export type Shop = {
  id: string;
  name: string;
  description: string;
  /** Heuristic flag for automated / low-quality storefronts */
  isBot: boolean;
  /** 0–100; below 50 is treated as untrusted when filtering */
  trustScore: number;
  location: GeoPoint;
};

export type Product = {
  id: string;
  shopId: string;
  name: string;
  price: number;
  description: string;
};

export type Review = {
  id: string;
  productId: string;
  author: string;
  body: string;
  rating: number;
  isSpam: boolean;
  createdAt: string;
};

export type CartLine = {
  product: Product;
  shop: Shop;
  quantity: number;
  /** ms since epoch — cart list is sorted newest first */
  addedAt: number;
};

export type PaymentMethod = "card" | "paypal" | "cod";
