// constants.ts - Hindi UI strings and configuration for Gautam Ekta Sadhana

export const APP_NAME = "गौतम एकता साधना";
export const FOUNDATION_NAME = "Gautam Labdhi Foundation";
export const GURU_QUOTE = "गुरु प्रेरणा से एकता की साधना";
export const FOOTER_TEXT = "यह सिर्फ प्रार्थना नहीं… एकता का अनुभव है।";
export const FOOTER_DEDICATION = "गुरुदेव को समर्पित — नगर रोड, गौतम लाभ्धि फाउंडेशन";

export const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL || "";

export const NAV_ITEMS = [
  { key: "dashboard", label: "डैशबोर्ड", href: "/dashboard" },
  { key: "leaderboard", label: "लीडरबोर्ड", href: "/leaderboard" },
  { key: "profile", label: "प्रोफ़ाइल", href: "/profile" },
  { key: "admin", label: "एडमिन", href: "/admin" },
] as const;

export const ROLES = {
  USER: "user",
  ADMIN: "admin",
} as const;

export const MESSAGES = {
  LOGIN_SUCCESS: "सफलतापूर्वक लॉगिन हुआ!",
  LOGIN_FAILED: "लॉगिन विफल। कृपया पुनः प्रयास करें।",
  SIGNUP_SUCCESS: "पंजीकरण सफल! स्वागत है।",
  SIGNUP_FAILED: "पंजीकरण विफल। कृपया पुनः प्रयास करें।",
  ATTENDANCE_MARKED: "आज की उपस्थिति दर्ज हो गई!",
  ATTENDANCE_ALREADY: "आज की उपस्थिति पहले से दर्ज है।",
  NETWORK_ERROR: "नेटवर्क त्रुटि। कृपया इंटरनेट कनेक्शन जांचें।",
  LOADING: "लोड हो रहा है...",
  NO_DATA: "कोई डेटा उपलब्ध नहीं है।",
} as const;

export const STORAGE_KEYS = {
  USER: "gautam_user",
} as const;

export const MAHARASHTRA_DISTRICTS = [
  "अहमदनगर/अहिल्यानगर",
  "अकोला",
  "अमरावती",
  "औरंगाबाद/छत्रपति संभाजीनगर",
  "बीड",
  "भंडारा",
  "बुलढाणा",
  "चंद्रपुर",
  "धुले",
  "गढ़चिरौली",
  "गोंदिया",
  "हिंगोली",
  "जलगांव",
  "जालना",
  "कोल्हापुर",
  "लातूर",
  "मुंबई शहर",
  "मुंबई उपनगर",
  "नागपुर",
  "नांदेड़",
  "नंदुरबार",
  "नाशिक",
  "उस्मानाबाद/धाराशिव",
  "पालघर",
  "परभणी",
  "पुणे",
  "रायगढ़",
  "रत्नागिरी",
  "सांगली",
  "सतारा",
  "सिंधुदुर्ग",
  "सोलापुर",
  "ठाणे",
  "वर्धा",
  "वाशिम",
  "यवतमाल",
] as const;
