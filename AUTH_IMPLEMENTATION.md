# Authentication Implementation

## Overview
Complete authentication system with API integration, context management, and route protection.

## Components

### 1. Auth Endpoints (`libs/endpoints/auth.ts`)
All API authentication functions:
- `register()` - Register new user
- `login()` - Login user
- `verifyOtp()` - Verify OTP after registration
- `resendOtp()` - Resend OTP to email
- `requestPasswordReset()` - Request password reset
- `resetPassword()` - Reset password with OTP
- `getCurrentUser()` - Get current user details
- `logout()` - Logout and clear token

### 2. UserContext (`contexts/UserContext.jsx`)
Global state management for authentication with:
- User state
- Authentication status
- Loading state
- Auto-check authentication on app start

### 3. AuthGuard (`components/AuthGuard.tsx`)
Route protection component that:
- Redirects unauthenticated users to login
- Redirects authenticated users away from auth pages
- Shows loading spinner during auth check

### 4. useAuth Hook (`hooks/useAuth.ts`)
Custom hook for easy access to auth context.

## Usage Examples

### Login
```tsx
import { useAuth } from '@/hooks/useAuth';

function LoginScreen() {
  const { login } = useAuth();

  const handleLogin = async () => {
    const result = await login('user@example.com', 'password');
    if (result.success) {
      // User is logged in and redirected
    } else {
      Alert.alert('Error', result.error);
    }
  };
}
```

### Register
```tsx
import { useAuth } from '@/hooks/useAuth';

function RegisterScreen() {
  const { register } = useAuth();

  const handleRegister = async () => {
    const result = await register({
      name: 'John',
      lname: 'Doe',
      email: 'john@example.com',
      phone: '08012345678',
      address: '123 Main St',
      state: 'Lagos',
      city: 'Ikeja',
      password: 'password123',
      role: 'buyer',
    });
    
    if (result.success) {
      // Show OTP verification screen
      router.push('/verify-otp');
    } else {
      Alert.alert('Error', result.error);
    }
  };
}
```

### Verify OTP
```tsx
import { useAuth } from '@/hooks/useAuth';

function VerifyOtpScreen({ route }) {
  const { verifyOtp } = useAuth();
  const email = route.params.email;

  const handleVerify = async (otp) => {
    const result = await verifyOtp(email, otp);
    if (result.success) {
      // User is verified and logged in
    } else {
      Alert.alert('Error', result.error);
    }
  };
}
```

### Get Current User
```tsx
import { useAuth } from '@/hooks/useAuth';

function ProfileScreen() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Text>Not logged in</Text>;
  }

  return (
    <View>
      <Text>{user.name} {user.lname}</Text>
      <Text>{user.email}</Text>
      {user.profile_image && <Image source={{ uri: user.profile_image }} />}
    </View>
  );
}
```

### Logout
```tsx
import { useAuth } from '@/hooks/useAuth';

function SettingsScreen() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      // User is logged out and redirected to login
    }
  };
}
```

### Password Reset
```tsx
import { useAuth } from '@/hooks/useAuth';

function ForgotPasswordScreen() {
  const { requestPasswordReset, resetPassword } = useAuth();

  const handleRequestReset = async () => {
    const result = await requestPasswordReset('user@example.com');
    if (result.success) {
      // Show OTP input screen
    }
  };

  const handleResetPassword = async (email, otp, newPassword) => {
    const result = await resetPassword(email, otp, newPassword);
    if (result.success) {
      // Password reset successful
      router.push('/login');
    }
  };
}
```

### Refresh User Data
```tsx
import { useAuth } from '@/hooks/useAuth';

function ProfileEditScreen() {
  const { refreshUser } = useAuth();

  const handleSave = async () => {
    // After updating profile via API
    await refreshUser(); // Reload user data
  };
}
```

## API Response Types
All TypeScript types are defined in `types/auth.ts`:
- `User` - User object structure
- `LoginResponse` - Login API response
- `RegisterResponse` - Registration API response
- `OtpVerifyResponse` - OTP verification response
- `UserResponse` - User data response
- Payload types for all API calls

## Environment Variables
Make sure to set in your `.env`:
```
EXPO_PUBLIC_API_BASE_URL=https://pishonserv.com/api/mobile
```

## Security
- Tokens are stored securely using `expo-secure-store`
- Auth state is checked on app start
- Invalid tokens are automatically cleared
- Protected routes redirect to login if not authenticated
