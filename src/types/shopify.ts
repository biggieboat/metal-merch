export interface ShopifyImage {
  url: string;
  altText?: string | null;
  width?: number;
  height?: number;
}

export interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyPrice;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description?: string;
  tags?: string[];
  featuredImage?: ShopifyImage | null;
  priceRange?: {
    minVariantPrice?: ShopifyPrice;
  };
  images?: {
    edges: Array<{ node: ShopifyImage }>;
  };
  variants?: {
    edges: Array<{ node: ShopifyProductVariant }>;
  };
  descriptionHtml?: string;
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  cost?: {
    totalAmount?: ShopifyPrice;
  };
  merchandise?: {
    id: string;
    title?: string;
    price?: ShopifyPrice;
    product?: {
      id: string;
      title?: string;
      handle?: string;
      featuredImage?: ShopifyImage | null;
    };
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost?: {
    subtotalAmount?: ShopifyPrice;
    totalAmount?: ShopifyPrice;
  };
  lines?: {
    edges: Array<{ node: ShopifyCartLine }>;
  };
}
