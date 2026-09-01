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
    <div className="max-w-[1500px] mx-auto p-4 sm:p-8 space-y-10 font-['Hanken_Grotesk'] text-white">
      {/* Top Banner: 70/30 Split */}
      <section className="flex flex-col lg:flex-row w-full border-4 border-white bg-[#121416]">
        {/* Left 70%: Massive Overview */}
        <div className="lg:w-2/3 p-6 sm:p-12 lg:p-16 flex flex-col justify-between border-b-4 lg:border-b-0 lg:border-r-4 border-white">
          <div>
            <div className="text-xs font-mono font-black uppercase tracking-widest px-3 py-1 bg-white text-black inline-block mb-4">
              ASSESSMENT SCORECARD
            </div>
            <h1 className="font-black text-5xl sm:text-7xl uppercase tracking-tight mb-6">
              EXAM SUMMARY
            </h1>
            <p className="text-base sm:text-xl font-light text-zinc-300 font-sans border-l-8 border-white pl-6 leading-relaxed">
              {tier.description}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 font-mono text-xs text-zinc-400 font-bold uppercase">
            <span className="p-3 border-2 border-white bg-[#0a0b0d] text-white">
              DURATION: {formatTime(session.duration_seconds - session.remaining_seconds)}
            </span>
            <span className="p-3 border-2 border-white bg-[#0a0b0d] text-white">
              AUDITED: {session.question_ids.length} PROBLEMS
            </span>
            <span className="p-3 border-2 border-white bg-white text-black font-black">
              TIER: {tier.tier}
            </span>
          </div>
        </div>

        {/* Right 30%: Score Gauge Card */}
        <div className="lg:w-1/3 p-8 sm:p-14 flex flex-col items-center justify-center bg-white text-black border-white text-center">
          <div className="text-7xl sm:text-9xl font-black tracking-tighter mb-4">
            {totalScore.toFixed(0)}%
          </div>
          <div className="bg-black text-white px-6 py-2 text-xl font-black uppercase tracking-widest border-2 border-black">
            {totalScore >= 90 ? "BENCHMARK MET" : "BELOW 90% TARGET"}
          </div>
        </div>
      </section>

      {/* 50/50 Dual Charts Row */}
      <section className="grid grid-cols-1 lg:grid-cols-2 border-4 border-white">
        {/* Left: 6-Axis Radar */}
        <div className="p-6 sm:p-12 lg:border-r-4 border-white bg-[#121416] space-y-6">
          <div className="border-b-4 border-white pb-4">
            <h3 className="text-3xl font-black uppercase tracking-tight">6-AXIS RADAR</h3>
            <p className="text-xs font-mono uppercase text-zinc-400 mt-1">
              BENCHMARKED AT 90%
            </p>
          </div>
          <CompetencyRadarChart data={aggregateDimensions} />
        </div>

        {/* Right: Competency Matrix */}
        <div className="p-6 sm:p-12 bg-white text-black space-y-6">
          <div className="border-b-4 border-black pb-4">
            <h3 className="text-3xl font-black uppercase tracking-tight">COMPETENCY MATRIX</h3>
            <p className="text-xs font-mono uppercase text-zinc-700 mt-1 font-bold">
              TARGET &ge; 90.0%
            </p>
          </div>

          <div className="flex flex-col gap-4">
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
      <div className="border-4 border-white bg-[#121416] p-6 sm:p-10 space-y-6">
        <div className="flex items-center justify-between border-b-4 border-white pb-4">
          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
            ITEMIZED QUESTION SCORES
          </h3>
          <span className="text-xs font-mono uppercase bg-white text-black px-3 py-1 font-bold">
            {session.question_ids.length} PROBLEMS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b-4 border-white text-white font-black uppercase text-xs">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">QUESTION</th>
                <th className="py-3 px-4">SCORE</th>
                <th className="py-3 px-4">VERDICT</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-white font-mono">
              {session.question_ids.map((qId, idx) => {
                const q = SEED_QUESTIONS.find((item) => item.id === qId);
                const evalRes = results[qId];
                return (
                  <tr key={qId} className="hover:bg-white hover:text-black transition-none">
                    <td className="py-4 px-4 font-bold">Q{idx + 1}</td>
                    <td className="py-4 px-4 font-black uppercase">{q?.title || qId}</td>
                    <td className="py-4 px-4 text-base font-black">
                      {evalRes ? (evalRes.overall_score * 10).toFixed(0) : "0"} / 100
                    </td>
                    <td className="py-4 px-4 font-bold uppercase">
                      {evalRes?.verdict_accuracy ? "[✓] ACCURATE" : "[X] INCORRECT"}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        href={`/practice/${qId}`}
                        className="font-bold uppercase underline underline-offset-4"
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 font-mono">
        <Link
          href="/dashboard"
          className="w-full sm:w-auto px-8 py-4 bg-[#121416] text-white border-2 border-white hover:bg-white hover:text-black font-black uppercase text-xs transition-none text-center"
        >
          VIEW DASHBOARD
        </Link>
        <Link
          href="/assessment"
          className="w-full sm:w-auto px-8 py-4 bg-white text-black font-black uppercase text-xs hover:bg-zinc-200 transition-none text-center"
        >
          RETAKE MOCK TEST ➔
        </Link>
      </div>
    </div>
  );
}
