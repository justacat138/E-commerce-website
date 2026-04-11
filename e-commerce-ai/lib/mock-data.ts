import type { GeoPoint, Product, Review, Shop } from "./types";

/** Default fulfillment origin (single warehouse) for demo quotes */
export const WAREHOUSE: GeoPoint = {
  lat: 40.7128,
  lng: -74.006,
  label: "NYC Fulfillment Hub",
};

export const shops: Shop[] = [
  {
    id: "shop-aurora",
    name: "Aurora Gear Co.",
    description: "Outdoor equipment with verified suppliers and fast dispatch.",
    isBot: false,
    trustScore: 92,
    location: { lat: 39.9526, lng: -75.1652, label: "Philadelphia, PA" },
  },
  {
    id: "shop-nimbus",
    name: "Nimbus Electronics",
    description: "Refurbished laptops and accessories. Strong return policy.",
    isBot: false,
    trustScore: 78,
    location: { lat: 37.7749, lng: -122.4194, label: "San Francisco, CA" },
  },
  {
    id: "shop-bot-deals",
    name: "!!! SUPER DEALS BOT 9000 !!!",
    description: "CLICK NOW LIMITED OFFER BUY BUY BUY",
    isBot: true,
    trustScore: 12,
    location: { lat: 0, lng: 0, label: "Unknown" },
  },
  {
    id: "shop-shadow",
    name: "ShadowMart (unverified)",
    description: "No contact page. Prices too good.",
    isBot: false,
    trustScore: 34,
    location: { lat: 25.7617, lng: -80.1918, label: "Miami, FL" },
  },
  {
    id: "shop-luna",
    name: "Luna Home",
    description: "Curated homeware, carbon-neutral shipping.",
    isBot: false,
    trustScore: 88,
    location: { lat: 41.8781, lng: -87.6298, label: "Chicago, IL" },
  },
];

export const products: Product[] = [
  {
    id: "p-tent",
    shopId: "shop-aurora",
    name: "Ultralight 2P Tent",
    price: 289,
    description: "Sub-1kg trail shelter with taped seams.",
  },
  {
    id: "p-pack",
    shopId: "shop-aurora",
    name: "35L Trail Pack",
    price: 124,
    description: "Ventilated back panel and hydration sleeve.",
  },
  {
    id: "p-laptop",
    shopId: "shop-nimbus",
    name: '14" Refurb Laptop',
    price: 649,
    description: "16GB RAM, 512GB NVMe, 1-year warranty.",
  },
  {
    id: "p-dock",
    shopId: "shop-nimbus",
    name: "USB-C Dock",
    price: 89,
    description: "Dual 4K HDMI, 100W PD passthrough.",
  },
  {
    id: "p-mystery",
    shopId: "shop-bot-deals",
    name: "Mystery Box (no refunds)",
    price: 9.99,
    description: "Contents unknown. Terms: you agree to everything.",
  },
  {
    id: "p-watch",
    shopId: "shop-shadow",
    name: "Luxury Watch 99% Off",
    price: 49,
    description: "Authenticity not guaranteed.",
  },
  {
    id: "p-lamp",
    shopId: "shop-luna",
    name: "Ceramic Desk Lamp",
    price: 72,
    description: "Hand-glazed, warm dimmable LED.",
  },
];

export const reviews: Review[] = [
  {
    id: "r-1",
    productId: "p-tent",
    author: "River H.",
    body: "Held up in a Sierra storm — impressed with the poles.",
    rating: 5,
    isSpam: false,
    createdAt: "2026-03-01T12:00:00Z",
  },
  {
    id: "r-2",
    productId: "p-tent",
    author: "promo_bot",
    body: "FREE iPHONE CLICK bit.ly/fake-deal-scam",
    rating: 5,
    isSpam: true,
    createdAt: "2026-03-10T09:00:00Z",
  },
  {
    id: "r-3",
    productId: "p-laptop",
    author: "Morgan",
    body: "Battery health reported 92%, runs cool under load.",
    rating: 4,
    isSpam: false,
    createdAt: "2026-02-20T15:30:00Z",
  },
  {
    id: "r-4",
    productId: "p-laptop",
    author: "deal_hunter_xx",
    body: "DM @fake_vendor on telegram for wholesale prices!!!",
    rating: 5,
    isSpam: true,
    createdAt: "2026-04-01T08:00:00Z",
  },
  {
    id: "r-5",
    productId: "p-lamp",
    author: "Avery",
    body: "Beautiful finish; packaging was plastic-free.",
    rating: 5,
    isSpam: false,
    createdAt: "2026-01-11T18:45:00Z",
  },
  {
    id: "r-6",
    productId: "p-mystery",
    author: "spamfarm",
    body: "crypto investment 300% daily returns join now",
    rating: 5,
    isSpam: true,
    createdAt: "2026-04-05T03:00:00Z",
  },
  {
    id: "r-7",
    productId: "p-watch",
    author: "RealBuyer123",
    body: "Feels cheap, engraving misaligned. Requested refund — no reply.",
    rating: 1,
    isSpam: false,
    createdAt: "2026-03-22T11:20:00Z",
  },
];

export function getShopById(id: string): Shop | undefined {
  return shops.find((s) => s.id === id);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function reviewsForProduct(productId: string): Review[] {
  return reviews.filter((r) => r.productId === productId);
}

/** Sample delivery addresses for shipping demo (distance from `WAREHOUSE`) */
export const deliveryPresets: GeoPoint[] = [
  { lat: 40.758, lng: -73.9855, label: "Midtown NYC (~0 km hub offset)" },
  { lat: 42.3601, lng: -71.0589, label: "Boston, MA" },
  { lat: 34.0522, lng: -118.2437, label: "Los Angeles, CA" },
  { lat: 47.6062, lng: -122.3321, label: "Seattle, WA" },
  { lat: 25.7617, lng: -80.1918, label: "Miami, FL" },
  { lat: 51.5074, lng: -0.1278, label: "London, UK (intl demo)" },
];
