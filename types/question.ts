export type QuestionTopic =
  | "arrays"
  | "strings"
  | "linked_lists"
  | "trees"
  | "graphs"
  | "dp"
  | "recursion"
  | "backtracking"
  | "stacks_queues"
  | "heaps"
  | "intervals"
  | "greedy"
  | "binary_search"
  | "concurrency"
  | "sql";

export type QuestionDifficulty = "easy" | "medium" | "hard";

export type QuestionLanguage = "python" | "javascript" | "cpp" | "java" | "sql";

export type Verdict = "correct" | "minor_issue" | "major_bug";

export type DefectCategory =
  | "completely_correct"
  | "subtle_logic_bug"
  | "edge_case_blindness"
  | "complexity_regression"
  | "minor_style_quality"
  | "deceptive_explanation"
  | "instruction_mismatch"
  | "pointer_bug"
  | "edge_case"
  | "clean";

export type IssueSeverity = "critical" | "major" | "minor" | "nit";

export type IssueDimension =
  | "correctness"
  | "edge_case"
  | "complexity"
  | "instruction"
  | "explanation"
  | "communication"
  | "debugging";

export interface ExpectedIssue {
  id: string;
  severity: IssueSeverity;
  dimension: IssueDimension;
  line_numbers: number[];
  description: string;
  failing_input_example?: string;
  why_it_matters?: string;
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface ProblemStatement {
  title?: string;
  description: string;
  constraints: string[];
  examples: ProblemExample[];
}

export interface AIResponse {
  code: string;
  stated_explanation: string;
  stated_time_complexity: string;
  stated_space_complexity: string;
}

export interface OptimalComplexity {
  time: string;
  space: string;
  reasoning: string;
}

export interface GroundTruth {
  verdict: Verdict;
  defect_type?: DefectCategory;
  error_categories: DefectCategory[];
  expected_issues: ExpectedIssue[];
  optimal_complexity: OptimalComplexity;
  corrected_code: string;
  model_critique_summary: string;
  why_it_matters_note?: string;
}

export interface LanguageVariant {
  code: string;
  corrected_code: string;
}

export interface QuestionItem {
  id: string;
  title: string;
  topic: QuestionTopic;
  difficulty: QuestionDifficulty;
  language: QuestionLanguage;
  problem_statement: ProblemStatement;
  ai_response: AIResponse;
  ground_truth: GroundTruth;
  language_variants?: Partial<Record<QuestionLanguage, LanguageVariant>>;
}
