"use client";

import { createContext, useContext, useEffect, useState } from "react";

// One store per cart: a COD order always goes to a single store.

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
  quantity: number;
};

type CartStore = { id: number; name: string };
type CartProduct = Omit<CartItem, "quantity">;

type CartState = {
  store: CartStore | null;
  items: CartItem[];
};

type AddResult = "added" | "other-store";

type CartContextValue = CartState & {
  count: number;
  total: number;
  add: (store: CartStore, product: CartProduct, quantity?: number) => AddResult;
  replaceWith: (
    store: CartStore,
    product: CartProduct,
    quantity?: number,
  ) => void;
  setQuantity: (productId: number, quantity: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "thiqa_cart";
const empty: CartState = { store: null, items: [] };

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartState>(empty);

  // Load once on the client, then save on every change
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCart(JSON.parse(saved));
    } catch {
      /* ignore broken or blocked storage */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      /* ignore */
    }
  }, [cart]);

  function add(
    store: CartStore,
    product: CartProduct,
    quantity = 1,
  ): AddResult {
    if (cart.store && cart.store.id !== store.id && cart.items.length > 0) {
      return "other-store"; // the page asks the customer to start a new cart
    }
    setCart((c) => {
      const existing = c.items.find((i) => i.productId === product.productId);
      const items = existing
        ? c.items.map((i) =>
            i.productId === product.productId
              ? {
                  ...i,
                  ...product,
                  quantity: Math.min(i.quantity + quantity, product.stock),
                }
              : i,
          )
        : [
            ...c.items,
            { ...product, quantity: Math.min(quantity, product.stock) },
          ];
      return { store, items };
    });
    return "added";
  }

  function replaceWith(store: CartStore, product: CartProduct, quantity = 1) {
    setCart({
      store,
      items: [{ ...product, quantity: Math.min(quantity, product.stock) }],
    });
  }

  function setQuantity(productId: number, quantity: number) {
    setCart((c) => ({
      ...c,
      items: c.items.map((i) =>
        i.productId === productId
          ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
          : i,
      ),
    }));
  }

  function remove(productId: number) {
    setCart((c) => {
      const items = c.items.filter((i) => i.productId !== productId);
      return items.length ? { ...c, items } : empty;
    });
  }

  function clear() {
    setCart(empty);
  }

  const count = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        ...cart,
        count,
        total,
        add,
        replaceWith,
        setQuantity,
        remove,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
