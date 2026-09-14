import { apiRequest } from "@/libs/api/clients";

export interface PaymentBreakdown {
  listed_property_price?: number;
  agent_fee?: number | null;
  legal_fee?: number | null;
  service_charge?: number | null;
  service_charge_label?: string | null;
  caution_fee?: number | null;
  refundable_caution_fee?: number | null;
  total_payable?: number;
  total_label?: string;
}

export interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  type: string;
  listing_type: "for_sale" | "for_rent" | "short_let" | "hotel" | "land" | "project";
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  garage?: number;
  parking_space?: number;
  size?: "small" | "standard" | "medium" | "large" | string;
  amenities?: string[];
  images?: string[];
  image?: string;
  rating?: number;
  user_id?: number;
  is_featured?: boolean;
  status?: string;
  created_at?: string;
  updated_at?: string;
  requires_inspection?: boolean;
  latitude?: number;
  longitude?: number;
  video_url?: string | null;
  video_mime?: string | null;
  video_upload_status?: "ready" | "pending" | "processing" | "failed" | string | null;
  video_provider?: string | null;
  video_playback_url?: string | null;
  youtube_video_url?: string | null;
  youtube_video_embed_url?: string | null;
  caution_fee?: number | string;
  headline_label?: string;
  headline_amount?: number;
  payment_breakdown?: PaymentBreakdown;
  total_payable?: number;
  property_charge_amount?: number;
  agent_fee_amount?: number;
  legal_fee_amount?: number;
  service_charge_amount?: number;
  service_charge_known?: boolean;
  caution_fee_amount?: number;
  agent_fee?: number | null;
  legal_fee?: number | null;
  service_charge?: number | null;
  refundable_caution_fee?: number | null;
  approval_status?: string;
  whatsapp_inquiry_url?: string;
  requires_inquiry?: boolean;
  inquiry_mode?: string;
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

function propertyAuthHeaders(): Record<string, string> {
  if (!PROPERTY_TOKEN) {
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
  listing_type?: "for_sale" | "for_rent" | "short_let" | "hotel" | "land" | "project";
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

    const response = await apiRequest<ApiResponse<PropertiesResponse>>(
      endpoint,
      {
        auth: false,
        headers: propertyAuthHeaders(),
      },
    );

    return response.data;
  } catch (error) {
    return { items: [], page, limit };
  }
}

export async function getFeaturedProperties() {
  try {
    const response = await apiRequest<ApiResponse<PropertiesResponse>>(
      `${ENDPOINTS.GET_PROPERTIES}?featured=true`,
      {
        auth: false,
        headers: propertyAuthHeaders(),
      },
    );

    return response.data.items ?? [];
  } catch (error) {
    return [];
  }
}

export async function getPropertyDetails(id: number): Promise<Property | null> {
  try {
    const response = await apiRequest<ApiResponse<Property>>(
      ENDPOINTS.GET_PROPERTY_DETAILS(id),
      {
        auth: false,
        headers: propertyAuthHeaders(),
      },
    );
    return response.data ?? null;
  } catch (error) {
    return null;
  }
}
