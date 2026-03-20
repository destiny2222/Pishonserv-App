import { apiRequest } from "@/libs/api/clients";

export interface WishlistItem {
  id: number;
  property_id: number;
  title: string;
  location: string;
  price: string;
  images: string | string[];
  created_at: string;
}

export interface WishlistResponse {
  status: string;
  data: {
    items: WishlistItem[];
  };
}

export interface WishlistToggleResponse {
  status: string;
  message: string;
  data?: {
    added?: boolean;
    removed?: boolean;
  };
}

/**
 * Get user's wishlist
 */
export async function getWishlist(): Promise<WishlistResponse> {
  try {
    const response = await apiRequest<WishlistResponse>("/wishlist", {
      method: "GET",
      auth: true,
    });
    return response;
    
  } catch (error) {
    
    throw error;
  }
}

/**
 * Add/Remove a property to/from user's wishlist
 */
export async function addToWishlist(
  propertyId: number,
): Promise<WishlistToggleResponse> {
  try {
    const response = await apiRequest<WishlistToggleResponse>("/wishlist/toggle", {
      method: "POST",
      body: { property_id: propertyId },
      auth: true,
    });
    return response;
  } catch (error) {
    
    throw error;
  }
}

/**
 * Remove a property from user's wishlist
 */
export async function removeFromWishlist(
  propertyId: number,
): Promise<WishlistToggleResponse> {
  try {
    const response = await apiRequest<WishlistToggleResponse>("/wishlist/remove", {
      method: "POST",
      body: { property_id: propertyId },
      auth: true,
    });
    return response;
  } catch (error) {
      
    throw error;
  }
}