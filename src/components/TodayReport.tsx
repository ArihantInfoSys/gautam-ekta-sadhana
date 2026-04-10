"use client";

import { useEffect, useState } from "react";
import { getTodayAttendees, type TodayAttendeesResult } from "@/lib/api";
import LoadingSpinner from "./LoadingSpinner";

const MOTIVATIONAL_MESSAGES = [
  "हर एक साधक की उपस्थिति एकता की शक्ति है।",
  "आप सभी का समर्पण गुरुदेव को समर्पित है। 🙏",
  "एक साथ प्रार्थना, एक साथ शक्ति।",
  "आपकी नियमितता ही सच्ची साधना है।",
  "गुरु कृपा से आज का दिन धन्य है।",
];

function getTodayMessage(): string {
  const day = new Date().getDay();
  return MOTIVATIONAL_MESSAGES[day % MOTIVATIONAL_MESSAGES.length];
}

export default function TodayReport() {
  const [data, setData] = useState<TodayAttendeesResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTodayAttendees().then((res) => {
      if (res.success && res.data) {
        setData(res.data);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  const count = data?.count ?? 0;
  const attendees = data?.attendees ?? [];

  return (
    <div className="space-y-4">
      {/* Motivational Header */}
      <div className="bg-gradient-to-br from-saffron to-gold rounded-2xl p-5 text-white text-center shadow-md">
        <p className="text-3xl font-bold">{count}</p>
        <p className="text-sm font-medium mt-1 opacity-90">
          साधक आज की प्रार्थना में शामिल हुए
        </p>
        <div className="mt-3 h-px bg-white/30" />
        <p className="text-sm mt-3 italic opacity-90">{getTodayMessage()}</p>
      </div>

      {/* Gratitude Message */}
      {count > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-center">
          <p className="text-sm text-amber-800 font-medium">
            🙏 इन सभी साधकों को हृदय से धन्यवाद एवं वंदन!
          </p>
        </div>
      )}

      {/* Attendee List */}
      {attendees.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-4xl mb-2">🕐</p>
          <p className="text-sm">अभी तक कोई उपस्थित नहीं हुआ।</p>
          <p className="text-xs mt-1">पहले साधक बनें!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-600">आज के साधक</p>
          </div>
          <ul className="divide-y divide-gray-50">
            {attendees.map((a, i) => (
              <li key={a.userId} className="flex items-center gap-3 px-4 py-3">
                <span className="w-7 h-7 rounded-full bg-saffron/15 text-saffron text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-gray-800 flex-1">
                  {a.name}
                </span>
                <span className="text-saffron text-base">🙏</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
