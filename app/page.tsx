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
    <div className="flex flex-col min-h-screen bg-[#0a0b0d] text-[#e2e8f0] font-mono selection:bg-[#00ffc2] selection:text-[#0a0b0d]">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 sm:pt-16 pb-20 border-b-2 border-[#242830]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center gap-12">
          {/* Left Hero Content */}
          <div className="flex-1 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#00ffc2]/10 border border-[#00ffc2]/30 text-[#00ffc2] text-xs font-bold font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI EVALUATION & RLHF ASSESSMENT SIMULATOR</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-[1.1] uppercase font-mono">
              STOP SOLVING FROM SCRATCH. <br />
              <span className="text-[#00ffc2] bg-[#00ffc2]/10 px-2 py-0.5 border border-[#00ffc2]/40 inline-block mt-1">
                AUDIT AI-GENERATED CODE.
              </span>
            </h1>

            {/* Subtext cap: <20 words as per design-taste directive */}
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
              Screening tests at Alignerr, Mindrift, and Scale AI measure code evaluation: spotting logic flaws, boundary regressions, and deceptive commentary.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2 font-mono">
              <Link
                href="/practice"
                className="flex items-center gap-2 px-6 py-3.5 rounded-none bg-[#00ffc2] hover:bg-white text-[#0a0b0d] font-black text-xs shadow-lg transition-colors cursor-pointer"
              >
                <Code2 className="w-4 h-4" />
                <span>LAUNCH REVIEW STUDIO</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Link>

              <Link
                href="/assessment"
                className="flex items-center gap-2 px-6 py-3.5 rounded-none bg-[#121417] hover:bg-zinc-800 border-2 border-[#242830] text-zinc-200 font-bold text-xs transition-colors cursor-pointer"
              >
                <Timer className="w-4 h-4 text-[#00ffc2]" />
                <span>TAKE MOCK ASSESSMENT</span>
              </Link>
            </div>
          </div>

          {/* Right: Interactive Live Mini-Evaluation Teaser */}
          <div className="w-full lg:w-[520px] rounded-none bg-[#121417] border-2 border-[#242830] p-6 shadow-2xl space-y-4 text-left font-mono relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#00ffc2]" />
            
            <div className="flex items-center justify-between pb-3 border-b border-[#242830]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-none bg-[#00ffc2] animate-pulse" />
                <span className="text-xs font-black text-white uppercase">AUDIT THIS AI SNIPPET</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase">10S BENCHMARK</span>
            </div>

            {/* Code Snippet */}
            <div className="p-3.5 rounded-none bg-[#0a0b0d] font-mono text-xs text-zinc-300 space-y-1 overflow-x-auto border border-[#242830]">
              <div className="text-zinc-500">// Problem: Reverse Singly Linked List</div>
              <div><span className="text-purple-400">def</span> <span className="text-sky-300">reverseList</span>(head):</div>
              <div className="pl-4">prev = <span className="text-orange-300">None</span>; curr = head</div>
              <div className="pl-4"><span className="text-purple-400">while</span> curr:</div>
              <div className="pl-8 text-rose-300 bg-rose-950/40 px-1 border-l-2 border-rose-500">curr.next = prev  <span className="text-zinc-500">// Line 5</span></div>
              <div className="pl-8">prev = curr</div>
              <div className="pl-8">curr = curr.next</div>
              <div className="pl-4"><span className="text-purple-400">return</span> prev</div>
            </div>

            {/* Interactive Verdict Buttons */}
            {!showTeaserResult ? (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase text-zinc-400">
                  WHAT IS YOUR EVALUATION VERDICT ON LINE 5?
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => handleTeaserSubmit("correct")}
                    className="p-3 rounded-none border border-[#242830] bg-[#0a0b0d] hover:bg-[#1a1d24] text-xs font-bold text-zinc-300 transition-colors cursor-pointer text-left flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#00ffc2] shrink-0" />
                    <span>COMPLETELY CORRECT</span>
                  </button>
                  <button
                    onClick={() => handleTeaserSubmit("bug")}
                    className="p-3 rounded-none border border-[#242830] bg-[#0a0b0d] hover:bg-[#1a1d24] text-xs font-bold text-zinc-300 transition-colors cursor-pointer text-left flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4 text-[#ff4d4d] shrink-0" />
                    <span>FATAL POINTER BUG</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Teaser Discrepancy Diff Result */
              <div className="p-4 rounded-none bg-[#0a0b0d] border border-[#242830] space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    {selectedVerdict === "bug" ? (
                      <>
                        <Check className="w-4 h-4 text-[#00ffc2]" />
                        <span className="text-[#00ffc2] font-black">EXACT MATCH! 10 / 10 SCORE</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-[#ff4d4d]" />
                        <span className="text-[#ff4d4d] font-black">FALSE NEGATIVE! 0 / 10 SCORE</span>
                      </>
                    )}
                  </span>
                  <button
                    onClick={() => setShowTeaserResult(false)}
                    className="text-[11px] text-zinc-500 hover:text-zinc-300 underline uppercase cursor-pointer"
                  >
                    TRY AGAIN
                  </button>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  <strong>Root Cause:</strong> Line 5 overwrites <code>curr.next = prev</code> before saving a reference to <code>next_node</code>. Line 7 subsequently assigns <code>curr = curr.next</code> (which is now <code>prev</code>), causing an infinite loop oscillating on the first node!
                </p>

                <Link
                  href="/practice/q_ll_001"
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-none bg-[#00ffc2] hover:bg-white text-[#0a0b0d] text-xs font-black transition-colors"
                >
                  <span>OPEN FULL REVIEW STUDIO</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PLATFORM LOGO STRIP */}
      <section className="py-8 border-b-2 border-[#242830] bg-[#0a0b0d]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-6 font-mono">
          <span className="text-[11px] font-black uppercase text-zinc-500">
            CALIBRATED FOR SCREENING AT:
          </span>
          <div className="flex flex-wrap items-center gap-8 text-xs font-black text-zinc-400">
            <span className="hover:text-[#00ffc2] transition-colors">ALIGNERR</span>
            <span className="hover:text-[#00ffc2] transition-colors">MINDRIFT</span>
            <span className="hover:text-[#00ffc2] transition-colors">SCALE AI / OUTLIER</span>
            <span className="hover:text-[#00ffc2] transition-colors">TURING RLHF</span>
            <span className="hover:text-[#00ffc2] transition-colors">ENTERPRISE CODE REVIEW</span>
          </div>
        </div>
      </section>

      {/* COMPARISON SECTION: LEETCODE VS EVALFORGE */}
      <section className="py-16 max-w-[1400px] mx-auto px-4 sm:px-6 w-full space-y-10 font-mono">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
            CODE SYNTHESIS VS. CODE EVALUATION
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans">
            Why 90% of LeetCode practitioners fail AI-trainer technical screeners on their first try.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional LeetCode Card */}
          <div className="p-6 rounded-none bg-[#121417] border-2 border-[#242830] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-none bg-[#0a0b0d] border border-[#242830] flex items-center justify-center">
                <FileCode className="w-4 h-4 text-zinc-400" />
              </div>
              <div>
                <h3 className="text-sm font-black text-zinc-300 uppercase">TRADITIONAL LEETCODE</h3>
                <span className="text-[10px] text-zinc-500 uppercase font-bold">CODE SYNTHESIS PARADIGM</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-zinc-400 font-sans">
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-[#ff4d4d] shrink-0 mt-0.5" />
                <span>Writes code from scratch with rote syntax recall.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-[#ff4d4d] shrink-0 mt-0.5" />
                <span>Binary pass/fail based solely on test-case execution.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-[#ff4d4d] shrink-0 mt-0.5" />
                <span>Ignores deceptive or hallucinated natural language AI commentary.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-[#ff4d4d] shrink-0 mt-0.5" />
                <span>Zero calibration for false positives (rejecting good code).</span>
              </li>
            </ul>
          </div>

          {/* EvalForge Card */}
          <div className="p-6 rounded-none bg-[#121417] border-2 border-[#00ffc2]/40 space-y-4 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#00ffc2]" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-none bg-[#00ffc2]/10 border border-[#00ffc2]/40 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-[#00ffc2]" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase">EVALFORGE BRUTALIST</h3>
                <span className="text-[10px] text-[#00ffc2] uppercase font-bold">MULTI-DIMENSIONAL EVALUATION</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-zinc-300 font-sans">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#00ffc2] shrink-0 mt-0.5" />
                <span>Audits pre-generated AI solutions with calibrated defects.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#00ffc2] shrink-0 mt-0.5" />
                <span>Diagnostic Discrepancy Diff matches findings to Ground Truth.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#00ffc2] shrink-0 mt-0.5" />
                <span>Evaluates 6 dimensions: Correctness, Edge Cases, Complexity, etc.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#00ffc2] shrink-0 mt-0.5" />
                <span>Readiness Index benchmarks you against screening standards.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6-DIMENSIONAL RUBRIC MATRIX */}
      <section className="py-16 border-t-2 border-[#242830] bg-[#0a0b0d] font-mono">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              THE 6-DIMENSIONAL RUBRIC MATRIX
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans">
              Every submission is graded against the exact dimensions used by premier RLHF platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: "1. FUNCTIONAL CORRECTNESS",
                weight: "30% WEIGHT",
                desc: "Accurately classify whether the code solves standard cases or contains fatal logic crashes.",
                color: "text-[#00ffc2]",
                border: "border-[#00ffc2]/40",
              },
              {
                title: "2. EDGE-CASE ANALYSIS",
                weight: "25% WEIGHT",
                desc: "Identify boundary vulnerabilities: empty arrays, single nodes, duplicates, and integer overflows.",
                color: "text-amber-400",
                border: "border-amber-400/40",
              },
              {
                title: "3. COMPLEXITY & BIG-O",
                weight: "15% WEIGHT",
                desc: "Spot asymptotic regressions: quadratic string copies, nested lookups, and recursive stack overhead.",
                color: "text-sky-400",
                border: "border-sky-400/40",
              },
              {
                title: "4. EXPLANATION AUDITING",
                weight: "15% WEIGHT",
                desc: "Catch deceptive or hallucinated commentary claiming different algorithmic properties than the code.",
                color: "text-purple-400",
                border: "border-purple-400/40",
              },
              {
                title: "5. INSTRUCTION COMPLIANCE",
                weight: "15% WEIGHT",
                desc: "Verify strict adherence to constraints: in-place mutations, O(1) space, and return formatting.",
                color: "text-orange-400",
                border: "border-orange-400/40",
              },
              {
                title: "6. REMEDIATION & FIXES",
                weight: "DIAGNOSTIC",
                desc: "Provide concise, verified refactoring advice or corrected code implementations.",
                color: "text-pink-400",
                border: "border-pink-400/40",
              },
            ].map((rub, i) => (
              <div
                key={i}
                className="p-6 rounded-none bg-[#121417] border-2 border-[#242830] hover:border-[#00ffc2]/50 transition-colors space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-white uppercase">{rub.title}</h3>
                  <span className={cn("text-[10px] font-mono font-bold px-2 py-0.5 rounded-none bg-[#0a0b0d] border", rub.border, rub.color)}>
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
      <section className="py-16 border-t-2 border-[#242830] bg-[#121417] font-mono">
        <div className="max-w-[800px] mx-auto px-4 text-center space-y-6">
          <div className="w-12 h-12 rounded-none bg-[#00ffc2]/10 border border-[#00ffc2]/40 mx-auto flex items-center justify-center text-[#00ffc2]">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            CALIBRATE YOUR CODE REVIEW ACUITY
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto font-sans leading-relaxed">
            Choose Practice Mode for instant granular feedback, or enter the Timed 3-Question Mock Assessment to test your readiness index.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              href="/practice"
              className="px-6 py-3.5 rounded-none bg-[#00ffc2] hover:bg-white text-[#0a0b0d] font-black text-xs shadow-xl transition-colors"
            >
              START PRACTICE CATALOG
            </Link>
            <Link
              href="/assessment"
              className="px-6 py-3.5 rounded-none bg-[#0a0b0d] hover:bg-zinc-800 text-zinc-200 font-bold text-xs border-2 border-[#242830] transition-colors"
            >
              START MOCK ASSESSMENT
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
