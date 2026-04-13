"use client";

import { useState, useEffect } from "react";
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

function isPrayerTime(): boolean {
  const now = new Date();
  const istStr = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  const ist = new Date(istStr);
  const totalMinutes = ist.getHours() * 60 + ist.getMinutes();
  return totalMinutes >= 350 && totalMinutes <= 375;
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
  const prayerTimeActive = isPrayerTime();

  useEffect(() => {
    if (user && isToday(user.lastAttendanceDate)) {
      setAttended(true);
    }
  }, [user?.lastAttendanceDate]);

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
    if (!user || loading || !prayerTimeActive) return;

    openZoom();

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
        <div className="w-full py-4 px-6 rounded-xl text-center bg-yellow-50 border border-yellow-200 text-yellow-700">
          <p className="text-lg font-bold">⚠️ Zoom लिंक उपलब्ध नहीं है</p>
          <p className="text-sm mt-1">कृपया व्यवस्थापक (Admin) से संपर्क करें।</p>
        </div>
      ) : attended ? (
        /* Already attended — green card */
        <div className="w-full py-4 px-6 rounded-xl text-center bg-green-50 border border-green-200">
          <p className="text-lg font-bold text-green-700">✅ आज की उपस्थिति दर्ज हो चुकी है</p>
          <p className="text-sm text-green-600 mt-1">🙏 जय जिनेन्द्र! आज की प्रार्थना में आपकी उपस्थिति सफलतापूर्वक दर्ज है।</p>
        </div>
      ) : (
        /* Not attended — orange button (disabled if outside prayer time) */
        <>
          <button
            onClick={handleClick}
            disabled={loading || !prayerTimeActive}
            className={`w-full py-4 px-6 rounded-xl text-lg font-bold shadow-lg transition-all btn-press bg-saffron text-white ${
              !prayerTimeActive
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-saffron-dark active:scale-95"
            } ${loading ? "opacity-70 cursor-wait" : ""}`}
          >
            {loading
              ? "कृपया प्रतीक्षा करें..."
              : "🙏 आज की प्रार्थना में जुड़ें"}
          </button>

          {!prayerTimeActive && (
            <p className="text-center text-xs text-gray-400">
              Zoom लिंक सुबह 5:50 से 6:15 बजे तक सक्रिय होगा
            </p>
          )}

          {prayerTimeActive && showFallbackLink && (
            <a
              href={zoomLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-3 px-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm font-semibold hover:bg-blue-100 transition-colors"
            >
              🔗 Zoom नहीं खुला? यहां क्लिक करें
            </a>
          )}

          {prayerTimeActive && (
            <a
              href={zoomLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-2 text-xs text-saffron-dark hover:underline"
            >
              🔗 Zoom मीटिंग लिंक (सीधा खोलें)
            </a>
          )}
        </>
      )}

      <p className="text-center text-[11px] text-gray-400">
        🕕 प्रार्थना का समय: सुबह 5:50 से 6:15 बजे
      </p>
    </div>
  );
}
