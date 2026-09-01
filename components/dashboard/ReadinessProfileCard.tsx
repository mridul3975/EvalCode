"use client";

import React from "react";
import { UserProfileStats } from "@/types/submission";
import { ReadinessGauge } from "@/components/infographics/ReadinessGauge";
import { cn } from "@/lib/utils";
import {
  ShieldCheck,
  CheckCircle2,
  Trophy,
  Flame,
  Clock,
  TrendingUp,
  Target,
  ArrowRight,
} from "lucide-react";

export function ReadinessProfileCard({ profile }: { profile: UserProfileStats }) {
  const hasActivity = profile.total_evaluations_count > 0;
  const percentileText = hasActivity
    ? profile.readiness_score >= 90
      ? "TOP 5%"
      : profile.readiness_score >= 80
      ? "TOP 15%"
      : profile.readiness_score >= 70
      ? "TOP 35%"
      : "IN PROGRESS"
    : "UNRANKED";

  return (
    <div className="p-6 rounded-none bg-[#121417] border-2 border-[#242830] flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
      {/* Editorial Border Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#00ffc2]" />

      {/* Left: Overall Readiness & Target */}
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#00ffc2]" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00ffc2]">
            CANDIDATE READINESS PROFILE
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-mono uppercase">
          EVALUATION ACUITY
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md leading-relaxed">
          Aggregated performance across Practice Mode and Timed Mock Assessments computed via exponential decay weighting.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2 font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-[#0a0b0d] border border-[#242830] text-xs">
            <Target className="w-3.5 h-3.5 text-[#00ffc2]" />
            <span className="text-zinc-400">BENCHMARK:</span>
            <span className="font-bold text-white">90.0%+</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-[#0a0b0d] border border-[#242830] text-xs">
            <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-zinc-400">PERCENTILE:</span>
            <span className="font-bold text-sky-400">{percentileText}</span>
          </div>
        </div>
      </div>

      {/* Center Gauge */}
      <ReadinessGauge score={profile.readiness_score} size={200} />

      {/* Right Stats Grid */}
      <div className="grid grid-cols-2 gap-3 w-full lg:w-auto font-mono">
        <div className="p-3.5 rounded-none bg-[#0a0b0d] border border-[#242830] flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs uppercase font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00ffc2]" />
            <span>ACCURACY</span>
          </div>
          <span className="text-xl font-black text-white">
            {profile.verdict_accuracy.toFixed(1)}%
          </span>
          <span className="text-[10px] text-zinc-500">
            {Math.round((profile.verdict_accuracy / 100) * profile.total_evaluations_count)} / {profile.total_evaluations_count} VERIFIED
          </span>
        </div>

        <div className="p-3.5 rounded-none bg-[#0a0b0d] border border-[#242830] flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs uppercase font-bold">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>STREAK</span>
          </div>
          <span className="text-xl font-black text-amber-400">
            {profile.current_streak_days} DAYS
          </span>
          <span className="text-[10px] text-zinc-500">
            BEST: {profile.best_streak_days} DAYS
          </span>
        </div>

        <div className="p-3.5 rounded-none bg-[#0a0b0d] border border-[#242830] flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs uppercase font-bold">
            <Trophy className="w-3.5 h-3.5 text-sky-400" />
            <span>MOCK AVG</span>
          </div>
          <span className="text-xl font-black text-white">
            {profile.mock_average_score.toFixed(1)}%
          </span>
          <span className="text-[10px] text-zinc-500">
            {profile.total_mocks_count} MOCK TESTS
          </span>
        </div>

        <div className="p-3.5 rounded-none bg-[#0a0b0d] border border-[#242830] flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs uppercase font-bold">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span>PRACTICE AVG</span>
          </div>
          <span className="text-xl font-black text-white">
            {profile.practice_average_score.toFixed(1)}%
          </span>
          <span className="text-[10px] text-zinc-500">
            {profile.total_evaluations_count - profile.total_mocks_count} AUDITS
          </span>
        </div>
      </div>
    </div>
  );
}

export function MockHistoryTable({ history = [] }: { history?: any[] }) {
  if (history.length === 0) {
    return (
      <div className="p-8 rounded-none bg-[#121417] border-2 border-[#242830] text-center space-y-4 font-mono">
        <div className="w-12 h-12 rounded-none bg-[#0a0b0d] border border-[#242830] flex items-center justify-center mx-auto text-zinc-400">
          <Trophy className="w-6 h-6 text-zinc-500" />
        </div>
        <div className="space-y-1">
          <h4 className="text-base font-black text-white uppercase tracking-wider">NO ASSESSMENTS COMPLETED YET</h4>
          <p className="text-xs text-zinc-400 max-w-md mx-auto font-sans leading-relaxed">
            You haven't taken any mock assessments yet. Take a timed 3-question evaluation test to benchmark your readiness and unlock your certification scorecard.
          </p>
        </div>
        <a
          href="/assessment"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-[#00ffc2] hover:bg-white text-[#0a0b0d] font-mono font-black text-xs shadow-md transition-colors"
        >
          <span>LAUNCH MOCK ASSESSMENT</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-none bg-[#121417] border-2 border-[#242830] space-y-4 font-mono">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-widest text-zinc-300">
          RECENT ASSESSMENT & AUDIT HISTORY
        </span>
        <span className="text-[11px] text-zinc-500">{history.length} ASSESSMENTS RECORDED</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#242830] text-zinc-400 font-black uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">DATE</th>
              <th className="py-3 px-4">ASSESSMENT ID</th>
              <th className="py-3 px-4">SCORE</th>
              <th className="py-3 px-4">TIME SPENT</th>
              <th className="py-3 px-4">STATUS</th>
              <th className="py-3 px-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#242830] font-mono">
            {history.map((session) => (
              <tr key={session.id} className="hover:bg-[#1a1d24] transition-colors">
                <td className="py-3.5 px-4 text-zinc-400">
                  {new Date(session.started_at).toLocaleDateString()}
                </td>
                <td className="py-3.5 px-4 font-bold text-zinc-200">
                  #{session.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="py-3.5 px-4 font-black text-[#00ffc2]">
                  {session.total_score ? session.total_score.toFixed(0) : "0"} / 100
                </td>
                <td className="py-3.5 px-4 text-zinc-400">
                  {session.time_spent_seconds ? `${Math.floor(session.time_spent_seconds / 60)}m ${session.time_spent_seconds % 60}s` : "TIMED"}
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-none text-[#00ffc2] bg-[#00ffc2]/10 border border-[#00ffc2]/30">
                    COMPLETED
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <a
                    href="/assessment/results"
                    className="inline-flex items-center gap-1 text-[#00ffc2] hover:text-white font-bold underline underline-offset-4"
                  >
                    <span>VIEW SCORECARD</span>
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
