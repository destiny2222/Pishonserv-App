import * as authApi from "@/libs/endpoints/auth";
import * as SecureStore from "expo-secure-store";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const token = await SecureStore.getItemAsync("access_token");
      if (token) {
        const response = await authApi.getCurrentUser();
        setUser(response.data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // console.error("Auth check failed:", error);
      // Clear invalid token
      await SecureStore.deleteItemAsync("access_token");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email, password) {
    try {
      const response = await authApi.login({ email, password });      
      // Only set user if verification is not required
      if (!response.data.verification_required) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      }
      return { success: true, data: response.data };
    } catch (error) {
      // console.error("Login failed:", error);
      
      // Customize error message based on status code
      let errorMessage = "Login failed";
      
      if (error.status === 401) {
        errorMessage = error.data?.message || "Invalid email or password. Please try again.";
      } else if (error.status === 404) {
        errorMessage = "Account not found. Please check your email or sign up.";
      } else if (error.status === 403) {
        errorMessage = error.data?.message || "Access denied. Your account may be inactive.";
      } else if (error.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage, status: error.status };
    }
  }

  async function register(userData) {
    try {
      const response = await authApi.register(userData);
      return { success: true, data: response.data };
    } catch (error) {
      // console.error("Registration failed:", error);
      
      let errorMessage = "Registration failed";
      
      if (error.status === 400) {
        errorMessage = error.data?.message || "Invalid registration data. Please check your information.";
      } else if (error.status === 409) {
        errorMessage = "Email already exists. Please use a different email or login.";
      } else if (error.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage, status: error.status };
    }
  }

  async function verifyOtp(email, otp) {
    try {
      const response = await authApi.verifyOtp({ email, otp });
      setUser(response.data.user);
      setIsAuthenticated(true);
      return { success: true, data: response.data };
    } catch (error) {
      // console.error("OTP verification failed:", error);
      
      let errorMessage = "Verification failed";
      
      if (error.status === 400) {
        errorMessage = error.data?.message || "Invalid or expired OTP. Please try again.";
      } else if (error.status === 404) {
        errorMessage = "Verification request not found. Please request a new OTP.";
      } else if (error.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage, status: error.status };
    }
  }

  async function resendOtp(email) {
    try {
      const response = await authApi.resendOtp({ email });
      return { success: true, data: response };
    } catch (error) {
      // console.error("Resend OTP failed:", error);
      return { success: false, error: error.message || "Failed to resend OTP" };
    }
  }

  async function requestPasswordReset(email) {
    try {
      const response = await authApi.requestPasswordReset({ email });
      return { success: true, data: response };
    } catch (error) {
      // console.error("Password reset request failed:", error);
      
      let errorMessage = "Failed to request password reset";
      
      if (error.status === 404) {
        errorMessage = "Email not found. Please check your email or sign up.";
      } else if (error.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage, status: error.status };
    }
  }

  async function resetPassword(email, otp, password) {
    try {
      const response = await authApi.resetPassword({ email, otp, password });
      return { success: true, data: response };
    } catch (error) {
      // console.error("Password reset failed:", error);
      
      let errorMessage = "Password reset failed";
      
      if (error.status === 400) {
        errorMessage = error.data?.message || "Invalid or expired OTP. Please request a new one.";
      } else if (error.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage, status: error.status };
    }
  }

  async function logout() {
    try {
      await authApi.logout();
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      // console.error("Logout failed:", error);
      return { success: false, error: error.message || "Logout failed" };
    }
  }

  async function refreshUser() {
    try {
      const response = await authApi.getCurrentUser();
      setUser(response.data.user);
      return { success: true, data: response.data.user };
    } catch (error) {
      // console.error("Failed to refresh user:", error);
      return { success: false, error: error.message || "Failed to refresh user" };
    }
  }

  async function updateUser(userData) {
    try {
      // Optimistically update the local state
      setUser(prevUser => ({ ...prevUser, ...userData }));
      
      const response = await authApi.updateCurrentUser(userData);
      setUser(response.data.user);
      return { success: true, data: response.data.user };
    } catch (error) {
      // console.error("Failed to update user:", error);
      // Revert the optimistic update by refreshing from server
      await refreshUser();
      return { success: false, error: error.message || "Failed to update user" };
    }
  }

  return (
    <UserContext.Provider 
      value={{
        user,
        isAuthenticated,
        isLoading,
        register,
        login,
        logout,
        verifyOtp,
        resendOtp,
        requestPasswordReset,
        resetPassword,
        refreshUser,
        updateUser,
        checkAuth,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}