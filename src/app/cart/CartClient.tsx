"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShopifyCart, ShopifyCartLine } from "@/types/shopify";

const SHIPPING_OPTIONS = [
  { id: "standard", name: "Standard Shipping", price: 20, days: "10-15 business days" },
  { id: "express", name: "Express Shipping", price: 40, days: "3-6 business days" },
];

export default function CartClient({ cart }: { cart: ShopifyCart | null }) {
  const [selectedShipping, setSelectedShipping] = useState("standard");
  const lines = cart?.lines?.edges ?? [];
  
  const subtotal = parseFloat(cart?.cost?.subtotalAmount?.amount || "0");
  const isFreeShipping = subtotal >= 150;
  const selectedOption = SHIPPING_OPTIONS.find(opt => opt.id === selectedShipping) || SHIPPING_OPTIONS[0];
  const shippingCost = isFreeShipping && selectedOption.id === "standard" ? 0 : selectedOption.price;
  const total = subtotal + shippingCost;

  if (lines.length === 0) {
    return (
      <div className="text-[var(--muted-foreground)]">
        Your cart is empty. <Link href="/" className="underline text-[var(--primary)] hover:text-[var(--accent-foreground)] transition-colors">Continue shopping</Link>.
      </div>
    );
  }

  return (
    <div className="space-y-6" suppressHydrationWarning={true}>
      <ul className="divide-y divide-[var(--border)] border border-[var(--border)] rounded bg-[var(--card)]" suppressHydrationWarning={true}>
        {lines.map((edge: { node: ShopifyCartLine }) => {
          const line = edge.node;
          const merch = line.merchandise;
          if (!merch) return null;
          const product = merch.product;
          if (!product) return null;
          const unitPrice = merch.price;
          const lineTotal = line.cost?.totalAmount;
          return (
            <li key={line.id} className="grid grid-cols-[80px,1fr,100px,120px,80px] items-center gap-4 p-4" suppressHydrationWarning={true}>
              {product.featuredImage && (
                <Image
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText || product.title || "Product image"}
                  width={80}
                  height={96}
                  className="w-20 h-24 rounded border border-[var(--border)] object-cover"
                />
              )}
              <div className="flex-1">
                <div className="font-medium line-clamp-1 text-[var(--foreground)]">{product.title}</div>
                <div className="text-xs text-[var(--muted-foreground)]">Size: {merch.title}</div>
              </div>
              <div className="text-sm text-[var(--muted-foreground)]">
                {unitPrice?.amount} {unitPrice?.currencyCode}
              </div>
              <div className="text-sm text-[var(--muted-foreground)]">Qty: {line.quantity}</div>
              <div className="text-sm font-semibold text-[var(--primary)]">
                {lineTotal?.amount} {lineTotal?.currencyCode}
              </div>
            </li>
          );
        })}
      </ul>

        <div className="flex justify-end" suppressHydrationWarning={true}>
          <div className="w-full max-w-sm border border-[var(--border)] rounded p-4 bg-[var(--card)]" suppressHydrationWarning={true}>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-[var(--muted-foreground)]">Subtotal</span>
            <span className="text-[var(--foreground)]">{cart?.cost?.subtotalAmount?.amount} {cart?.cost?.subtotalAmount?.currencyCode}</span>
          </div>
          
          <div className="border-t border-[var(--border)] pt-3 mb-3">
            <div className="text-sm text-[var(--muted-foreground)] mb-2">Shipping</div>
            <select
              value={selectedShipping}
              onChange={(e) => setSelectedShipping(e.target.value)}
              className="w-full bg-[var(--muted)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-[var(--accent)] mb-2 transition-colors"
            >
              {SHIPPING_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name} - {isFreeShipping && option.id === "standard" ? "FREE" : `$${option.price}`} ({option.days})
                </option>
              ))}
            </select>
            {isFreeShipping && selectedShipping === "standard" && (
              <div className="text-xs text-green-400">🎉 You qualify for free standard shipping!</div>
            )}
          </div>

          <div className="flex items-center justify-between text-sm mb-4">
            <span className="text-[var(--muted-foreground)]">Total</span>
            <span className="text-[var(--primary)] font-semibold">
              ${total.toFixed(2)} {cart?.cost?.subtotalAmount?.currencyCode}
            </span>
          </div>
          
          {cart?.checkoutUrl && (
            <a
              href={cart.checkoutUrl}
              className="w-full block text-center bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold rounded px-4 py-3 hover:bg-[var(--accent-foreground)] transition-colors"
            >
              Checkout
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
