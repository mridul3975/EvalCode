import {
  OAAssessmentResult,
  OAMultiAssessmentResult,
  OAMultiAssessmentSession,
} from "@/types/oa";

const OA_RESULTS_KEY = "evalforge_oa_results";
const OA_MULTI_RESULTS_KEY = "evalforge_oa_multi_results";
const OA_ACTIVE_SESSION_KEY = "evalforge_oa_active_session";
const OA_ACTIVE_MULTI_SESSION_KEY = "evalforge_oa_active_multi_session";

// Legacy single-problem session
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

// ----------------------------------------------------------------------------
// Multi-Question Online Assessment Sessions (HackerRank & CodeSignal Standard)
// ----------------------------------------------------------------------------

export function saveActiveMultiSession(session: OAMultiAssessmentSession): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(OA_ACTIVE_MULTI_SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.error("Error saving active multi-problem OA session:", e);
  }
}

export function getActiveMultiSession(): OAMultiAssessmentSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(OA_ACTIVE_MULTI_SESSION_KEY);
    if (!raw) return null;
    const parsed: OAMultiAssessmentSession = JSON.parse(raw);
    return parsed;
  } catch {
    return null;
  }
}

export function clearActiveMultiSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(OA_ACTIVE_MULTI_SESSION_KEY);
}

/**
 * Calculates remaining countdown time against the fixed absolute deadline:
 * startedAt + (totalTimeAllocatedSeconds * 1000) - Date.now()
 * Refreshing the browser cannot reset the clock.
 */
export function calculateRemainingSeconds(session: OAMultiAssessmentSession): number {
  const deadline = session.startedAt + session.totalTimeAllocatedSeconds * 1000;
  const remainingMs = deadline - Date.now();
  return Math.max(0, Math.floor(remainingMs / 1000));
}

// ----------------------------------------------------------------------------
// Results Storage
// ----------------------------------------------------------------------------

export function saveMultiOAResult(result: OAMultiAssessmentResult): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getMultiOAResults();
    existing[result.id] = result;
    localStorage.setItem(OA_MULTI_RESULTS_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error("Error saving multi-OA result:", e);
  }
}

export function getMultiOAResults(): Record<string, OAMultiAssessmentResult> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(OA_MULTI_RESULTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getMultiOAResultById(id: string): OAMultiAssessmentResult | null {
  const all = getMultiOAResults();
  return all[id] || null;
}

// Backward-compatible single problem results
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
