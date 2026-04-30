import { apiRequest } from "@/libs/api/clients";

export interface FurnitureItem {
  id: number;
  name: string;
  description: string;
  sale_price: string;
  regular_price: string;
  image_url: string;
  image?: string;
  images?: string | string[];
  visibility?: string;
  created_at: string;
}

export interface FurnitureResponse {
  status: string;
  data: {
    items: FurnitureItem[];
  };
}

export interface FurnitureCategory {
  category_path: string;
  product_count: number;
}

export interface FurnitureCategoryResponse {
  status: string;
  data: {
    items: FurnitureCategory[];
  };
}

export interface FurnitureParams {
  q?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  page?: number;
  limit?: number;
}

/**
 * Get list of furniture items
 */
export async function getFurnitureList(params?: FurnitureParams): Promise<FurnitureResponse> {
  try {
    const response = await apiRequest<FurnitureResponse>("/products/public", {
      method: "GET",
      params: params,
      auth: false,
    });
    return response;
  } catch (error) {
    throw error;
  }
}

/**
 * Get list of furniture categories
 */
export async function getFurnitureCategories(): Promise<FurnitureCategoryResponse> {
  try {
    const response = await apiRequest<FurnitureCategoryResponse>("/products/categories/public", {
      method: "GET",
      auth: false,
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export interface FurnitureDetailResponse {
  status: string;
  data: {
    item: FurnitureItem;
  };
}

/**
 * Get details of a specific furniture item by ID
 */
export async function getFurnitureDetail(
  furnitureId: number,
): Promise<FurnitureItem | null> {
  try {
    const response = await apiRequest<any>(`/products/${furnitureId}`, {
      method: "GET",
      auth: false,
    });
    
    // Handle different response structures
    if (response?.data?.item) {
      return response.data.item;
    } else if (response?.data) {
      return response.data;
    } else if (response?.item) {
      return response.item;
    }
    return response ?? null;
  } catch (error) {
    
    return null;
  }
}
export interface FurnitureQuotePayload {
  product_id: number;
  full_name: string;
  phone: string;
  email: string;
  delivery_address?: string;
  preferred_contact?: string;
  note?: string;
}

export interface FurnitureQuoteResponse {
  status: string;
  data: {
    success: boolean;
    request_id: string;
  };
}

/**
 * Create a furniture quote request
 */
export async function createFurnitureQuoteRequest(
  payload: FurnitureQuotePayload
): Promise<FurnitureQuoteResponse> {
  try {
    const response = await apiRequest<FurnitureQuoteResponse>("/products/quote-requests", {
      method: "POST",
      body: payload,
      auth: false,
    });
    return response;
  } catch (error) {
    throw error;
  }
}
