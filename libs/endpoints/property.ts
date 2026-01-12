import { apiRequest } from '@/libs/api/clients'


export interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  type: string;
  listing_type: "for_sale" | "for_rent" | "shortlet";
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  garage?: number;
  size?: string;
  amenities?: string[];
  images?: string[];
  image?: string;
  rating?: number;
  user_id?: number;
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const ENDPOINTS = {
  GET_LATEST_PROPERTIES: '/properties/latest',
  GET_PROPERTY_DETAILS: (id: number | string) => `/properties/${id}`,
  GET_PROPERTIES: '/properties',
};

export async function getProperties({filter, query, limit}: {
    filter: string;
    query: string;
    limit?: number;
}) {
    try {
      // return apiRequest<Property[]>(ENDPOINTS.GET_PROPERTIES);
      const builderQuery = `${ENDPOINTS.GET_PROPERTIES}?${filter}=${query}${limit ? `&limit=${limit}` : ''}`;
      
      if (filter && filter !== 'All') {
        
      }
    } catch (error) {
        console.error('Error fetching properties:', error);
        return [];
    }
}

export async function getFeaturedProperties() {
    return apiRequest<Property[]>(ENDPOINTS.GET_PROPERTIES + '?featured=true');
}

export async function getPropertyDetails(id: number | string): Promise<Property> {
  const numericId = typeof id === 'string' ? parseInt(id) : id;
  const endpoint = ENDPOINTS.GET_PROPERTY_DETAILS(numericId);
  
  console.log('Fetching property with ID:', numericId);
  console.log('Full endpoint:', endpoint);
  try {
    const result = await apiRequest<Property>(endpoint, { auth: false });
    console.log('Property data received:', result);
    return result;
  } catch (error) {
    console.error('Failed to fetch property:', error);
    throw error;
  }
}

export async function getLastestProperties() {
    return apiRequest<Property[]>(ENDPOINTS.GET_LATEST_PROPERTIES);
}
