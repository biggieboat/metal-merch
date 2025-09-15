import { GraphQLClient, gql } from "graphql-request";

const storeDomain = process.env.SHOPIFY_STORE_DOMAIN as string;
const storefrontToken = process.env.SHOPIFY_STOREFRONT_TOKEN as string;
const apiVersion = process.env.SHOPIFY_API_VERSION || "2024-07";

if (!storeDomain || !storefrontToken) {
  // Fail fast at runtime to make misconfiguration obvious during dev
  throw new Error("Missing Shopify env. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_TOKEN.");
}

export const shopifyClient = new GraphQLClient(
  `https://${storeDomain}/api/${apiVersion}/graphql.json`,
  {
    headers: {
      "X-Shopify-Storefront-Access-Token": storefrontToken,
      "Content-Type": "application/json",
    },
  }
);

export const queries = {
  products: gql`
    query Products($first: Int = 24) {
      products(first: $first, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            id
            handle
            title
            description
            featuredImage { url altText width height }
            priceRange { minVariantPrice { amount currencyCode } }
          }
        }
      }
    }
  `,
  productByHandle: gql`
    query ProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        title
        descriptionHtml
        handle
        images(first: 6) { edges { node { url altText width height } } }
        variants(first: 50) { edges { node { id title availableForSale price { amount currencyCode } } } }
      }
    }
  `,
  cartCreate: gql`
    mutation CartCreate($lines: [CartLineInput!]) {
      cartCreate(input: { lines: $lines }) {
        cart { id checkoutUrl totalQuantity }
        userErrors { field message }
      }
    }
  `,
  cartQuery: gql`
    query CartQuery($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        totalQuantity
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              cost { totalAmount { amount currencyCode } }
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product { title handle featuredImage { url altText width height } }
                  price { amount currencyCode }
                }
              }
            }
          }
        }
      }
    }
  `,
  cartLinesAdd: gql`
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { id totalQuantity checkoutUrl }
        userErrors { field message }
      }
    }
  `,
};

export type CartLineInput = { merchandiseId: string; quantity: number };

export async function fetchProducts(limit = 24) {
  const data = await shopifyClient.request(queries.products, { first: limit });
  return data.products.edges.map((e: any) => e.node);
}

export async function fetchProductByHandle(handle: string) {
  const data = await shopifyClient.request(queries.productByHandle, { handle });
  return data.product;
}

export async function createCart(lines: CartLineInput[]) {
  const data = await shopifyClient.request(queries.cartCreate, { lines });
  const error = data.cartCreate.userErrors?.[0]?.message;
  if (error) throw new Error(error);
  return data.cartCreate.cart as { id: string; checkoutUrl: string; totalQuantity: number };
}

export async function addLinesToCart(cartId: string, lines: CartLineInput[]) {
  const data = await shopifyClient.request(queries.cartLinesAdd, { cartId, lines });
  const error = data.cartLinesAdd.userErrors?.[0]?.message;
  if (error) throw new Error(error);
  return data.cartLinesAdd.cart as { id: string; checkoutUrl: string; totalQuantity: number };
}

export async function getCart(cartId: string) {
  const data = await shopifyClient.request(queries.cartQuery, { cartId });
  return data.cart;
}


