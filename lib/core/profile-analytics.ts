import { EvaluationResult, UserProfileStats } from "@/types/submission";

export const DEFAULT_PROFILE_STATS: UserProfileStats = {
  readiness_score: 84.2,
  verdict_accuracy: 88.7,
  total_evaluations_count: 142,
  total_mocks_count: 16,
  mock_average_score: 81.4,
  practice_average_score: 79.8,
  current_streak_days: 9,
  best_streak_days: 18,
  last_active_at: new Date().toISOString(),
  dimensional_mastery: {
    correctness: 82.0,
    edge_cases: 48.0, // Critical deficit example
    complexity: 94.0,
    explanation: 68.0,
    communication: 81.0,
    debugging: 88.5,
  },
  dimensional_deltas: {
    correctness: -1.2,
    edge_cases: -4.5,
    complexity: 0.5,
    explanation: -2.0,
    communication: 1.8,
    debugging: 4.1,
  },
  topic_stats: {
    linked_lists: { attempts: 28, avg_score: 62.0 },
    trees: { attempts: 24, avg_score: 74.0 },
    dp: { attempts: 30, avg_score: 89.0 },
    arrays: { attempts: 35, avg_score: 91.0 },
    strings: { attempts: 25, avg_score: 85.0 },
  },
  defect_stats: {
    subtle_logic_bug: { attempts: 45, detection_rate: 86.0 },
    edge_case_blindness: { attempts: 35, detection_rate: 42.0 },
    deceptive_explanation: { attempts: 22, detection_rate: 61.0 },
    complexity_regression: { attempts: 25, detection_rate: 95.0 },
    completely_correct: { attempts: 15, detection_rate: 93.0 },
  },
};

/**
 * Calculates exponential decay weighted average for practice evaluations:
 * w_i = e^(0.05 * i) / sum(e^(0.05 * j))
 */
export function calculateExponentialWeightedPracticeScore(practiceScores: number[]): number {
  if (practiceScores.length === 0) return 75.0;
  const n = practiceScores.length;
  let weightSum = 0;
  const weights: number[] = [];

  for (let i = 0; i < n; i++) {
    const w = Math.exp(0.05 * (i + 1));
    weights.push(w);
    weightSum += w;
  }

  let total = 0;
  for (let i = 0; i < n; i++) {
    total += (weights[i] / weightSum) * practiceScores[i];
  }

  return total;
}

/**
 * Calculates overall readiness score R:
 * R = 0.60 * S_mock_avg + 0.40 * (sum w_i * S_practice_i)
 */
export function calculateReadinessIndex(
  mockAverage: number,
  practiceScores: number[]
): number {
  const weightedPractice = calculateExponentialWeightedPracticeScore(practiceScores);
  if (mockAverage === 0 && practiceScores.length === 0) return 0;
  if (mockAverage === 0) return weightedPractice;
  return Number((0.6 * mockAverage + 0.4 * weightedPractice).toFixed(1));
}

/**
 * Updates profile stats when a new evaluation is completed
 */
export function updateProfileWithEvaluation(
  currentStats: UserProfileStats,
  result: EvaluationResult,
  isMock: boolean = false,
  topic?: string,
  defectCategory?: string
): UserProfileStats {
  const newTotal = currentStats.total_evaluations_count + 1;
  const newMocks = isMock ? currentStats.total_mocks_count + 1 : currentStats.total_mocks_count;

  // Verdict accuracy update
  const currentAccurateCount = Math.round((currentStats.verdict_accuracy / 100) * currentStats.total_evaluations_count);
  const newAccurateCount = currentAccurateCount + (result.verdict_accuracy ? 1 : 0);
  const newVerdictAccuracy = Number(((newAccurateCount / newTotal) * 100).toFixed(1));

  // Dimensional scores update (0-100 scale)
  const normCorrectness = result.dimensional_scores.correctness * 10;
  const normEdgeCases = result.dimensional_scores.edge_cases * 10;
  const normComplexity = result.dimensional_scores.complexity * 10;
  const normExplanation = result.dimensional_scores.explanation * 10;
  const normComm = (result.dimensional_scores.communication ?? 8) * 10;
  const normDebug = (result.dimensional_scores.debugging ?? (result.overall_score >= 8 ? 9 : 7)) * 10;

  // Smoothing factor alpha for exponential moving average
  const alpha = 0.2;
  const newMastery = {
    correctness: Number((currentStats.dimensional_mastery.correctness * (1 - alpha) + normCorrectness * alpha).toFixed(1)),
    edge_cases: Number((currentStats.dimensional_mastery.edge_cases * (1 - alpha) + normEdgeCases * alpha).toFixed(1)),
    complexity: Number((currentStats.dimensional_mastery.complexity * (1 - alpha) + normComplexity * alpha).toFixed(1)),
    explanation: Number((currentStats.dimensional_mastery.explanation * (1 - alpha) + normExplanation * alpha).toFixed(1)),
    communication: Number((currentStats.dimensional_mastery.communication * (1 - alpha) + normComm * alpha).toFixed(1)),
    debugging: Number((currentStats.dimensional_mastery.debugging * (1 - alpha) + normDebug * alpha).toFixed(1)),
  };

  // Deltas
  const newDeltas = {
    correctness: Number((newMastery.correctness - currentStats.dimensional_mastery.correctness).toFixed(1)),
    edge_cases: Number((newMastery.edge_cases - currentStats.dimensional_mastery.edge_cases).toFixed(1)),
    complexity: Number((newMastery.complexity - currentStats.dimensional_mastery.complexity).toFixed(1)),
    explanation: Number((newMastery.explanation - currentStats.dimensional_mastery.explanation).toFixed(1)),
    communication: Number((newMastery.communication - currentStats.dimensional_mastery.communication).toFixed(1)),
    debugging: Number((newMastery.debugging - currentStats.dimensional_mastery.debugging).toFixed(1)),
  };

  // Update topic stats
  const topicStats = { ...currentStats.topic_stats };
  if (topic) {
    const existing = topicStats[topic] || { attempts: 0, avg_score: 70 };
    const updatedAttempts = existing.attempts + 1;
    const updatedAvg = Number(((existing.avg_score * existing.attempts + result.overall_score * 10) / updatedAttempts).toFixed(1));
    topicStats[topic] = { attempts: updatedAttempts, avg_score: updatedAvg };
  }

  // Update defect stats
  const defectStats = { ...currentStats.defect_stats };
  if (defectCategory) {
    const existing = defectStats[defectCategory] || { attempts: 0, detection_rate: 70 };
    const updatedAttempts = existing.attempts + 1;
    const hit = result.overall_score >= 7 ? 100 : 0;
    const updatedRate = Number(((existing.detection_rate * existing.attempts + hit) / updatedAttempts).toFixed(1));
    defectStats[defectCategory] = { attempts: updatedAttempts, detection_rate: updatedRate };
  }

  // Recompute readiness score R
  const practiceAvg = isMock
    ? currentStats.practice_average_score
    : Number(((currentStats.practice_average_score * (currentStats.total_evaluations_count - currentStats.total_mocks_count) + result.overall_score * 10) / (newTotal - newMocks)).toFixed(1));

  const mockAvg = isMock
    ? Number(((currentStats.mock_average_score * currentStats.total_mocks_count + result.overall_score * 10) / newMocks).toFixed(1))
    : currentStats.mock_average_score;

  const readiness = Number((0.6 * mockAvg + 0.4 * practiceAvg).toFixed(1));

  return {
    ...currentStats,
    readiness_score: readiness,
    verdict_accuracy: newVerdictAccuracy,
    total_evaluations_count: newTotal,
    total_mocks_count: newMocks,
    mock_average_score: mockAvg,
    practice_average_score: practiceAvg,
    last_active_at: new Date().toISOString(),
    dimensional_mastery: newMastery,
    dimensional_deltas: newDeltas,
    topic_stats: topicStats,
    defect_stats: defectStats,
  };
}
