import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      // Optional: if your store serves images from your custom domain
      ...(process.env.SHOPIFY_STORE_DOMAIN
        ? [{ protocol: "https", hostname: process.env.SHOPIFY_STORE_DOMAIN } as const]
        : []),
    ],
  },
};

export default nextConfig;
