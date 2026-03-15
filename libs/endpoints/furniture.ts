import { apiRequest } from "@/libs/api/clients";

export interface FurnitureItem {
  id: number;
  name: string;
  description: string;
  sale_price: string;
  regular_price: string;
  image_url: string;
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
    // console.error("Error fetching furniture list:", error);
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
): Promise<FurnitureDetailResponse> {
  try {
    const response = await apiRequest<FurnitureDetailResponse>(
      `/products/${furnitureId}`,
      {
        method: "GET",
        auth: false,
      },
    );
    return response;
  } catch (error) {
    // console.error("Error fetching furniture detail:", error);
    throw error;
  }
}
