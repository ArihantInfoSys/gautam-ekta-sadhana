"use client";

import { useState } from "react";
import { getTodayTeachings } from "@/lib/teachings";

export default function SurpriseCard() {
  const [isOpen, setIsOpen] = useState(false);
  const teachings = getTodayTeachings();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full text-left relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-saffron to-gold shadow-lg btn-press cursor-pointer"
      >
        <div className="shimmer-effect absolute inset-0 rounded-2xl pointer-events-none" />
        <div className="relative z-10">
          <p className="text-3xl mb-2">✨</p>
          <h3 className="text-xl font-bold text-white mb-1">आज का संदेश</h3>
          <p className="text-white/90 text-sm">टैप करके आज की शिक्षा देखें</p>
        </div>
      </button>
    );
  }

  return (
    <div className="flip-in bg-white rounded-2xl border-t-4 border-gold shadow-lg overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-saffron-light to-gold-light">
        <h3 className="text-lg font-bold text-saffron-dark">
          गौतम स्वामी की शिक्षाएं
        </h3>
      </div>
      <div className="p-4 space-y-0">
        {teachings.map((teaching, index) => (
          <div key={index}>
            <div className="flex gap-3 py-3">
              <span className="text-saffron font-bold text-lg shrink-0">
                {index + 1}.
              </span>
              <p className="text-foreground leading-relaxed">{teaching}</p>
            </div>
            {index < teachings.length - 1 && (
              <hr className="border-gold-light" />
            )}
          </div>
        ))}
      </div>
      <div className="px-4 pb-4">
        <button
          onClick={() => setIsOpen(false)}
          className="w-full py-2 text-sm text-saffron-dark bg-saffron-light rounded-lg font-medium hover:bg-saffron/10 transition-colors"
        >
          बंद करें
        </button>
      </div>
    </div>
  );
}
