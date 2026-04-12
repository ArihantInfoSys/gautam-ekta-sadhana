"use client";

import { useEffect, useState } from "react";
import type { LeaderboardEntry } from "@/lib/api";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId: string;
  groupByBranch?: boolean;
}

const medals: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

interface BranchGroup {
  branch: string;
  leaderName: string;
  members: LeaderboardEntry[];
  totalAttendance: number;
  activeCount: number;
}

function groupEntries(entries: LeaderboardEntry[]): BranchGroup[] {
  const map = new Map<string, BranchGroup>();
  for (const e of entries) {
    const key = e.branch || "—";
    let g = map.get(key);
    if (!g) {
      g = {
        branch: key,
        leaderName: e.leaderName || "",
        members: [],
        totalAttendance: 0,
        activeCount: 0,
      };
      map.set(key, g);
    }
    g.members.push(e);
    g.totalAttendance += e.attendance;
    if (e.attendance > 0) g.activeCount++;
    if (!g.leaderName && e.leaderName) g.leaderName = e.leaderName;
  }
  return Array.from(map.values()).sort(
    (a, b) => b.totalAttendance - a.totalAttendance
  );
}

export default function LeaderboardTable({
  entries,
  currentUserId,
  groupByBranch = false,
}: LeaderboardTableProps) {
  const groups = groupByBranch ? groupEntries(entries) : [];

  // Auto-expand only the top branch initially; reset whenever the group set changes.
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const groupKey = groups.map((g) => g.branch).join("|");
  useEffect(() => {
    if (!groupByBranch) return;
    const init: Record<string, boolean> = {};
    groups.forEach((g, i) => { init[g.branch] = i === 0; });
    setExpanded(init);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupKey, groupByBranch]);

  if (entries.length === 0) {
    return (
      <p className="text-center text-gray-400 py-8">
        अभी तक कोई डेटा नहीं है।
      </p>
    );
  }

  // ─── Flat table (single branch view) ────────────────────────────────────────
  if (!groupByBranch) {
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
                      <span className="text-[10px] text-saffron ml-1">
                        (आप)
                      </span>
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

  // ─── Grouped view (all branches) ────────────────────────────────────────────
  const allOpen = groups.length > 0 && groups.every((g) => expanded[g.branch]);

  function toggle(branch: string) {
    setExpanded((prev) => ({ ...prev, [branch]: !prev[branch] }));
  }
  function setAll(open: boolean) {
    const next: Record<string, boolean> = {};
    groups.forEach((g) => { next[g.branch] = open; });
    setExpanded(next);
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center px-1">
        <p className="text-xs text-gray-500">
          {groups.length} शाखाएं · {entries.length} साधक
        </p>
        <button
          onClick={() => setAll(!allOpen)}
          className="text-[11px] text-saffron-dark font-semibold hover:underline"
        >
          {allOpen ? "सभी बंद करें" : "सभी खोलें"}
        </button>
      </div>

      {groups.map((g) => {
        const isOpen = !!expanded[g.branch];
        return (
          <div
            key={g.branch}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <button
              onClick={() => toggle(g.branch)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-saffron-light/30 transition-colors text-left"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-saffron-dark text-xs font-bold w-4">
                  {isOpen ? "▾" : "▸"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">
                    {g.branch}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate">
                    नेता: {g.leaderName || "—"} · {g.activeCount}/{g.members.length} सक्रिय
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-bold text-saffron-dark leading-none">
                  {g.totalAttendance}
                </p>
                <p className="text-[9px] text-gray-400 mt-0.5">कुल उप.</p>
              </div>
            </button>

            {isOpen && (
              <table className="w-full text-xs border-t border-gray-100">
                <tbody>
                  {g.members.map((entry, idx) => {
                    const isMe = entry.id === currentUserId;
                    const localRank = idx + 1;
                    return (
                      <tr
                        key={entry.id}
                        className={`border-t border-gray-50 ${
                          isMe ? "bg-saffron-light/50" : ""
                        }`}
                      >
                        <td className="py-2 px-3 font-medium w-8">
                          {medals[localRank] || localRank}
                        </td>
                        <td className="py-2 px-2">
                          {entry.name}
                          {isMe && (
                            <span className="text-[10px] text-saffron ml-1">
                              (आप)
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-saffron-dark w-12">
                          {entry.attendance}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
    </div>
  );
}
