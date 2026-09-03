"use client";

import React, { useState } from "react";
import Link from "next/link";
import { OA_TRACKS, OA_PROBLEMS } from "@/data/oa-problems";
import { CompanyProfile } from "@/types/oa";
import { cn } from "@/lib/utils";
import {
  Timer,
  Sparkles,
  ArrowRight,
  Flame,
  Layers,
  Cpu,
  CheckCircle2,
  Building2,
  Shield,
  HelpCircle,
  Clock,
  ChevronRight,
  Zap,
} from "lucide-react";

const COMPANY_FILTERS: Array<{ key: string; label: string }> = [
  { key: "all", label: "ALL TRACKS" },
  { key: "Citadel", label: "CITADEL" },
  { key: "Google", label: "GOOGLE" },
  { key: "Fintech", label: "ZURICH FINTECH" },
  { key: "Meta", label: "META" },
  { key: "Two Sigma", label: "TWO SIGMA" },
];

export default function OALobbyPage() {
  const [selectedCompany, setSelectedCompany] = useState<string>("all");

  const filteredTracks = OA_TRACKS.filter(
    (t) => selectedCompany === "all" || t.companyProfile === selectedCompany
  );

  return (
    <div className="min-h-screen bg-[#121416] text-[#e2e2e5] font-['Hanken_Grotesk'] antialiased">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        {/* Header Hero */}
        <div className="space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>HACKERRANK & CODESIGNAL MULTI-QUESTION OA ENVIRONMENT</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-none font-mono">
            70–90 MINUTE MULTI-PROBLEM ASSESSMENTS
          </h1>

          <p className="text-base sm:text-lg text-[#b9cbc1] font-normal leading-relaxed">
            Realistic high-stakes technical coding screenings modeled after Citadel, Google, and Tier-1 FinTech hiring standards.
            Allocate time across 2–4 problems under a global countdown clock, defend algorithmic invariants, and justify your code directly before a Gemini Principal Staff Bar Raiser.
          </p>
        </div>

        {/* 4-Phase Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 font-mono">
          <div className="neu-card p-6 space-y-3 border-l-4 border-l-emerald-400">
            <span className="text-[10px] text-neutral-500 font-bold uppercase">PHASE 1</span>
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>MULTI-TAB WORKSPACE</span>
            </div>
            <p className="text-xs text-neutral-400 font-sans leading-relaxed">
              Solve 2–3 problems freely under a single 75-min timer. Code and test states stay isolated per problem.
            </p>
          </div>

          <div className="neu-card p-6 space-y-3 border-l-4 border-l-sky-400">
            <span className="text-[10px] text-neutral-500 font-bold uppercase">PHASE 2</span>
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>PRE-SUBMIT & DEFENSE</span>
            </div>
            <p className="text-xs text-neutral-400 font-sans leading-relaxed">
              Review test matrix warnings, lock code, and document Big-O Time & Space complexities for each solution.
            </p>
          </div>

          <div className="neu-card p-6 space-y-3 border-l-4 border-l-purple-400">
            <span className="text-[10px] text-neutral-500 font-bold uppercase">PHASE 3</span>
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>GEMINI BAR-RAISER ROUND</span>
            </div>
            <p className="text-xs text-neutral-400 font-sans leading-relaxed">
              Gemini audits your hardest implementation and probes scale, memory bounds, and edge-case invariants.
            </p>
          </div>

          <div className="neu-card p-6 space-y-3 border-l-4 border-l-amber-400">
            <span className="text-[10px] text-neutral-500 font-bold uppercase">PHASE 4</span>
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Timer className="w-4 h-4 text-amber-400" />
              <span>COMPREHENSIVE AUDIT</span>
            </div>
            <p className="text-xs text-neutral-400 font-sans leading-relaxed">
              Receive a hiring bar verdict (Strong Pass to Fail) with full hidden test matrix, radar metrics, and feedback.
            </p>
          </div>
        </div>

        {/* Company Filters */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
          {COMPANY_FILTERS.map((comp) => (
            <button
              key={comp.key}
              type="button"
              onClick={() => setSelectedCompany(comp.key)}
              className={cn(
                "px-4 py-2 rounded-xl font-bold uppercase transition-all whitespace-nowrap cursor-pointer",
                selectedCompany === comp.key
                  ? "neu-inset text-white font-black border border-white/20"
                  : "neu-button text-neutral-400 hover:text-white"
              )}
            >
              {comp.label}
            </button>
          ))}
        </div>

        {/* Assessment Tracks Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between font-mono text-xs">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>SELECT AN ASSESSMENT TRACK</span>
            </h2>
            <span className="text-neutral-400 font-mono">
              Showing {filteredTracks.length} Official Company Tracks
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {filteredTracks.map((track) => {
              const companyBadgeColor = {
                Citadel: "border-amber-500/40 text-amber-400 bg-amber-500/10",
                Google: "border-sky-500/40 text-sky-400 bg-sky-500/10",
                Meta: "border-blue-500/40 text-blue-400 bg-blue-500/10",
                Fintech: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
                "Two Sigma": "border-purple-500/40 text-purple-400 bg-purple-500/10",
                Amazon: "border-orange-500/40 text-orange-400 bg-orange-500/10",
              }[track.companyProfile] || "border-white/20 text-white bg-white/10";

              const trackProblems = track.problemIds
                .map((id) => OA_PROBLEMS.find((p) => p.id === id))
                .filter(Boolean);

              const durationMins = Math.round(track.totalTimeSeconds / 60);

              return (
                <div
                  key={track.id}
                  className="neu-card p-6 sm:p-8 space-y-6 flex flex-col justify-between transition-all group hover:translate-y-[-2px]"
                >
                  <div className="space-y-5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap font-mono">
                          <span className={cn("px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border", companyBadgeColor)}>
                            {track.companyProfile}
                          </span>
                          <span className="neu-active-pill px-2.5 py-0.5 text-[10px] font-bold text-neutral-300">
                            {track.problemIds.length} PROBLEMS
                          </span>
                          <span className="text-[11px] text-neutral-400">
                            100 TOTAL POINTS
                          </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors font-mono">
                          {track.title}
                        </h3>
                        <p className="text-xs font-mono text-neutral-400">
                          {track.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 font-mono text-xs text-neutral-300 shrink-0 neu-inset px-3.5 py-2">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-bold text-white">{durationMins} MINS</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
                      {track.description}
                    </p>

                    {/* Problems Breakdown Matrix */}
                    <div className="neu-inset p-4 space-y-2.5 font-mono text-xs">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                        Included Assessment Problems:
                      </span>
                      <div className="space-y-2">
                        {trackProblems.map((prob, idx) => {
                          const weight = track.problemWeights[prob!.id] || 0;
                          return (
                            <div
                              key={prob!.id}
                              className="flex items-center justify-between text-[11px] text-neutral-300 hover:text-white"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className="text-neutral-500 font-bold">Q{idx + 1}:</span>
                                <span className="truncate">{prob!.title}</span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0 text-neutral-400">
                                <span
                                  className={cn(
                                    "px-1.5 py-0.2 rounded text-[9px] uppercase font-bold",
                                    prob!.difficulty === "Hard" ? "text-rose-400" : "text-amber-400"
                                  )}
                                >
                                  {prob!.difficulty}
                                </span>
                                <span className="font-bold text-white">{weight} pts</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                      {track.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-black/40 text-neutral-400 border border-white/5"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="pt-5 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center gap-2 text-neutral-400">
                      <span>Global Timer</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">HackerRank Standard</span>
                    </div>

                    <Link
                      href={`/oa/${track.id}`}
                      className="neu-button bg-white text-black hover:bg-neutral-200 px-5 py-2.5 rounded-xl font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg"
                    >
                      <span>START {durationMins}-MIN OA</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
