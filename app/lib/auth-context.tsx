"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api, getAuthToken, setAuthToken, removeAuthToken } from "./api";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  platform: string;
  role: string;
  division: string;
  matchesPlayed?: number;
  matchesWon?: number;
  winRate?: number;
  konamiId?: string;
  wallet?: {
    id: string;
    availableBalance: number;
    escrowLockedBalance: number;
    lifetimeWinnings: number;
    monthlyLimit: number;
    monthlyUsed: number;
  };
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (data: { login: string; password: string }) => Promise<void>;
  register: (data: { username: string; email: string; password: string; platform?: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  refreshUser: async () => null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = async (): Promise<UserProfile | null> => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const profile = await api.getMe();
      if (profile) {
        setUser(profile);
        return profile;
      }
      removeAuthToken();
      setUser(null);
      return null;
    } catch {
      removeAuthToken();
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  // Route protection: Block unauthenticated users from accessing protected pages like /dashboard
  useEffect(() => {
    if (loading) return;

    const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
    if (isProtectedRoute && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, pathname, router]);

  const login = async (data: { login: string; password: string }) => {
    const res = await api.login(data);
    if (!res?.token) {
      throw new Error(res?.message || "Invalid credentials");
    }
    setAuthToken(res.token);
    setUser(res.user);
    // Fetch full profile with wallet relations
    const fullProfile = await api.getMe().catch(() => res.user);
    setUser(fullProfile);
  };

  const register = async (data: { username: string; email: string; password: string; platform?: string }) => {
    const res = await api.register(data);
    if (!res?.token) {
      throw new Error(res?.message || "Registration failed");
    }
    setAuthToken(res.token);
    setUser(res.user);
    // Fetch full profile with wallet relations
    const fullProfile = await api.getMe().catch(() => res.user);
    setUser(fullProfile);
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
