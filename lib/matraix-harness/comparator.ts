import { MatraixEvaluationPayload, MatraixRubricWeights } from "./eval-schema";
import { DimensionalScores } from "@/types/submission";

export interface MatraixComparisonOutcome {
  dimensional_scores: DimensionalScores;
  normalized_total: number; // 0 to 10
  alignment_index: number;  // 0.0 to 1.0
  deductions: Array<{ dimension: string; points: number; reason: string }>;
}

export function evaluateMatraixPayloads(
  candidate: MatraixEvaluationPayload,
  groundTruth: MatraixEvaluationPayload,
  weights: MatraixRubricWeights = {
    correctness: 0.30,
    edge_cases: 0.25,
    complexity: 0.15,
    explanation: 0.15,
    communication: 0.15,
  }
): MatraixComparisonOutcome {
  const deductions: Array<{ dimension: string; points: number; reason: string }> = [];

  // 1. Correctness (0 to 10)
  let correctness = 10.0;
  if (candidate.verdict !== groundTruth.verdict) {
    if (groundTruth.verdict === "correct" && candidate.verdict !== "correct") {
      correctness -= 7.0; // Heavy false positive penalty
      deductions.push({ dimension: "correctness", points: 7.0, reason: "False positive penalty: Marked correct solution as flawed" });
    } else if (groundTruth.verdict === "major_bug" && candidate.verdict === "correct") {
      correctness -= 8.0; // False negative cap
      deductions.push({ dimension: "correctness", points: 8.0, reason: "False negative penalty: Missed critical fatal bug" });
    } else {
      correctness -= 3.0; // Minor vs major divergence
      deductions.push({ dimension: "correctness", points: 3.0, reason: "Severity divergence between minor and major" });
    }
  }

  // 2. Edge Cases (0 to 10)
  let edgeCases = 10.0;
  const gtEdgeBugs = groundTruth.bug_annotations.filter((b) => b.dimension === "edge_case");
  if (gtEdgeBugs.length > 0) {
    const candEdgeBugs = candidate.bug_annotations.filter((b) => b.dimension === "edge_case" || b.description.toLowerCase().includes("edge"));
    if (candEdgeBugs.length === 0) {
      edgeCases -= 6.0;
      deductions.push({ dimension: "edge_cases", points: 6.0, reason: "Failed to isolate breaking boundary input condition" });
    }
  }

  // 3. Complexity (0 to 10)
  let complexity = 10.0;
  const timeMatch = candidate.asymptotic_bounds.time.toLowerCase().replace(/\s+/g, "") === groundTruth.asymptotic_bounds.time.toLowerCase().replace(/\s+/g, "");
  const spaceMatch = candidate.asymptotic_bounds.space.toLowerCase().replace(/\s+/g, "") === groundTruth.asymptotic_bounds.space.toLowerCase().replace(/\s+/g, "");

  if (!timeMatch) {
    complexity -= 5.0;
    deductions.push({ dimension: "complexity", points: 5.0, reason: `Time complexity mismatch: expected ${groundTruth.asymptotic_bounds.time}` });
  }
  if (!spaceMatch) {
    complexity -= 4.0;
    deductions.push({ dimension: "complexity", points: 4.0, reason: `Space complexity mismatch: expected ${groundTruth.asymptotic_bounds.space}` });
  }

  // 4. Explanation (0 to 10)
  let explanation = 10.0;
  if (groundTruth.explanation_critique.is_accurate !== candidate.explanation_critique.is_accurate) {
    explanation -= 7.0;
    deductions.push({ dimension: "explanation", points: 7.0, reason: "Missed or falsely flagged AI explanation accuracy status" });
  }

  // 5. Communication (0 to 10)
  let communication = 8.5;
  const totalAnnotationLength = candidate.bug_annotations.reduce((acc, b) => acc + b.description.length, 0);
  if (totalAnnotationLength > 40) communication = 10.0;
  else if (totalAnnotationLength < 10) communication = 6.0;

  // Clamp 0-10
  correctness = Math.max(0, Math.min(10, correctness));
  edgeCases = Math.max(0, Math.min(10, edgeCases));
  complexity = Math.max(0, Math.min(10, complexity));
  explanation = Math.max(0, Math.min(10, explanation));
  communication = Math.max(0, Math.min(10, communication));

  const total =
    weights.correctness * correctness +
    weights.edge_cases * edgeCases +
    weights.complexity * complexity +
    weights.explanation * explanation +
    weights.communication * communication;

  return {
    dimensional_scores: {
      correctness: Number(correctness.toFixed(1)),
      edge_cases: Number(edgeCases.toFixed(1)),
      complexity: Number(complexity.toFixed(1)),
      explanation: Number(explanation.toFixed(1)),
      communication: Number(communication.toFixed(1)),
    },
    normalized_total: Number(total.toFixed(1)),
    alignment_index: Number((total / 10).toFixed(2)),
    deductions,
  };
}
