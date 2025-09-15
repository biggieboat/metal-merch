import Link from "next/link";
import Image from "next/image";
import { fetchProducts } from "@/lib/shopify";

export default async function Home() {
  const products = await fetchProducts(24);
  return (
    <main className="min-h-screen px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-8">New desecrations</h1>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p: any) => (
          <li key={p.id} className="group">
            <Link href={`/product/${p.handle}`} className="block">
              {p.featuredImage && (
                <Image
                  src={p.featuredImage.url}
                  alt={p.featuredImage.altText || p.title}
                  width={600}
                  height={800}
                  className="aspect-[3/4] object-cover rounded border border-white/10 group-hover:opacity-90 transition"
                />
              )}
              <div className="mt-3">
                <p className="text-sm uppercase tracking-wide">{p.title}</p>
                <p className="text-sm text-white/60">
                  {p.priceRange?.minVariantPrice?.amount} {p.priceRange?.minVariantPrice?.currencyCode}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
