"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getSettings, getUserProfile, type AttendanceResult } from "@/lib/api";
import { FOOTER_TEXT, FOOTER_DEDICATION } from "@/lib/constants";
import GuruImage from "@/components/GuruImage";
import SurpriseCard from "@/components/SurpriseCard";
import DailyBhaav from "@/components/DailyBhaav";
import AiMessage from "@/components/AiMessage";
import PrayerButton from "@/components/PrayerButton";
import StatsCard from "@/components/StatsCard";
import TodayReport from "@/components/TodayReport";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function DashboardPage() {
  const { user, login, logout, isLoading } = useAuth();
  const router = useRouter();
  const [zoomLink, setZoomLink] = useState("https://zoom.us/j/PLACEHOLDER");
  const [streak, setStreak] = useState(0);
  const [total, setTotal] = useState(0);
  const [activeTab, setActiveTab] = useState<"home" | "report">("home");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      setStreak(user.currentStreak);
      setTotal(user.totalAttendance);
    }
  }, [user]);

  // Refresh stats from server on mount to fix stale localStorage values
  useEffect(() => {
    if (!user) return;
    getUserProfile(user.id).then((res) => {
      if (res.success && res.data) {
        const fresh = res.data;
        setStreak(fresh.currentStreak);
        setTotal(fresh.totalAttendance);
        login({
          ...user,
          currentStreak: fresh.currentStreak,
          totalAttendance: fresh.totalAttendance,
          lastAttendanceDate: fresh.lastAttendanceDate,
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    getSettings().then((res) => {
      if (res.success && res.data && res.data.ZoomLink) {
        setZoomLink(res.data.ZoomLink as string);
      }
    });
  }, []);

  const handleAttendanceMarked = (data: AttendanceResult) => {
    setStreak(data.currentStreak);
    setTotal(data.totalAttendance);
    if (user) {
      login({
        ...user,
        currentStreak: data.currentStreak,
        totalAttendance: data.totalAttendance,
        lastAttendanceDate: data.lastAttendanceDate,
      });
    }
  };

  if (isLoading || !user) return <LoadingSpinner />;

  return (
    <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Header: Greeting + Logout */}
      <div className="flex items-center justify-between">
        <p className="text-lg font-medium text-gray-700">
          🙏 नमस्ते, <span className="text-saffron font-semibold">{user.name}</span>
        </p>
        <button
          onClick={logout}
          className="text-xs px-3 py-1.5 rounded-full bg-red-50 text-red-500 font-semibold hover:bg-red-100 transition-colors"
          aria-label="लॉगआउट"
        >
          लॉगआउट
        </button>
      </div>

      {/* Guru Image */}
      <GuruImage />

      {/* Tab Switcher */}
      <div className="flex rounded-xl bg-gray-100 p-1 gap-1">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "home"
              ? "bg-white shadow text-saffron"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          🏠 होम
        </button>
        <button
          onClick={() => setActiveTab("report")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "report"
              ? "bg-white shadow text-saffron"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          📋 आज की उपस्थिति
        </button>
      </div>

      {activeTab === "home" ? (
        <>
          {/* Surprise Card - Today's Teachings */}
          <SurpriseCard />

          {/* Daily Bhaav */}
          <DailyBhaav />

          {/* AI Message */}
          <AiMessage />

          {/* Prayer Button */}
          <PrayerButton
            zoomLink={zoomLink}
            onAttendanceMarked={handleAttendanceMarked}
          />

          {/* Stats */}
          <StatsCard streak={streak} total={total} />
        </>
      ) : (
        <TodayReport />
      )}

      {/* Footer */}
      <div className="text-center space-y-1 pt-4">
        <p className="text-xs text-gray-400 italic">{FOOTER_TEXT}</p>
        <p className="text-xs text-gray-400">🙏 {FOOTER_DEDICATION}</p>
      </div>
    </div>
  );
}
