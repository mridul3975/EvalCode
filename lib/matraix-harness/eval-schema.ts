import { Verdict, IssueSeverity, IssueDimension } from "@/types/question";

export interface MatraixEvaluationPayload {
  evaluation_id: string;
  target_id: string;
  evaluator_persona: "human_reviewer" | "ground_truth_oracle";
  verdict: Verdict;
  defect_tags: string[];
  bug_annotations: Array<{
    line_start: number;
    line_end: number;
    severity: IssueSeverity;
    dimension: IssueDimension;
    description: string;
  }>;
  asymptotic_bounds: {
    time: string;
    space: string;
  };
  explanation_critique: {
    is_accurate: boolean;
    hallucination_notes?: string;
  };
  remediation_proposal?: string;
}

export interface MatraixRubricWeights {
  correctness: number;    // default 0.30
  edge_cases: number;     // default 0.25
  complexity: number;     // default 0.15
  explanation: number;    // default 0.15
  communication: number;  // default 0.15
}
