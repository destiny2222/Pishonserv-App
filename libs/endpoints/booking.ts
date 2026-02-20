import { apiRequest } from "@/libs/api/clients";

export interface BookingPayload {
  property_id: number;
  check_in: string; // Format: YYYY-MM-DD
  check_out: string; // Format: YYYY-MM-DD
}

export interface BookingResponse {
  status: string;
  data: {
    booking_id: number;
    amount: number;
    zoho_deal_id: number | null;
  };
}

export interface PaymentInitPayload {
  booking_id: number;
}

export interface PaymentInitResponse {
  status: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaymentVerifyPayload {
  reference: string;
}

export interface PaymentVerifyResponse {
  status: string;
  data: {
    transaction_id: number;
    status: string;
    amount: number;
  };
}

/**
 * Create a new booking
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
 * Initialize Paystack payment for a booking
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
 * Mobile-only: Verify Paystack and complete booking
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

export interface PaymentCompletePayload {
  booking_id: number;
  reference: string;
}

export interface PaymentCompleteResponse {
  status: string;
  data: {
    success: boolean;
  };
}
