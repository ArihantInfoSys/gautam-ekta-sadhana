"use client";

import { GURU_QUOTE } from "@/lib/constants";

export default function GuruImage() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="guru-glow rounded-full overflow-hidden w-[150px] h-[150px] md:w-[200px] md:h-[200px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Gurudev.png"
          alt="गुरुदेव"
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-center text-gold font-semibold text-lg">{GURU_QUOTE}</p>
    </div>
  );
}
