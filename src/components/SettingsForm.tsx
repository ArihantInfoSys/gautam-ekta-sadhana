"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { updateSettings } from "@/lib/api";

interface SettingsFormProps {
  initialZoomLink: string;
  initialBhaav: string;
}

export default function SettingsForm({
  initialZoomLink,
  initialBhaav,
}: SettingsFormProps) {
  const { user } = useAuth();
  const [zoomLink, setZoomLink] = useState(initialZoomLink);
  const [bhaav, setBhaav] = useState(initialBhaav);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const [r1, r2] = await Promise.all([
      updateSettings(user.id, "ZoomLink", zoomLink),
      updateSettings(user.id, "DailyBhaav", bhaav),
    ]);

    setSaving(false);
    if (r1.success && r2.success) {
      showToast("सेटिंग्स सहेजी गई!");
    } else {
      showToast("सहेजने में त्रुटि हुई।");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 space-y-4 relative">
      {toast && (
        <div className="slide-up absolute -top-10 left-0 right-0 bg-green-600 text-white text-center py-2 rounded-lg text-sm font-medium shadow-lg">
          {toast}
        </div>
      )}
      <p className="text-sm font-semibold text-gray-600">सेटिंग्स</p>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Zoom लिंक</label>
        <input
          type="url"
          value={zoomLink}
          onChange={(e) => setZoomLink(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/50 focus:border-saffron"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">दैनिक भाव</label>
        <textarea
          value={bhaav}
          onChange={(e) => setBhaav(e.target.value)}
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/50 focus:border-saffron resize-none"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-2 bg-saffron text-white rounded-lg font-medium hover:bg-saffron-dark transition-colors disabled:opacity-60"
      >
        {saving ? "सहेज रहे हैं..." : "सहेजें"}
      </button>
    </div>
  );
}
