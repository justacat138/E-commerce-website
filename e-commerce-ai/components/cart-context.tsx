"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine, Product, Shop } from "@/lib/types";

type CartContextValue = {
  lines: CartLine[];
  addItem: (product: Product, shop: Shop, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeLine: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function sortNewestFirst(lines: CartLine[]): CartLine[] {
  return [...lines].sort((a, b) => b.addedAt - a.addedAt);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const addItem = useCallback((product: Product, shop: Shop, quantity = 1) => {
    const now = Date.now();
    setLines((prev) => {
      const idx = prev.findIndex((l) => l.product.id === product.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          quantity: next[idx].quantity + quantity,
          addedAt: now,
        };
        return sortNewestFirst(next);
      }
      return sortNewestFirst([
        ...prev,
        { product, shop, quantity, addedAt: now },
      ]);
    });
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setLines((prev) => {
      if (quantity <= 0) {
        return prev.filter((l) => l.product.id !== productId);
      }
      return sortNewestFirst(
        prev.map((l) =>
          l.product.id === productId ? { ...l, quantity } : l,
        ),
      );
    });
  }, []);

  const removeLine = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.product.id !== productId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(
    () => ({ lines, addItem, setQuantity, removeLine, clear }),
    [lines, addItem, setQuantity, removeLine, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
