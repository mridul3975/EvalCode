"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { AssessmentSession } from "@/types/submission";
import { SEED_QUESTIONS } from "@/data/seed-questions";
import { CompetencyRadarChart } from "@/components/infographics/CompetencyRadarChart";
import { ReadinessProgressBar } from "@/components/infographics/DiscrepancyDiffChart";
import { getReadinessTier, formatTime, cn } from "@/lib/utils";
import {
  Trophy,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export function AssessmentSummary({ session }: { session: AssessmentSession }) {
  const results = session.results || {};
  const resultList = Object.values(results);

  const totalScore = session.total_score ?? 0;
  const tier = getReadinessTier(totalScore);

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

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 space-y-10 font-['Hanken_Grotesk'] text-[#e2e2e5]">
      {/* Top Banner: Obsidian Tactile Scorecard Hero */}
      <section className="obsidian-card w-full flex flex-col lg:flex-row overflow-hidden">
        {/* Left 65%: Overview */}
        <div className="lg:w-2/3 p-8 sm:p-12 lg:p-14 flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="obsidian-chip-optimal flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                <span>ASSESSMENT COMPLETED</span>
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight leading-none">
              EXAM SCORECARD
            </h1>

            <p className="text-base sm:text-xl text-[#b9cbc1] font-normal leading-relaxed max-w-2xl">
              {tier.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 font-mono text-xs text-[#b9cbc1]">
            <div className="obsidian-inset p-3 px-4">
              DURATION: <strong className="text-white">{formatTime(session.duration_seconds - session.remaining_seconds)}</strong>
            </div>
            <div className="obsidian-inset p-3 px-4">
              AUDITED: <strong className="text-white">{session.question_ids.length} PROBLEMS</strong>
            </div>
            <div className="obsidian-inset p-3 px-4">
              TIER: <strong className="text-white">{tier.tier}</strong>
            </div>
          </div>
        </div>

        {/* Right 35%: Score Gauge Dial */}
        <div className="lg:w-1/3 p-8 sm:p-12 flex flex-col items-center justify-center bg-[#17191b] border-t lg:border-t-0 lg:border-l border-[rgba(255,255,255,0.05)] text-center space-y-4">
          <span className="text-xs font-mono font-bold text-[#b9cbc1] uppercase tracking-widest">
            OVERALL READINESS SCORE
          </span>

          <div className="text-7xl sm:text-8xl font-black text-white tracking-tighter drop-shadow-[0_0_24px_rgba(255,255,255,0.2)]">
            {totalScore.toFixed(0)}%
          </div>

          <span
            className={cn(
              "mt-2",
              totalScore >= 90
                ? "obsidian-chip-optimal"
                : totalScore >= 80
                ? "obsidian-chip-neutral"
                : "obsidian-chip-critical"
            )}
          >
            {totalScore >= 90 ? "BENCHMARK MET" : "BELOW 90% THRESHOLD"}
          </span>
        </div>
      </section>

      {/* Dual Charts Row: 6-Axis Radar & Competency Matrix */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: 6-Axis Radar */}
        <div className="obsidian-card p-6 sm:p-10 space-y-6">
          <div className="border-b border-[rgba(255,255,255,0.06)] pb-4">
            <span className="text-xs font-mono font-bold text-[#b9cbc1] uppercase tracking-widest">
              6-DIMENSIONAL MASTERY
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">
              COMPETENCY RADAR
            </h3>
          </div>
          <CompetencyRadarChart data={aggregateDimensions} />
        </div>

        {/* Right: Competency Matrix */}
        <div className="obsidian-card p-6 sm:p-10 space-y-6">
          <div className="border-b border-[rgba(255,255,255,0.06)] pb-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-[#b9cbc1] uppercase tracking-widest">
                EVALUATION DIMENSIONS
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">
                COMPETENCY MATRIX
              </h3>
            </div>
            <span className="obsidian-chip-optimal">
              TARGET &ge; 90.0%
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <ReadinessProgressBar label="Logic Debugging" value={aggregateDimensions.correctness} />
            <ReadinessProgressBar label="Boundary Analysis" value={aggregateDimensions.edge_cases} />
            <ReadinessProgressBar label="Big-O Invariants" value={aggregateDimensions.complexity} />
            <ReadinessProgressBar label="Hallucination Auditing" value={aggregateDimensions.explanation} />
            <ReadinessProgressBar label="Review Structure" value={aggregateDimensions.communication} />
            <ReadinessProgressBar label="Proposed Fixes" value={aggregateDimensions.debugging} />
          </div>
        </div>
      </section>

      {/* Per-Question Audit Breakdown Table */}
      <div className="obsidian-card p-6 sm:p-10 space-y-6">
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-[#b9cbc1] uppercase tracking-widest">
              EXAM BREAKDOWN
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">
              ITEMIZED QUESTION SCORES
            </h3>
          </div>
          <span className="obsidian-chip-neutral">
            {session.question_ids.length} PROBLEMS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)] text-[#b9cbc1] uppercase text-xs">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">QUESTION TITLE</th>
                <th className="py-3 px-4">SCORE</th>
                <th className="py-3 px-4">VERDICT STATUS</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
              {session.question_ids.map((qId, idx) => {
                const q = SEED_QUESTIONS.find((item) => item.id === qId);
                const evalRes = results[qId];
                return (
                  <tr key={qId} className="hover:bg-[#282a2c]/40 transition-colors">
                    <td className="py-4 px-4 font-bold text-white">Q{idx + 1}</td>
                    <td className="py-4 px-4 font-bold uppercase text-white">{q?.title || qId}</td>
                    <td className="py-4 px-4 text-sm font-bold text-white">
                      {evalRes ? (evalRes.overall_score * 10).toFixed(0) : "0"}%
                    </td>
                    <td className="py-4 px-4">
                      {evalRes?.verdict_accuracy ? (
                        <span className="obsidian-chip-optimal">ACCURATE</span>
                      ) : (
                        <span className="obsidian-chip-critical">INCORRECT</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        href={`/practice/${qId}`}
                        className="text-white font-bold uppercase hover:underline"
                      >
                        REVIEW AUDIT ➔
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 font-mono">
        <Link
          href="/dashboard"
          className="w-full sm:w-auto obsidian-btn-secondary px-8 py-4 text-xs font-bold uppercase tracking-wider text-center cursor-pointer"
        >
          VIEW DASHBOARD
        </Link>
        <Link
          href="/assessment"
          className="w-full sm:w-auto obsidian-btn-primary px-8 py-4 text-xs font-bold uppercase tracking-wider text-center cursor-pointer"
        >
          RETAKE MOCK EXAM ➔
        </Link>
      </div>
    </div>
  );
}
