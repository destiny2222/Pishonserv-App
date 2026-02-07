import { apiRequest } from '@/libs/api/clients';
import type {
  LoginPayload,
  LoginResponse,
  OtpPayload,
  OtpVerifyResponse,
  PasswordResetPayload,
  PasswordResetRequestPayload,
  RegisterPayload,
  RegisterResponse,
  ResendOtpPayload,
  UserResponse,
} from '@/types/auth';
import * as SecureStore from "expo-secure-store";

/**
 * Register a new user
 */
export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: payload,
    auth: false,
  });
}

/**
 * Login user and store token
 */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: payload,
    auth: false,
  });
  // Store the token securely
  if (response.data.token) {
    await SecureStore.setItemAsync('access_token', response.data.token);
  }

  return response;
}

/**
 * Verify OTP after registration
 */
export async function verifyOtp(payload: OtpPayload): Promise<OtpVerifyResponse> {
  const response = await apiRequest<OtpVerifyResponse>('/auth/otp/verify', {
    method: 'POST',
    body: payload,
    auth: false,
  });

  // Store the token securely
  if (response.data.token) {
    await SecureStore.setItemAsync('access_token', response.data.token);
  }

  return response;
}

/**
 * Resend OTP to user email
 */
export async function resendOtp(payload: ResendOtpPayload): Promise<{ status: string; message?: string }> {
  return apiRequest('/auth/otp/resend', {
    method: 'POST',
    body: payload,
    auth: false,
  });
}

/**
 * Request password reset OTP
 */
export async function requestPasswordReset(payload: PasswordResetRequestPayload): Promise<{ status: string; message?: string }> {
  return apiRequest('/auth/password/request-reset', {
    method: 'POST',
    body: payload,
    auth: false,
  });
}

/**
 * Reset password using OTP
 */
export async function resetPassword(payload: PasswordResetPayload): Promise<{ status: string; message?: string }> {
  return apiRequest('/auth/password/reset', {
    method: 'POST',
    body: payload,
    auth: false,
  });
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<UserResponse> {
  return apiRequest<UserResponse>('/users/me', {
    method: 'GET',
    auth: true,
  });
}

/**
 * Update current authenticated user
 */
export async function updateCurrentUser(payload: Partial<UserResponse>): Promise<UserResponse> {
  return apiRequest<UserResponse>('/users/me', {
    method: 'PATCH',
    body: payload,
    auth: true,
  });
}

/**
 * Logout user (clear stored token)
 */
export async function logout(): Promise<void> {
  await SecureStore.deleteItemAsync('access_token');
}

