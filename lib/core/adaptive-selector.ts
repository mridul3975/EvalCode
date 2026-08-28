import { QuestionItem, DefectCategory } from "@/types/question";
import { UserProfileStats } from "@/types/submission";

export interface AdaptiveRecommendation {
  weakDimension: string;
  suggestedDefectCategory: DefectCategory;
  sessionTitle: string;
  reason: string;
  targetQuestions: QuestionItem[];
}

export function getAdaptiveRecommendation(
  profile: UserProfileStats,
  allQuestions: QuestionItem[]
): AdaptiveRecommendation {
  const mastery = profile.dimensional_mastery;

  // Find lowest scoring dimension
  const dimensions = [
    { key: "edge_cases", score: mastery.edge_cases, label: "Edge-Case Analysis", defect: "edge_case_blindness" as DefectCategory },
    { key: "explanation", score: mastery.explanation, label: "Explanation Auditing", defect: "deceptive_explanation" as DefectCategory },
    { key: "complexity", score: mastery.complexity, label: "Complexity & Big-O", defect: "complexity_regression" as DefectCategory },
    { key: "correctness", score: mastery.correctness, label: "Logic Debugging", defect: "subtle_logic_bug" as DefectCategory },
    { key: "debugging", score: mastery.debugging, label: "Remediation & Fixes", defect: "subtle_logic_bug" as DefectCategory },
  ];

  dimensions.sort((a, b) => a.score - b.score);
  const weakest = dimensions[0];

  // Filter questions matching weakest defect category
  const matchingQuestions = allQuestions.filter((q) => {
    const qDefect = q.ground_truth.defect_type || q.ground_truth.error_categories[0];
    return qDefect === weakest.defect || q.ground_truth.error_categories.includes(weakest.defect);
  });

  const fallbackQuestions = matchingQuestions.length > 0 ? matchingQuestions : allQuestions;

  let sessionTitle = "Targeted Skill Calibration";
  let reason = `Your score in ${weakest.label} is currently ${weakest.score.toFixed(1)}%. We recommend drilling into calibrated problem sets to eliminate this blind spot.`;

  if (weakest.key === "edge_cases") {
    sessionTitle = "Boundary Conditions & Null Pointer Edge Cases";
  } else if (weakest.key === "explanation") {
    sessionTitle = "Detecting Plausible AI Hallucinations & False Claims";
  } else if (weakest.key === "complexity") {
    sessionTitle = "Asymptotic Analysis & Quadratic String/Loop Regressions";
  } else {
    sessionTitle = "Pointer Manipulations & Subtle State Flaws";
  }

  return {
    weakDimension: weakest.label,
    suggestedDefectCategory: weakest.defect,
    sessionTitle,
    reason,
    targetQuestions: fallbackQuestions,
  };
}

export function sampleAdaptiveQuestions(
  profile: UserProfileStats,
  allQuestions: QuestionItem[],
  count: number = 5
): QuestionItem[] {
  const mastery = profile.dimensional_mastery;

  // Assign weights to questions based on user's weak dimensions
  const weighted = allQuestions.map((q) => {
    let weight = 1.0;
    const defect = q.ground_truth.defect_type || "";

    if (defect.includes("edge") && mastery.edge_cases < 70) weight *= 3.0;
    if (defect.includes("explanation") && mastery.explanation < 70) weight *= 3.0;
    if (defect.includes("complexity") && mastery.complexity < 70) weight *= 3.0;
    if (defect.includes("logic") && mastery.correctness < 70) weight *= 3.0;

    return { question: q, weight };
  });

  // Shuffle and sort by weight with jitter
  weighted.sort((a, b) => b.weight * Math.random() - a.weight * Math.random());
  return weighted.slice(0, count).map((w) => w.question);
}
