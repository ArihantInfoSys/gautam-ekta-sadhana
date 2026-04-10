# गौतम एकता साधना (Gautam Ekta Sadhana)

> गुरु प्रेरणा से एकता की साधना

**Powered by Gautam Labdhi Foundation**

एक जैन आध्यात्मिक समुदाय का दैनिक प्रार्थना ट्रैकिंग वेब ऐप।

---

## विशेषताएं (Features)

- **फ़ोन-आधारित लॉगिन** — सरल पंजीकरण (नाम + फ़ोन)
- **दैनिक उपस्थिति** — एक क्लिक में उपस्थिति दर्ज करें और Zoom से जुड़ें
- **स्ट्रीक ट्रैकिंग** — लगातार उपस्थिति की गिनती
- **लीडरबोर्ड** — शीर्ष साधकों की सूची
- **आज का संदेश** — गौतम स्वामी की 5 दैनिक शिक्षाएं (सरप्राइज कार्ड)
- **एडमिन डैशबोर्ड** — उपस्थिति रुझान, निष्क्रिय सदस्य, सेटिंग्स
- **100% मुफ़्त** — Google Sheets + Vercel

---

## टेक स्टैक

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 + Tailwind CSS |
| Backend | Google Apps Script (Web App) |
| Database | Google Sheets |
| Hosting | Vercel (Free) |

---

## सेटअप गाइड (Setup Guide)

### चरण 1: Google Sheet बनाएं

1. [Google Sheets](https://sheets.google.com) पर जाएं
2. नई स्प्रेडशीट बनाएं: **"Gautam Ekta Sadhana Database"**
3. तीन शीट टैब बनाएं:

**MEMBERS** शीट (Row 1 headers):
```
ID | Name | Phone | JoinDate | TotalAttendance | CurrentStreak | LastAttendanceDate | Role
```

**ATTENDANCE** शीट (Row 1 headers):
```
UserID | Date | Status | Timestamp
```

**SETTINGS** शीट (Key-Value):
```
Key          | Value
ZoomLink     | https://zoom.us/j/YOUR_MEETING_ID
DailyBhaav   | अहिंसा परमो धर्मः
```

4. MEMBERS शीट में एक एडमिन row जोड़ें:
```
admin001 | Your Name | 9999999999 | 2026-04-09 | 0 | 0 |  | admin
```

### चरण 2: Google Apps Script Deploy करें

1. Google Sheet में: **Extensions → Apps Script** पर क्लिक करें
2. `google-apps-script/` फ़ोल्डर की सभी `.gs` फ़ाइलें यहाँ कॉपी करें:
   - `Code.gs` — मुख्य router (doGet/doPost)
   - `Auth.gs` — signup/login
   - `Attendance.gs` — उपस्थिति + streak logic
   - `Leaderboard.gs` — सॉर्टेड लीडरबोर्ड
   - `Admin.gs` — एडमिन stats + settings
   - `Utils.gs` — helper functions
3. **Deploy → New deployment** पर क्लिक करें
4. Type: **Web app** चुनें
5. Settings:
   - Execute as: **Me**
   - Who has access: **Anyone**
6. **Deploy** → URL कॉपी करें

### चरण 3: लोकल सेटअप

```bash
cd gautam-ekta-sadhana
npm install

# .env.local में अपना Apps Script URL डालें:
# NEXT_PUBLIC_GAS_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec

npm run dev
```

ब्राउज़र खोलें: http://localhost:3000

### चरण 4: Vercel पर Deploy करें

1. कोड को GitHub पर push करें
2. [Vercel](https://vercel.com) पर जाएं → **Import Project**
3. **Environment Variables** जोड़ें:
   - `NEXT_PUBLIC_GAS_URL` = आपका Apps Script URL
4. **Deploy** → कुछ सेकंड में लाइव!

### चरण 5: गुरुदेव की तस्वीर

`public/gurudev.png` फ़ाइल को अपनी गुरुदेव की तस्वीर से बदलें। फिर Vercel पर redeploy करें।

---

## डेटा फ़्लो

```
User (Browser)
    ↓ fetch (Content-Type: text/plain)
Next.js App (Vercel)
    ↓
Google Apps Script (Web App API)
    ↓
Google Sheets (Database)
```

---

## फ़ोल्डर संरचना

```
src/
├── app/              # pages (/, /signup, /dashboard, /leaderboard, /profile, /admin)
├── components/       # 11 UI components
├── lib/              # api.ts, auth.tsx, constants.ts, teachings.ts
└── hooks/            # useAuth

google-apps-script/   # backend code (paste into Apps Script editor)
```

---

## महत्वपूर्ण नोट्स

- **CORS:** Apps Script calls use `Content-Type: text/plain` to avoid preflight OPTIONS
- **Timezone:** सभी dates IST (Asia/Kolkata) में
- **Auth:** localStorage-based session (community app के लिए पर्याप्त)
- **Streak logic:** यदि last attendance == yesterday → streak++, अन्यथा streak = 1
- **Teachings:** 110 pre-loaded teachings, रोज़ 5 automatic रोटेट

---

> यह सिर्फ प्रार्थना नहीं… एकता का अनुभव है। 🙏
