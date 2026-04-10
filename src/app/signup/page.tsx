"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { signup as apiSignup } from "@/lib/api";
import { APP_NAME, FOOTER_TEXT, FOOTER_DEDICATION, MAHARASHTRA_DISTRICTS } from "@/lib/constants";

export default function SignupPage() {
  const { user, login, isLoading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("member");
  const [branch, setBranch] = useState("");
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

    if (!name.trim()) {
      setError("कृपया अपना नाम दर्ज करें।");
      return;
    }
    if (phone.length !== 10) {
      setError("कृपया 10 अंकों का फ़ोन नंबर दर्ज करें।");
      return;
    }
    if (!branch) {
      setError("कृपया अपनी शाखा (जिला) चुनें।");
      return;
    }

    setLoading(true);
    const res = await apiSignup(name.trim(), phone, role, branch);
    setLoading(false);

    if (res.success && res.data) {
      login(res.data);
      router.push("/dashboard");
    } else {
      setError(res.error || "पंजीकरण विफल। कृपया पुनः प्रयास करें।");
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
          <p className="text-sm text-gray-500">नया खाता बनाएं</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border border-gray-100">
          <h2 className="text-lg font-semibold text-center">पंजीकरण</h2>

          <div>
            <label className="block text-sm text-gray-600 mb-1">नाम</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="अपना पूरा नाम"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-saffron/50 focus:border-saffron"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">भूमिका</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "member", label: "🙏 सदस्य", sub: "Member" },
                { value: "leader", label: "⭐ नेता", sub: "Leader" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRole(opt.value)}
                  className={`py-3 rounded-xl border-2 text-center transition-all ${
                    role === opt.value
                      ? "border-saffron bg-saffron/10 text-saffron font-semibold"
                      : "border-gray-200 text-gray-500 hover:border-saffron/50"
                  }`}
                >
                  <div className="text-lg">{opt.label}</div>
                  <div className="text-xs opacity-70">{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">शाखा / जिला</label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-saffron/50 focus:border-saffron bg-white"
            >
              <option value="">-- जिला चुनें --</option>
              {MAHARASHTRA_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

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
            {loading ? "कृपया प्रतीक्षा करें..." : "पंजीकरण करें"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-500">
          पहले से खाता है?{" "}
          <Link href="/" className="text-saffron font-semibold hover:underline">
            लॉगिन करें
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
