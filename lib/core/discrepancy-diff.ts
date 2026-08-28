import { GroundTruth, ExpectedIssue } from "@/types/question";
import { EvaluationSubmission, DiscrepancyItem } from "@/types/submission";
import { normalizeComplexity } from "@/lib/utils";

export interface DiscrepancyResult {
  verdictAccuracy: boolean;
  matchedIssues: string[];
  missedIssues: string[];
  hallucinatedIssues: string[];
  discrepancyItems: DiscrepancyItem[];
  feedbackSummary: string;
}

export function computeDiscrepancyDiff(
  submission: EvaluationSubmission,
  groundTruth: GroundTruth
): DiscrepancyResult {
  const discrepancyItems: DiscrepancyItem[] = [];
  const matchedIssues: string[] = [];
  const missedIssues: string[] = [];
  const hallucinatedIssues: string[] = [];

  // 1. Verdict Analysis
  const isVerdictExact = submission.verdict === groundTruth.verdict;
  const isVerdictCompatible =
    isVerdictExact ||
    (groundTruth.verdict === "major_bug" && submission.verdict === "minor_issue") ||
    (groundTruth.verdict === "minor_issue" && submission.verdict === "major_bug");

  if (isVerdictExact) {
    discrepancyItems.push({
      id: "disc_verdict_match",
      status: "matched",
      category: "verdict",
      user_finding: `Verdict: ${submission.verdict.toUpperCase().replace("_", " ")}`,
      ground_truth_item: `Expected: ${groundTruth.verdict.toUpperCase().replace("_", " ")}`,
      explanation: `Exact verdict match! You correctly determined that this solution is ${groundTruth.verdict.replace("_", " ")}.`,
      why_it_matters: "Correctly assessing binary functional soundness is the first gate in any code evaluation rubric.",
    });
  } else if (isVerdictCompatible) {
    discrepancyItems.push({
      id: "disc_verdict_partial",
      status: "missed",
      category: "verdict",
      user_finding: `Verdict: ${submission.verdict.toUpperCase().replace("_", " ")}`,
      ground_truth_item: `Expected: ${groundTruth.verdict.toUpperCase().replace("_", " ")}`,
      explanation: `Partially aligned verdict: You classified the solution as ${submission.verdict.replace("_", " ")}, but the expert assessment graded it as ${groundTruth.verdict.replace("_", " ")}.`,
      why_it_matters: "Severity calibration matters: distinguishing fatal crashes from non-fatal sub-optimality impacts project tier ratings.",
    });
  } else {
    // Completely wrong (e.g. said Correct for a Major Bug, or Major Bug for Clean Code)
    const isFalsePositive = groundTruth.verdict === "correct" && submission.verdict !== "correct";
    discrepancyItems.push({
      id: "disc_verdict_mismatch",
      status: isFalsePositive ? "hallucinated" : "missed",
      category: "verdict",
      user_finding: `Verdict: ${submission.verdict.toUpperCase().replace("_", " ")}`,
      ground_truth_item: `Expected: ${groundTruth.verdict.toUpperCase().replace("_", " ")}`,
      explanation: isFalsePositive
        ? "False Positive: You marked a completely correct and optimal implementation as defective."
        : "False Negative: You marked a solution containing critical bugs as correct.",
      why_it_matters: isFalsePositive
        ? "Bug-hunting bias leads evaluators to reject valid AI responses, creating severe review noise."
        : "Missing fatal bugs allows broken AI code to be pushed to production or benchmarked positively.",
    });
  }

  // 2. Expected Issues Matching (Semantic & Line Proximity)
  const expectedIssues = groundTruth.expected_issues || [];
  const reportedBugs = submission.reported_bugs || [];

  const matchedExpectedSet = new Set<string>();
  const matchedReportedSet = new Set<number>();

  // Check each expected issue against reported bugs
  expectedIssues.forEach((expIssue) => {
    let bestMatchIndex = -1;

    reportedBugs.forEach((repBug, rIdx) => {
      if (matchedReportedSet.has(rIdx)) return;

      // Check line proximity if line references provided
      const lineProximity =
        repBug.line_reference !== undefined &&
        expIssue.line_numbers.some((ln) => Math.abs(ln - (repBug.line_reference || 0)) <= 3);

      // Check text keyword similarity
      const repDescLower = repBug.description.toLowerCase();
      const expDescLower = expIssue.description.toLowerCase();
      const keywords = expDescLower
        .replace(/[^a-z0-9]/g, " ")
        .split(" ")
        .filter((w) => w.length > 4);

      const keywordHits = keywords.filter((kw) => repDescLower.includes(kw)).length;
      const isKeywordMatch = keywords.length > 0 && keywordHits >= Math.min(2, keywords.length);

      if (lineProximity || isKeywordMatch || repDescLower.length > 30) {
        bestMatchIndex = rIdx;
      }
    });

    if (bestMatchIndex !== -1) {
      matchedExpectedSet.add(expIssue.id);
      matchedReportedSet.add(bestMatchIndex);
      const repBug = reportedBugs[bestMatchIndex];
      matchedIssues.push(expIssue.description);

      discrepancyItems.push({
        id: `disc_match_${expIssue.id}`,
        status: "matched",
        category: "bug",
        severity: expIssue.severity,
        user_finding: `Line ${repBug.line_reference || "?"}: ${repBug.description}`,
        ground_truth_item: `Expected [${expIssue.severity.toUpperCase()}]: ${expIssue.description}`,
        explanation: "Successfully identified and localized the primary root cause.",
        why_it_matters: expIssue.why_it_matters || "Accurate root-cause localization enables developers to fix regressions quickly.",
      });
    } else {
      missedIssues.push(expIssue.description);
      discrepancyItems.push({
        id: `disc_missed_${expIssue.id}`,
        status: "missed",
        category: expIssue.dimension === "edge_case" ? "edge_case" : "bug",
        severity: expIssue.severity,
        ground_truth_item: `[${expIssue.severity.toUpperCase()}] Line(s) ${expIssue.line_numbers.join(", ")}: ${expIssue.description}`,
        explanation: `Missed Defect: You did not flag this ${expIssue.severity} flaw.`,
        why_it_matters: expIssue.why_it_matters || "Unspotted defects compromise model evaluation accuracy.",
      });
    }
  });

  // Check for candidate hallucinations (reported bugs when code is correct or reporting phantom bugs)
  reportedBugs.forEach((repBug, rIdx) => {
    if (!matchedReportedSet.has(rIdx) && (groundTruth.verdict === "correct" || expectedIssues.length === 0)) {
      hallucinatedIssues.push(repBug.description);
      discrepancyItems.push({
        id: `disc_hallucinated_${rIdx}`,
        status: "hallucinated",
        category: "bug",
        user_finding: `Line ${repBug.line_reference || "?"}: ${repBug.description}`,
        explanation: "Phantom Defect: You flagged a bug at this location, but the code behavior is actually valid.",
        why_it_matters: "Hallucinating bugs on correct code lowers your evaluation precision score.",
      });
    }
  });

  // 3. Complexity Big-O Match
  const expectedTime = groundTruth.optimal_complexity?.time || (groundTruth as any).actual_time_complexity || "";
  const expectedSpace = groundTruth.optimal_complexity?.space || (groundTruth as any).actual_space_complexity || "";
  const userTimeNorm = normalizeComplexity(submission.assessed_complexity?.time || "");
  const expectedTimeNorm = normalizeComplexity(expectedTime);
  const userSpaceNorm = normalizeComplexity(submission.assessed_complexity?.space || "");
  const expectedSpaceNorm = normalizeComplexity(expectedSpace);

  const isTimeMatch = userTimeNorm === expectedTimeNorm;
  const isSpaceMatch = userSpaceNorm === expectedSpaceNorm;

  if (isTimeMatch && isSpaceMatch) {
    discrepancyItems.push({
      id: "disc_complexity_match",
      status: "matched",
      category: "complexity",
      user_finding: `Time: ${userTimeNorm}, Space: ${userSpaceNorm}`,
      ground_truth_item: `Expected Time: ${expectedTimeNorm}, Space: ${expectedSpaceNorm}`,
      explanation: "Exact asymptotic Big-O calculation match for both time and space.",
      why_it_matters: "Asymptotic precision is required for benchmarking algorithmic scalability.",
    });
  } else {
    discrepancyItems.push({
      id: "disc_complexity_mismatch",
      status: "missed",
      category: "complexity",
      user_finding: `Time: ${userTimeNorm || "Not specified"}, Space: ${userSpaceNorm || "Not specified"}`,
      ground_truth_item: `Actual Time: ${expectedTimeNorm}, Space: ${expectedSpaceNorm}`,
      explanation: `Complexity Discrepancy: ${!isTimeMatch ? `Time should be ${expectedTimeNorm}. ` : ""}${!isSpaceMatch ? `Space should be ${expectedSpaceNorm}.` : ""}`,
      why_it_matters: "Miscalculating complexity can lead to accepting quadratic O(N^2) code that times out in production.",
    });
  }

  // 4. Explanation Audit Verification
  const hasExplanationFlaw =
    groundTruth.error_categories.includes("deceptive_explanation") ||
    (groundTruth.error_categories as string[]).includes("hallucinated_explanation") ||
    groundTruth.expected_issues.some((i) => i.dimension === "explanation");

  const userFlaggedExplanation = submission.explanation_audit?.is_accurate === false;

  if (hasExplanationFlaw && userFlaggedExplanation) {
    discrepancyItems.push({
      id: "disc_explanation_caught",
      status: "matched",
      category: "explanation",
      user_finding: `Flagged Inaccurate: ${submission.explanation_audit?.notes || "Identified discrepancy"}`,
      ground_truth_item: "AI Explanation contained misleading / hallucinated claims.",
      explanation: "Excellent catch! You correctly spotted that the AI explanation misled the reader.",
      why_it_matters: "Catching deceptive AI explanations prevents developers from accepting broken code based on convincing prose.",
    });
  } else if (hasExplanationFlaw && !userFlaggedExplanation) {
    discrepancyItems.push({
      id: "disc_explanation_missed",
      status: "missed",
      category: "explanation",
      user_finding: "Marked AI explanation as Accurate",
      ground_truth_item: "AI Explanation contained deceptive claims about its algorithm or complexity.",
      explanation: "Missed Explanation Hallucination: The AI explanation made false claims that you accepted as true.",
      why_it_matters: "Evaluators must audit textual reasoning with the same skepticism as code logic.",
    });
  }

  // Generate concise feedback summary
  let feedbackSummary = "";
  if (isVerdictExact && missedIssues.length === 0 && hallucinatedIssues.length === 0 && isTimeMatch && isSpaceMatch) {
    feedbackSummary = "Outstanding review! You achieved 100% agreement with the expert ground truth across all dimensions.";
  } else if (isVerdictCompatible && missedIssues.length <= 1) {
    feedbackSummary = "Strong evaluation with minor diagnostic gaps. Review the itemized discrepancy diff below to refine your edge-case and complexity precision.";
  } else {
    feedbackSummary = "Significant diagnostic discrepancies detected. Compare your review findings with the ground truth breakdown and corrected code diff below.";
  }

  return {
    verdictAccuracy: isVerdictExact,
    matchedIssues,
    missedIssues,
    hallucinatedIssues,
    discrepancyItems,
    feedbackSummary,
  };
}
