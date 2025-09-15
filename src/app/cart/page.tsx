import { cookies } from "next/headers";
import { getCart } from "@/lib/shopify";
import CartClient from "./CartClient";

export default async function CartPage() {
  const cookieStore = await cookies();
  const existing = cookieStore.get("sf_cart_id")?.value;
  const cart = existing ? await getCart(existing) : null;

  return (
    <main className="px-6 py-10">
        <h1 className="text-2xl font-bold mb-6 text-[var(--primary)]">Your ritual kit</h1>
      <CartClient cart={cart} />
    </main>
  );
}


