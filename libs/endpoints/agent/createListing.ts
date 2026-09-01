import { apiRequest } from "@/libs/api/clients";

export type ListingType = "for_sale" | "for_rent" | "short_let" | "hotel";

export interface CreateListingData {
  title: string;
  price: number;
  location: string;
  listing_type: ListingType;
  description: string;
  type?: string;
  bedrooms?: number;
  bathrooms?: number;
  garage?: number;
  size?: number;
  amenities?: string[];
  images?: string[]; // Array of Base64 strings
  youtube_video_url?: string;
  utility_bill?: string; // Base64 image or PDF data URL
}

export const createListing = async (data: CreateListingData) => {
  return apiRequest("/properties", {
    method: "POST",
    body: data,
    auth: true,
  });
};

/**
 * fetch the properties created by the agent
 */
export interface Property {
  id: number;
  property_code: string;
  title: string;
  price: string;
  location: string;
  type: string;
  status: string;
  description: string;
  owner_id: number;
  created_at: string;
  images: string | null | undefined; // Comma-separated string of filenames (may be null/undefined on new listings)
  admin_approved: number;
  listing_type: string;
  bedrooms: number;
  bathrooms: number;
  size: string | null;
  garage: number;
  furnishing_status: string;
  property_condition: string;
  amenities: string; // Comma-separated string
  maintenance_fee: string | null;
  agent_fee: string | null;
  caution_fee: string | null;
  price_frequency: string;
  minimum_stay: number | null;
  checkin_time: string;
  checkout_time: string;
  room_type: string;
  star_rating: number | null;
  policies: string;
  zoho_deal_id: string | null;
  zoho_product_id: string | null;
  latitude: string;
  longitude: string;
  expiry_date: string;
}

export interface GetPropertiesResponse {
  status: string;
  data: {
    items: Property[];
  };
}

export interface DeletePropertyResponse {
  status: string;
  data: {
    success: boolean;
  };
}

/**
 * delete a property
 */
export const deleteProperty = async (id: number) => {
  return apiRequest<DeletePropertyResponse>(`/properties/${id}`, {
    method: "DELETE",
    auth: true,
  });
};

/**
 * fetch the properties created by the agent
 */
export const getAgentProperties = async () => {
  return apiRequest<GetPropertiesResponse>("/properties/me", {
    method: "GET",
    auth: true,
  });
};
