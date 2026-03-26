export interface User {
  id: number;
  name: string;
  lname?: string;
  email: string;
  phone?: string;
  address?: string;
  state?: string;
  city?: string;
  role?: string;
  profile_image?: string;
  email_verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LoginResponse {
  status: string;
  data: {
    user: User;
    token: string;
  };
}

export interface RegisterResponse {
  status: string;
  data: {
    user_id: number;
    verification_required: boolean;
  };
}

export interface OtpVerifyResponse {
  status: string;
  data: {
    user: User;
    token: string;
  };
}

export interface UserResponse {
  status: string;
  data: {
    user: User;
  };
}

export interface RegisterPayload {
  name: string;
  lname: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  city: string;
  password: string;
  role: 'buyer' | 'agent' | 'owner' | 'hotel_owner' | 'developer' | 'host' | 'admin' | 'superadmin';
  agree_mou?: boolean | number;
  signed_name?: string;
  turnstile_token?: string;
  referral_code?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  turnstile_token?: string;
}

export interface OtpPayload {
  email: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface PasswordResetRequestPayload {
  email: string;
}

export interface PasswordResetPayload {
  email: string;
  otp: string;
  password: string;
}
