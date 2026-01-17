import { simulateApiCall } from './client';
import categoriesData from '../mockData/categories.json';
import productsData from '../mockData/products.json';
import bannersData from '../mockData/banners.json';
import shelvesData from '../mockData/shelves.json';
import type { Category, Product, Banner, Shelf, Location } from '../types';

export async function getCategories(): Promise<Category[]> {
  return simulateApiCall(categoriesData as Category[]);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = categoriesData as Category[];
  const category = categories.find((c) => c.slug === slug) || null;
  return simulateApiCall(category);
}

export async function getProducts(): Promise<Product[]> {
  return simulateApiCall(productsData as Product[]);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = productsData as Product[];
  const product = products.find((p) => p.slug === slug) || null;
  return simulateApiCall(product);
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = productsData as Product[];
  const product = products.find((p) => p.id === id) || null;
  return simulateApiCall(product);
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const products = productsData as Product[];
  const filtered = products.filter((p) => p.categoryId === categoryId);
  return simulateApiCall(filtered);
}

export async function getProductsByTag(tag: string): Promise<Product[]> {
  const products = productsData as Product[];
  const filtered = products.filter((p) => p.tags.includes(tag));
  return simulateApiCall(filtered);
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  const products = productsData as Product[];
  const filtered = products.filter((p) => ids.includes(p.id));
  return simulateApiCall(filtered);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const products = productsData as Product[];
  const lowerQuery = query.toLowerCase();
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.brand.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
  );
  return simulateApiCall(filtered);
}

export async function getBanners(): Promise<Banner[]> {
  return simulateApiCall(bannersData as Banner[]);
}

export async function getShelves(): Promise<Shelf[]> {
  return simulateApiCall(shelvesData as Shelf[]);
}

export async function getRecommendations(productId: string): Promise<Product[]> {
  const products = productsData as Product[];
  const currentProduct = products.find((p) => p.id === productId);
  if (!currentProduct) return simulateApiCall([]);

  const recommendations = products
    .filter((p) => p.categoryId === currentProduct.categoryId && p.id !== productId)
    .slice(0, 8);
  return simulateApiCall(recommendations);
}

export async function checkServiceability(pincode: string): Promise<Location> {
  const serviceablePincodes = ['400001', '400002', '400003', '400004', '400005', '400006', '400007', '400008', '400009', '400010',
    '110001', '110002', '110003', '110004', '110005',
    '560001', '560002', '560003', '560004', '560005',
    '500001', '500002', '500003', '500004', '500005'];

  const isServiceable = serviceablePincodes.includes(pincode);
  const areaMap: Record<string, string> = {
    '400001': 'Fort, Mumbai',
    '400002': 'Kalbadevi, Mumbai',
    '400003': 'Mandvi, Mumbai',
    '400004': 'Girgaon, Mumbai',
    '400005': 'Colaba, Mumbai',
    '110001': 'Connaught Place, Delhi',
    '110002': 'Darya Ganj, Delhi',
    '560001': 'MG Road, Bangalore',
    '560002': 'Richmond Town, Bangalore',
    '500001': 'Secunderabad, Hyderabad',
  };

  return simulateApiCall({
    pincode,
    area: areaMap[pincode] || (isServiceable ? `Area ${pincode}` : ''),
    isServiceable,
  });
}

export async function getTrendingSearches(): Promise<string[]> {
  return simulateApiCall(['milk', 'bread', 'eggs', 'banana', 'chips', 'maggi', 'coke', 'paneer']);
}
