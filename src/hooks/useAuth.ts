"use client";

import { useContext } from "react";
import { AuthContext, type AuthContextType } from "@/lib/auth";

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth must be used within an <AuthProvider>. " +
        "Wrap your component tree with <AuthProvider> in your root layout."
    );
  }
  return context;
}
