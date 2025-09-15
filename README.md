Obsidian Cult Merch — a Next.js storefront integrated with Shopify Storefront API for selling black/death metal shirts and longsleeves.

<!-- Updated for Vercel deployment -->

## Getting Started

1) Create a Shopify custom app and generate a Storefront API access token.

2) Copy `.env.example` to `.env.local` and fill in values:

```
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=shpat_xxx
SHOPIFY_API_VERSION=2024-07

SITE_NAME=Obsidian Cult Merch
SITE_DESCRIPTION=Black & death metal shirts and longsleeves
```

3) Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the storefront.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to load [Geist](https://vercel.com/font).

### Features

- Product grid and product detail pages
- Cart with Shopify Storefront cart and hosted checkout
- Dark, minimalist theme with metal aesthetic

### Notes

- Ensure your products are published to the Online Store channel
- Update `next.config.ts` if your image CDN is a custom domain
