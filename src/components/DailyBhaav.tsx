"use client";

import { useEffect, useState } from "react";
import { getDailyBhaav } from "@/lib/api";

/** 31 Jain spiritual quotes — one for each day of the month. */
const BHAAV_POOL = [
  "अहिंसा परमो धर्मः — सत्य, अहिंसा और करुणा से जीवन को सार्थक बनाएं।",
  "क्षमा वीरस्य भूषणम् — क्षमा वीरों का आभूषण है।",
  "जिनेन्द्र वचनं सत्यं — जिनेन्द्र भगवान का वचन ही सत्य है।",
  "मन को जीतो, जग को जीतोगे — स्वयं पर विजय ही सबसे बड़ी विजय है।",
  "संयम और तप से ही आत्मा का कल्याण होता है।",
  "परस्परोपग्रहो जीवानाम् — सभी जीव एक-दूसरे पर निर्भर हैं।",
  "अप्रमत्तता ही धर्म का मूल है — जागरूक रहो, सचेत रहो।",
  "राग-द्वेष से मुक्ति ही मोक्ष का मार्ग है।",
  "सम्यक् दर्शन, ज्ञान और चारित्र — यही रत्नत्रय है।",
  "आत्मा स्वयं ही अपना मित्र है और स्वयं ही अपना शत्रु।",
  "कर्म का बंधन क्रोध, मान, माया और लोभ से होता है।",
  "जो दूसरों को सुख देता है, उसे स्वयं सुख मिलता है।",
  "धर्म सबसे उत्तम मंगल है, अहिंसा सबसे उत्तम संयम।",
  "त्याग में ही सच्चा सुख है — संग्रह में नहीं।",
  "सभी प्राणियों में आत्मा समान है — भेदभाव मिथ्या है।",
  "गुरु का आशीर्वाद सबसे बड़ा धन है।",
  "सत्य बोलो, प्रिय बोलो, हित बोलो — यही वाणी का तप है।",
  "जैसा बोओगे वैसा काटोगे — कर्म का सिद्धांत अटल है।",
  "मन की शांति ही असली संपत्ति है।",
  "ज्ञान का प्रकाश अज्ञान के अंधकार को दूर करता है।",
  "दया धर्म का मूल है — सब जीवों पर दया करो।",
  "इंद्रियों को वश में रखना ही सच्ची साधना है।",
  "सादा जीवन उच्च विचार — यही जैन जीवन शैली है।",
  "प्रतिदिन की प्रार्थना आत्मा को शुद्ध करती है।",
  "अनेकांतवाद — सत्य के अनेक पहलू होते हैं, सबका आदर करो।",
  "जो वर्तमान में जीता है, वही सच्चा साधक है।",
  "सेवा ही सबसे बड़ी पूजा है।",
  "एकता में शक्ति है — साथ मिलकर साधना करो।",
  "विनम्रता ज्ञान की पहचान है — अहंकार से दूर रहो।",
  "हर दिन एक नया अवसर है — आत्मकल्याण का।",
  "गौतम स्वामी की भक्ति से मोक्ष का मार्ग प्रशस्त होता है।",
];

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function DailyBhaav() {
  const [bhaav, setBhaav] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try fetching from GAS SETTINGS first; fall back to day-rotated pool
    getDailyBhaav().then((res) => {
      if (res.success && res.data && res.data.text) {
        setBhaav(res.data.text);
      } else {
        const idx = getDayOfYear() % BHAAV_POOL.length;
        setBhaav(BHAAV_POOL[idx]);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border-l-4 border-gold p-4 animate-pulse">
        <div className="h-4 bg-saffron-light rounded w-3/4 mb-2" />
        <div className="h-4 bg-saffron-light rounded w-1/2" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border-l-4 border-gold p-4 shadow-sm">
      <p className="text-sm text-gray-500 mb-1 font-medium">दैनिक भाव</p>
      <p className="text-foreground italic leading-relaxed">{bhaav}</p>
    </div>
  );
}
