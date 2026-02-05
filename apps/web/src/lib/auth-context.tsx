// src/hooks/useAuth.ts
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { apiClient } from "./api-client";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role?: "OWNER" | "RENTER" | "ADMIN";
  kycStatus?: "PENDING" | "APPROVED" | "REJECTED" | null;
  trustScore?: {
    score: number;
    kycCompleted: boolean;
  };
} | null;

export type AuthContextType = {
  user: User;
  login: (phone: string, code: string) => Promise<{ success: boolean; user?: any }>;
  register: (name: string, phone: string, code: string) => Promise<{ success: boolean; user?: any }>;
  logout: () => void;
  requestOtp: (phone: string) => Promise<boolean>;
  updateUser: (userData: Partial<NonNullable<User>>) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  isKycApproved: boolean;
  requiresKyc: boolean;
  isAdmin: boolean;
  isOwner: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    // Check for stored token and fetch user data
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          apiClient.setToken(token);
          const userData = await apiClient.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          // Clear invalid token
          apiClient.clearToken();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [isClient]);

  const requestOtp = async (phone: string): Promise<boolean> => {
    try {
      await apiClient.requestOtp(phone);
      toast.success("OTP sent to your phone");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
      return false;
    }
  };

  const login = async (phone: string, code: string): Promise<{ success: boolean; user?: any }> => {
    try {
      const response = await apiClient.verifyOtp(phone, code);
      setUser(response.user);
      toast.success("Login successful");
      return { success: true, user: response.user };
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP");
      return { success: false };
    }
  };

  const register = async (name: string, phone: string, code: string): Promise<{ success: boolean; user?: any }> => {
    try {
      // First verify OTP (this creates the user if it doesn't exist)
      const response = await apiClient.verifyOtp(phone, code);
      
      // If user doesn't have a name, update it
      if (response.user && !response.user.name && name.trim()) {
        // Update user name via API (we'll need to add this endpoint)
        try {
          await apiClient.updateProfile({ name: name.trim() });
          response.user.name = name.trim();
        } catch (updateError) {
          console.warn("Failed to update user name:", updateError);
        }
      }
      
      setUser(response.user);
      toast.success("Registration successful");
      return { success: true, user: response.user };
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP");
      return { success: false };
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      apiClient.clearToken();
    }
    toast.success("Logged out successfully");
  };

  const updateUser = (userData: Partial<NonNullable<User>>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
    }
  };

  const isAuthenticated = !!user;
  const isKycApproved = user?.kycStatus === "APPROVED";
  const requiresKyc = isAuthenticated && !isKycApproved;
  const isAdmin = user?.role === "ADMIN";
  const isOwner = user?.role === "OWNER";

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        login, 
        register,
        logout, 
        requestOtp,
        updateUser,
        isLoading, 
        isAuthenticated, 
        isKycApproved, 
        requiresKyc,
        isAdmin,
        isOwner
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}