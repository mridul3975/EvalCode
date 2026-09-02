"use client";

import React, { useState } from "react";
import Link from "next/link";
import { OA_PROBLEMS } from "@/data/oa-problems";
import { CompanyProfile } from "@/types/oa";
import { cn } from "@/lib/utils";
import {
  Timer,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Flame,
  Layers,
  Cpu,
  Zap,
  CheckCircle2,
  Building2,
  BrainCircuit,
  Lock,
} from "lucide-react";

const COMPANY_FILTERS: Array<{ key: string; label: string }> = [
  { key: "all", label: "ALL COMPANIES" },
  { key: "Citadel", label: "CITADEL" },
  { key: "Google", label: "GOOGLE" },
  { key: "Fintech", label: "ZURICH FINTECH" },
  { key: "Meta", label: "META" },
  { key: "Two Sigma", label: "TWO SIGMA" },
];

export default function OALobbyPage() {
  const [selectedCompany, setSelectedCompany] = useState<string>("all");

  const filteredProblems = OA_PROBLEMS.filter(
    (p) => selectedCompany === "all" || p.companyProfile === selectedCompany
  );

  return (
    <div className="min-h-screen bg-[#121416] text-[#e2e2e5] font-['Hanken_Grotesk'] antialiased">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        {/* Header Hero */}
        <div className="space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>FAANG & TIER-1 FINTECH ONLINE ASSESSMENT SIMULATOR</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight leading-none font-mono">
            40-MINUTE TIMED CODING SCREENINGS
          </h1>

          <p className="text-base sm:text-lg text-[#b9cbc1] font-normal leading-relaxed">
            High-stakes competitive coding assessments modeled after HackerRank and CodeSignal OAs at Citadel, Google, Meta, and quantitative trading desks. Code from scratch, defend against hidden edge cases, and justify your architecture directly before a Gemini Principal Staff Bar Raiser.
          </p>
        </div>

        {/* 4-Phase Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 font-mono">
          <div className="obsidian-card p-6 space-y-3 border-l-4 border-emerald-400">
            <span className="text-[10px] text-[#83958c] font-bold uppercase">PHASE 1</span>
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>CODE & SANDBOX</span>
            </div>
            <p className="text-xs text-[#b9cbc1] font-sans leading-relaxed">
              Write solution in Monaco IDE (Python, TS, C++). Run against visible sample test cases.
            </p>
          </div>

          <div className="obsidian-card p-6 space-y-3 border-l-4 border-sky-400">
            <span className="text-[10px] text-[#83958c] font-bold uppercase">PHASE 2</span>
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>SELF-EXPLANATION</span>
            </div>
            <p className="text-xs text-[#b9cbc1] font-sans leading-relaxed">
              Document algorithmic invariants, claim theoretical Time & Space Big-O complexity.
            </p>
          </div>

          <div className="obsidian-card p-6 space-y-3 border-l-4 border-purple-400">
            <span className="text-[10px] text-[#83958c] font-bold uppercase">PHASE 3</span>
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>GEMINI DEFENSE</span>
            </div>
            <p className="text-xs text-[#b9cbc1] font-sans leading-relaxed">
              Gemini analyzes your code and asks 2-3 tailored follow-ups on scale, edge cases, and memory trade-offs.
            </p>
          </div>

          <div className="obsidian-card p-6 space-y-3 border-l-4 border-amber-400">
            <span className="text-[10px] text-[#83958c] font-bold uppercase">PHASE 4</span>
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Timer className="w-4 h-4 text-amber-400" />
              <span>BAR-RAISER REPORT</span>
            </div>
            <p className="text-xs text-[#b9cbc1] font-sans leading-relaxed">
              Hiring verdict (Strong Pass to Fail) with hidden test matrix and senior staff critique.
            </p>
          </div>
        </div>

        {/* Company Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
          {COMPANY_FILTERS.map((comp) => (
            <button
              key={comp.key}
              type="button"
              onClick={() => setSelectedCompany(comp.key)}
              className={cn(
                "px-4 py-2 rounded-xl font-bold uppercase transition-all whitespace-nowrap cursor-pointer",
                selectedCompany === comp.key
                  ? "bg-white text-black font-black shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                  : "bg-[#181a1d] text-[#b9cbc1] hover:text-white border border-white/5"
              )}
            >
              {comp.label}
            </button>
          ))}
        </div>

        {/* Problem Assessment Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {filteredProblems.map((problem) => {
            const companyBadgeColor = {
              Citadel: "border-amber-500/40 text-amber-400 bg-amber-500/10",
              Google: "border-sky-500/40 text-sky-400 bg-sky-500/10",
              Meta: "border-blue-500/40 text-blue-400 bg-blue-500/10",
              Fintech: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
              "Two Sigma": "border-purple-500/40 text-purple-400 bg-purple-500/10",
            }[problem.companyProfile] || "border-white/20 text-white bg-white/10";

            return (
              <div
                key={problem.id}
                className="obsidian-card p-6 sm:p-8 space-y-6 flex flex-col justify-between border border-white/10 hover:border-white/30 transition-all group"
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap font-mono">
                        <span className={cn("px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border", companyBadgeColor)}>
                          {problem.companyProfile}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1e2022] text-[#b9cbc1] border border-white/5">
                          {problem.difficulty.toUpperCase()}
                        </span>
                        <span className="text-[11px] text-[#83958c]">
                          {problem.topic}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors font-mono">
                        {problem.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-xs text-[#83958c] shrink-0 bg-[#0c0e10] px-3 py-1.5 rounded-lg border border-white/5">
                      <Timer className="w-3.5 h-3.5 text-amber-400" />
                      <span>40 MINS</span>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-[#b9cbc1] font-sans line-clamp-3 leading-relaxed">
                    {problem.description.replace(/###[\s\S]*?\n/g, "").replace(/\n/g, " ").trim()}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                    {problem.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-[#1e2022] text-[#83958c] border border-white/5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-2 text-[#83958c]">
                    <span>{problem.testCases.length} Test Cases</span>
                    <span>•</span>
                    <span className="text-emerald-400">Gemini Follow-Ups</span>
                  </div>

                  <Link
                    href={`/oa/${problem.id}`}
                    className="neu-extruded bg-white hover:bg-zinc-200 text-black px-5 py-2.5 rounded-lg font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                  >
                    <span>START 40-MIN OA</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
