"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { AuthSession } from "@/lib/types";
import { getSession, setSession, clearSession } from "@/lib/mock-auth";

interface AuthContextValue {
  user: AuthSession | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<AuthSession>) => void;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  role: "influencer" | "clipper";
  avatarUrl?: string;
  bio?: string;
  socialAccounts?: {
    platform: string;
    handle: string;
    profileUrl: string;
    followers?: number;
  }[];
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthSession | null>(() => getSession());
  const [isLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`/api/users?email=${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error("Error fetching user");

    const data = await res.json();
    const found = data.data?.[0];
    if (!found) throw new Error("User not found");
    if (found.password !== password) throw new Error("Wrong password");

    const session: AuthSession = {
      userId: found.id,
      email: found.email,
      name: found.name,
      role: found.role,
      avatarUrl: found.avatarUrl,
    };
    setSession(session);
    setUser(session);
  }, []);

  const signup = useCallback(async (data: SignupData) => {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error creating account");
    }

    const { data: created } = await res.json();
    const session: AuthSession = {
      userId: created.id,
      email: created.email,
      name: created.name,
      role: created.role,
      avatarUrl: created.avatarUrl,
    };
    setSession(session);
    setUser(session);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const updateUser = useCallback((updates: Partial<AuthSession>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      setSession(next);
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
