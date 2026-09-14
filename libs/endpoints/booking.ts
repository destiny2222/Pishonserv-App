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
  inspection_time: string; // Format: "10:00 AM" or "HH:MM" (AM/PM recommended)
  agreement: boolean; // Required: explicit acceptance of platform agreement
  platform_agreement?: boolean; // Accepted alias
  notes?: string;
  note?: string;
  skip_payment?: boolean; // Admin/superadmin only
}

/**
 * Response for successful inspection booking
 */
export interface InspectionResponse {
  status: string;
  tour_request_id?: number;
  inspection_code?: string;
  payment_reference?: string;
  inspection_fee?: {
    amount: number;
    currency: string;
    label: string;
  };
  payment?: {
    authorization_url: string;
    access_code: string;
    reference: string;
    callback_url: string;
  };
  data?: {
    tour_request_id?: number;
    inspection_code: string;
    payment_reference?: string;
    inspection_fee?: {
      amount: number;
      currency: string;
      label: string;
    };
    payment?: {
      authorization_url: string;
      access_code: string;
      reference: string;
      callback_url: string;
    };
    success?: boolean;
  };
}

export interface VerifyInspectionPayload {
  reference: string;
}

export interface VerifyInspectionResponse {
  status: string;
  paid?: boolean;
  already_processed?: boolean;
  tour_request_id?: number;
  inspection_code?: string;
  receipts_sent?: boolean;
  data?: {
    paid?: boolean;
    already_processed?: boolean;
    tour_request_id?: number;
    inspection_code?: string;
    receipts_sent?: boolean;
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
 * @param checkIn - Optional check-in date (YYYY-MM-DD)
 * @param checkOut - Optional check-out date (YYYY-MM-DD)
 * @returns WhatsApp inquiry URL for the property
 */
export async function createWhatsAppInquiry(
  propertyId: number,
  checkIn?: string,
  checkOut?: string,
): Promise<BookingWhatsAppResponse> {
  const body = { 
    property_id: propertyId,
    check_in: checkIn,
    check_out: checkOut,
  };
  

  return apiRequest<BookingWhatsAppResponse>("/bookings", {
    method: "POST",
    body,
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

/**
 * Verify Paystack payment for property inspection (idempotent, safe to retry)
 *
 * @param payload - Verification details with Paystack reference
 * @returns Inspection verification result
 */
export async function verifyInspectionPayment(
  payload: VerifyInspectionPayload,
): Promise<VerifyInspectionResponse> {
  return apiRequest<VerifyInspectionResponse>("/inspections/payments/verify", {
    method: "POST",
    body: payload,
    auth: true,
  });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if a property type supports direct online booking / inquiry
 *
 * NOTE: For rent and sale properties, payment is offline and handled by Pishonserv.
 * They should use the inquiry/inspection workflow instead of online booking.
 * Online booking / inquiry is for short_let and hotel.
 *
 * @param listingType - The property listing type
 * @returns true if online booking / inquiry flow is used
 */
export function supportsDirectBooking(
  listingType: string | undefined,
): boolean {
  if (!listingType) return false;
  return listingType === "short_let" || listingType === "hotel";
}

/**
 * Check if a property supports/requires an inspection
 *
 * Inspection is available for: for_sale, for_rent, and land_for_sale (or land).
 *
 * @param requiresInspection - Optional flag from property
 * @param listingType - The property listing type
 * @returns true if inspection applies
 */
export function requiresInspection(
  requiresInspection: boolean | undefined,
  listingType: string | undefined,
): boolean {
  const inspectionTypes = ["for_sale", "for_rent", "land", "land_for_sale"];
  if (listingType && inspectionTypes.includes(listingType)) {
    return true;
  }
  return Boolean(requiresInspection);
}
