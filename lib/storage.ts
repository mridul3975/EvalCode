import { EvaluationSubmission, EvaluationResult, AssessmentSession, UserProfileStats } from "@/types/submission";
import { DEFAULT_PROFILE_STATS, updateProfileWithEvaluation } from "@/lib/core/profile-analytics";

const KEYS = {
  SUBMISSIONS: "evalforge_submissions",
  ASSESSMENT_ACTIVE: "evalforge_assessment_active",
  ASSESSMENT_HISTORY: "evalforge_assessment_history",
  PROFILE: "evalforge_user_profile",
  BOOKMARKS: "evalforge_bookmarks",
};

// Safe localStorage access for SSR
function isClient(): boolean {
  return typeof window !== "undefined";
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
    return updated;
  } catch (e) {
    return [];
  }
}
