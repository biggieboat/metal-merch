import Image from "next/image";
import Link from "next/link";
import { fetchProductByHandle } from "@/lib/shopify";
import { addToCartAction } from "@/app/actions/cart";
import { ShopifyProduct, ShopifyImage, ShopifyProductVariant } from "@/types/shopify";

type PageProps = { params: Promise<{ handle: string }> };

export default async function ProductPage({ params }: PageProps) {
  const { handle } = await params;
  const product = await fetchProductByHandle(handle);
  if (!product) {
    return <div className="px-6 py-10">Product not found.</div>;
  }
  const images = product.images?.edges?.map((e: { node: ShopifyImage }) => e.node) ?? [];
  const variants = product.variants?.edges?.map((e: { node: ShopifyProductVariant }) => e.node) ?? [];
  const defaultVariant = variants.find((v: ShopifyProductVariant) => v.availableForSale) ?? variants[0];
  const price = defaultVariant?.price;

  return (
    <main className="px-6 py-10">
      <nav className="mb-6 text-sm text-white/60">
        <Link href="/" className="hover:text-white">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-white/80 line-clamp-1 align-middle">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="aspect-[3/4] w-full overflow-hidden rounded border border-white/10 bg-black/50">
            {images[0] && (
              <Image
                src={images[0].url}
                alt={images[0].altText || product.title}
                width={1200}
                height={1600}
                className="h-full w-full object-cover"
                priority
              />
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {images.slice(1, 6).map((img: ShopifyImage) => (
                <Image key={img.url} src={img.url} alt={img.altText || ""} width={300} height={300} className="rounded border border-white/10 object-cover aspect-square hover:opacity-90 transition" />
              ))}
            </div>
          )}
        </div>

        <div className="lg:pl-4">
          <h1 className="text-3xl font-bold tracking-tight mb-3">{product.title}</h1>
          {price && (
            <div className="text-xl mb-6 text-white/90">
              {price.amount} {price.currencyCode}
            </div>
          )}

          <div className="prose prose-invert max-w-none border-t border-white/10 pt-6" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />

          <form
            action={async (formData: FormData) => {
              "use server";
              const variantId = String(formData.get("variantId"));
              await addToCartAction(variantId, 1);
            }}
            className="mt-8 space-y-4 border-t border-white/10 pt-6"
          >
            {variants.length > 0 && (
              <div>
                <label className="block text-sm mb-2 text-white/80">Select variant</label>
                <select
                  name="variantId"
                  defaultValue={defaultVariant?.id}
                  className="bg-black/60 border border-white/20 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  {variants.map((v: ShopifyProductVariant) => (
                    <option key={v.id} value={v.id} disabled={!v.availableForSale}>
                      {v.title} {v.availableForSale ? "" : "(Sold out)"} — {v.price.amount} {v.price.currencyCode}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-white text-black font-semibold rounded px-4 py-3 hover:opacity-90 disabled:opacity-50"
              disabled={!defaultVariant?.availableForSale}
            >
              {defaultVariant?.availableForSale ? "Add to cart" : "Sold out"}
            </button>

            <div className="text-xs text-white/50">Ships worldwide. Secure checkout via Shopify.</div>
          </form>
        </div>
      </div>
    </main>
  );
}


