import { Verdict, IssueSeverity } from "./question";

export interface ReportedBug {
  id?: string;
  line_reference?: number;
  severity: IssueSeverity;
  description: string;
}

export interface FailingTestCase {
  input: string;
  expected: string;
  actual: string;
}

export interface AssessedComplexity {
  time: string;
  space: string;
  notes?: string;
  justification?: string;
}

export interface ExplanationAudit {
  is_accurate: boolean;
  notes?: string;
  discrepancy_notes?: string;
}

export interface InstructionCompliance {
  is_compliant: boolean;
  notes?: string;
}

export interface EvaluationSubmission {
  submission_id?: string;
  question_id: string;
  user_id?: string;
  mode?: "practice" | "mock";
  verdict: Verdict;
  selected_defect_types?: string[];
  reported_bugs: ReportedBug[];
  failing_test_cases: FailingTestCase[];
  assessed_complexity: AssessedComplexity;
  explanation_audit: ExplanationAudit;
  instruction_compliance?: InstructionCompliance;
  suggested_fix?: string;
  created_at?: string;
}

export interface DimensionalScores {
  correctness: number;      // 0 to 10 or 0 to 100
  edge_cases: number;       // 0 to 10 or 0 to 100
  complexity: number;       // 0 to 10 or 0 to 100
  explanation: number;      // 0 to 10 or 0 to 100
  communication?: number;   // 0 to 10 or 0 to 100
  debugging?: number;       // 0 to 10 or 0 to 100
}

export interface DiscrepancyItem {
  id: string;
  status: "matched" | "missed" | "hallucinated";
  category: "verdict" | "bug" | "edge_case" | "complexity" | "explanation" | "instruction";
  severity?: IssueSeverity;
  user_finding?: string;
  ground_truth_item?: string;
  explanation: string;
  why_it_matters?: string;
}

export interface EvaluationResult {
  submission_id?: string;
  question_id: string;
  overall_score: number; // 0 to 10 (or 0 to 100)
  verdict_accuracy: boolean;
  dimensional_scores: DimensionalScores;
  matched_issues: string[];
  missed_issues: string[];
  hallucinated_issues: string[];
  discrepancy_items: DiscrepancyItem[];
  feedback_summary: string;
  corrected_code_diff?: {
    buggy: string;
    corrected: string;
  };
  created_at: string;
}

export interface AssessmentSession {
  id: string;
  start_time: number;
  duration_seconds: number;
  remaining_seconds: number;
  question_ids: string[];
  active_question_index: number;
  flagged_questions: string[];
  submissions: Record<string, EvaluationSubmission>;
  results?: Record<string, EvaluationResult>;
  is_completed: boolean;
  completed_at?: string;
  total_score?: number;
  composite_readiness?: number;
  readiness_tier?: "Ready" | "Borderline" | "Needs Practice" | "Not Ready";
}

export interface UserProfileStats {
  readiness_score: number;
  verdict_accuracy: number;
  total_evaluations_count: number;
  total_mocks_count: number;
  mock_average_score: number;
  practice_average_score: number;
  current_streak_days: number;
  best_streak_days: number;
  last_active_at: string;
  dimensional_mastery: {
    correctness: number;
    edge_cases: number;
    complexity: number;
    explanation: number;
    communication: number;
    debugging: number;
  };
  dimensional_deltas: {
    correctness: number;
    edge_cases: number;
    complexity: number;
    explanation: number;
    communication: number;
    debugging: number;
  };
  topic_stats: Record<string, { attempts: number; avg_score: number }>;
  defect_stats: Record<string, { attempts: number; detection_rate: number }>;
}
