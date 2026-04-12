"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  getLeaderboard,
  type LeaderboardEntry,
  type LeaderboardPeriod,
} from "@/lib/api";
import { MAHARASHTRA_DISTRICTS } from "@/lib/constants";
import LeaderboardTable from "@/components/LeaderboardTable";
import LoadingSpinner from "@/components/LoadingSpinner";

const PERIOD_TABS: { key: LeaderboardPeriod; label: string }[] = [
  { key: "daily", label: "आज" },
  { key: "weekly", label: "साप्ताहिक" },
  { key: "monthly", label: "मासिक" },
  { key: "all", label: "कुल" },
];

export default function LeaderboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<LeaderboardPeriod>("weekly");
  const [selectedBranch, setSelectedBranch] = useState("all");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getLeaderboard(period, selectedBranch).then((res) => {
      if (res.success && res.data) {
        setEntries(res.data);
      }
      setLoading(false);
    });
  }, [user, period, selectedBranch]);

  if (isLoading || !user) return <LoadingSpinner />;

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold text-center text-saffron-dark">
        🏆 लीडरबोर्ड
      </h1>

      {/* Period Tabs */}
      <div className="flex rounded-xl bg-gray-100 p-1 gap-1">
        {PERIOD_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setPeriod(t.key)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              period === t.key
                ? "bg-white shadow text-saffron"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Branch Filter */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">
          शाखा / जिला फ़िल्टर
        </label>
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/50 focus:border-saffron bg-white"
        >
          <option value="all">🌐 सभी शाखाएं</option>
          {MAHARASHTRA_DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <LeaderboardTable
          entries={entries}
          currentUserId={user.id}
          groupByBranch={selectedBranch === "all"}
        />
      )}
    </div>
  );
}
