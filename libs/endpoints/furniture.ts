import { apiRequest } from "@/libs/api/clients";

export interface FurnitureItem {
  id: number;
  name: string;
  description: string;
  sale_price: string;
  regular_price: string;
  image_url: string;
  images?: string;
  visibility?: string;
  created_at: string;
}

export interface FurnitureResponse {
  status: string;
  data: {
    items: FurnitureItem[];
  };
}

/**
 * Get list of furniture items
 */
export async function getFurnitureList(): Promise<FurnitureResponse> {
  try {
    const response = await apiRequest<FurnitureResponse>("/products/public", {
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
