import type { Review, Shop } from "./types";

export function filterShopsForTrust(shops: Shop[], onlyTrusted: boolean): Shop[] {
  if (!onlyTrusted) return shops;
  return shops.filter((s) => s.trustScore >= 50);
}

export function filterReviewsForSpam(reviews: Review[], hideSpam: boolean): Review[] {
  if (!hideSpam) return reviews;
  return reviews.filter((r) => !r.isSpam);
}
