export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  color: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  mrp: number;
  price: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  categoryId: string;
  images: string[];
  variants: ProductVariant[];
  tags: string[];
  highlights: Record<string, string>;
  description: string;
  compliance: {
    fssai: string;
    seller: string;
    address: string;
  };
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  bgColor: string;
}

export interface Shelf {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  categorySlug: string | null;
  tags: string[] | null;
  productIds: string[];
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface Address {
  id: string;
  label: 'home' | 'work' | 'other';
  name: string;
  phone: string;
  line1: string;
  line2: string;
  landmark: string;
  pincode: string;
  city: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  phone: string;
  name: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  address: Address;
  total: number;
  savings: number;
  status: 'placed' | 'packing' | 'out_for_delivery' | 'delivered';
  createdAt: string;
  deliveryFee: number;
  handlingFee: number;
  tip: number;
  instructions: string;
  needBag: boolean;
}

export interface Location {
  pincode: string;
  area: string;
  isServiceable: boolean;
}
