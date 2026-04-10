"use client";

interface StatsCardProps {
  streak: number;
  total: number;
}

export default function StatsCard({ streak, total }: StatsCardProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-white rounded-xl border border-saffron-light p-4 shadow-sm text-center">
        <p className="text-3xl mb-1">🔥</p>
        <p className="text-2xl font-bold text-saffron">{streak}</p>
        <p className="text-xs text-gray-500 mt-1">दिन की स्ट्रीक</p>
      </div>
      <div className="bg-white rounded-xl border border-saffron-light p-4 shadow-sm text-center">
        <p className="text-3xl mb-1">📅</p>
        <p className="text-2xl font-bold text-saffron">{total}</p>
        <p className="text-xs text-gray-500 mt-1">कुल उपस्थिति</p>
      </div>
    </div>
  );
}
