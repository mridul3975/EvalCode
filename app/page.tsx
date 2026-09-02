"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Code2,
  CheckCircle2,
  XCircle,
  Timer,
  Sparkles,
  ArrowRight,
  Flame,
  Check,
  Shield,
  Layers,
  Terminal,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const [selectedVerdict, setSelectedVerdict] = useState<"correct" | "bug" | null>(null);
  const [showTeaserResult, setShowTeaserResult] = useState(false);

  const handleTeaserSubmit = (verdict: "correct" | "bug") => {
    setSelectedVerdict(verdict);
    setShowTeaserResult(true);
  };

  return (
    <div className="min-h-screen bg-[#0d0e11] text-neutral-200 font-['Hanken_Grotesk'] antialiased selection:bg-neutral-800 selection:text-white">
      <div className="max-w-6xl mx-auto px-6 space-y-24 sm:space-y-32 py-12 md:py-20">
        {/* HERO SECTION: Asymmetric & Expansive */}
        <section className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 pt-6">
          {/* Left Hero Content */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/60 text-neutral-400 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>THE RLHF & CODE-REVIEW BENCHMARK</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              STOP SOLVING.<br />
              <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
                AUDIT AI CODE.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Screening assessments at Alignerr, Mindrift, and Scale AI measure code evaluation: spotting subtle logic flaws, boundary regressions, and deceptive commentary.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                href="/practice"
                className="h-12 px-7 rounded-lg font-medium text-sm bg-white text-black hover:bg-neutral-200 flex items-center gap-2 transition-colors shadow-lg cursor-pointer"
              >
                <Code2 className="w-4 h-4" />
                <span>LAUNCH REVIEW STUDIO</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/oa"
                className="h-12 px-7 rounded-lg border border-neutral-800 text-neutral-300 hover:bg-neutral-900 flex items-center gap-2 transition-colors font-medium text-sm cursor-pointer"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>40M OA SIMULATOR</span>
              </Link>
            </div>
          </div>

          {/* Right: Floating Perspective Mini Code Audit Preview */}
          <div className="w-full lg:w-[480px] shrink-0">
            <div className="relative rounded-xl border border-neutral-800 bg-neutral-950/80 p-5 shadow-2xl backdrop-blur-sm space-y-4 text-left font-mono">
              {/* Genuine Code Editor Header with 3 Window Dots */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                    <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                    <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                  </div>
                  <span className="text-xs text-neutral-400 font-mono ml-2">reverse_list.py</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-400">
                  10S BENCHMARK
                </span>
              </div>

              {/* Code Box */}
              <div className="p-4 rounded-lg bg-neutral-900/60 text-xs font-mono text-neutral-300 space-y-1 overflow-x-auto border border-neutral-800/50 leading-relaxed">
                <div className="text-neutral-500"># Problem: Reverse Singly Linked List</div>
                <div><span className="text-purple-400">def</span> <span className="text-sky-300">reverseList</span>(head):</div>
                <div className="pl-4">prev = <span className="text-orange-300">None</span>; curr = head</div>
                <div className="pl-4"><span className="text-purple-400">while</span> curr:</div>
                <div className="pl-8 text-rose-300 bg-rose-950/30 px-1.5 py-0.5 rounded border-l-2 border-rose-500 font-medium">curr.next = prev  <span className="text-neutral-500 font-normal"># Line 5</span></div>
                <div className="pl-8">prev = curr</div>
                <div className="pl-8">curr = curr.next</div>
                <div className="pl-4"><span className="text-purple-400">return</span> prev</div>
              </div>

              {!showTeaserResult ? (
                <div className="space-y-3 pt-1">
                  <span className="text-xs font-mono text-neutral-400 block font-medium">
                    WHAT IS YOUR VERDICT ON LINE 5?
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleTeaserSubmit("correct")}
                      className="p-3 rounded-lg bg-neutral-900/40 border border-neutral-800/60 hover:border-neutral-700 text-xs font-mono font-medium text-neutral-300 hover:text-white transition-all cursor-pointer flex items-center justify-between"
                    >
                      <span>CORRECT</span>
                      <CheckCircle2 className="w-4 h-4 text-neutral-500" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTeaserSubmit("bug")}
                      className="p-3 rounded-lg bg-neutral-900/40 border border-neutral-800/60 hover:border-neutral-700 text-xs font-mono font-medium text-neutral-300 hover:text-white transition-all cursor-pointer flex items-center justify-between"
                    >
                      <span>FATAL BUG</span>
                      <XCircle className="w-4 h-4 text-rose-400" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-neutral-900/40 border border-neutral-800/80 space-y-3 font-mono">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      {selectedVerdict === "bug" ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">EXACT MATCH! 10/10 SCORE</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-400" />
                          <span className="text-rose-400 font-bold">FALSE NEGATIVE! 0/10</span>
                        </>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowTeaserResult(false)}
                      className="text-[11px] text-neutral-500 hover:text-white underline cursor-pointer"
                    >
                      RETRY
                    </button>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                    Line 5 overwrites <code>curr.next = prev</code> before saving a reference to <code>next_node</code>. Line 7 subsequently assigns <code>curr = curr.next</code> (which is now <code>prev</code>), causing an infinite loop oscillating on the first node!
                  </p>

                  <Link
                    href="/practice/q_ll_001"
                    className="w-full py-2.5 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>OPEN IN REVIEW STUDIO</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* COMPARISON SECTION: Side-by-Side Sleek Split Matrix */}
        <section className="space-y-8">
          <div className="space-y-3 text-center sm:text-left">
            <span className="px-2.5 py-1 rounded-full text-xs font-mono border border-neutral-800 bg-neutral-900/60 text-neutral-400">
              PARADIGM SHIFT
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Code Synthesis vs. Code Evaluation
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 max-w-2xl font-normal">
              Traditional coding platforms test rote memory. Modern AI evaluations test your ability to audit, catch hallucinations, and benchmark reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column (Traditional LeetCode) */}
            <div className="rounded-xl border border-neutral-900 bg-neutral-950/40 opacity-75 hover:opacity-100 transition-opacity p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
                <h3 className="text-lg font-semibold text-neutral-300 uppercase tracking-tight font-mono">
                  Traditional LeetCode
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-neutral-900 text-neutral-500 border border-neutral-800">
                  SYNTHESIS
                </span>
              </div>

              <ul className="space-y-3 text-sm text-neutral-400 font-sans">
                <li className="flex items-start gap-3 py-1">
                  <span className="font-mono text-red-400/80 font-bold shrink-0">✕</span>
                  <span>Writes code from scratch with rote syntax recall.</span>
                </li>
                <li className="flex items-start gap-3 py-1">
                  <span className="font-mono text-red-400/80 font-bold shrink-0">✕</span>
                  <span>Binary pass/fail based solely on test-case execution.</span>
                </li>
                <li className="flex items-start gap-3 py-1">
                  <span className="font-mono text-red-400/80 font-bold shrink-0">✕</span>
                  <span>Ignores deceptive or hallucinated natural language AI commentary.</span>
                </li>
                <li className="flex items-start gap-3 py-1">
                  <span className="font-mono text-red-400/80 font-bold shrink-0">✕</span>
                  <span>Zero calibration for false positives (rejecting good code).</span>
                </li>
              </ul>
            </div>

            {/* Right Column (EvalForge) */}
            <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/10 via-neutral-950/40 to-neutral-950/80 p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
                <h3 className="text-lg font-semibold text-white uppercase tracking-tight font-mono">
                  EvalForge Simulator
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                  THE RLHF STANDARD
                </span>
              </div>

              <ul className="space-y-3 text-sm text-neutral-200 font-sans font-medium">
                <li className="flex items-start gap-3 py-1">
                  <span className="font-mono text-emerald-400 font-bold shrink-0">✓</span>
                  <span>Audits pre-generated AI solutions with calibrated defects.</span>
                </li>
                <li className="flex items-start gap-3 py-1">
                  <span className="font-mono text-emerald-400 font-bold shrink-0">✓</span>
                  <span>Diagnostic Discrepancy Diff matches findings to Ground Truth.</span>
                </li>
                <li className="flex items-start gap-3 py-1">
                  <span className="font-mono text-emerald-400 font-bold shrink-0">✓</span>
                  <span>Evaluates 6 dimensions: Correctness, Edge Cases, Complexity, etc.</span>
                </li>
                <li className="flex items-start gap-3 py-1">
                  <span className="font-mono text-emerald-400 font-bold shrink-0">✓</span>
                  <span>Readiness Index benchmarks you against screening standards.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 6-DIMENSIONAL RUBRIC MATRIX: Asymmetric Bento Grid */}
        <section className="space-y-8">
          <div className="space-y-3 text-center sm:text-left">
            <span className="px-2.5 py-1 rounded-full text-xs font-mono border border-neutral-800 bg-neutral-900/60 text-neutral-400">
              AUDIT TAXONOMY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              The 6-Dimensional Rubric Matrix
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 max-w-2xl font-normal">
              Structured evaluation frameworks aligned with OpenAI, Anthropic, Scale AI, and Google DeepMind code assessment standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Bento Card 1: Functional Correctness (Spans 2 cols on lg) */}
            <div className="lg:col-span-2 rounded-xl bg-neutral-900/40 border border-neutral-800/60 backdrop-blur-sm hover:border-neutral-700/80 transition-all p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  1. Functional Correctness
                </h3>
                <span className="px-2 py-0.5 text-xs rounded-full bg-neutral-800 text-neutral-300 font-mono">
                  30% WEIGHT
                </span>
              </div>
              <p className="text-sm text-neutral-400 leading-normal">
                Accurately classify whether the code solves standard cases or contains fatal logic crashes, off-by-one errors, infinite loops, and unhandled branch regressions.
              </p>
            </div>

            {/* Bento Card 2: Edge-Case Analysis */}
            <div className="rounded-xl bg-neutral-900/40 border border-neutral-800/60 backdrop-blur-sm hover:border-neutral-700/80 transition-all p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  2. Edge-Case Analysis
                </h3>
                <span className="px-2 py-0.5 text-xs rounded-full bg-neutral-800 text-neutral-300 font-mono">
                  25% WEIGHT
                </span>
              </div>
              <p className="text-sm text-neutral-400 leading-normal">
                Identify boundary vulnerabilities: empty arrays, single nodes, duplicates, negative numbers, and integer overflows.
              </p>
            </div>

            {/* Bento Card 3: Complexity & Big-O */}
            <div className="rounded-xl bg-neutral-900/40 border border-neutral-800/60 backdrop-blur-sm hover:border-neutral-700/80 transition-all p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                <h3 className="text-base font-bold text-white tracking-tight">
                  3. Complexity & Big-O
                </h3>
                <span className="px-2 py-0.5 text-xs rounded-full bg-neutral-800 text-neutral-300 font-mono">
                  15% WEIGHT
                </span>
              </div>
              <p className="text-sm text-neutral-400 leading-normal">
                Spot asymptotic regressions: quadratic string copies, nested lookups, and unneeded heap overhead.
              </p>
            </div>

            {/* Bento Card 4: Explanation Auditing */}
            <div className="rounded-xl bg-neutral-900/40 border border-neutral-800/60 backdrop-blur-sm hover:border-neutral-700/80 transition-all p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                <h3 className="text-base font-bold text-white tracking-tight">
                  4. Explanation Auditing
                </h3>
                <span className="px-2 py-0.5 text-xs rounded-full bg-neutral-800 text-neutral-300 font-mono">
                  15% WEIGHT
                </span>
              </div>
              <p className="text-sm text-neutral-400 leading-normal">
                Catch deceptive or hallucinated commentary claiming different algorithmic invariants than the code.
              </p>
            </div>

            {/* Bento Card 5 & 6 Combined / Grouped */}
            <div className="rounded-xl bg-neutral-900/40 border border-neutral-800/60 backdrop-blur-sm hover:border-neutral-700/80 transition-all p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                <h3 className="text-base font-bold text-white tracking-tight">
                  5. Instruction Compliance
                </h3>
                <span className="px-2 py-0.5 text-xs rounded-full bg-neutral-800 text-neutral-300 font-mono">
                  15% WEIGHT
                </span>
              </div>
              <p className="text-sm text-neutral-400 leading-normal">
                Verify strict adherence to constraints: in-place mutations, auxiliary space bounds, and exact return types.
              </p>
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION: High-End Developer Banner */}
        <section className="rounded-2xl border border-neutral-800/80 bg-gradient-to-b from-neutral-900/40 to-neutral-950/80 p-10 sm:p-16 flex flex-col items-center justify-center text-center space-y-6 shadow-2xl backdrop-blur-sm">
          <div className="space-y-3 max-w-2xl">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-neutral-800 text-neutral-300 border border-neutral-700/50">
              START CALIBRATION
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Calibrate Your Code Audit Acuity
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 font-normal leading-relaxed">
              Practice on 75+ benchmarks across calibrated defect categories or enter the timed 40-minute FAANG/FinTech Online Assessment.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/practice"
              className="w-full sm:w-auto h-12 px-8 rounded-lg font-medium text-sm bg-white text-black hover:bg-neutral-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>START PRACTICE CATALOG</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/oa"
              className="w-full sm:w-auto h-12 px-8 rounded-lg border border-neutral-800 text-neutral-300 hover:bg-neutral-900 flex items-center justify-center gap-2 transition-colors font-medium text-sm cursor-pointer"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>LAUNCH OA SIMULATOR</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
