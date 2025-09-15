"use client";

import { useState } from "react";

type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost?: {
    subtotalAmount?: { amount?: string; currencyCode?: string };
    totalAmount?: { amount?: string; currencyCode?: string };
  };
  lines?: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        cost?: { totalAmount?: { amount?: string; currencyCode?: string } };
        merchandise?: {
          title?: string;
          price?: { amount?: string; currencyCode?: string };
          product?: {
            title?: string;
            handle?: string;
            featuredImage?: { url?: string; altText?: string | null };
          };
        };
      };
    }>;
  };
};

const SHIPPING_OPTIONS = [
  { id: "standard", name: "Standard Shipping", price: 20, days: "10-15 business days" },
  { id: "express", name: "Express Shipping", price: 40, days: "3-6 business days" },
];

export default function CartClient({ cart }: { cart: Cart | null }) {
  const [selectedShipping, setSelectedShipping] = useState("standard");
  const lines = cart?.lines?.edges ?? [];
  
  const subtotal = parseFloat(cart?.cost?.subtotalAmount?.amount || "0");
  const isFreeShipping = subtotal >= 150;
  const selectedOption = SHIPPING_OPTIONS.find(opt => opt.id === selectedShipping) || SHIPPING_OPTIONS[0];
  const shippingCost = isFreeShipping && selectedOption.id === "standard" ? 0 : selectedOption.price;
  const total = subtotal + shippingCost;

  if (lines.length === 0) {
    return (
      <div className="text-white/70">
        Your cart is empty. <a href="/" className="underline">Continue shopping</a>.
      </div>
    );
  }

  return (
    <div className="space-y-6" suppressHydrationWarning={true}>
      <ul className="divide-y divide-white/10 border border-white/10 rounded" suppressHydrationWarning={true}>
        {lines.map((edge: any) => {
          const line = edge.node;
          const merch = line.merchandise;
          const product = merch.product;
          const unitPrice = merch.price;
          const lineTotal = line.cost?.totalAmount;
          return (
            <li key={line.id} className="grid grid-cols-[80px,1fr,100px,120px,80px] items-center gap-4 p-4" suppressHydrationWarning={true}>
              {product.featuredImage && (
                <img
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText || product.title}
                  className="w-20 h-24 rounded border border-white/10 object-cover"
                />
              )}
              <div className="flex-1">
                <div className="font-medium line-clamp-1">{product.title}</div>
                <div className="text-xs text-white/60">Size: {merch.title}</div>
              </div>
              <div className="text-sm text-white/80">
                {unitPrice?.amount} {unitPrice?.currencyCode}
              </div>
              <div className="text-sm text-white/80">Qty: {line.quantity}</div>
              <div className="text-sm font-semibold text-white">
                {lineTotal?.amount} {lineTotal?.currencyCode}
              </div>
            </li>
          );
        })}
      </ul>

        <div className="flex justify-end" suppressHydrationWarning={true}>
          <div className="w-full max-w-sm border border-white/10 rounded p-4" suppressHydrationWarning={true}>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-white/70">Subtotal</span>
            <span className="text-white">{cart?.cost?.subtotalAmount?.amount} {cart?.cost?.subtotalAmount?.currencyCode}</span>
          </div>
          
          <div className="border-t border-white/10 pt-3 mb-3">
            <div className="text-sm text-white/70 mb-2">Shipping</div>
            <select
              value={selectedShipping}
              onChange={(e) => setSelectedShipping(e.target.value)}
              className="w-full bg-black/60 border border-white/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 mb-2"
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
            <span className="text-white/70">Total</span>
            <span className="text-white font-semibold">
              ${total.toFixed(2)} {cart?.cost?.subtotalAmount?.currencyCode}
            </span>
          </div>
          
          {cart?.checkoutUrl && (
            <a
              href={cart.checkoutUrl}
              className="w-full block text-center bg-white text-black font-semibold rounded px-4 py-3 hover:opacity-90"
            >
              Checkout
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
