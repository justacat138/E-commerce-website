"use client";

import { useState } from "react";
import type { PaymentMethod } from "@/lib/types";

type Props = {
  subtotal: number;
  shippingFee: number;
  onSubmit?: (payload: {
    method: PaymentMethod;
    cardLast4?: string;
  }) => void;
};

export function CheckoutForm({ subtotal, shippingFee, onSubmit }: Props) {
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);

  const total = Math.round((subtotal + shippingFee) * 100) / 100;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (method === "card") {
      const digits = cardNumber.replace(/\D/g, "");
      onSubmit?.({ method, cardLast4: digits.slice(-4) || undefined });
      setSubmitted(`Card ending ····${digits.slice(-4) || "????"} (mock)`);
    } else if (method === "paypal") {
      onSubmit?.({ method });
      setSubmitted(`PayPal: ${paypalEmail || "(no email)"} (mock)`);
    } else {
      onSubmit?.({ method: "cod" });
      setSubmitted("Cash on delivery — driver will collect payment.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Payment
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Choose a method. No real charges — UI demo only.
        </p>
      </div>

      <fieldset className="space-y-2">
        <legend className="sr-only">Payment method</legend>
        {(
          [
            ["card", "Credit / debit card"],
            ["paypal", "PayPal"],
            ["cod", "Cash on delivery (COD)"],
          ] as const
        ).map(([value, label]) => (
          <label
            key={value}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors ${
              method === value
                ? "border-emerald-600 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/40"
                : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-600"
            }`}
          >
            <input
              type="radio"
              name="pay"
              value={value}
              checked={method === value}
              onChange={() => setMethod(value)}
              className="accent-emerald-600"
            />
            <span className="font-medium text-zinc-800 dark:text-zinc-100">
              {label}
            </span>
          </label>
        ))}
      </fieldset>

      {method === "card" && (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block text-zinc-600 dark:text-zinc-400">
              Card number
            </span>
            <input
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 outline-none ring-emerald-600 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              placeholder="4242 4242 4242 4242"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              autoComplete="cc-number"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-zinc-600 dark:text-zinc-400">
              Expiry
            </span>
            <input
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 outline-none ring-emerald-600 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              placeholder="MM / YY"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              autoComplete="cc-exp"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-zinc-600 dark:text-zinc-400">
              CVC
            </span>
            <input
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 outline-none ring-emerald-600 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              placeholder="123"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              autoComplete="cc-csc"
            />
          </label>
        </div>
      )}

      {method === "paypal" && (
        <label className="block text-sm">
          <span className="mb-1 block text-zinc-600 dark:text-zinc-400">
            PayPal email
          </span>
          <input
            type="email"
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 outline-none ring-emerald-600 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            placeholder="you@example.com"
            value={paypalEmail}
            onChange={(e) => setPaypalEmail(e.target.value)}
          />
        </label>
      )}

      {method === "cod" && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950/50 dark:text-amber-100">
          COD orders may include a small handling fee at the door. Prepare exact
          change if possible.
        </p>
      )}

      <dl className="space-y-1 border-t border-zinc-100 pt-3 text-sm dark:border-zinc-800">
        <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
          <dt>Subtotal</dt>
          <dd>${subtotal.toFixed(2)}</dd>
        </div>
        <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
          <dt>Shipping</dt>
          <dd>${shippingFee.toFixed(2)}</dd>
        </div>
        <div className="flex justify-between pt-1 text-base font-semibold text-zinc-900 dark:text-zinc-50">
          <dt>Total</dt>
          <dd>${total.toFixed(2)}</dd>
        </div>
      </dl>

      <button
        type="submit"
        className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
      >
        Place order (mock)
      </button>

      {submitted && (
        <p
          className="rounded-lg bg-zinc-100 px-3 py-2 text-sm text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          role="status"
        >
          {submitted}
        </p>
      )}
    </form>
  );
}
