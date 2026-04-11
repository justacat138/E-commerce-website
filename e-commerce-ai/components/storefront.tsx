"use client";

import { useMemo, useState } from "react";
import { useCart } from "./cart-context";
import { CheckoutForm } from "./checkout-form";
import { filterReviewsForSpam, filterShopsForTrust } from "@/lib/filters";
import {
  deliveryPresets,
  getShopById,
  products,
  reviewsForProduct,
  shops,
  WAREHOUSE,
} from "@/lib/mock-data";
import { quoteShipping } from "@/lib/shipping";
import type { GeoPoint, Product } from "@/lib/types";

function formatAddedAt(ts: number) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(ts));
}

export function Storefront() {
  const { lines, addItem, setQuantity, removeLine } = useCart();
  const [strictTrust, setStrictTrust] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [delivery, setDelivery] = useState<GeoPoint>(deliveryPresets[1]);

  const visibleShops = useMemo(
    () => filterShopsForTrust(shops, strictTrust),
    [strictTrust],
  );

  const visibleProducts = useMemo(
    () =>
      products.filter((p) => visibleShops.some((s) => s.id === p.shopId)),
    [visibleShops],
  );

  const productReviews = useMemo(() => {
    if (!activeProduct) return [];
    return filterReviewsForSpam(
      reviewsForProduct(activeProduct.id),
      strictTrust,
    );
  }, [activeProduct, strictTrust]);

  const allReviewsForPanel = useMemo(() => {
    if (!activeProduct) return [];
    return reviewsForProduct(activeProduct.id);
  }, [activeProduct]);

  const subtotal = useMemo(
    () =>
      lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0),
    [lines],
  );

  const shipping = useMemo(
    () => quoteShipping(WAREHOUSE, delivery),
    [delivery],
  );

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
          Next.js commerce lab
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Trust-aware catalog, cart, and checkout
        </h1>
        <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
          Sample data includes bot-run storefronts, low trust scores, and spam
          reviews. Use the toggle to filter shops below trust 50 and hide spam
          reviews. The cart always lists the most recently touched line first.
        </p>
      </header>

      <label className="flex max-w-xl cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
        <input
          type="checkbox"
          className="mt-1 size-4 accent-emerald-600"
          checked={strictTrust}
          onChange={(e) => setStrictTrust(e.target.checked)}
        />
        <span>
          <span className="block font-medium text-zinc-900 dark:text-zinc-50">
            Hide low-trust shops and spam reviews
          </span>
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            Removes shops with trust score under 50 and filters out reviews
            flagged as spam.
          </span>
        </span>
      </label>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Shops
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleShops.map((shop) => (
            <article
              key={shop.id}
              className="flex flex-col rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                  {shop.name}
                </h3>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                    shop.trustScore >= 70
                      ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100"
                      : shop.trustScore >= 50
                        ? "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100"
                        : "bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-100"
                  }`}
                >
                  Trust {shop.trustScore}
                </span>
              </div>
              <p className="mt-2 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
                {shop.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {shop.isBot && (
                  <span className="rounded bg-violet-100 px-2 py-0.5 font-medium text-violet-900 dark:bg-violet-900/50 dark:text-violet-100">
                    isBot
                  </span>
                )}
                <span className="rounded bg-zinc-100 px-2 py-0.5 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {shop.location.label}
                </span>
              </div>
            </article>
          ))}
        </div>
        {visibleShops.length === 0 && (
          <p className="text-sm text-zinc-500">
            No shops match the current filter.
          </p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Products
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {visibleProducts.map((product) => {
            const shop = getShopById(product.shopId);
            if (!shop) return null;
            return (
              <article
                key={product.id}
                className="flex flex-col rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {product.name}
                    </h3>
                    <p className="text-sm text-zinc-500">{shop.name}</p>
                  </div>
                  <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {product.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500"
                    onClick={() => addItem(product, shop)}
                  >
                    Add to cart
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
                    onClick={() => setActiveProduct(product)}
                  >
                    Reviews
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {activeProduct && (
        <section
          className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
          aria-labelledby="reviews-heading"
        >
          <div className="flex items-center justify-between gap-2">
            <h2
              id="reviews-heading"
              className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
            >
              Reviews — {activeProduct.name}
            </h2>
            <button
              type="button"
              className="text-sm text-zinc-500 underline hover:text-zinc-800 dark:hover:text-zinc-200"
              onClick={() => setActiveProduct(null)}
            >
              Close
            </button>
          </div>
          {!strictTrust && allReviewsForPanel.some((r) => r.isSpam) && (
            <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
              Spam reviews are visible because the filter is off.
            </p>
          )}
          <ul className="mt-4 space-y-3">
            {productReviews.map((r) => (
              <li
                key={r.id}
                className="rounded-lg border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/40"
              >
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {r.author}
                  </span>
                  <span className="text-amber-700 dark:text-amber-400">
                    {r.rating}★
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                  {r.body}
                </p>
              </li>
            ))}
          </ul>
          {productReviews.length === 0 && (
            <p className="mt-3 text-sm text-zinc-500">
              No reviews to show (all hidden as spam or none yet).
            </p>
          )}
        </section>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Cart{" "}
            <span className="text-sm font-normal text-zinc-500">
              (newest activity first)
            </span>
          </h2>
          {lines.length === 0 ? (
            <p className="text-sm text-zinc-500">Your cart is empty.</p>
          ) : (
            <ul className="space-y-3">
              {lines.map((line) => (
                <li
                  key={line.product.id}
                  className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">
                      {line.product.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      Last update: {formatAddedAt(line.addedAt)}
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {line.shop.name} · ${line.product.price.toFixed(2)} each
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      className="w-16 rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                      value={line.quantity}
                      onChange={(e) =>
                        setQuantity(
                          line.product.id,
                          Number(e.target.value) || 1,
                        )
                      }
                    />
                    <button
                      type="button"
                      className="text-sm text-red-600 hover:underline"
                      onClick={() => removeLine(line.product.id)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Shipping from {WAREHOUSE.label}
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Fee is derived from the great-circle distance to your delivery
              location using <code className="text-xs">quoteShipping</code>.
            </p>
            <label className="mt-3 block text-sm">
              <span className="mb-1 block text-zinc-600 dark:text-zinc-400">
                Deliver to
              </span>
              <select
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                value={delivery.label}
                onChange={(e) => {
                  const next = deliveryPresets.find(
                    (d) => d.label === e.target.value,
                  );
                  if (next) setDelivery(next);
                }}
              >
                {deliveryPresets.map((d) => (
                  <option key={d.label} value={d.label}>
                    {d.label}
                  </option>
                ))}
              </select>
            </label>
            <dl className="mt-4 grid gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-zinc-500">Distance</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                  {shipping.distanceKm} km
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">Zone</dt>
                <dd className="font-medium capitalize text-zinc-900 dark:text-zinc-100">
                  {shipping.zone}
                </dd>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <dt className="text-zinc-700 dark:text-zinc-200">Shipping fee</dt>
                <dd className="text-emerald-700 dark:text-emerald-400">
                  ${shipping.fee.toFixed(2)}
                </dd>
              </div>
            </dl>
          </div>

          <CheckoutForm subtotal={subtotal} shippingFee={shipping.fee} />
        </section>
      </div>
    </div>
  );
}
