"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getLeaderboard, type LeaderboardEntry } from "@/lib/api";
import LeaderboardTable from "@/components/LeaderboardTable";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function LeaderboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    getLeaderboard().then((res) => {
      if (res.success && res.data) {
        setEntries(res.data);
      }
      setLoading(false);
    });
  }, []);

  if (isLoading || !user) return <LoadingSpinner />;

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold text-center text-saffron-dark">
        🏆 लीडरबोर्ड
      </h1>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <LeaderboardTable entries={entries} currentUserId={user.id} />
      )}
    </div>
  );
}
