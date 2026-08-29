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
  Target,
  FileCode,
  Check,
  ShieldCheck,
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
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/20 selection:text-emerald-200">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 sm:pt-16 pb-20 border-b border-zinc-800/80">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center gap-12">
          {/* Left Hero Content */}
          <div className="flex-1 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Evaluation & RLHF Assessment Simulator</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tighter text-white leading-[1.08]">
              Stop Solving from Scratch. <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
                Audit AI-Generated Code.
              </span>
            </h1>

            {/* Subtext cap: <20 words as per design-taste directive */}
            <p className="text-base text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
              Screening tests at Alignerr, Mindrift, and Scale AI measure code evaluation: spotting logic flaws, boundary regressions, and deceptive commentary.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/practice"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Code2 className="w-4 h-4" />
                <span>Launch Review Studio</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Link>

              <Link
                href="/assessment"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 font-semibold text-xs transition-all active:scale-[0.98] cursor-pointer"
              >
                <Timer className="w-4 h-4 text-emerald-400" />
                <span>Take 50m Mock Assessment</span>
              </Link>
            </div>
          </div>

          {/* Right: Interactive Live Mini-Evaluation Teaser */}
          <div className="w-full lg:w-[520px] rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-zinc-200">Interactive Teaser: Audit This AI Snippet</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">10s Benchmark</span>
            </div>

            {/* Code Snippet */}
            <div className="p-3.5 rounded-xl bg-zinc-950 font-mono text-xs text-zinc-300 space-y-1 overflow-x-auto border border-zinc-800/80">
              <div className="text-zinc-500">// Problem: Reverse Singly Linked List</div>
              <div><span className="text-purple-400">def</span> <span className="text-sky-300">reverseList</span>(head):</div>
              <div className="pl-4">prev = <span className="text-orange-300">None</span>; curr = head</div>
              <div className="pl-4"><span className="text-purple-400">while</span> curr:</div>
              <div className="pl-8 text-rose-300 bg-rose-950/40 px-1 rounded border-l border-rose-500">curr.next = prev  <span className="text-zinc-500">// Line 5</span></div>
              <div className="pl-8">prev = curr</div>
              <div className="pl-8">curr = curr.next</div>
              <div className="pl-4"><span className="text-purple-400">return</span> prev</div>
            </div>

            {/* Interactive Verdict Buttons */}
            {!showTeaserResult ? (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  What is your evaluation verdict on Line 5?
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => handleTeaserSubmit("correct")}
                    className="p-3 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 transition-all active:scale-95 cursor-pointer text-left flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Completely Correct</span>
                  </button>
                  <button
                    onClick={() => handleTeaserSubmit("bug")}
                    className="p-3 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 transition-all active:scale-95 cursor-pointer text-left flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Fatal Pointer Bug</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Teaser Discrepancy Diff Result */
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    {selectedVerdict === "bug" ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400 font-mono font-bold">Exact Match! 10 / 10 Score</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span className="text-rose-400 font-mono font-bold">False Negative! 0 / 10 Score</span>
                      </>
                    )}
                  </span>
                  <button
                    onClick={() => setShowTeaserResult(false)}
                    className="text-[11px] text-zinc-500 hover:text-zinc-300 underline cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  <strong>Root Cause:</strong> Line 5 overwrites <code>curr.next = prev</code> before saving a reference to <code>next_node</code>. Line 7 subsequently assigns <code>curr = curr.next</code> (which is now <code>prev</code>), causing an infinite loop oscillating on the first node!
                </p>

                <Link
                  href="/practice/q_ll_001"
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-emerald-500 text-zinc-950 text-xs font-bold transition-all active:scale-95"
                >
                  <span>Open Full Review Studio for this Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PLATFORM LOGO STRIP */}
      <section className="py-10 border-b border-zinc-800/60 bg-zinc-950/40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-mono">
            Calibrated for screening at:
          </span>
          <div className="flex flex-wrap items-center gap-8 text-xs font-mono font-bold text-zinc-400">
            <span className="hover:text-zinc-200 transition-colors">ALIGNERR</span>
            <span className="hover:text-zinc-200 transition-colors">MINDRIFT</span>
            <span className="hover:text-zinc-200 transition-colors">SCALE AI / OUTLIER</span>
            <span className="hover:text-zinc-200 transition-colors">TURING RLHF</span>
            <span className="hover:text-zinc-200 transition-colors">ENTERPRISE CODE REVIEW</span>
          </div>
        </div>
      </section>

      {/* COMPARISON SECTION: LEETCODE VS EVALFORGE */}
      <section className="py-20 max-w-[1400px] mx-auto px-4 sm:px-6 w-full space-y-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Code Synthesis vs. Code Evaluation
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Why 90% of LeetCode practitioners fail AI-trainer technical screeners on their first try.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional LeetCode Card */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                <FileCode className="w-4 h-4 text-zinc-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-300">Traditional LeetCode</h3>
                <span className="text-[11px] text-zinc-500 font-mono">Code Synthesis Paradigm</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-zinc-400">
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Writes code from scratch with rote syntax recall.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Binary pass/fail based solely on test-case execution.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Ignores deceptive or hallucinated natural language AI commentary.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Zero calibration for false positives (rejecting good code).</span>
              </li>
            </ul>
          </div>

          {/* EvalForge Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/20 to-zinc-900/60 border border-emerald-500/30 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">EvalForge</h3>
                <span className="text-[11px] text-emerald-400 font-mono">Multi-Dimensional Evaluation</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-zinc-300">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Audits pre-generated AI solutions with calibrated defects.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Diagnostic Discrepancy Diff matches findings to Ground Truth.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Evaluates 6 dimensions: Correctness, Edge Cases, Complexity, etc.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Readiness Index $R$ benchmarks you against screening standards.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6-DIMENSIONAL RUBRIC MATRIX */}
      <section className="py-20 border-t border-zinc-800 bg-zinc-950/60">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              The 6-Dimensional Evaluation Rubric
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Every submission is graded against the exact dimensions used by premier RLHF platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: "1. Functional Correctness",
                weight: "30% Weight",
                desc: "Accurately classify whether the code solves standard cases or contains fatal logic crashes.",
                color: "text-emerald-400",
                border: "border-emerald-500/30",
              },
              {
                title: "2. Edge-Case Analysis",
                weight: "25% Weight",
                desc: "Identify boundary vulnerabilities: empty arrays, single nodes, duplicates, and integer overflows.",
                color: "text-amber-400",
                border: "border-amber-500/30",
              },
              {
                title: "3. Complexity & Big-O",
                weight: "15% Weight",
                desc: "Spot asymptotic regressions: quadratic string copies, nested lookups, and recursive stack overhead.",
                color: "text-sky-400",
                border: "border-sky-500/30",
              },
              {
                title: "4. Explanation Auditing",
                weight: "15% Weight",
                desc: "Catch deceptive or hallucinated commentary claiming different algorithmic properties than the code.",
                color: "text-purple-400",
                border: "border-purple-500/30",
              },
              {
                title: "5. Instruction Compliance",
                weight: "15% Weight",
                desc: "Verify strict adherence to constraints: in-place mutations, O(1) space, and return formatting.",
                color: "text-orange-400",
                border: "border-orange-500/30",
              },
              {
                title: "6. Remediation & Fixes",
                weight: "Diagnostic",
                desc: "Provide concise, verified refactoring advice or corrected code implementations.",
                color: "text-pink-400",
                border: "border-pink-500/30",
              },
            ].map((rub, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">{rub.title}</h3>
                  <span className={cn("text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-950 border", rub.border, rub.color)}>
                    {rub.weight}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">{rub.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 border-t border-zinc-800 bg-gradient-to-b from-zinc-950 to-zinc-900">
        <div className="max-w-[800px] mx-auto px-4 text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center">
            <Target className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Calibrate Your Code Review Acuity
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            Choose Practice Mode for instant granular feedback, or enter the Timed 5-Question Mock Assessment to test your readiness index.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              href="/practice"
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-xl transition-all active:scale-95"
            >
              Start Practice Catalog
            </Link>
            <Link
              href="/assessment"
              className="px-6 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs border border-zinc-700 transition-all active:scale-95"
            >
              Start 50m Mock Assessment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
