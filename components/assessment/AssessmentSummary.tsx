"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { AssessmentSession } from "@/types/submission";
import { SEED_QUESTIONS } from "@/data/seed-questions";
import { ReadinessGauge } from "@/components/infographics/ReadinessGauge";
import { CompetencyRadarChart } from "@/components/infographics/CompetencyRadarChart";
import { ReadinessProgressBar } from "@/components/infographics/DiscrepancyDiffChart";
import { getReadinessTier, formatTime, cn } from "@/lib/utils";
import {
  Trophy,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Layers,
  AlertCircle,
  ExternalLink,
  Target,
} from "lucide-react";

export function AssessmentSummary({ session }: { session: AssessmentSession }) {
  const results = session.results || {};
  const resultList = Object.values(results);

  const totalScore = session.total_score ?? 78.5;
  const tier = getReadinessTier(totalScore);

  // Calculate aggregated dimensional averages (0 to 100)
  const avgDim = resultList.reduce(
    (acc, curr) => {
      acc.correctness += curr.dimensional_scores.correctness * 10;
      acc.edge_cases += curr.dimensional_scores.edge_cases * 10;
      acc.complexity += curr.dimensional_scores.complexity * 10;
      acc.explanation += curr.dimensional_scores.explanation * 10;
      acc.communication += (curr.dimensional_scores.communication ?? 8) * 10;
      acc.debugging += (curr.dimensional_scores.debugging ?? 8) * 10;
      return acc;
    },
    { correctness: 0, edge_cases: 0, complexity: 0, explanation: 0, communication: 0, debugging: 0 }
  );

  const count = Math.max(1, resultList.length);
  const aggregateDimensions = {
    correctness: Number((avgDim.correctness / count).toFixed(1)),
    edge_cases: Number((avgDim.edge_cases / count).toFixed(1)),
    complexity: Number((avgDim.complexity / count).toFixed(1)),
    explanation: Number((avgDim.explanation / count).toFixed(1)),
    communication: Number((avgDim.communication / count).toFixed(1)),
    debugging: Number((avgDim.debugging / count).toFixed(1)),
  };

  useEffect(() => {
    if (totalScore >= 80) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [totalScore]);

  // Find lowest scoring dimension for targeted remediation
  const weakDimensions = [
    { key: "edge_cases", score: aggregateDimensions.edge_cases, label: "Boundary Condition Edge Cases", topic: "arrays" },
    { key: "explanation", score: aggregateDimensions.explanation, label: "Catching AI Explanation Hallucinations", topic: "trees" },
    { key: "correctness", score: aggregateDimensions.correctness, label: "Pointer & State Logic Debugging", topic: "linked_lists" },
    { key: "complexity", score: aggregateDimensions.complexity, label: "Asymptotic Complexity Auditing", topic: "strings" },
  ];
  weakDimensions.sort((a, b) => a.score - b.score);
  const primaryWeakness = weakDimensions[0];

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-8">
      {/* Top Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3 max-w-xl">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Assessment Completed
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            AI-Evaluation Readiness Scorecard
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            {tier.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-zinc-400">
            <span>Duration: {formatTime(session.duration_seconds - session.remaining_seconds)}</span>
            <span>&bull;</span>
            <span>Problems Audited: {session.question_ids.length}</span>
            <span>&bull;</span>
            <span>Status: <strong className="text-emerald-400">Graded</strong></span>
          </div>
        </div>

        {/* Big Readiness Gauge */}
        <ReadinessGauge score={totalScore} />
      </div>

      {/* 2-Column Analytics: Radar + Progress Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              6-Axis Competency Polygon
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">Target: 90.0%</span>
          </div>
          <CompetencyRadarChart data={aggregateDimensions} />
        </div>

        {/* Dimensional Bars */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Dimensional Proficiency Breakdown
            </span>
            <span className="text-[11px] text-zinc-500">Weighted Scoring</span>
          </div>

          <div className="space-y-3.5 pt-1">
            <ReadinessProgressBar
              label="Functional Correctness (30%)"
              value={aggregateDimensions.correctness}
            />
            <ReadinessProgressBar
              label="Edge-Case Coverage (25%)"
              value={aggregateDimensions.edge_cases}
            />
            <ReadinessProgressBar
              label="Complexity & Big-O (15%)"
              value={aggregateDimensions.complexity}
            />
            <ReadinessProgressBar
              label="Explanation Auditing (15%)"
              value={aggregateDimensions.explanation}
            />
            <ReadinessProgressBar
              label="Communication & Review Quality (15%)"
              value={aggregateDimensions.communication}
            />
            <ReadinessProgressBar
              label="Proposed Remediation & Debugging"
              value={aggregateDimensions.debugging}
            />
          </div>
        </div>
      </div>

      {/* Question-by-Question Itemized Table */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Itemized Question Performance
          </span>
          <span className="text-[11px] text-zinc-500">{session.question_ids.length} Evaluation Batteries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Question Title</th>
                <th className="py-3 px-4">Topic</th>
                <th className="py-3 px-4">True Defect</th>
                <th className="py-3 px-4">Your Verdict</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {session.question_ids.map((qId, idx) => {
                const question = SEED_QUESTIONS.find((q) => q.id === qId);
                const sub = session.submissions[qId];
                const res = results[qId];
                const isCorrectVerdict = sub && question && sub.verdict === question.ground_truth.verdict;

                return (
                  <tr key={qId} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-zinc-500">
                      Q{idx + 1}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-zinc-200">
                      {question?.title || qId}
                    </td>
                    <td className="py-3.5 px-4 uppercase font-mono text-[11px] text-zinc-400">
                      {question?.topic || "general"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {question?.ground_truth.verdict.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          "text-[10px] uppercase font-bold px-2 py-0.5 rounded border",
                          isCorrectVerdict
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                        )}
                      >
                        {sub?.verdict.replace("_", " ") || "No answer"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      {res ? `${(res.overall_score * 10).toFixed(0)}%` : "--"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/practice/${qId}`}
                        className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2"
                      >
                        <span>Review Audit</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Targeted Remediation Queue */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Targeted Remediation Queue
            </span>
          </div>
          <span className="text-[11px] text-amber-400 font-semibold">
            Based on detected evaluation gaps
          </span>
        </div>

        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-200">
              Recommended Drill: {primaryWeakness.label}
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
              Your evaluation accuracy in {primaryWeakness.label} scored {primaryWeakness.score.toFixed(0)}%. Practice focused problem sets to eliminate false positives and catch unhandled edge cases.
            </p>
          </div>

          <Link
            href="/practice"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            <span>Start Practice Drill</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-800">
        <Link
          href="/assessment"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retake Mock Assessment</span>
        </Link>

        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold shadow-lg transition-all"
        >
          <span>View Full Profile & Analytics</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
