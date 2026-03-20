import { apiRequest } from "@/libs/api/clients";

// ============================================================================
// SOLAR QUOTE TYPES
// ============================================================================

/**
 * Payload for solar quote request
 */
export interface SolarQuotePayload {
  full_name: string;
  phone: string;
  email: string;
  home_address: string;
  city_state: string;
  occupation: string;
  building_type: string;
  requested_date: string; // ISO 8601 format: YYYY-MM-DD
  requested_time: string; // 12-hour format with AM/PM: "10:00 AM"
  inverter_capacity?: string;
  alias_capacity?: string;
  other_capacity?: string;
  install_address?: string;
  installation_address?: string;
  other_building?: string;
  other_building_type?: string;
  commitment_check: boolean;
}

/**
 * Response for solar quote submission
 */
export interface SolarQuoteResponse {
  status: string;
  data: {
    success: boolean;
    quote_id: string;
    message: string;
  };
}

// ============================================================================
// API SERVICE METHODS
// ============================================================================

/**
 * Submit a request for a solar quote
 *
 * @param payload - The quote request details
 * @returns The submission status and unique quote ID
 */
export async function submitSolarQuote(
  payload: SolarQuotePayload,
): Promise<SolarQuoteResponse> {
  return apiRequest<SolarQuoteResponse>("/solar/quotes", {
    method: "POST",
    body: payload,
    auth: false,
    noToken: true,
  });
}
