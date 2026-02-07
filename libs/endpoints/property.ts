import { apiRequest } from "@/libs/api/clients";

export interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  type: string;
  listing_type: "for_sale" | "for_rent" | "short_let" | "hotel";
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  garage?: number;
  size?: string;
  amenities?: string[];
  // images?: string[];
  // image?: string;
  rating?: number;
  user_id?: number;
  is_featured?: boolean;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

interface ApiResponse<T> {
  status: string;
  data: T;
}

interface PropertiesResponse {
  items: Property[];
  page: number;
  limit: number;
}

const PROPERTY_TOKEN = process.env.EXPO_PUBLIC_API_ACCESS_TOKEN;


function propertyAuthHeaders() {
  if (!PROPERTY_TOKEN) {
    // console.warn("Missing EXPO_PUBLIC_API_ACCESS_TOKEN (properties will fail if backend requires it)");
    return {};
  }
  return { Authorization: `Bearer ${PROPERTY_TOKEN}` };
}

export const ENDPOINTS = {
  GET_PROPERTIES: "/properties",
  GET_PROPERTY_DETAILS: (id: number) => `/properties/${id}`,
  GET_MY_PROPERTIES: "/properties/me",
};

export async function getProperties({
  type,
  listing_type,
  location,
  min_price,
  max_price,
  bedrooms,
  limit = 20,
  page = 1,
}: {
  type?: string;
  listing_type?: "for_sale" | "for_rent" | "short_let" | "hotel";
  location?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  limit?: number;
  page?: number;
} = {}) {
  try {
    const params = new URLSearchParams();
    if (type) params.append("type", type);
    if (listing_type) params.append("listing_type", listing_type);
    if (location) params.append("location", location);
    if (min_price !== undefined) params.append("min_price", String(min_price));
    if (max_price !== undefined) params.append("max_price", String(max_price));
    if (bedrooms !== undefined) params.append("bedrooms", String(bedrooms));
    params.append("limit", String(limit));
    params.append("page", String(page));

    const endpoint = `${ENDPOINTS.GET_PROPERTIES}?${params.toString()}`;

    const response = await apiRequest<ApiResponse<PropertiesResponse>>(endpoint, {
      auth: false,
      headers: propertyAuthHeaders(),
    });
    // console.log("Fetched properties:", response.data.items);
    return response.data.items ?? [];
  } catch (error) {
    // console.error("Error fetching properties:", error);
    return [];
  }
}

export async function getFeaturedProperties() {
  try {
    const response = await apiRequest<ApiResponse<PropertiesResponse>>(
      `${ENDPOINTS.GET_PROPERTIES}?featured=true`,
      {
        auth: false,
        headers: propertyAuthHeaders(),
      }
    );

    return response.data.items ?? [];
  } catch (error) {
    // console.error("Error fetching featured properties:", error);
    return [];
  }
}

export async function getPropertyDetails(id: number): Promise<Property> {
  const endpoint = ENDPOINTS.GET_PROPERTY_DETAILS(id);
  const response = await apiRequest<ApiResponse<Property>>(endpoint, {
    auth: false,
    headers: propertyAuthHeaders(),
  });

  return response.data;
}
