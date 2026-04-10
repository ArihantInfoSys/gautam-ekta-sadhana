"use client";

interface InactiveUser {
  name: string;
  lastDate: string;
  daysInactive: number;
}

interface InactiveUsersProps {
  users: InactiveUser[];
}

export default function InactiveUsers({ users }: InactiveUsersProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <p className="text-sm font-semibold text-gray-600 mb-3">
        निष्क्रिय सदस्य (7+ दिन)
      </p>
      {users.length === 0 ? (
        <p className="text-center text-gray-400 py-4">
          सभी सदस्य सक्रिय हैं! 🎉
        </p>
      ) : (
        <div className="space-y-2">
          {users.map((u, i) => (
            <div
              key={i}
              className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0"
            >
              <span className="text-sm">{u.name}</span>
              <span className="text-xs text-red-400">
                {u.daysInactive} दिन से अनुपस्थित
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
