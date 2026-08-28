import { QuestionItem } from "@/types/question";
import { EvaluationSubmission, EvaluationResult } from "@/types/submission";
import { computeDiscrepancyDiff } from "@/lib/core/discrepancy-diff";
import { MatraixEvaluationPayload } from "@/lib/matraix-harness/eval-schema";
import { evaluateMatraixPayloads } from "@/lib/matraix-harness/comparator";

export function evaluateSubmission(
  submission: EvaluationSubmission,
  question: QuestionItem
): EvaluationResult {
  const groundTruth = question.ground_truth;

  // 1. Run Discrepancy Diff Engine
  const discrepancy = computeDiscrepancyDiff(submission, groundTruth);

  // 2. Convert to MatrAIx evaluation schemas
  const candidatePayload: MatraixEvaluationPayload = {
    evaluation_id: submission.submission_id || `sub_${Date.now()}`,
    target_id: question.id,
    evaluator_persona: "human_reviewer",
    verdict: submission.verdict,
    defect_tags: submission.selected_defect_types || [],
    bug_annotations: (submission.reported_bugs || []).map((b) => ({
      line_start: b.line_reference || 1,
      line_end: b.line_reference || 1,
      severity: b.severity,
      dimension: "correctness",
      description: b.description,
    })),
    asymptotic_bounds: {
      time: submission.assessed_complexity?.time || "O(1)",
      space: submission.assessed_complexity?.space || "O(1)",
    },
    explanation_critique: {
      is_accurate: submission.explanation_audit?.is_accurate ?? true,
      hallucination_notes: submission.explanation_audit?.notes,
    },
    remediation_proposal: submission.suggested_fix,
  };

  const hasExplanationBug =
    groundTruth.error_categories.includes("deceptive_explanation") ||
    (groundTruth.error_categories as string[]).includes("hallucinated_explanation") ||
    groundTruth.expected_issues.some((i) => i.dimension === "explanation");

  const gtPayload: MatraixEvaluationPayload = {
    evaluation_id: `gt_${question.id}`,
    target_id: question.id,
    evaluator_persona: "ground_truth_oracle",
    verdict: groundTruth.verdict,
    defect_tags: groundTruth.error_categories || [],
    bug_annotations: (groundTruth.expected_issues || []).map((i) => ({
      line_start: i.line_numbers[0] || 1,
      line_end: i.line_numbers[i.line_numbers.length - 1] || 1,
      severity: i.severity,
      dimension: i.dimension,
      description: i.description,
    })),
    asymptotic_bounds: {
      time: groundTruth.optimal_complexity?.time || (groundTruth as any).actual_time_complexity || "",
      space: groundTruth.optimal_complexity?.space || (groundTruth as any).actual_space_complexity || "",
    },
    explanation_critique: {
      is_accurate: !hasExplanationBug,
      hallucination_notes: hasExplanationBug ? "Contains misleading or hallucinated claims" : undefined,
    },
    remediation_proposal: groundTruth.corrected_code,
  };

  // 3. Compute MatrAIx comparison
  const matraixOutcome = evaluateMatraixPayloads(candidatePayload, gtPayload);

  // 4. Debugging & Communication scores
  const debuggingScore = submission.suggested_fix && submission.suggested_fix.length > 20
    ? (submission.verdict === groundTruth.verdict ? 9.5 : 7.0)
    : (groundTruth.verdict === "correct" ? 10.0 : 6.0);

  const finalDimScores = {
    correctness: matraixOutcome.dimensional_scores.correctness,
    edge_cases: matraixOutcome.dimensional_scores.edge_cases,
    complexity: matraixOutcome.dimensional_scores.complexity,
    explanation: matraixOutcome.dimensional_scores.explanation,
    communication: matraixOutcome.dimensional_scores.communication ?? 8.0,
    debugging: debuggingScore,
  };

  // 5. Total overall score (0 to 10) matching PRD weights:
  // Total = 0.30(Correctness) + 0.25(EdgeCases) + 0.15(Complexity) + 0.15(Explanation) + 0.15(Communication)
  const totalScore = Number(
    (
      0.30 * finalDimScores.correctness +
      0.25 * finalDimScores.edge_cases +
      0.15 * finalDimScores.complexity +
      0.15 * finalDimScores.explanation +
      0.15 * finalDimScores.communication
    ).toFixed(1)
  );

  return {
    submission_id: candidatePayload.evaluation_id,
    question_id: question.id,
    overall_score: totalScore,
    verdict_accuracy: discrepancy.verdictAccuracy,
    dimensional_scores: finalDimScores,
    matched_issues: discrepancy.matchedIssues,
    missed_issues: discrepancy.missedIssues,
    hallucinated_issues: discrepancy.hallucinatedIssues,
    discrepancy_items: discrepancy.discrepancyItems,
    feedback_summary: discrepancy.feedbackSummary,
    corrected_code_diff: {
      buggy: question.ai_response.code,
      corrected: groundTruth.corrected_code,
    },
    created_at: new Date().toISOString(),
  };
}
