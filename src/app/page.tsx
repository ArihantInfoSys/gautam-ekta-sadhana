"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { login as apiLogin } from "@/lib/api";
import { APP_NAME, FOUNDATION_NAME, FOOTER_TEXT, FOOTER_DEDICATION } from "@/lib/constants";

export default function LoginPage() {
  const { user, login, isLoading } = useAuth();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (phone.length !== 10) {
      setError("कृपया 10 अंकों का फ़ोन नंबर दर्ज करें।");
      return;
    }

    setLoading(true);
    const res = await apiLogin(phone);
    setLoading(false);

    if (res.success && res.data) {
      login(res.data);
      router.push("/dashboard");
    } else {
      setError(res.error || "लॉगिन विफल। कृपया पुनः प्रयास करें।");
    }
  };

  if (isLoading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="saffron-spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-saffron">{APP_NAME}</h1>
          <p className="text-sm text-gray-500">Powered by {FOUNDATION_NAME}</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border border-gray-100">
          <h2 className="text-lg font-semibold text-center">लॉगिन करें</h2>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              फ़ोन नंबर
            </label>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder="10 अंकों का नंबर"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-saffron/50 focus:border-saffron"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-saffron text-white rounded-xl text-lg font-semibold hover:bg-saffron-dark transition-colors disabled:opacity-60 btn-press"
          >
            {loading ? "कृपया प्रतीक्षा करें..." : "लॉगिन करें"}
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-center text-sm text-gray-500">
          नया खाता बनाना है?{" "}
          <Link href="/signup" className="text-saffron font-semibold hover:underline">
            पंजीकरण करें →
          </Link>
        </p>

        {/* Footer */}
        <div className="text-center space-y-1">
          <p className="text-xs text-gray-400 italic">{FOOTER_TEXT}</p>
          <p className="text-xs text-gray-400">🙏 {FOOTER_DEDICATION}</p>
        </div>
      </div>
    </div>
  );
}
