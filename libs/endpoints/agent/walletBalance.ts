import { apiRequest } from "@/libs/api/clients";

export type WalletBalanceData = {
    balance: number;
}

interface ApiResponse<WalletBalanceData> {
    status: string;
    data: WalletBalanceData;
}

export async function getWalletBalance() {
    const response = await apiRequest<ApiResponse<WalletBalanceData>>(
        "/wallet/balance",
        {
            method: "GET",
            auth: true,
        },
    );
    return response.data;
}