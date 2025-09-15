import Link from "next/link";
import Image from "next/image";
import { fetchProducts, isShopifyConfigured } from "@/lib/shopify";
import ProductsClient from "./products-client";

export default async function Home() {
  if (!isShopifyConfigured()) {
    return (
      <main className="min-h-screen px-6 py-10" suppressHydrationWarning={true}>
        <h1 className="text-2xl font-bold mb-4">Connect Shopify</h1>
        <p className="text-white/70">Add <code>.env.local</code> with <code>SHOPIFY_STORE_DOMAIN</code> and <code>SHOPIFY_STOREFRONT_TOKEN</code>, then restart the dev server.</p>
      </main>
    );
  }
  try {
    const products = await fetchProducts(24);
    return (
      <main className="min-h-screen px-6 py-10" suppressHydrationWarning={true}>
        <h1 className="text-3xl font-bold tracking-tight mb-6">New products</h1>
        <ProductsClient initialProducts={products} />
      </main>
    );
  } catch (error: any) {
    return (
      <main className="min-h-screen px-6 py-10" suppressHydrationWarning={true}>
        <h1 className="text-2xl font-bold mb-4">Shopify connection error</h1>
        <p className="text-white/70 mb-2">We could not fetch products. Check your <code>SHOPIFY_STORE_DOMAIN</code> and <code>SHOPIFY_STOREFRONT_TOKEN</code>.</p>
        <p className="text-white/60">If you just updated <code>.env.local</code>, restart the dev server.</p>
      </main>
    );
  }
}
