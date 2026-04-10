"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { STORAGE_KEYS } from "./constants";

export interface User {
  id: string;
  name: string;
  phone: string;
  role: string;
  totalAttendance: number;
  currentStreak: number;
  lastAttendanceDate: string;
  joinDate: string;
}

export interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check localStorage for existing session
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      if (stored) {
        const parsed = JSON.parse(stored) as User;
        setUser(parsed);
      }
    } catch (error) {
      console.error("[Auth] Failed to restore session:", error);
      localStorage.removeItem(STORAGE_KEYS.USER);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((userData: User) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    window.location.href = "/";
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({ user, login, logout, isLoading }),
    [user, login, logout, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
