import { apiRequest } from "@/libs/api/clients";


export interface Transaction {
    id: number;
    amount: number;
    type: "credit" | "debit";
    status: string;
    description: string;
    created_at: string;
}

export interface TransactionsResponse {
    status: string;
    data: {
        items: Transaction[];
    };
}


export async function getTransactions() {
    const response = await apiRequest < TransactionsResponse > ("/transactions", {
        method: "GET",
        auth: true,
    });
    return response.data;
}
