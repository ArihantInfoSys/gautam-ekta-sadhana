"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getLeaderboard, getLeaderboardByBranch, type LeaderboardEntry } from "@/lib/api";
import { MAHARASHTRA_DISTRICTS } from "@/lib/constants";
import LeaderboardTable from "@/components/LeaderboardTable";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function LeaderboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState("all");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user || user.role === "member") return;

    setLoading(true);
    const fetchFn =
      selectedBranch === "all"
        ? getLeaderboard()
        : getLeaderboardByBranch(selectedBranch);

    fetchFn.then((res) => {
      if (res.success && res.data) {
        setEntries(res.data);
      }
      setLoading(false);
    });
  }, [user, selectedBranch]);

  if (isLoading || !user) return <LoadingSpinner />;

  // Members see locked screen
  if (user.role === "member") {
    return (
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        <h1 className="text-2xl font-bold text-center text-saffron-dark">
          🏆 लीडरबोर्ड
        </h1>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center space-y-4">
          <p className="text-6xl">🔒</p>
          <p className="text-gray-700 font-semibold text-lg">
            लीडरबोर्ड केवल नेताओं के लिए उपलब्ध है
          </p>
          <p className="text-sm text-gray-400">
            यह सुविधा नेता (Leader) भूमिका वाले साधकों के लिए है।
          </p>
        </div>
      </div>
    );
  }

  // Leaders & admins see full leaderboard with branch filter
  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold text-center text-saffron-dark">
        🏆 लीडरबोर्ड
      </h1>

      {/* Branch Filter */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">शाखा / जिला फ़िल्टर</label>
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/50 focus:border-saffron bg-white"
        >
          <option value="all">🌐 सभी शाखाएं</option>
          {MAHARASHTRA_DISTRICTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <LeaderboardTable entries={entries} currentUserId={user.id} />
      )}
    </div>
  );
}
