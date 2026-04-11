import type { GeoPoint } from "./types";

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

/** Haversine distance in kilometers between two WGS84 points */
export function distanceKm(a: GeoPoint, b: GeoPoint): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return EARTH_RADIUS_KM * c;
}

export type ShippingQuote = {
  distanceKm: number;
  fee: number;
  zone: "local" | "regional" | "national" | "remote";
};

/**
 * Tiered shipping from distance (km). Adjust tiers for your business rules.
 */
export function calculateShippingFee(distanceKm: number): ShippingQuote {
  let fee: number;
  let zone: ShippingQuote["zone"];

  if (distanceKm <= 25) {
    zone = "local";
    fee = 4.99;
  } else if (distanceKm <= 150) {
    zone = "regional";
    fee = 9.99;
  } else if (distanceKm <= 800) {
    zone = "national";
    fee = 14.99 + Math.min(25, Math.floor(distanceKm / 100) * 2);
  } else {
    zone = "remote";
    fee = 24.99 + Math.min(40, Math.floor(distanceKm / 200) * 3);
  }

  return { distanceKm: Math.round(distanceKm * 10) / 10, fee: Math.round(fee * 100) / 100, zone };
}

export function quoteShipping(origin: GeoPoint, destination: GeoPoint): ShippingQuote {
  return calculateShippingFee(distanceKm(origin, destination));
}
