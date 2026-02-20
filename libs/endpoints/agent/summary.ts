import { apiRequest } from "@/libs/api/clients";

export type SummaryData = {
  role: string;
  wallet_balance: number;
  properties: number;
  bookings: number;
  earnings: number;
};

interface ApiResponse<SummaryData> {
  status: string;
  data: SummaryData;
}

export async function getSummary() {
  const response = await apiRequest<ApiResponse<SummaryData>>(
    "/dashboard/summary",
    {
      method: "GET",
      auth: true,
    },
  );
  return response.data;
}
