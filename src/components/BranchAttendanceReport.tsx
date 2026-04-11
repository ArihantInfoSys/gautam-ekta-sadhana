"use client";

import { useEffect, useState } from "react";
import { getBranchAttendanceReport, type BranchAttendanceReport } from "@/lib/api";
import { MAHARASHTRA_DISTRICTS } from "@/lib/constants";
import LoadingSpinner from "./LoadingSpinner";

interface Props {
  defaultBranch?: string;
}

type Period = "weekly" | "monthly";

const DAY_LABELS: Record<number, string> = { 0: "र", 1: "सो", 2: "मं", 3: "बु", 4: "गु", 5: "शु", 6: "श" };

function formatDate(dateStr: string): string {
  const [, , dd] = dateStr.split("-");
  const d = new Date(dateStr);
  return `${dd} ${["जन","फ़र","मार","अप्र","मई","जून","जुल","अग","सित","अक्ट","नव","दिस"][d.getMonth()]}`;
}

function dayLabel(dateStr: string): string {
  return DAY_LABELS[new Date(dateStr).getDay()];
}

export default function BranchAttendanceReportView({ defaultBranch = "all" }: Props) {
  const [branch, setBranch] = useState(defaultBranch);
  const [period, setPeriod] = useState<Period>("weekly");
  const [data, setData] = useState<BranchAttendanceReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getBranchAttendanceReport(branch, period).then((res) => {
      if (res.success && res.data) setData(res.data);
      setLoading(false);
    });
  }, [branch, period]);

  const maxCount = data ? Math.max(...data.dailyData.map((d) => d.count), 1) : 1;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex gap-2">
        {/* Period Toggle */}
        <div className="flex rounded-xl bg-gray-100 p-1 gap-1 flex-shrink-0">
          {(["weekly", "monthly"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                period === p ? "bg-white shadow text-saffron" : "text-gray-500"
              }`}
            >
              {p === "weekly" ? "साप्ताहिक" : "मासिक"}
            </button>
          ))}
        </div>

        {/* Branch Selector */}
        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-saffron/50 focus:border-saffron bg-white"
        >
          <option value="all">🌐 सभी शाखाएं</option>
          {MAHARASHTRA_DISTRICTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><LoadingSpinner /></div>
      ) : !data ? null : (
        <>
          {/* Summary Card */}
          <div className="bg-gradient-to-br from-saffron to-gold rounded-2xl p-4 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold">{data.totalUniqueCount}</p>
                <p className="text-sm opacity-90 mt-0.5">
                  {period === "weekly" ? "७ दिनों में" : "३० दिनों में"} अनन्य साधक
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-80">कुल उपस्थिति</p>
                <p className="text-2xl font-bold">
                  {data.dailyData.reduce((s, d) => s + d.count, 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs font-semibold text-gray-500 mb-3">
              {period === "weekly" ? "साप्ताहिक" : "मासिक"} उपस्थिति चार्ट
            </p>
            <div className={`flex items-end gap-1 h-24 ${period === "monthly" ? "overflow-x-auto" : ""}`}>
              {data.dailyData.map((d) => {
                const heightPct = maxCount > 0 ? (d.count / maxCount) * 100 : 0;
                const isToday = d.date === new Date().toISOString().slice(0, 10);
                return (
                  <div key={d.date} className="flex flex-col items-center flex-1 min-w-[20px] gap-1">
                    <span className="text-[9px] text-gray-500 leading-none">{d.count > 0 ? d.count : ""}</span>
                    <div
                      className={`w-full rounded-t-sm transition-all ${
                        isToday ? "bg-saffron" : d.count > 0 ? "bg-saffron/50" : "bg-gray-100"
                      }`}
                      style={{ height: `${Math.max(heightPct, d.count > 0 ? 8 : 4)}%` }}
                    />
                    <span className="text-[9px] text-gray-400 leading-none">
                      {period === "weekly" ? dayLabel(d.date) : d.date.slice(8)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Unique Attendees List */}
          {data.uniqueAttendees.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-sm">इस अवधि में कोई उपस्थिति नहीं मिली।</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <p className="text-sm font-semibold text-gray-600">
                  {period === "weekly" ? "इस सप्ताह के" : "इस माह के"} साधक
                </p>
                <span className="text-xs bg-saffron/15 text-saffron px-2 py-0.5 rounded-full font-semibold">
                  {data.totalUniqueCount}
                </span>
              </div>
              <ul className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
                {data.uniqueAttendees.map((a, i) => (
                  <li key={a.userId} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="w-6 h-6 rounded-full bg-saffron/15 text-saffron text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-800 flex-1">{a.name}</span>
                    <span className="text-saffron text-sm">🙏</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
