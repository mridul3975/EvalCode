export type CompanyProfile = "Citadel" | "Google" | "Meta" | "Fintech" | "Two Sigma";

export type OALanguage = "python" | "typescript" | "cpp";

export type HiringBarVerdict = "STRONG_PASS" | "PASS" | "BORDERLINE" | "FAIL";

export type OAPhase = "code" | "explanation" | "followups";

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

export interface OAFollowUpQuestion {
  id: string;
  category: "scale_and_constraints" | "edge_case_and_stability" | "complexity_reduction" | "architecture_tradeoffs";
  question: string;
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
