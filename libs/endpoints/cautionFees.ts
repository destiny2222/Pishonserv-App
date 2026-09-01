import { apiRequest } from "@/libs/api/clients";

export interface CautionFee {
  id: number;
  booking_id: number;
  property_title: string;
  amount: number;
  status:
    | "held"
    | "refund_requested"
    | "approved"
    | "refund_processing"
    | "refund_needs_attention"
    | "refund_failed"
    | "refunded"
    | "disputed";
  can_request_refund: boolean;
  checkout_date?: string;
  created_at: string;
  updated_at: string;
  owner_name?: string;
  customer_name?: string;
}

export interface CautionFeesResponse {
  status: string;
  data: CautionFee[];
}

export interface RefundRequestResponse {
  status: string;
  message: string;
}

export async function getCautionFees(owner = false): Promise<CautionFeesResponse> {
  return apiRequest<CautionFeesResponse>(
    `/caution-fees${owner ? "?owner=1" : ""}`,
    {
      method: "GET",
      auth: true,
    }
  );
}

export async function requestRefund(id: number): Promise<RefundRequestResponse> {
  return apiRequest<RefundRequestResponse>(
    `/caution-fees/${id}/refund-request`,
    {
      method: "POST",
      auth: true,
    }
  );
}

export async function decideRefund(
  id: number,
  decision: "approve" | "dispute"
): Promise<RefundRequestResponse> {
  return apiRequest<RefundRequestResponse>(
    `/caution-fee-refund-requests/${id}/decision`,
    {
      method: "POST",
      body: { decision },
      auth: true,
    }
  );
}
