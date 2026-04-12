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
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-saffron-light text-saffron-dark">
            <th className="py-2 px-2 text-left">#</th>
            <th className="py-2 px-2 text-left">साधक</th>
            <th className="py-2 px-1 text-left">शाखा</th>
            <th className="py-2 px-1 text-center">उप.</th>
            <th className="py-2 px-1 text-left">नेता</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const isMe = entry.id === currentUserId;
            return (
              <tr
                key={entry.id}
                className={`border-t border-gray-100 ${
                  isMe ? "bg-saffron-light/50" : ""
                }`}
              >
                <td className="py-2 px-2 font-medium">
                  {medals[entry.rank] || entry.rank}
                </td>
                <td className="py-2 px-2">
                  {entry.name}
                  {isMe && (
                    <span className="text-[10px] text-saffron ml-1">(आप)</span>
                  )}
                </td>
                <td className="py-2 px-1 text-gray-600 truncate max-w-[70px]">
                  {entry.branch || "—"}
                </td>
                <td className="py-2 px-1 text-center font-bold text-saffron-dark">
                  {entry.attendance}
                </td>
                <td className="py-2 px-1 text-gray-500 truncate max-w-[70px]">
                  {entry.leaderName || "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
