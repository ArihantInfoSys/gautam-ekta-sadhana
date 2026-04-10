"use client";

interface WeeklyData {
  date: string;
  count: number;
}

interface AdminStatsProps {
  todayCount: number;
  weeklyData: WeeklyData[];
}

export default function AdminStats({ todayCount, weeklyData }: AdminStatsProps) {
  const maxCount = Math.max(...weeklyData.map((d) => d.count), 1);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm p-6 text-center border border-saffron-light">
        <p className="text-sm text-gray-500 mb-1">आज की उपस्थिति</p>
        <p className="text-5xl font-bold text-saffron">{todayCount}</p>
        <p className="text-xs text-gray-400 mt-1">साधक</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4">
        <p className="text-sm font-semibold text-gray-600 mb-4">
          साप्ताहिक रुझान
        </p>
        <div className="flex items-end justify-between gap-2 h-32">
          {weeklyData.map((day) => {
            const height = (day.count / maxCount) * 100;
            const label = day.date.slice(5); // MM-DD
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500 font-medium">
                  {day.count}
                </span>
                <div
                  className="w-full bg-saffron rounded-t-md transition-all"
                  style={{ height: `${Math.max(height, 4)}%` }}
                />
                <span className="text-[10px] text-gray-400">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
