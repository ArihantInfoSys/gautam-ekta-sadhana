"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ProfilePage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return <LoadingSpinner />;

  const fields = [
    { label: "नाम", value: user.name },
    { label: "फ़ोन", value: user.phone },
    { label: "शामिल होने की तिथि", value: user.joinDate || "—" },
    { label: "कुल उपस्थिति", value: `${user.totalAttendance} दिन` },
    { label: "वर्तमान स्ट्रीक", value: `${user.currentStreak} दिन 🔥` },
    { label: "अंतिम उपस्थिति", value: user.lastAttendanceDate || "—" },
  ];

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-center text-saffron-dark">
        👤 मेरी प्रोफ़ाइल
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Avatar */}
        <div className="bg-gradient-to-r from-saffron to-gold p-6 text-center">
          <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center text-3xl shadow-md">
            🙏
          </div>
          <p className="text-white font-bold text-xl mt-3">{user.name}</p>
        </div>

        {/* Details */}
        <div className="p-4 space-y-0">
          {fields.map((f, i) => (
            <div
              key={i}
              className="flex justify-between py-3 border-b border-gray-50 last:border-0"
            >
              <span className="text-sm text-gray-500">{f.label}</span>
              <span className="text-sm font-medium">{f.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full py-3 bg-red-50 text-red-500 rounded-xl font-semibold hover:bg-red-100 transition-colors"
      >
        लॉगआउट
      </button>
    </div>
  );
}
