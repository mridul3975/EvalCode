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
    <div className="min-h-screen bg-[#121416] text-[#e2e2e5] font-['Hanken_Grotesk']">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* HERO SECTION: Obsidian Tactile Split Hero */}
        <section className="obsidian-card p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-12 overflow-hidden">
          {/* Left Hero Content */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2">

            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[0.95] uppercase">
              STOP SOLVING.<br />
              <span className="text-white">AUDIT AI CODE.</span>
            </h1>

            <p className="text-base sm:text-xl text-[#b9cbc1] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Screening tests at Alignerr, Mindrift, and Scale AI measure code evaluation: spotting subtle logic flaws, boundary regressions, and deceptive commentary.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/practice"
                className="obsidian-btn-primary px-8 py-4 text-sm font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <Code2 className="w-4 h-4" />
                <span>LAUNCH REVIEW STUDIO</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/assessment"
                className="obsidian-btn-secondary px-8 py-4 text-sm font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <Timer className="w-4 h-4 text-white" />
                <span>TAKE 50M MOCK</span>
              </Link>
            </div>
          </div>

          {/* Right: Interactive Live Mini-Evaluation Teaser */}
          <div className="w-full lg:w-[480px] obsidian-inset p-6 space-y-4 text-left font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.06)]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-xs font-bold text-white uppercase">AUDIT THIS AI SNIPPET</span>
              </div>
              <span className="obsidian-chip-neutral">10S BENCHMARK</span>
            </div>

            {/* Code Box */}
            <div className="p-4 rounded-xl bg-[#0c0e10] text-xs font-mono text-[#e2e2e5] space-y-1 overflow-x-auto border border-black/60 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.8)]">
              <div className="text-[#83958c]">// Problem: Reverse Singly Linked List</div>
              <div><span className="text-purple-400">def</span> <span className="text-sky-300">reverseList</span>(head):</div>
              <div className="pl-4">prev = <span className="text-orange-300">None</span>; curr = head</div>
              <div className="pl-4"><span className="text-purple-400">while</span> curr:</div>
              <div className="pl-8 text-rose-300 bg-rose-950/40 px-1 border-l-2 border-rose-500">curr.next = prev  <span className="text-zinc-500">// Line 5</span></div>
              <div className="pl-8">prev = curr</div>
              <div className="pl-8">curr = curr.next</div>
              <div className="pl-4"><span className="text-purple-400">return</span> prev</div>
            </div>

            {!showTeaserResult ? (
              <div className="space-y-3 pt-1">
                <span className="text-xs font-bold uppercase text-[#b9cbc1] block">
                  WHAT IS YOUR VERDICT ON LINE 5?
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleTeaserSubmit("correct")}
                    className="p-3 rounded-xl obsidian-card hover:bg-[#282a2c] text-xs font-bold text-white transition-all cursor-pointer text-left flex items-center justify-between"
                  >
                    <span>CORRECT</span>
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                  </button>
                  <button
                    onClick={() => handleTeaserSubmit("bug")}
                    className="p-3 rounded-xl obsidian-card hover:bg-[#282a2c] text-xs font-bold text-white transition-all cursor-pointer text-left flex items-center justify-between"
                  >
                    <span>FATAL BUG</span>
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#0c0e10] border border-[rgba(255,255,255,0.06)] space-y-3 font-mono">
                <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    {selectedVerdict === "bug" ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span className="text-white font-black">EXACT MATCH! 10 / 10 SCORE</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span className="text-rose-400 font-black">FALSE NEGATIVE! 0 / 10 SCORE</span>
                      </>
                    )}
                  </span>
                  <button
                    onClick={() => setShowTeaserResult(false)}
                    className="text-[11px] text-[#83958c] hover:text-white underline uppercase cursor-pointer"
                  >
                    TRY AGAIN
                  </button>
                </div>

                <p className="text-xs text-[#b9cbc1] leading-relaxed font-sans">
                  Line 5 overwrites <code>curr.next = prev</code> before saving a reference to <code>next_node</code>. Line 7 subsequently assigns <code>curr = curr.next</code> (which is now <code>prev</code>), causing an infinite loop oscillating on the first node!
                </p>

                <Link
                  href="/practice/q_ll_001"
                  className="obsidian-btn-primary w-full py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>OPEN IN REVIEW STUDIO</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </section>



        {/* COMPARISON SECTION: SYNTHESIS VS EVALUATION */}
        <section className="space-y-6">
          <div className="space-y-2">

            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
              CODE SYNTHESIS VS. CODE EVALUATION
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Traditional LeetCode Card */}
            <div className="obsidian-card p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-4">
                <h3 className="text-xl font-bold uppercase text-white">TRADITIONAL LEETCODE</h3>
                <span className="obsidian-chip-neutral">SYNTHESIS</span>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm font-mono text-[#b9cbc1]">
                <li className="flex items-start gap-3">
                  <span className="font-bold text-rose-400 text-sm">[X]</span>
                  <span>Writes code from scratch with rote syntax recall.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-rose-400 text-sm">[X]</span>
                  <span>Binary pass/fail based solely on test-case execution.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-rose-400 text-sm">[X]</span>
                  <span>Ignores deceptive or hallucinated natural language AI commentary.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-rose-400 text-sm">[X]</span>
                  <span>Zero calibration for false positives (rejecting good code).</span>
                </li>
              </ul>
            </div>

            {/* EvalForge Card */}
            <div className="obsidian-card p-8 space-y-6 border-l-4 border-white">
              <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-4">
                <h3 className="text-xl font-bold uppercase text-white">EVALFORGE SIMULATOR</h3>
                <span className="obsidian-chip-optimal">EVALUATION</span>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm font-mono text-white font-medium">
                <li className="flex items-start gap-3">
                  <span className="font-bold text-white text-sm">[✓]</span>
                  <span>Audits pre-generated AI solutions with calibrated defects.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-white text-sm">[✓]</span>
                  <span>Diagnostic Discrepancy Diff matches findings to Ground Truth.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-white text-sm">[✓]</span>
                  <span>Evaluates 6 dimensions: Correctness, Edge Cases, Complexity, etc.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-white text-sm">[✓]</span>
                  <span>Readiness Index benchmarks you against screening standards.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 6-DIMENSIONAL RUBRIC MATRIX */}
        <section className="space-y-6">
          <div className="space-y-2">

            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
              THE 6-DIMENSIONAL RUBRIC MATRIX
            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "1. Functional Correctness",
                weight: "30% WEIGHT",
                desc: "Accurately classify whether the code solves standard cases or contains fatal logic crashes.",
              },
              {
                title: "2. Edge-Case Analysis",
                weight: "25% WEIGHT",
                desc: "Identify boundary vulnerabilities: empty arrays, single nodes, duplicates, and integer overflows.",
              },
              {
                title: "3. Complexity & Big-O",
                weight: "15% WEIGHT",
                desc: "Spot asymptotic regressions: quadratic string copies, nested lookups, and recursive stack overhead.",
              },
              {
                title: "4. Explanation Auditing",
                weight: "15% WEIGHT",
                desc: "Catch deceptive or hallucinated commentary claiming different algorithmic properties than the code.",
              },
              {
                title: "5. Instruction Compliance",
                weight: "15% WEIGHT",
                desc: "Verify strict adherence to constraints: in-place mutations, O(1) space, and return formatting.",
              },
              {
                title: "6. Remediation & Fixes",
                weight: "DIAGNOSTIC",
                desc: "Provide concise, verified refactoring advice or corrected code implementations.",
              },
            ].map((rub, i) => (
              <div
                key={i}
                className="obsidian-card p-6 space-y-4 hover:border-[rgba(255,255,255,0.1)] transition-all"
              >
                <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-3">
                  <h3 className="text-base sm:text-lg font-bold text-white uppercase">{rub.title}</h3>
                  <span className="obsidian-chip-neutral text-[10px]">
                    {rub.weight}
                  </span>
                </div>
                <p className="text-xs text-[#b9cbc1] font-sans leading-relaxed">{rub.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="obsidian-card p-10 sm:p-16 flex flex-col items-center justify-center text-center space-y-6">
          <div className="space-y-3 max-w-2xl">
            <span className="obsidian-chip-optimal">START YOUR CALIBRATION</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-none">
              CALIBRATE YOUR CODE AUDIT ACUITY
            </h2>
            <p className="text-sm sm:text-base text-[#b9cbc1] font-normal leading-relaxed">
              Practice on 75+ benchmarks across calibrated defect categories or enter the timed 50-minute Mock Assessment.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/practice"
              className="w-full sm:w-auto obsidian-btn-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-center cursor-pointer"
            >
              START PRACTICE CATALOG ➔
            </Link>
            <Link
              href="/assessment"
              className="w-full sm:w-auto obsidian-btn-secondary px-8 py-4 text-sm font-bold uppercase tracking-wider text-center cursor-pointer"
            >
              TAKE MOCK TEST
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
