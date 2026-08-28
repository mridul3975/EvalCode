import { DefectCategory, QuestionItem } from "@/types/question";

export interface DefectTaxonomyItem {
  key: DefectCategory;
  label: string;
  targetFrequency: string; // e.g. "25%"
  description: string;
  color: string;
  badgeClass: string;
}

export const DEFECT_TAXONOMY: Record<DefectCategory, DefectTaxonomyItem> = {
  completely_correct: {
    key: "completely_correct",
    label: "Completely Correct",
    targetFrequency: "20%",
    description: "Optimal time/space, handles all edge cases, and accurate explanation.",
    color: "#10B981",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
  subtle_logic_bug: {
    key: "subtle_logic_bug",
    label: "Subtle Logic Bug",
    targetFrequency: "25%",
    description: "Off-by-one, incorrect pointer mutations, bad base cases, or faulty state transitions.",
    color: "#EF4444",
    badgeClass: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  },
  edge_case_blindness: {
    key: "edge_case_blindness",
    label: "Edge-Case Blindness",
    targetFrequency: "15%",
    description: "Fails on boundary conditions (empty inputs, single nodes, duplicates, or negative values).",
    color: "#F59E0B",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  },
  complexity_regression: {
    key: "complexity_regression",
    label: "Complexity Regression",
    targetFrequency: "15%",
    description: "Functionally correct but sub-optimal (e.g. O(n^2) nested lookups instead of O(n) hash map).",
    color: "#8B5CF6",
    badgeClass: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  },
  minor_style_quality: {
    key: "minor_style_quality",
    label: "Minor Style / Quality",
    targetFrequency: "10%",
    description: "Redundant passes, poor variable naming, or unidiomatic language usage.",
    color: "#06B6D4",
    badgeClass: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  },
  deceptive_explanation: {
    key: "deceptive_explanation",
    label: "Deceptive Explanation",
    targetFrequency: "10%",
    description: "Code works or has bugs, but the explanation hallucinates algorithmic steps or complexities.",
    color: "#EC4899",
    badgeClass: "bg-pink-500/10 text-pink-400 border-pink-500/30",
  },
  instruction_mismatch: {
    key: "instruction_mismatch",
    label: "Instruction Mismatch",
    targetFrequency: "5%",
    description: "Solves a different problem or ignores strict constraints (e.g. in-place mutation, O(1) space).",
    color: "#F97316",
    badgeClass: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  },
  pointer_bug: {
    key: "subtle_logic_bug",
    label: "Pointer Mutation Bug",
    targetFrequency: "10%",
    description: "Lost pointer reference on node traversal or inversion.",
    color: "#EF4444",
    badgeClass: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  },
  edge_case: {
    key: "edge_case_blindness",
    label: "Edge Case",
    targetFrequency: "15%",
    description: "Boundary condition failure.",
    color: "#F59E0B",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  },
  clean: {
    key: "completely_correct",
    label: "Clean / Optimal",
    targetFrequency: "20%",
    description: "Flawless code.",
    color: "#10B981",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
};

export function getDefectMeta(category?: string): DefectTaxonomyItem {
  if (!category) return DEFECT_TAXONOMY.completely_correct;
  const match = DEFECT_TAXONOMY[category as DefectCategory];
  return match || DEFECT_TAXONOMY.subtle_logic_bug;
}

export function filterQuestionsByDefect(questions: QuestionItem[], defect: DefectCategory | "all"): QuestionItem[] {
  if (defect === "all") return questions;
  return questions.filter((q) => {
    const qDefect = q.ground_truth.defect_type || q.ground_truth.error_categories[0];
    return qDefect === defect || q.ground_truth.error_categories.includes(defect);
  });
}
