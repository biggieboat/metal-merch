import Image from "next/image";
import Link from "next/link";
import { getOrCreateCart } from "@/app/actions/cart";

export default async function CartPage() {
  const cart = await getOrCreateCart();
  const lines = cart?.lines?.edges ?? [];

  return (
    <main className="px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Your ritual kit</h1>
      {lines.length === 0 ? (
        <div className="text-white/70">Your cart is empty. <Link href="/" className="underline">Continue shopping</Link>.</div>
      ) : (
        <div className="space-y-6">
          <ul className="divide-y divide-white/10 border border-white/10 rounded">
            {lines.map((edge: any) => {
              const line = edge.node;
              const merch = line.merchandise;
              const product = merch.product;
              return (
                <li key={line.id} className="flex items-center gap-4 p-4">
                  {product.featuredImage && (
                    <Image src={product.featuredImage.url} alt={product.featuredImage.altText || product.title} width={80} height={100} className="rounded border border-white/10 object-cover" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{product.title}</div>
                    <div className="text-xs text-white/60">{merch.title}</div>
                  </div>
                  <div className="text-sm">x{line.quantity}</div>
                </li>
              );
            })}
          </ul>
          <div className="flex justify-end">
            <Link href={cart.checkoutUrl} className="bg-white text-black font-semibold rounded px-4 py-3 hover:opacity-90">Checkout</Link>
          </div>
        </div>
      )}
    </main>
  );
}


