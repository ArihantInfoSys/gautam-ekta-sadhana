"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { markAttendance, type AttendanceResult } from "@/lib/api";

interface PrayerButtonProps {
  zoomLink: string;
  onAttendanceMarked?: (data: AttendanceResult) => void;
}

function isToday(dateStr: string): boolean {
  if (!dateStr) return false;
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });
  return dateStr === today;
}

export default function PrayerButton({
  zoomLink,
  onAttendanceMarked,
}: PrayerButtonProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [attended, setAttended] = useState(
    user ? isToday(user.lastAttendanceDate) : false
  );
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleClick = async () => {
    if (!user || loading || attended) return;
    setLoading(true);

    const res = await markAttendance(user.id);
    setLoading(false);

    if (res.success && res.data) {
      setAttended(true);
      showToast("🙏 उपस्थिति दर्ज हो गई!");
      onAttendanceMarked?.(res.data);
      window.open(zoomLink, "_blank");
    } else {
      showToast(res.error || "कुछ गड़बड़ हो गई, पुनः प्रयास करें।");
    }
  };

  return (
    <div className="relative">
      {toast && (
        <div className="slide-up absolute -top-12 left-0 right-0 bg-green-600 text-white text-center py-2 px-4 rounded-lg text-sm font-medium shadow-lg z-10">
          {toast}
        </div>
      )}
      <button
        onClick={handleClick}
        disabled={attended || loading}
        className={`w-full py-4 px-6 rounded-xl text-lg font-bold shadow-lg transition-all btn-press ${
          attended
            ? "bg-green-500 text-white cursor-default"
            : "bg-saffron text-white hover:bg-saffron-dark active:scale-95"
        } ${loading ? "opacity-70 cursor-wait" : ""}`}
      >
        {loading
          ? "कृपया प्रतीक्षा करें..."
          : attended
          ? "✅ आज की उपस्थिति दर्ज है"
          : "🙏 आज की प्रार्थना में जुड़ें"}
      </button>
    </div>
  );
}
