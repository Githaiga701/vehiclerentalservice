// src/lib/auth-context.tsx
"use client";

import React, { createContext, useContext, useCallback, useEffect, useState, ReactNode, type FC } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin?: boolean;
  kycStatus?: "pending" | "approved" | "rejected" | null;
} | null;

type AuthContextType = {
  user: User;
  login: (userData: Exclude<User, null>) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  clearError: () => void;
  isKycApproved: boolean;
  requiresKyc: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "vehicle_rental_user";

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser) as User;
        // Validate user object has required fields
        if (parsedUser && "id" in parsedUser && "email" in parsedUser) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (err) {
      console.error("Failed to parse stored user:", err);
      localStorage.removeItem(STORAGE_KEY);
      setError("Failed to restore session");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (userData: Exclude<User, null>) => {
    try {
      setError(null);
      
      // Validate user data
      if (!userData.id || !userData.email) {
        throw new Error("Invalid user data: missing required fields");
      }

      // TODO: Replace with actual API call for authentication
      // const response = await fetch("/api/auth/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(userData),
      // });
      // if (!response.ok) throw new Error("Login failed");
      // const user = await response.json();

      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setError(null);
      
      // TODO: Replace with actual API call for logout
      // await fetch("/api/auth/logout", { method: "POST" });

      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Logout failed";
      setError(errorMessage);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: user !== null,
    error,
    clearError,
    isKycApproved: user?.kycStatus === "approved",
    requiresKyc: !!(user && user.kycStatus !== "approved" && user.kycStatus !== null),
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

/**
 * Hook to check if user is an admin
 */
export function useIsAdmin(): boolean {
  const { user } = useAuth();
  return user?.isAdmin ?? false;
}