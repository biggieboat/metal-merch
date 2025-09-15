import Image from "next/image";
import { fetchProductByHandle } from "@/lib/shopify";
import { addToCartAction } from "@/app/actions/cart";

type PageProps = { params: Promise<{ handle: string }> };

export default async function ProductPage({ params }: PageProps) {
  const { handle } = await params;
  const product = await fetchProductByHandle(handle);
  if (!product) {
    return <div className="px-6 py-10">Product not found.</div>;
  }
  const images = product.images?.edges?.map((e: any) => e.node) ?? [];
  const variants = product.variants?.edges?.map((e: any) => e.node) ?? [];
  const defaultVariant = variants.find((v: any) => v.availableForSale) ?? variants[0];

  return (
    <main className="px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="space-y-4">
        {images[0] && (
          <Image
            src={images[0].url}
            alt={images[0].altText || product.title}
            width={1000}
            height={1200}
            className="rounded border border-white/10 object-cover w-full"
            priority
          />
        )}
        <div className="grid grid-cols-4 gap-3">
          {images.slice(1, 5).map((img: any) => (
            <Image key={img.url} src={img.url} alt={img.altText || ""} width={300} height={300} className="rounded border border-white/10 object-cover aspect-square" />
          ))}
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
        <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
        <form action={async (formData: FormData) => {
          "use server";
          const variantId = String(formData.get("variantId"));
          await addToCartAction(variantId, 1);
        }} className="mt-8 space-y-4">
          <label className="block text-sm">Variant</label>
          <select name="variantId" defaultValue={defaultVariant?.id} className="bg-black border border-white/20 rounded px-3 py-2 w-full">
            {variants.map((v: any) => (
              <option key={v.id} value={v.id} disabled={!v.availableForSale}>
                {v.title} {v.availableForSale ? "" : "(Sold out)"} — {v.price.amount} {v.price.currencyCode}
              </option>
            ))}
          </select>
          <button type="submit" className="w-full bg-white text-black font-semibold rounded px-4 py-3 hover:opacity-90">Add to cart</button>
        </form>
      </div>
    </main>
  );
}


