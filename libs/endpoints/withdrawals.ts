import { apiRequest } from "@/libs/api/clients";

export interface InitWithdrawalPayload {
  amount: number;
  bank_account_id: number;
}

export interface InitWithdrawalResponse {
  status: string;
  data: {
    pending: {
      amount: number;
      bank_account_id: number;
    };
  };
}

export async function initWithdrawal(
  payload: InitWithdrawalPayload,
): Promise<InitWithdrawalResponse> {
  return apiRequest<InitWithdrawalResponse>("/withdrawals/init", {
    method: "POST",
    body: payload,
    auth: true,
  });
}

export interface ConfirmWithdrawalPayload {
  amount: number;
  bank_account_id: number;
  otp: string;
}

export interface ConfirmWithdrawalResponse {
  status: string;
  data: {
    withdrawal_id: number;
    transfer_code: string;
    reference: string;
  };
}

export async function confirmWithdrawal(
  payload: ConfirmWithdrawalPayload,
): Promise<ConfirmWithdrawalResponse> {
  return apiRequest<ConfirmWithdrawalResponse>("/withdrawals/confirm", {
    method: "POST",
    body: payload,
    auth: true,
  });
}
