import { simulateApiCall, apiClient, apiClientPaginated, type PaginatedResponse } from './client';
import productsData from '../mockData/products.json';
import type { Category, Product, Banner, Shelf, Location } from '../types';

export async function getCategories(): Promise<Category[]> {
  return apiClient<Category[]>('/categories');
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    return await apiClient<Category>(`/categories/${slug}`);
  } catch {
    return null;
  }
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
}

export async function getProducts(params: GetProductsParams = {}): Promise<PaginatedResponse<Product[]>> {
  const { page = 1, limit = 10 } = params;
  return apiClientPaginated<Product[]>(`/products?page=${page}&limit=${limit}`);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    return await apiClient<Product>(`/products/${slug}`);
  } catch {
    return null;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = productsData as unknown as Product[];
  const product = products.find((p) => p.id === id) || null;
  return simulateApiCall(product);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  return apiClient<Product[]>(`/products/category/${categorySlug}`);
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  return apiClient<Product[]>(`/products/by-ids?ids=${ids.join(',')}`);
}

export interface SearchProductsParams {
  query: string;
  page?: number;
  limit?: number;
}

export async function searchProducts(params: SearchProductsParams): Promise<Product[]> {
  const { query, page = 1, limit = 10 } = params;
  return apiClient<Product[]>(`/products/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
}

export async function getBanners(): Promise<Banner[]> {
  return apiClient<Banner[]>('/banners');
}

export async function getShelves(): Promise<Shelf[]> {
  return apiClient<Shelf[]>('/shelves');
}

export async function getRecommendations(productId: string): Promise<Product[]> {
  try {
    return await apiClient<Product[]>(`/products/recommendations/${productId}`);
  } catch {
    return [];
  }
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
