"use server";

import { cookies } from "next/headers";
import { addLinesToCart, createCart, type CartLineInput, getCart } from "@/lib/shopify";

const CART_COOKIE = "sf_cart_id";

export async function getOrCreateCart(): Promise<{ id: string; checkoutUrl: string; totalQuantity: number }> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(CART_COOKIE)?.value;
  if (existing) {
    const cart = await getCart(existing);
    if (cart) return cart;
  }
  const cart = await createCart([]);
  cookieStore.set(CART_COOKIE, cart.id, { httpOnly: true, sameSite: "lax", path: "/" });
  return cart;
}

export async function addToCartAction(variantId: string, quantity: number = 1) {
  const cart = await getOrCreateCart();
  const updated = await addLinesToCart(cart.id, [{ merchandiseId: variantId, quantity } satisfies CartLineInput]);
  return updated;
}


