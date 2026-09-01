import { EvaluationSubmission, EvaluationResult, AssessmentSession, UserProfileStats } from "@/types/submission";
import { DEFAULT_PROFILE_STATS, updateProfileWithEvaluation } from "@/lib/core/profile-analytics";

const KEYS = {
  SUBMISSIONS: "evalforge_submissions_v2",
  ASSESSMENT_ACTIVE: "evalforge_assessment_active_v2",
  ASSESSMENT_HISTORY: "evalforge_assessment_history_v2",
  PROFILE: "evalforge_user_profile_v2",
  BOOKMARKS: "evalforge_bookmarks_v2",
};

// Automatically purge legacy pre-seeded localStorage cache
if (typeof window !== "undefined") {
  try {
    const legacyKeys = [
      "evalforge_submissions",
      "evalforge_assessment_active",
      "evalforge_assessment_history",
      "evalforge_user_profile",
      "evalforge_bookmarks",
    ];
    legacyKeys.forEach((k) => localStorage.removeItem(k));
  } catch (e) {
    // Ignore storage exceptions
  }
}

// Safe localStorage access for SSR
function isClient(): boolean {
  return typeof window !== "undefined";
}

/**
 * Fetch and sync cloud database profile into local storage
 */
export async function syncFromDatabase(): Promise<UserProfileStats> {
  if (!isClient()) return DEFAULT_PROFILE_STATS;
  try {
    const res = await fetch("/api/profile");
    if (res.ok) {
      const cloudProfile = await res.json();
      localStorage.setItem(KEYS.PROFILE, JSON.stringify(cloudProfile));
      return cloudProfile;
    }
  } catch (e) {
    console.error("Failed to sync profile from Neon DB", e);
  }
  return getStoredProfile();
}

export function getStoredSubmissions(): Record<string, { submission: EvaluationSubmission; result: EvaluationResult }> {
  if (!isClient()) return {};
  try {
    const raw = localStorage.getItem(KEYS.SUBMISSIONS);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error("Failed to load submissions from localStorage", e);
    return {};
  }
}

export function saveStoredSubmission(
  questionId: string,
  submission: EvaluationSubmission,
  result: EvaluationResult,
  topic?: string,
  defect?: string
): void {
  if (!isClient()) return;
  try {
    const all = getStoredSubmissions();
    all[questionId] = { submission, result };
    localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(all));

    // Update user profile statistics
    const profile = getStoredProfile();
    const updatedProfile = updateProfileWithEvaluation(profile, result, false, topic, defect);
    saveStoredProfile(updatedProfile);

    // Asynchronously sync with Neon Postgres backend
    fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId, submission, result, topic, defect }),
    }).catch((err) => console.error("Async submission cloud sync failed:", err));
  } catch (e) {
    console.error("Failed to save submission to localStorage", e);
  }
}

export function getActiveAssessmentSession(): AssessmentSession | null {
  if (!isClient()) return null;
  try {
    const raw = localStorage.getItem(KEYS.ASSESSMENT_ACTIVE);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("Failed to load active assessment session", e);
    return null;
  }
}

export function saveActiveAssessmentSession(session: AssessmentSession | null): void {
  if (!isClient()) return;
  try {
    if (!session) {
      localStorage.removeItem(KEYS.ASSESSMENT_ACTIVE);
    } else {
      localStorage.setItem(KEYS.ASSESSMENT_ACTIVE, JSON.stringify(session));
    }
  } catch (e) {
    console.error("Failed to save active assessment session", e);
  }
}

export function getAssessmentHistory(): AssessmentSession[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(KEYS.ASSESSMENT_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to load assessment history", e);
    return [];
  }
}

export function saveCompletedAssessment(session: AssessmentSession): void {
  if (!isClient()) return;
  try {
    const history = getAssessmentHistory();
    history.unshift(session);
    localStorage.setItem(KEYS.ASSESSMENT_HISTORY, JSON.stringify(history));

    // Clear active session
    saveActiveAssessmentSession(null);

    // Update profile with mock results
    if (session.results) {
      let profile = getStoredProfile();
      Object.values(session.results).forEach((res) => {
        profile = updateProfileWithEvaluation(profile, res, true);
      });
      saveStoredProfile(profile);
    }

    // Asynchronously sync mock session with Neon Postgres backend
    fetch("/api/assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(session),
    }).catch((err) => console.error("Async assessment cloud sync failed:", err));
  } catch (e) {
    console.error("Failed to save completed assessment", e);
  }
}

export function getStoredProfile(): UserProfileStats {
  if (!isClient()) return DEFAULT_PROFILE_STATS;
  try {
    const raw = localStorage.getItem(KEYS.PROFILE);
    return raw ? JSON.parse(raw) : DEFAULT_PROFILE_STATS;
  } catch (e) {
    console.error("Failed to load profile from localStorage", e);
    return DEFAULT_PROFILE_STATS;
  }
}

export function saveStoredProfile(profile: UserProfileStats): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));

    // Asynchronously sync profile with Neon Postgres backend
    fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    }).catch((err) => console.error("Async profile cloud sync failed:", err));
  } catch (e) {
    console.error("Failed to save profile to localStorage", e);
  }
}

export function getBookmarks(): string[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(KEYS.BOOKMARKS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function toggleBookmark(questionId: string): string[] {
  if (!isClient()) return [];
  try {
    const current = getBookmarks();
    const updated = current.includes(questionId)
      ? current.filter((id) => id !== questionId)
      : [...current, questionId];
    localStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(updated));

    // Asynchronously sync bookmark toggle with Neon Postgres backend
    fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId }),
    }).catch((err) => console.error("Async bookmark cloud sync failed:", err));

    return updated;
  } catch (e) {
    return [];
  }
}

export function clearAllProgress(): void {
  if (!isClient()) return;
  try {
    const allKeys = [
      KEYS.SUBMISSIONS,
      KEYS.ASSESSMENT_ACTIVE,
      KEYS.ASSESSMENT_HISTORY,
      KEYS.PROFILE,
      KEYS.BOOKMARKS,
      "evalforge_submissions",
      "evalforge_assessment_active",
      "evalforge_assessment_history",
      "evalforge_user_profile",
      "evalforge_bookmarks",
    ];
    allKeys.forEach((k) => localStorage.removeItem(k));

    // Also reset in cloud Neon DB
    fetch("/api/profile", { method: "DELETE" }).catch(() => {});
    fetch("/api/submissions", { method: "DELETE" }).catch(() => {});
    fetch("/api/assessment", { method: "DELETE" }).catch(() => {});
    fetch("/api/bookmarks", { method: "DELETE" }).catch(() => {});
  } catch (e) {
    console.error("Failed to clear progress from localStorage", e);
  }
}
