import { OAAssessmentResult, OASubmissionPayload } from "@/types/oa";

const OA_RESULTS_KEY = "evalforge_oa_results";
const OA_ACTIVE_SESSION_KEY = "evalforge_oa_active_session";

export interface OAActiveSession {
  problemId: string;
  language: string;
  code: string;
  timeRemainingSeconds: number;
  phase: "code" | "explanation" | "followups";
  approachExplanation: string;
  claimedTimeComplexity: string;
  claimedSpaceComplexity: string;
  startTime: number;
}

export function saveActiveOASession(session: OAActiveSession): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(OA_ACTIVE_SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.error("Error saving active OA session:", e);
  }
}

export function getActiveOASession(): OAActiveSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(OA_ACTIVE_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearActiveOASession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(OA_ACTIVE_SESSION_KEY);
}

export function saveOAResult(result: OAAssessmentResult): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getOAResults();
    existing[result.id] = result;
    localStorage.setItem(OA_RESULTS_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error("Error saving OA result:", e);
  }
}

export function getOAResults(): Record<string, OAAssessmentResult> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(OA_RESULTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getOAResultById(id: string): OAAssessmentResult | null {
  const all = getOAResults();
  return all[id] || null;
}
