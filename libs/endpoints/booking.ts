import { apiRequest } from "@/libs/api/clients";

// ============================================================================
// BOOKING TYPES
// ============================================================================

/**
 * Booking payload for regular properties (not short_let or hotel)
 */
export interface BookingPayload {
  property_id: number;
  check_in: string; // Format: YYYY-MM-DD
  check_out: string; // Format: YYYY-MM-DD
}

/**
 * Response for regular booking creation
 */
export interface BookingResponse {
  status: string;
  data: {
    booking_id: number;
    amount: number;
    zoho_deal_id: number | null;
    whatsapp_inquiry_url?: string; // For short_let/hotel types
  };
}

/**
 * Response when booking is not available (short_let/hotel use WhatsApp flow)
 */
export interface BookingWhatsAppResponse {
  status: string;
  data: {
    whatsapp_inquiry_url: string;
    property_type: string;
  };
}

/**
 * Response when direct booking is disabled for mobile (403 error)
 */
export interface BookingMobileDisabledResponse {
  error: string;
  whatsapp_inquiry_url: string;
  inquiry_mode: string;
}

// ============================================================================
// INSPECTION TYPES
// ============================================================================

/**
 * Inspection booking payload for properties requiring inspection
 */
export interface InspectionPayload {
  property_id: number;
  full_name: string;
  phone: string;
  email: string;
  inspection_date: string; // Format: YYYY-MM-DD
  inspection_time: string; // Format: "10:00 AM"
  note?: string;
}

/**
 * Response for successful inspection booking
 */
export interface InspectionResponse {
  status: string;
  data: {
    success: boolean;
    inspection_code: string; // Format: INSP-YYYYMMDD-XXXX
  };
}

// ============================================================================
// PAYMENT TYPES
// ============================================================================

/**
 * Payment initialization payload
 */
export interface PaymentInitPayload {
  booking_id: number;
}

/**
 * Payment initialization response
 */
export interface PaymentInitResponse {
  status: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

/**
 * Payment verification payload
 */
export interface PaymentVerifyPayload {
  reference: string;
}

/**
 * Payment verification response
 */
export interface PaymentVerifyResponse {
  status: string;
  data: {
    success: boolean;
    transaction_id?: number;
    status?: string;
    amount?: number;
  };
}

/**
 * Payment completion payload (mobile-specific)
 */
export interface PaymentCompletePayload {
  booking_id: number;
  reference: string;
}

/**
 * Payment completion response
 */
export interface PaymentCompleteResponse {
  status: string;
  data: {
    success: boolean;
  };
}

// ============================================================================
// API ERROR TYPE
// ============================================================================

/**
 * Standard API error response
 */
export interface ApiError {
  status: string;
  message: string;
  code?: string;
}

// ============================================================================
// API SERVICE METHODS
// ============================================================================

/**
 * Create a new booking for regular properties
 *
 * NOTE: For mobile, this may return Http 403 if direct booking is disabled
 *
 * @param payload - Booking details including property_id, check_in, check_out
 * @returns Booking response with booking_id and amount
 */
export async function createBooking(
  payload: BookingPayload,
): Promise<BookingResponse> {
  return apiRequest<BookingResponse>("/bookings", {
    method: "POST",
    body: payload,
    auth: true,
  });
}

/**
 * Get WhatsApp inquiry URL for properties
 *
 * @param propertyId - The property ID to inquire about
 * @returns WhatsApp inquiry URL for the property
 */
export async function createWhatsAppInquiry(
  propertyId: number,
): Promise<BookingWhatsAppResponse> {
  return apiRequest<BookingWhatsAppResponse>("/bookings", {
    method: "POST",
    body: { property_id: propertyId },
    auth: true,
  });
}

/**
 * Book an inspection for properties requiring inspection
 *
 * @param payload - Inspection booking details
 * @returns Inspection confirmation with inspection_code
 */
export async function createInspection(
  payload: InspectionPayload,
): Promise<InspectionResponse> {
  return apiRequest<InspectionResponse>("/inspections", {
    method: "POST",
    body: payload,
    auth: true,
  });
}

/**
 * Initialize Paystack payment for a booking
 *
 * @param payload - Payment initialization details (booking_id)
 * @returns Paystack authorization URL, access code, and reference
 */
export async function initializePayment(
  payload: PaymentInitPayload,
): Promise<PaymentInitResponse> {
  return apiRequest<PaymentInitResponse>("/payments/init", {
    method: "POST",
    body: payload,
    auth: true,
  });
}

/**
 * Verify Paystack payment
 *
 * @param payload - Payment verification details (reference from Paystack)
 * @returns Transaction verification result
 */
export async function verifyPayment(
  payload: PaymentVerifyPayload,
): Promise<PaymentVerifyResponse> {
  return apiRequest<PaymentVerifyResponse>("/payments/verify", {
    method: "POST",
    body: payload,
    auth: true,
  });
}

/**
 * Complete payment and finalize booking (mobile-specific)
 *
 * @param payload - Payment completion details
 * @returns Success status
 */
export async function completePayment(
  payload: PaymentCompletePayload,
): Promise<PaymentCompleteResponse> {
  return apiRequest<PaymentCompleteResponse>("/payments/complete", {
    method: "POST",
    body: payload,
    auth: true,
  });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if a property type supports direct booking
 *
 * NOTE: Direct booking is not allowed for short_let and hotel types.
 * These types should use the WhatsApp inquiry flow instead.
 *
 * @param listingType - The property listing type
 * @returns true if direct booking is supported
 */
export function supportsDirectBooking(
  listingType: string | undefined,
): boolean {
  if (!listingType) return false;
  // Direct booking is NOT available for short_let and hotel
  return !["short_let", "hotel"].includes(listingType);
}

/**
 * Check if a property requires inspection before booking
 *
 * Works for: For Sale, For Rent, Land property types
 * if they have requires_inspection: true
 *
 * @param requiresInspection - Whether the property requires inspection
 * @param listingType - The property listing type
 * @returns true if inspection is required
 */
export function requiresInspection(
  requiresInspection: boolean | undefined,
  listingType: string | undefined,
): boolean {
  if (!requiresInspection) return false;
  // Inspection applies to: for_sale, for_rent, land
  const inspectionTypes = ["for_sale", "for_rent", "land"];
  return listingType ? inspectionTypes.includes(listingType) : false;
}
