"use client";

import React from "react";
import { UserProfileStats } from "@/types/submission";
import { cn } from "@/lib/utils";
import { ArrowRight, Trophy } from "lucide-react";

export function ReadinessProfileCard({ profile }: { profile: UserProfileStats }) {
  const hasActivity = profile.total_evaluations_count > 0;
  const isReady = profile.readiness_score >= 90;
  const statusLabel = isReady
    ? "READY"
    : profile.readiness_score >= 80
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
    <section className="flex flex-col lg:flex-row w-full border-4 border-white bg-[#121416] text-white">
      {/* Massive 70% Title & Overview Area */}
      <div className="lg:w-2/3 p-6 sm:p-12 lg:p-16 flex flex-col justify-between border-b-4 lg:border-b-0 lg:border-r-4 border-white relative overflow-hidden">
        <div className="z-10">
          <div className="text-xs font-black uppercase tracking-widest mb-4 px-2 py-1 bg-white text-black inline-block border-2 border-white">
            CANDIDATE READINESS PROFILE
          </div>
          <h1 className="font-['Hanken_Grotesk'] font-black text-6xl sm:text-8xl lg:text-[8vw] leading-[0.85] tracking-tighter uppercase mb-8 break-words">
            Eval<br />Acuity
          </h1>
          <p className="text-base sm:text-xl lg:text-2xl font-light max-w-2xl border-l-8 border-white pl-6 leading-relaxed text-zinc-200">
            Aggregated performance across Practice Mode and Timed Mock Assessments computed via exponential decay weighting.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-6 z-10 font-['Hanken_Grotesk']">
          <div className="border-4 border-black p-6 bg-white text-black shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            <div className="text-xs font-black uppercase tracking-widest mb-1 font-mono">BENCHMARK</div>
            <div className="text-3xl sm:text-4xl font-black">90.0%+</div>
          </div>
          <div className="border-4 border-white p-6 bg-[#121416] text-white shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)]">
            <div className="text-xs font-black uppercase tracking-widest mb-1 font-mono">PERCENTILE</div>
            <div className="text-3xl sm:text-4xl font-black text-white">{percentileText}</div>
          </div>
        </div>
      </div>

      {/* 30% Gauge & 2x2 Stats Area */}
      <div className="lg:w-1/3 flex flex-col bg-white text-black">
        {/* Massive Gauge Block */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 border-b-4 border-black bg-white text-black relative">
          <div className="text-7xl sm:text-9xl font-['Hanken_Grotesk'] font-black tracking-tighter mb-4 relative z-10">
            {profile.readiness_score.toFixed(1)}%
          </div>
          <div className="bg-black text-white px-6 py-2 text-xl font-black uppercase tracking-widest border-2 border-black z-10 font-['Hanken_Grotesk']">
            {statusLabel}
          </div>
          {/* Abstract background graphic */}
          <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
            <line stroke="black" strokeWidth="4" x1="0" x2="100" y1="100" y2="0" />
            <line stroke="black" strokeWidth="4" x1="0" x2="100" y1="0" y2="100" />
            <circle cx="50" cy="50" fill="none" r="40" stroke="black" strokeWidth="8" />
          </svg>
        </div>

        {/* 2x2 Stats Grid */}
        <div className="grid grid-cols-2 bg-white text-black font-['Hanken_Grotesk']">
          <div className="p-5 border-r-4 border-b-4 border-black flex flex-col justify-center">
            <div className="text-[10px] font-black uppercase tracking-widest mb-1 font-mono text-zinc-600">VERDICT ACCURACY</div>
            <div className="text-3xl sm:text-4xl font-black">{profile.verdict_accuracy.toFixed(1)}%</div>
            <div className="text-xs font-mono text-zinc-600 mt-1">{Math.round((profile.verdict_accuracy / 100) * profile.total_evaluations_count)} / {profile.total_evaluations_count} verified</div>
          </div>
          <div className="p-5 border-b-4 border-black flex flex-col justify-center bg-zinc-100">
            <div className="text-[10px] font-black uppercase tracking-widest mb-1 font-mono text-zinc-600">ACTIVE STREAK</div>
            <div className="text-3xl sm:text-4xl font-black">{profile.current_streak_days}D</div>
            <div className="text-xs font-mono text-zinc-600 mt-1">Best: {profile.best_streak_days}D</div>
          </div>
          <div className="p-5 border-r-4 border-black flex flex-col justify-center">
            <div className="text-[10px] font-black uppercase tracking-widest mb-1 font-mono text-zinc-600">MOCK AVG</div>
            <div className="text-3xl sm:text-4xl font-black">{profile.mock_average_score.toFixed(1)}%</div>
            <div className="text-xs font-mono text-zinc-600 mt-1">{profile.total_mocks_count} taken</div>
          </div>
          <div className="p-5 flex flex-col justify-center bg-zinc-100">
            <div className="text-[10px] font-black uppercase tracking-widest mb-1 font-mono text-zinc-600">PRACTICE AVG</div>
            <div className="text-3xl sm:text-4xl font-black">{profile.practice_average_score.toFixed(1)}%</div>
            <div className="text-xs font-mono text-zinc-600 mt-1">{profile.total_evaluations_count - profile.total_mocks_count} audits</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MockHistoryTable({ history = [] }: { history?: any[] }) {
  if (history.length === 0) {
    return (
      <section className="p-8 sm:p-16 flex flex-col items-center justify-center text-center border-4 border-white bg-[#121416] w-full">
        <div className="bg-white text-black p-8 sm:p-12 border-4 border-black shadow-[16px_16px_0px_0px_rgba(255,255,255,1)] max-w-3xl w-full">
          <h3 className="font-['Hanken_Grotesk'] font-black text-4xl sm:text-6xl uppercase tracking-tighter mb-4 leading-none">
            ZERO ASSESSMENTS
          </h3>
          <p className="text-base sm:text-xl font-bold uppercase mb-8 font-mono">
            You haven't taken any mock assessments yet. Take a timed 3-question evaluation test.
          </p>
          <a
            href="/assessment"
            className="block bg-black text-white font-['Hanken_Grotesk'] font-black uppercase text-xl sm:text-2xl px-8 py-6 hover:bg-zinc-800 transition-none w-full shadow-[8px_8px_0px_0px_rgba(120,120,120,1)] text-center cursor-pointer"
          >
            LAUNCH MOCK NOW ➔
          </a>
        </div>
      </section>
    );
  }

  return (
    <div className="border-4 border-white bg-[#121416] text-white p-6 sm:p-10 space-y-6">
      <div className="flex items-center justify-between border-b-4 border-white pb-4">
        <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-['Hanken_Grotesk']">
          ASSESSMENT & AUDIT LOGS
        </h3>
        <span className="text-xs font-mono uppercase bg-white text-black px-3 py-1 font-bold">
          {history.length} RECORDED
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="border-b-4 border-white text-white font-black uppercase text-xs">
              <th className="py-3 px-4">DATE</th>
              <th className="py-3 px-4">SESSION ID</th>
              <th className="py-3 px-4">SCORE</th>
              <th className="py-3 px-4">DURATION</th>
              <th className="py-3 px-4">STATUS</th>
              <th className="py-3 px-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-white font-mono">
            {history.map((session) => (
              <tr key={session.id} className="hover:bg-white hover:text-black transition-none">
                <td className="py-3.5 px-4 font-bold">
                  {new Date(session.started_at).toLocaleDateString()}
                </td>
                <td className="py-3.5 px-4 font-bold">
                  #{session.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="py-3.5 px-4 text-sm font-black">
                  {session.total_score ? session.total_score.toFixed(0) : "0"} / 100
                </td>
                <td className="py-3.5 px-4 font-bold">
                  {session.time_spent_seconds ? `${Math.floor(session.time_spent_seconds / 60)}m ${session.time_spent_seconds % 60}s` : "TIMED"}
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 bg-white text-black border border-black font-black text-[10px] uppercase">
                    COMPLETED
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <a
                    href="/assessment/results"
                    className="font-bold uppercase underline underline-offset-4"
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
