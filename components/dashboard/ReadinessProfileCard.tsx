"use client";

import React from "react";
import { UserProfileStats } from "@/types/submission";
import { cn } from "@/lib/utils";
import { ArrowRight, Trophy, ShieldCheck, Flame, Zap } from "lucide-react";

export function ReadinessProfileCard({ profile }: { profile: UserProfileStats }) {
  const hasActivity = profile.total_evaluations_count > 0;
  const isReady = profile.readiness_score >= 90;
  const isBorderline = profile.readiness_score >= 80;

  const statusLabel = isReady
    ? "READY"
    : isBorderline
    ? "BORDERLINE"
    : hasActivity
    ? "IN TRAINING"
    : "NOT READY";

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
    <section className="obsidian-card w-full flex flex-col lg:flex-row overflow-hidden">
      {/* Left 65%: Massive Tactile Title & Overview */}
      <div className="lg:w-2/3 p-8 sm:p-12 lg:p-14 flex flex-col justify-between space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="obsidian-chip-optimal">
              CANDIDATE READINESS PROFILE
            </span>
            <span className="text-xs font-mono text-[#b9cbc1] uppercase">
              EXPONENTIAL DECAY WEIGHTED
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-black tracking-tight leading-[0.9] text-white uppercase font-['Hanken_Grotesk']">
            Eval<br />
            <span className="text-[#00ffc2]">Acuity</span>
          </h1>

          <p className="text-base sm:text-xl text-[#b9cbc1] font-normal leading-relaxed max-w-2xl font-['Hanken_Grotesk'] pt-2">
            Aggregated competency across Practice Mode and Timed Mock Assessments benchmarked against Tier-1 AI evaluation rubrics.
          </p>
        </div>

        {/* Tactile Benchmark Pods */}
        <div className="flex flex-wrap gap-4 pt-4">
          <div className="obsidian-inset p-5 flex flex-col justify-center min-w-[160px]">
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#b9cbc1] uppercase">
              TARGET BENCHMARK
            </span>
            <span className="text-3xl sm:text-4xl font-bold text-[#00ffc2] font-['Hanken_Grotesk'] mt-1">
              90.0%+
            </span>
          </div>

          <div className="obsidian-inset p-5 flex flex-col justify-center min-w-[160px]">
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#b9cbc1] uppercase">
              PERCENTILE RANK
            </span>
            <span className="text-3xl sm:text-4xl font-bold text-white font-['Hanken_Grotesk'] mt-1">
              {percentileText}
            </span>
          </div>
        </div>
      </div>

      {/* Right 35%: Tactile Dial & 2x2 Stats Pods */}
      <div className="lg:w-1/3 p-6 sm:p-8 flex flex-col justify-between bg-[#17191b] border-t lg:border-t-0 lg:border-l border-[rgba(255,255,255,0.05)] space-y-6">
        {/* Gauge Center Pod */}
        <div className="obsidian-inset p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <span className="text-xs font-mono font-bold text-[#b9cbc1] uppercase tracking-widest mb-1">
            READINESS SCORE
          </span>

          <div className="text-7xl sm:text-8xl font-black text-white tracking-tighter my-2 drop-shadow-[0_0_24px_rgba(0,255,194,0.15)] font-['Hanken_Grotesk']">
            {profile.readiness_score.toFixed(1)}%
          </div>

          <span
            className={cn(
              "mt-2",
              isReady
                ? "obsidian-chip-optimal"
                : isBorderline
                ? "obsidian-chip-neutral"
                : "obsidian-chip-critical"
            )}
          >
            {statusLabel}
          </span>
        </div>

        {/* 2x2 Tactile Stats Grid */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="obsidian-inset p-4 flex flex-col justify-center">
            <span className="text-[10px] font-mono font-bold text-[#b9cbc1] uppercase tracking-wider">
              VERDICT ACCURACY
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-white font-['Hanken_Grotesk'] mt-1">
              {profile.verdict_accuracy.toFixed(1)}%
            </span>
            <span className="text-[10px] font-mono text-[#83958c] mt-0.5">
              {profile.total_evaluations_count} verified
            </span>
          </div>

          <div className="obsidian-inset p-4 flex flex-col justify-center">
            <span className="text-[10px] font-mono font-bold text-[#b9cbc1] uppercase tracking-wider">
              ACTIVE STREAK
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-[#00ffc2] font-['Hanken_Grotesk'] mt-1">
              {profile.current_streak_days}D
            </span>
            <span className="text-[10px] font-mono text-[#83958c] mt-0.5">
              Best: {profile.best_streak_days}D
            </span>
          </div>

          <div className="obsidian-inset p-4 flex flex-col justify-center">
            <span className="text-[10px] font-mono font-bold text-[#b9cbc1] uppercase tracking-wider">
              MOCK AVERAGE
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-white font-['Hanken_Grotesk'] mt-1">
              {profile.mock_average_score.toFixed(1)}%
            </span>
            <span className="text-[10px] font-mono text-[#83958c] mt-0.5">
              {profile.total_mocks_count} taken
            </span>
          </div>

          <div className="obsidian-inset p-4 flex flex-col justify-center">
            <span className="text-[10px] font-mono font-bold text-[#b9cbc1] uppercase tracking-wider">
              PRACTICE AVERAGE
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-white font-['Hanken_Grotesk'] mt-1">
              {profile.practice_average_score.toFixed(1)}%
            </span>
            <span className="text-[10px] font-mono text-[#83958c] mt-0.5">
              {profile.total_evaluations_count - profile.total_mocks_count} audits
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MockHistoryTable({ history = [] }: { history?: any[] }) {
  if (history.length === 0) {
    return (
      <section className="obsidian-card p-8 sm:p-14 flex flex-col items-center justify-center text-center space-y-6 w-full">
        <div className="w-14 h-14 rounded-2xl bg-[#121416] flex items-center justify-center text-[#00ffc2] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.04)]">
          <Trophy className="w-7 h-7" />
        </div>

        <div className="space-y-2 max-w-lg">
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            ZERO RECORDED EXAMS
          </h3>
          <p className="text-sm text-[#b9cbc1] font-sans leading-relaxed">
            You haven't completed any mock assessments yet. Take a timed 50-minute exam to calibrate your readiness scorecard.
          </p>
        </div>

        <a
          href="/assessment"
          className="obsidian-btn-primary px-8 py-4 text-sm font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
        >
          <span>LAUNCH MOCK EXAM</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </section>
    );
  }

  return (
    <div className="obsidian-card p-6 sm:p-10 space-y-6">
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-4">
        <div>
          <span className="text-xs font-mono font-bold text-[#b9cbc1] uppercase tracking-widest">
            LOGS & AUDIT HISTORY
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">
            ASSESSMENT LOGS
          </h3>
        </div>
        <span className="obsidian-chip-neutral">
          {history.length} RECORDED
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.06)] text-[#b9cbc1] uppercase text-xs">
              <th className="py-3 px-4">DATE</th>
              <th className="py-3 px-4">SESSION ID</th>
              <th className="py-3 px-4">SCORE</th>
              <th className="py-3 px-4">DURATION</th>
              <th className="py-3 px-4">STATUS</th>
              <th className="py-3 px-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
            {history.map((session) => (
              <tr key={session.id} className="hover:bg-[#282a2c]/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-white">
                  {new Date(session.started_at).toLocaleDateString()}
                </td>
                <td className="py-3.5 px-4 text-[#b9cbc1]">
                  #{session.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="py-3.5 px-4 text-sm font-bold text-[#00ffc2]">
                  {session.total_score ? session.total_score.toFixed(0) : "0"}%
                </td>
                <td className="py-3.5 px-4 text-[#b9cbc1]">
                  {session.time_spent_seconds ? `${Math.floor(session.time_spent_seconds / 60)}m ${session.time_spent_seconds % 60}s` : "TIMED"}
                </td>
                <td className="py-3.5 px-4">
                  <span className="obsidian-chip-optimal">
                    COMPLETED
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <a
                    href="/assessment/results"
                    className="text-[#00ffc2] font-bold uppercase hover:underline"
                  >
                    SCORECARD ➔
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
