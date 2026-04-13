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

/** Check if current IST time is between 5:50 AM and 6:15 AM */
function isPrayerTime(): boolean {
  const now = new Date();
  const istStr = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  const ist = new Date(istStr);
  const totalMinutes = ist.getHours() * 60 + ist.getMinutes();
  return totalMinutes >= 350 && totalMinutes <= 375; // 5:50 AM to 6:15 AM
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
  const [showFallbackLink, setShowFallbackLink] = useState(false);

  const hasValidZoom = zoomLink && !zoomLink.includes("PLACEHOLDER");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const openZoom = () => {
    if (!hasValidZoom) return;
    const win = window.open(zoomLink, "_blank", "noopener,noreferrer");
    if (!win || win.closed) {
      setShowFallbackLink(true);
    }
  };

  const handleClick = async () => {
    if (!user || loading) return;

    // Check prayer time window
    if (!isPrayerTime()) {
      showToast("⏰ प्रार्थना का समय सुबह 5:50 से 6:15 बजे तक है। कृपया इस समय जुड़ें।");
      return;
    }

    // Check if Zoom link is valid
    if (!hasValidZoom) {
      showToast("⚠️ Zoom लिंक उपलब्ध नहीं है। कृपया व्यवस्थापक से संपर्क करें।");
      return;
    }

    // Open Zoom on every click
    openZoom();

    // If already attended, no need to call API again
    if (attended) {
      showToast("🙏 Zoom खुल रहा है। उपस्थिति पहले से दर्ज है।");
      return;
    }

    setLoading(true);
    const res = await markAttendance(user.id);
    setLoading(false);

    if (res.success && res.data) {
      setAttended(true);
      if (res.data.alreadyMarked) {
        showToast("🙏 उपस्थिति पहले से दर्ज है।");
      } else {
        showToast("🙏 उपस्थिति दर्ज हो गई!");
      }
      onAttendanceMarked?.(res.data);
    } else {
      showToast(res.error || "कुछ गड़बड़ हो गई, पुनः प्रयास करें।");
    }
  };

  return (
    <div className="relative space-y-2">
      {toast && (
        <div className="slide-up absolute -top-12 left-0 right-0 bg-green-600 text-white text-center py-2 px-4 rounded-lg text-sm font-medium shadow-lg z-10">
          {toast}
        </div>
      )}

      {!hasValidZoom ? (
        /* No valid Zoom link — show warning */
        <div className="w-full py-4 px-6 rounded-xl text-center bg-yellow-50 border border-yellow-200 text-yellow-700">
          <p className="text-lg font-bold">⚠️ Zoom लिंक उपलब्ध नहीं है</p>
          <p className="text-sm mt-1">कृपया व्यवस्थापक (Admin) से संपर्क करें।</p>
        </div>
      ) : (
        <>
          <button
            onClick={handleClick}
            disabled={loading}
            className={`w-full py-4 px-6 rounded-xl text-lg font-bold shadow-lg transition-all btn-press ${
              attended
                ? "bg-green-500 text-white hover:bg-green-600 active:scale-95"
                : "bg-saffron text-white hover:bg-saffron-dark active:scale-95"
            } ${loading ? "opacity-70 cursor-wait" : ""}`}
          >
            {loading
              ? "कृपया प्रतीक्षा करें..."
              : attended
              ? "✅ उपस्थिति दर्ज — Zoom में पुनः जुड़ें"
              : "🙏 आज की प्रार्थना में जुड़ें"}
          </button>

          {/* Fallback: direct clickable link if popup was blocked */}
          {showFallbackLink && (
            <a
              href={zoomLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-3 px-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm font-semibold hover:bg-blue-100 transition-colors"
            >
              🔗 Zoom नहीं खुला? यहां क्लिक करें
            </a>
          )}

          {/* Always show direct Zoom link for easy access */}
          <a
            href={zoomLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-2 text-xs text-saffron-dark hover:underline"
          >
            🔗 Zoom मीटिंग लिंक (सीधा खोलें)
          </a>

          {/* Prayer time info */}
          <p className="text-center text-[11px] text-gray-400">
            🕕 प्रार्थना का समय: सुबह 5:50 से 6:15 बजे
          </p>
        </>
      )}
    </div>
  );
}
