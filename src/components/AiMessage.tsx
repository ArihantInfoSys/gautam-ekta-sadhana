"use client";

import { useEffect, useState } from "react";
import { getTodayCount } from "@/lib/api";

export default function AiMessage() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    getTodayCount().then((res) => {
      if (res.success && res.data) {
        setCount(res.data.count);
      }
    });
  }, []);

  if (count === null) return null;

  const message =
    count === 0
      ? "आज का पहला साधक बनें!"
      : `आज ${count} साधक एक साथ जुड़े — यह एकता की शक्ति है।`;

  return (
    <div className="fade-in text-center py-2">
      <p className="text-sm text-saffron-dark font-medium italic">{message}</p>
    </div>
  );
}
