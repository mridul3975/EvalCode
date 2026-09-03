export type CompanyProfile = "Citadel" | "Google" | "Meta" | "Fintech" | "Two Sigma" | "Amazon";

export type OALanguage = "python" | "typescript" | "cpp";

export type HiringBarVerdict = "STRONG_PASS" | "PASS" | "BORDERLINE" | "FAIL";

export type OAPhase = "workspace" | "code" | "explanation" | "followups";

export type QuestionSubmissionState = "NOT_STARTED" | "IN_PROGRESS" | "TESTS_PASSING" | "SUBMITTED";

export type OASessionStatus = "IN_PROGRESS" | "SUBMITTED" | "EXPIRED";

export interface OATestCase {
  id: string;
  description: string;
  input: string; // JSON or representation of inputs
  rawInputArgs?: any[]; // actual args for runner
  expected: any;
  isHidden?: boolean;
}

export interface OATestResult {
  testCaseId: string;
  description: string;
  passed: boolean;
  actual: any;
  expected: any;
  executionTimeMs: number;
  error?: string;
  stdout?: string;
  isHidden?: boolean;
}

export interface OAProblem {
  id: string;
  title: string;
  companyProfile: CompanyProfile;
  difficulty: "Medium" | "Hard";
  topic: string;
  tags: string[];
  description: string;
  constraints: string[];
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  functionName: string;
  starterCode: Record<OALanguage, string>;
  testCases: OATestCase[];
  optimalComplexity: {
    time: string;
    space: string;
    reasoning: string;
  };
}

export interface OACompanyTrack {
  id: string;
  companyProfile: CompanyProfile;
  title: string;
  subtitle: string;
  description: string;
  totalTimeSeconds: number; // e.g. 4500 (75m), 4800 (80m), 5400 (90m)
  problemIds: string[];
  problemWeights: Record<string, number>; // problemId -> points (sum = 100)
  tags: string[];
}

export interface OAQuestionState {
  problemId: string;
  code: string;
  language: OALanguage;
  visibleTestsPassed: number;
  visibleTestsTotal: number;
  hiddenTestsPassed: number;
  hiddenTestsTotal: number;
  status: QuestionSubmissionState;
  testResults: OATestResult[];
  approach: string;
  claimedTime: string;
  claimedSpace: string;
  lastRunAt?: number;
}

export interface OAMultiAssessmentSession {
  sessionId: string;
  trackId: string;
  companyProfile: CompanyProfile;
  trackTitle: string;
  startedAt: number; // Date.now() timestamp
  totalTimeAllocatedSeconds: number;
  activeProblemId: string;
  questions: Record<string, OAQuestionState>;
  status: OASessionStatus;
  phase: OAPhase;
  followUpQuestions?: OAFollowUpQuestion[];
  followUpResponses?: Record<string, string>;
  completedAt?: number;
}

export interface OAFollowUpQuestion {
  id: string;
  category: "scale_and_constraints" | "edge_case_and_stability" | "complexity_reduction" | "architecture_tradeoffs";
  question: string;
  targetProblemTitle?: string;
}

export interface OAFollowUpResponse {
  questionId: string;
  category: string;
  question: string;
  userAnswer: string;
  score?: number; // 0-100
  feedback?: string;
}

export interface OASubmissionPayload {
  problemId: string;
  companyProfile: CompanyProfile;
  submittedCode: string;
  language: OALanguage;
  timeSpentSeconds: number;
  testResults: OATestResult[];
  testsPassed: number;
  totalTests: number;
  approachExplanation: string;
  claimedTimeComplexity: string;
  claimedSpaceComplexity: string;
  followUpResponses: OAFollowUpResponse[];
}

export interface OAQuestionEvaluationResult {
  orderIndex: number;
  problemId: string;
  problemTitle: string;
  difficulty: "Medium" | "Hard";
  topic: string;
  weight: number;
  questionScore: number; // out of weight
  visibleTestsPassed: number;
  visibleTestsTotal: number;
  hiddenTestsPassed: number;
  hiddenTestsTotal: number;
  testResults: OATestResult[];
  submittedCode: string;
  language: OALanguage;
  approachSummary: string;
  timeComplexity: string;
  spaceComplexity: string;
  critique: string;
}

export interface OAMultiAssessmentResult {
  id: string;
  sessionId: string;
  userId: string;
  trackId: string;
  trackTitle: string;
  companyProfile: CompanyProfile;
  totalTimeAllocatedSeconds: number;
  timeSpentSeconds: number;
  status: OASessionStatus;
  overallScore: number; // 0-100
  correctnessScore: number;
  qualityScore: number;
  complexityScore: number;
  communicationScore: number;
  hiringBarVerdict: HiringBarVerdict;
  totalTestsPassed: number;
  totalTestsCount: number;
  questions: OAQuestionEvaluationResult[];
  geminiFollowUps: OAFollowUpResponse[];
  barRaiserCritique: {
    summary: string;
    codeSmells: string[];
    asymptoticAnalysis: string;
    idiomaticQuality: string;
    strengths: string[];
    improvements: string[];
  };
  createdAt: string;
}

// Backward-compatible single assessment result
export interface OAAssessmentResult {
  id: string;
  userId: string;
  problemId: string;
  companyProfile: CompanyProfile;
  problemTitle: string;
  submittedCode: string;
  language: OALanguage;
  testsPassed: number;
  totalTests: number;
  timeSpentSeconds: number;
  approachExplanation: string;
  claimedTimeComplexity: string;
  claimedSpaceComplexity: string;
  geminiFollowUps: OAFollowUpResponse[];
  overallScore: number;
  correctnessScore: number;
  qualityScore: number;
  complexityScore: number;
  communicationScore: number;
  hiringBarVerdict: HiringBarVerdict;
  testResults: OATestResult[];
  barRaiserCritique: {
    summary: string;
    codeSmells: string[];
    asymptoticAnalysis: string;
    idiomaticQuality: string;
    strengths: string[];
    improvements: string[];
  };
  createdAt: string;
}
