// api.ts - All API calls to Google Apps Script backend

import { GAS_URL } from "./constants";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * POST to Google Apps Script.
 * CRITICAL: Uses Content-Type: text/plain to avoid CORS preflight (no OPTIONS request).
 * Uses redirect: 'follow' because GAS returns a 302 redirect.
 */
async function postToGAS<T = unknown>(
  action: string,
  data: Record<string, unknown> = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      redirect: "follow",
      body: JSON.stringify({ action, ...data }),
    });

    const result = await response.json();
    return result as ApiResponse<T>;
  } catch (error) {
    console.error(`[API] postToGAS "${action}" failed:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * GET from Google Apps Script with query parameters.
 * Uses redirect: 'follow' because GAS returns a 302 redirect.
 */
async function getFromGAS<T = unknown>(
  action: string,
  params: Record<string, string> = {}
): Promise<ApiResponse<T>> {
  try {
    const url = new URL(GAS_URL);
    url.searchParams.set("action", action);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    const response = await fetch(url.toString(), {
      method: "GET",
      redirect: "follow",
    });

    const result = await response.json();
    return result as ApiResponse<T>;
  } catch (error) {
    console.error(`[API] getFromGAS "${action}" failed:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface SignupData {
  id: string;
  name: string;
  phone: string;
  role: string;
  totalAttendance: number;
  currentStreak: number;
  lastAttendanceDate: string;
  joinDate: string;
  branch: string;
}

export async function signup(
  name: string,
  phone: string,
  role: string = "member",
  branch: string = ""
): Promise<ApiResponse<SignupData>> {
  return postToGAS<SignupData>("signup", { name, phone, role, branch });
}

export async function login(
  phone: string
): Promise<ApiResponse<SignupData>> {
  return postToGAS<SignupData>("login", { phone });
}

// ─── Attendance ──────────────────────────────────────────────────────────────

export interface AttendanceResult {
  marked: boolean;
  alreadyMarked?: boolean;
  totalAttendance: number;
  currentStreak: number;
  lastAttendanceDate: string;
}

export async function markAttendance(
  userId: string
): Promise<ApiResponse<AttendanceResult>> {
  return postToGAS<AttendanceResult>("markAttendance", { userId });
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export type LeaderboardPeriod = "daily" | "weekly" | "monthly" | "all";

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  branch: string;
  attendance: number;
  leaderName: string;
}

export async function getLeaderboard(
  period: LeaderboardPeriod = "all",
  branch: string = "all"
): Promise<ApiResponse<LeaderboardEntry[]>> {
  return getFromGAS<LeaderboardEntry[]>("getLeaderboard", { period, branch });
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  role: string;
  totalAttendance: number;
  currentStreak: number;
  lastAttendanceDate: string;
  joinDate: string;
  branch: string;
}

export async function getUserProfile(
  userId: string
): Promise<ApiResponse<UserProfile>> {
  return getFromGAS<UserProfile>("getUserProfile", { userId });
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export interface AdminDashboard {
  totalUsers: number;
  todayAttendance: number;
  activeStreaks: number;
  recentSignups: Array<{ name: string; joinDate: string }>;
}

export async function getAdminDashboard(): Promise<
  ApiResponse<AdminDashboard>
> {
  return getFromGAS<AdminDashboard>("getAdminDashboard");
}

// ─── Daily Content ───────────────────────────────────────────────────────────

export interface DailyBhaav {
  text: string;
  date: string;
}

export async function getDailyBhaav(): Promise<ApiResponse<DailyBhaav>> {
  return getFromGAS<DailyBhaav>("getDailyBhaav");
}

// ─── Settings ────────────────────────────────────────────────────────────────

export interface AppSettings {
  [key: string]: string | boolean | number;
}

export async function getSettings(): Promise<ApiResponse<AppSettings>> {
  return getFromGAS<AppSettings>("getSettings");
}

export async function updateSettings(
  userId: string,
  key: string,
  value: string
): Promise<ApiResponse<{ updated: boolean }>> {
  return postToGAS<{ updated: boolean }>("updateSettings", {
    userId,
    key,
    value,
  });
}

// ─── Today Count ─────────────────────────────────────────────────────────────

export interface TodayCount {
  count: number;
  date: string;
}

export async function getTodayCount(): Promise<ApiResponse<TodayCount>> {
  return getFromGAS<TodayCount>("getTodayCount");
}

// ─── Branch Attendance Report ─────────────────────────────────────────────────

export interface BranchAttendanceReport {
  period: string;
  branch: string;
  totalDays: number;
  dailyData: { date: string; count: number }[];
  userAttendance: {
    userId: string;
    name: string;
    attendedCount: number;
    totalDays: number;
    attendedDates: string[];
    currentStreak: number;
  }[];
  totalUniqueCount: number;
  totalAttendance: number;
  averagePercentage: number;
}

export async function getBranchAttendanceReport(
  branch: string,
  period: "weekly" | "monthly"
): Promise<ApiResponse<BranchAttendanceReport>> {
  return getFromGAS<BranchAttendanceReport>("getBranchAttendanceReport", {
    branch,
    period,
  });
}

// ─── Today Attendees ──────────────────────────────────────────────────────────

export interface TodayAttendeesResult {
  attendees: { userId: string; name: string }[];
  count: number;
  date: string;
}

export async function getTodayAttendees(): Promise<ApiResponse<TodayAttendeesResult>> {
  return getFromGAS<TodayAttendeesResult>("getTodayAttendees");
}
