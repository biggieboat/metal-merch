import { fetchProducts, isShopifyConfigured } from "@/lib/shopify";
import ProductsClient from "./products-client";

export default async function Home() {
  if (!isShopifyConfigured()) {
        return (
          <main className="min-h-screen px-6 py-10" suppressHydrationWarning={true}>
            <h1 className="text-2xl font-bold mb-4 text-[var(--primary)]">Connect Shopify</h1>
            <p className="text-[var(--muted-foreground)]">Add <code className="bg-[var(--muted)] px-2 py-1 rounded text-[var(--accent-foreground)]">.env.local</code> with <code className="bg-[var(--muted)] px-2 py-1 rounded text-[var(--accent-foreground)]">SHOPIFY_STORE_DOMAIN</code> and <code className="bg-[var(--muted)] px-2 py-1 rounded text-[var(--accent-foreground)]">SHOPIFY_STOREFRONT_TOKEN</code>, then restart the dev server.</p>
          </main>
        );
  }
  try {
    const products = await fetchProducts(24);
    return (
      <main className="min-h-screen px-6 py-10" suppressHydrationWarning={true}>
        <h1 className="text-3xl font-bold tracking-tight mb-6 text-[var(--primary)]">New products</h1>
        <ProductsClient initialProducts={products} />
      </main>
    );
  } catch {
    return (
      <main className="min-h-screen px-6 py-10" suppressHydrationWarning={true}>
        <h1 className="text-2xl font-bold mb-4 text-[var(--primary)]">Shopify connection error</h1>
        <p className="text-[var(--muted-foreground)] mb-2">We could not fetch products. Check your <code className="bg-[var(--muted)] px-2 py-1 rounded text-[var(--accent-foreground)]">SHOPIFY_STORE_DOMAIN</code> and <code className="bg-[var(--muted)] px-2 py-1 rounded text-[var(--accent-foreground)]">SHOPIFY_STOREFRONT_TOKEN</code>.</p>
        <p className="text-[var(--muted-foreground)]">If you just updated <code className="bg-[var(--muted)] px-2 py-1 rounded text-[var(--accent-foreground)]">.env.local</code>, restart the dev server.</p>
      </main>
    );
  }
}
