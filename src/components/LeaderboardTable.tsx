"use client";

import type { LeaderboardEntry } from "@/lib/api";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId: string;
}

const medals: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export default function LeaderboardTable({
  entries,
  currentUserId,
}: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <p className="text-center text-gray-400 py-8">
        अभी तक कोई डेटा नहीं है।
      </p>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-saffron-light text-saffron-dark">
            <th className="py-3 px-3 text-left">#</th>
            <th className="py-3 px-3 text-left">नाम</th>
            <th className="py-3 px-2 text-center">उपस्थिति</th>
            <th className="py-3 px-2 text-center">स्ट्रीक</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.id}
              className={`border-t border-gray-100 ${
                entry.id === currentUserId ? "bg-saffron-light/50" : ""
              }`}
            >
              <td className="py-3 px-3 font-medium">
                {medals[entry.rank] || entry.rank}
              </td>
              <td className="py-3 px-3">
                {entry.name}
                {entry.id === currentUserId && (
                  <span className="text-xs text-saffron ml-1">(आप)</span>
                )}
              </td>
              <td className="py-3 px-2 text-center font-semibold">
                {entry.totalAttendance}
              </td>
              <td className="py-3 px-2 text-center">
                {entry.currentStreak > 0 && "🔥"} {entry.currentStreak}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
