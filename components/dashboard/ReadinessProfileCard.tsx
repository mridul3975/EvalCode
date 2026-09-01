"use client";

import React from "react";
import { UserProfileStats } from "@/types/submission";
import { ReadinessGauge } from "@/components/infographics/ReadinessGauge";
import { getReadinessTier, cn } from "@/lib/utils";
import {
  ShieldCheck,
  CheckCircle2,
  Trophy,
  Flame,
  Clock,
  TrendingUp,
  Target,
} from "lucide-react";

export function ReadinessProfileCard({ profile }: { profile: UserProfileStats }) {
  const hasActivity = profile.total_evaluations_count > 0;
  const percentileText = hasActivity
    ? profile.readiness_score >= 90
      ? "Top 5%"
      : profile.readiness_score >= 80
      ? "Top 15%"
      : profile.readiness_score >= 70
      ? "Top 35%"
      : "In Progress"
    : "Unranked";

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
      {/* Left: Overall Readiness & Target */}
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Candidate Readiness Profile
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Platform Evaluation Acuity
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md leading-relaxed">
          Aggregated performance across Practice Mode and Timed Mock Assessments computed via exponential decay weighting.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-950/80 border border-zinc-800 text-xs">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-zinc-400">Benchmark:</span>
            <span className="font-bold text-white">90.0%+</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-950/80 border border-zinc-800 text-xs">
            <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-zinc-400">Global Percentile:</span>
            <span className="font-bold text-sky-400">{percentileText}</span>
          </div>
        </div>
      </div>

      {/* Center Gauge */}
      <ReadinessGauge score={profile.readiness_score} size={200} />

      {/* Right Stats Grid */}
      <div className="grid grid-cols-2 gap-3 w-full lg:w-auto">
        <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verdict Accuracy</span>
          </div>
          <span className="text-lg font-bold text-white font-mono">
            {profile.verdict_accuracy.toFixed(1)}%
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">
            {Math.round((profile.verdict_accuracy / 100) * profile.total_evaluations_count)} / {profile.total_evaluations_count} verified
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Active Streak</span>
          </div>
          <span className="text-lg font-bold text-amber-400 font-mono">
            {profile.current_streak_days} Days
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">
            Best: {profile.best_streak_days} Days
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
            <Trophy className="w-3.5 h-3.5 text-sky-400" />
            <span>Mock Avg Score</span>
          </div>
          <span className="text-lg font-bold text-white font-mono">
            {profile.mock_average_score.toFixed(1)}%
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">
            {profile.total_mocks_count} mock tests taken
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span>Practice Avg</span>
          </div>
          <span className="text-lg font-bold text-white font-mono">
            {profile.practice_average_score.toFixed(1)}%
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">
            {profile.total_evaluations_count - profile.total_mocks_count} practice audits
          </span>
        </div>
      </div>
    </div>
  );
}

export function MockHistoryTable({ history = [] }: { history?: any[] }) {
  if (history.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center mx-auto text-zinc-400">
          <Trophy className="w-6 h-6 text-zinc-500" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white">No Assessments Completed Yet</h4>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            You haven't taken any mock assessments yet. Take a timed 3-question evaluation test to benchmark your readiness and unlock your certification scorecard.
          </p>
        </div>
        <a
          href="/assessment"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md transition-colors"
        >
          <span>Launch Mock Assessment</span>
        </a>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
          Recent Assessment & Audit History
        </span>
        <span className="text-[11px] text-zinc-500">{history.length} assessments recorded</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Assessment ID</th>
              <th className="py-3 px-4">Score</th>
              <th className="py-3 px-4">Time Spent</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-mono">
            {history.map((session) => (
              <tr key={session.id} className="hover:bg-zinc-800/40 transition-colors">
                <td className="py-3.5 px-4 text-zinc-400">
                  {new Date(session.started_at).toLocaleDateString()}
                </td>
                <td className="py-3.5 px-4 font-sans font-semibold text-zinc-200">
                  Assessment #{session.id.slice(0, 8)}
                </td>
                <td className="py-3.5 px-4 font-bold text-emerald-400">
                  {session.total_score ? session.total_score.toFixed(0) : "0"} / 100
                </td>
                <td className="py-3.5 px-4 text-zinc-400">
                  {session.time_spent_seconds ? `${Math.floor(session.time_spent_seconds / 60)}m ${session.time_spent_seconds % 60}s` : "Timed"}
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded border text-emerald-400 bg-emerald-500/10 border-emerald-500/30">
                    Completed
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-sans">
                  <a
                    href="/assessment/results"
                    className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2"
                  >
                    <span>View Scorecard</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
