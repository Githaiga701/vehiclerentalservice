// src/hooks/useAuth.ts
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  isAdmin?: boolean;
  kycStatus?: "pending" | "approved" | "rejected" | null; // null = not submitted
} | null;

type AuthContextType = {
  user: User;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  isKycApproved: boolean;
  requiresKyc: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const isAuthenticated = !!user;
  const isKycApproved = user?.kycStatus === "approved";
  const requiresKyc = isAuthenticated && !isKycApproved;

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoading, isAuthenticated, isKycApproved, requiresKyc }}
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