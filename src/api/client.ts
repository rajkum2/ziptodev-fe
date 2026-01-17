// const SIMULATED_DELAY_MIN = 300;
// const SIMULATED_DELAY_MAX = 800;

// function getRandomDelay(): number {
//   return Math.floor(Math.random() * (SIMULATED_DELAY_MAX - SIMULATED_DELAY_MIN + 1)) + SIMULATED_DELAY_MIN;
// }

// export async function simulateApiCall<T>(data: T): Promise<T> {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(data);
//     }, getRandomDelay());
//   });
// }

// export async function simulateApiCallWithError<T>(data: T, shouldFail: boolean = false): Promise<T> {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (shouldFail) {
//         reject(new Error('API call failed'));
//       } else {
//         resolve(data);
//       }
//     }, getRandomDelay());
//   });
// }



// API Base URL from environment
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3008/api';

// API response type from backend
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Pagination info from backend
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Paginated API response type
interface PaginatedApiResponse<T> {
  success: boolean;
  data: T;
  pagination: PaginationInfo;
  message?: string;
}

// Paginated response with data
export interface PaginatedResponse<T> {
  data: T;
  pagination: PaginationInfo;
}

// Real API client
export async function apiClient<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const json: ApiResponse<T> = await response.json();

  if (!json.success) {
    throw new Error('API request failed');
  }

  return json.data;
}

// Paginated API client for endpoints with pagination
export async function apiClientPaginated<T>(endpoint: string): Promise<PaginatedResponse<T>> {
  const response = await fetch(`${API_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const json: PaginatedApiResponse<T> = await response.json();

  if (!json.success) {
    throw new Error('API request failed');
  }

  return {
    data: json.data,
    pagination: json.pagination,
  };
}

const SIMULATED_DELAY_MIN = 300;
const SIMULATED_DELAY_MAX = 800;

function getRandomDelay(): number {
  return Math.floor(Math.random() * (SIMULATED_DELAY_MAX - SIMULATED_DELAY_MIN + 1)) + SIMULATED_DELAY_MIN;
}

export async function simulateApiCall<T>(data: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, getRandomDelay());
  });
}

export async function simulateApiCallWithError<T>(data: T, shouldFail: boolean = false): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('API call failed'));
      } else {
        resolve(data);
      }
    }, getRandomDelay());
  });
}
