"use client";

import { useEffect, useState } from "react";
import { getDailyBhaav } from "@/lib/api";

export default function DailyBhaav() {
  const [bhaav, setBhaav] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDailyBhaav().then((res) => {
      if (res.success && res.data) {
        setBhaav(res.data.text);
      } else {
        setBhaav("अहिंसा परमो धर्मः — सत्य, अहिंसा और करुणा से जीवन को सार्थक बनाएं।");
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border-l-4 border-gold p-4 animate-pulse">
        <div className="h-4 bg-saffron-light rounded w-3/4 mb-2" />
        <div className="h-4 bg-saffron-light rounded w-1/2" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border-l-4 border-gold p-4 shadow-sm">
      <p className="text-sm text-gray-500 mb-1 font-medium">दैनिक भाव</p>
      <p className="text-foreground italic leading-relaxed">{bhaav}</p>
    </div>
  );
}
