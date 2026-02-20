import { apiRequest } from "@/libs/api/clients";

export interface BankAccount {
  id: number;
  bank_name: string;
  account_number: string;
  account_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface AddBankAccountRequest {
  bank_name: string;
  account_number: string;
  account_name: string;
}

export interface BankAccountsResponse {
  status: string;
  data: {
    items: BankAccount[];
  };
}

export interface AddBankAccountResponse {
  status: string;
  data: {
    id: number;
  };
}

export async function getBankAccounts() {
  const response = await apiRequest<BankAccountsResponse>("/bank-accounts", {
    method: "GET",
    auth: true,
  });
  return response.data.items;
}

export async function addBankAccount(data: AddBankAccountRequest) {
  const response = await apiRequest<AddBankAccountResponse>(
    "/bank-accounts/add",
    {
      method: "POST",
      body: data,
      auth: true,
    },
  );
  return response.data;
}
