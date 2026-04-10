"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getAdminDashboard, getSettings } from "@/lib/api";
import { ROLES } from "@/lib/constants";
import AdminStats from "@/components/AdminStats";
import InactiveUsers from "@/components/InactiveUsers";
import SettingsForm from "@/components/SettingsForm";
import LoadingSpinner from "@/components/LoadingSpinner";

interface DashboardData {
  todayCount: number;
  weeklyData: { date: string; count: number }[];
  inactiveUsers: { name: string; lastDate: string; daysInactive: number }[];
}

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [zoomLink, setZoomLink] = useState("");
  const [bhaav, setBhaav] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    Promise.all([getAdminDashboard(), getSettings()]).then(
      ([dashRes, settingsRes]) => {
        if (dashRes.success && dashRes.data) {
          // The API returns the data shape from Admin.gs getDashboard
          const d = dashRes.data as unknown as DashboardData;
          setData(d);
        }
        if (settingsRes.success && settingsRes.data) {
          setZoomLink((settingsRes.data.ZoomLink as string) || "");
          setBhaav((settingsRes.data.DailyBhaav as string) || "");
        }
        setLoading(false);
      }
    );
  }, []);

  if (isLoading || !user) return <LoadingSpinner />;

  if (user.role !== ROLES.ADMIN) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <p className="text-2xl mb-2">🚫</p>
        <p className="text-lg font-semibold text-gray-600">पहुँच अस्वीकृत</p>
        <p className="text-sm text-gray-400 mt-1">
          यह पेज केवल एडमिन के लिए है।
        </p>
      </div>
    );
  }

  if (loading || !data) return <LoadingSpinner />;

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-center text-saffron-dark">
        📊 एडमिन डैशबोर्ड
      </h1>

      <AdminStats
        todayCount={data.todayCount}
        weeklyData={data.weeklyData}
      />

      <InactiveUsers users={data.inactiveUsers} />

      <SettingsForm initialZoomLink={zoomLink} initialBhaav={bhaav} />
    </div>
  );
}
