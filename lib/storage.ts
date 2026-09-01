import { EvaluationSubmission, EvaluationResult, AssessmentSession, UserProfileStats } from "@/types/submission";
import { QuestionItem } from "@/types/question";
import { DEFAULT_PROFILE_STATS, updateProfileWithEvaluation } from "@/lib/core/profile-analytics";

const KEYS = {
  SUBMISSIONS: "evalforge_submissions_v2",
  ASSESSMENT_ACTIVE: "evalforge_assessment_active_v2",
  ASSESSMENT_HISTORY: "evalforge_assessment_history_v2",
  PROFILE: "evalforge_user_profile_v2",
  BOOKMARKS: "evalforge_bookmarks_v2",
  CUSTOM_QUESTIONS: "evalforge_custom_questions_v2",
};

// Safe localStorage access for SSR
function isClient(): boolean {
  return typeof window !== "undefined";
}

/**
 * Custom Questions Management
 */
export function getCustomQuestions(): QuestionItem[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(KEYS.CUSTOM_QUESTIONS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to load custom questions from localStorage", e);
    return [];
  }
}

export function saveCustomQuestion(question: QuestionItem): QuestionItem[] {
  if (!isClient()) return [];
  try {
    const existing = getCustomQuestions();
    const updated = [question, ...existing.filter((q) => q.id !== question.id)];
    localStorage.setItem(KEYS.CUSTOM_QUESTIONS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to save custom question to localStorage", e);
    return [];
  }
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
  topicKey?: string,
  defectKey?: string
): void {
  if (!isClient()) return;
  try {
    const currentSubmissions = getStoredSubmissions();
    currentSubmissions[questionId] = { submission, result };
    localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(currentSubmissions));

    // Update profile stats
    const currentProfile = getStoredProfile();
    const updatedProfile = updateProfileWithEvaluation(
      currentProfile,
      result,
      false,
      topicKey,
      defectKey
    );

    localStorage.setItem(KEYS.PROFILE, JSON.stringify(updatedProfile));

    // Sync cloud API in background
    fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId, submission, result }),
    }).catch(() => {});
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
    return null;
  }
}

export function saveActiveAssessmentSession(session: AssessmentSession): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(KEYS.ASSESSMENT_ACTIVE, JSON.stringify(session));
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
    return [];
  }
}

export function saveCompletedAssessment(session: AssessmentSession): void {
  if (!isClient()) return;
  try {
    const history = getAssessmentHistory();
    const updatedHistory = [session, ...history];
    localStorage.setItem(KEYS.ASSESSMENT_HISTORY, JSON.stringify(updatedHistory));
    localStorage.removeItem(KEYS.ASSESSMENT_ACTIVE);

    // Sync cloud API
    fetch("/api/assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session }),
    }).catch(() => {});
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
    return DEFAULT_PROFILE_STATS;
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

export function clearAllProgress(): void {
  if (!isClient()) return;
  try {
    localStorage.removeItem(KEYS.SUBMISSIONS);
    localStorage.removeItem(KEYS.ASSESSMENT_ACTIVE);
    localStorage.removeItem(KEYS.ASSESSMENT_HISTORY);
    localStorage.removeItem(KEYS.PROFILE);
    localStorage.removeItem(KEYS.BOOKMARKS);
  } catch (e) {
    console.error("Failed to clear progress", e);
  }
}
