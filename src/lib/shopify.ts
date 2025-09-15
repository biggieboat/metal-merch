import { GraphQLClient, gql } from "graphql-request";
import { ShopifyProduct, ShopifyCart } from "@/types/shopify";

const storeDomain = process.env.SHOPIFY_STORE_DOMAIN as string | undefined;
const storefrontToken = process.env.SHOPIFY_STOREFRONT_TOKEN as string | undefined;
const apiVersion = process.env.SHOPIFY_API_VERSION || "2024-07";

export function isShopifyConfigured(): boolean {
  return Boolean(storeDomain && storefrontToken);
}

function getClient(): GraphQLClient {
  if (!storeDomain || !storefrontToken) {
    throw new Error("Shopify not configured. Add SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_TOKEN to .env.local");
  }
  return new GraphQLClient(`https://${storeDomain}/api/${apiVersion}/graphql.json`, {
    headers: {
      "X-Shopify-Storefront-Access-Token": storefrontToken,
      "Content-Type": "application/json",
    },
  });
}

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
            tags
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
        cost {
          subtotalAmount { amount currencyCode }
          totalAmount { amount currencyCode }
        }
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

export async function fetchProducts(limit = 24): Promise<ShopifyProduct[]> {
  const client = getClient();
  const data = (await client.request(queries.products, { first: limit })) as { products: { edges: Array<{ node: ShopifyProduct }> } };
  return data.products.edges.map((e: { node: ShopifyProduct }) => e.node);
}

export async function fetchProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const client = getClient();
  const data = (await client.request(queries.productByHandle, { handle })) as { product: ShopifyProduct | null };
  return data.product;
}

export async function createCart(lines: CartLineInput[]) {
  const client = getClient();
  const data = (await client.request(queries.cartCreate, { lines })) as { cartCreate: { userErrors?: Array<{ message: string }>; cart: { id: string; checkoutUrl: string; totalQuantity: number } } };
  const error = data.cartCreate.userErrors?.[0]?.message;
  if (error) throw new Error(error);
  return data.cartCreate.cart;
}

export async function addLinesToCart(cartId: string, lines: CartLineInput[]) {
  const client = getClient();
  const data = (await client.request(queries.cartLinesAdd, { cartId, lines })) as { cartLinesAdd: { userErrors?: Array<{ message: string }>; cart: { id: string; checkoutUrl: string; totalQuantity: number } } };
  const error = data.cartLinesAdd.userErrors?.[0]?.message;
  if (error) throw new Error(error);
  return data.cartLinesAdd.cart;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const client = getClient();
  const data = (await client.request(queries.cartQuery, { cartId })) as { cart: ShopifyCart | null };
  return data.cart;
}


