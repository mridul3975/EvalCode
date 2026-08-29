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
  const tier = getReadinessTier(profile.readiness_score);

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
            <span className="font-bold text-sky-400">Top 14%</span>
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

export function MockHistoryTable() {
  const mockRows = [
    {
      id: "mock_4",
      date: "2026-08-28",
      title: "Mindrift Full Mock #4",
      score: 86.0,
      time: "44m 12s",
      status: "Borderline",
      statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      sampleQuestionId: "q_ll_001",
    },
    {
      id: "mock_2",
      date: "2026-08-25",
      title: "Alignerr Screener #2",
      score: 82.0,
      time: "48m 05s",
      status: "Borderline",
      statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      sampleQuestionId: "q_arr_002",
    },
    {
      id: "mock_3",
      date: "2026-08-21",
      title: "Mindrift Full Mock #3",
      score: 74.0,
      time: "50m 00s",
      status: "Needs Work",
      statusColor: "text-orange-400 bg-orange-500/10 border-orange-500/30",
      sampleQuestionId: "q_str_004",
    },
    {
      id: "mock_1",
      date: "2026-08-18",
      title: "Python Diagnostic #1",
      score: 91.0,
      time: "38m 20s",
      status: "Ready",
      statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      sampleQuestionId: "q_bs_003",
    },
  ];

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
          Recent Assessment & Audit History
        </span>
        <span className="text-[11px] text-zinc-500">Historical Retrieval Enabled</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Assessment Type</th>
              <th className="py-3 px-4">Score</th>
              <th className="py-3 px-4">Time Spent</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-mono">
            {mockRows.map((row) => (
              <tr key={row.id} className="hover:bg-zinc-800/40 transition-colors">
                <td className="py-3.5 px-4 text-zinc-400">{row.date}</td>
                <td className="py-3.5 px-4 font-sans font-semibold text-zinc-200">{row.title}</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400">{row.score.toFixed(0)} / 100</td>
                <td className="py-3.5 px-4 text-zinc-400">{row.time}</td>
                <td className="py-3.5 px-4">
                  <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded border", row.statusColor)}>
                    {row.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-sans">
                  <a
                    href={`/practice/${row.sampleQuestionId}`}
                    className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2"
                  >
                    <span>Review Audit</span>
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
