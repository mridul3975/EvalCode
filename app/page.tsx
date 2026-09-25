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
  Award,
  Users,
  BarChart3,
  Bug,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const [selectedVerdict, setSelectedVerdict] = useState<
    "correct" | "pointer_bug" | "complexity" | null
  >(null);
  const [showTeaserResult, setShowTeaserResult] = useState(false);
  const [hoveredLine, setHoveredLine] = useState<number | null>(5);

  const handleTeaserSubmit = (verdict: "correct" | "pointer_bug" | "complexity") => {
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neu-inset text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE AI BENCHMARK & RLHF CODE EVALUATOR</span>
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
                className="h-12 px-7 rounded-xl font-mono font-bold text-xs uppercase bg-white text-black hover:bg-neutral-200 flex items-center gap-2 transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Code2 className="w-4 h-4" />
                <span>LAUNCH REVIEW STUDIO</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/oa"
                className="h-12 px-7 rounded-xl neu-button text-neutral-200 hover:text-white flex items-center gap-2 transition-all font-mono font-bold text-xs uppercase cursor-pointer"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>OA SIMULATOR</span>
              </Link>
            </div>
          </div>

          {/* Right: Floating Perspective Mini Code Audit Preview */}
          <div className="w-full lg:w-[500px] shrink-0">
            <div className="neu-card rounded-2xl p-6 relative space-y-4 text-left font-mono border border-neutral-700/60 shadow-2xl">
              {/* Genuine Code Editor Header with Window Dots */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs text-neutral-300 font-mono ml-2 font-bold flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>reverse_list.py</span>
                  </span>
                </div>
                <span className="neu-active-pill px-2.5 py-0.5 text-[10px] font-mono text-emerald-400 font-bold animate-pulse">
                  INTERACTIVE DEMO
                </span>
              </div>

              {/* Code Box in Recessed Inset Well */}
              <div className="neu-inset p-4 text-xs font-mono text-neutral-300 space-y-1.5 overflow-x-auto leading-relaxed border border-white/[0.04]">
                <div className="text-neutral-500 font-medium"># Candidate Model: Gemini 2.5 Flash Solution</div>
                <div><span className="text-purple-400">def</span> <span className="text-sky-300">reverseList</span>(head):</div>
                <div className="pl-4">prev = <span className="text-orange-300">None</span>; curr = head</div>
                <div className="pl-4"><span className="text-purple-400">while</span> curr:</div>
                <div
                  onMouseEnter={() => setHoveredLine(5)}
                  className={cn(
                    "pl-6 py-1 px-2 rounded cursor-pointer transition-all border-l-2 flex items-center justify-between",
                    hoveredLine === 5
                      ? "bg-rose-950/50 border-rose-500 text-rose-200 shadow-[inset_0_0_8px_rgba(244,63,94,0.3)]"
                      : "border-transparent hover:bg-neutral-800/40 text-neutral-300"
                  )}
                >
                  <span>curr.next = prev</span>
                  <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                    Line 5 (Suspect)
                  </span>
                </div>
                <div className="pl-4">prev = curr</div>
                <div className="pl-4">curr = curr.next</div>
                <div className="pl-4"><span className="text-purple-400">return</span> prev</div>
              </div>

              {!showTeaserResult ? (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-neutral-200 block font-bold tracking-wider">
                      WHAT IS YOUR VERDICT ON LINE 5?
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">Click to test</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleTeaserSubmit("correct")}
                      className="neu-button p-2.5 text-xs font-mono font-bold text-neutral-300 hover:text-white cursor-pointer flex items-center justify-between group transition-all"
                    >
                      <span>CORRECT</span>
                      <CheckCircle2 className="w-4 h-4 text-neutral-500 group-hover:text-emerald-400 transition-colors" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTeaserSubmit("pointer_bug")}
                      className="neu-button p-2.5 text-xs font-mono font-bold text-rose-300 hover:text-white border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/15 cursor-pointer flex items-center justify-between group transition-all"
                    >
                      <span>FATAL POINTER BUG</span>
                      <Bug className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="neu-inset p-4 space-y-3 font-mono animate-in fade-in duration-200 border border-white/[0.06]">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                    <span className="text-xs font-bold flex items-center gap-2">
                      {selectedVerdict === "pointer_bug" ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400 font-bold uppercase tracking-wider">
                            CALIBRATION MATCH! (10/10)
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-400" />
                          <span className="text-rose-400 font-bold uppercase tracking-wider">
                            FALSE NEGATIVE (0/10)
                          </span>
                        </>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowTeaserResult(false)}
                      className="text-[11px] text-neutral-400 hover:text-white underline cursor-pointer"
                    >
                      TRY AGAIN
                    </button>
                  </div>

                  {/* Visual Failure Execution Trace */}
                  <div className="p-2.5 rounded bg-black/40 border border-white/[0.06] text-[11px] space-y-1 font-mono text-neutral-300">
                    <div className="text-neutral-500 font-bold uppercase text-[9px]">Execution Failure Proof:</div>
                    <div className="text-rose-300">Input List: 1 -&gt; 2 -&gt; 3 -&gt; None</div>
                    <div>Line 5 mutates: <code className="text-amber-300">1.next = None</code> (lost reference to 2!)</div>
                    <div>Line 7 assigns: <code className="text-rose-400">curr = curr.next</code> (resolves to None immediately)</div>
                    <div className="text-emerald-400 font-semibold">Outcome: Returns single node [1]; loses rest of the list.</div>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                    78% of uncalibrated evaluators miss this because the code looks clean at first glance. EvalForge trains you on 70+ calibrated defect archetypes.
                  </p>

                  <Link
                    href="/practice/q_ll_001"
                    className="neu-button w-full py-2.5 bg-emerald-500 text-black hover:bg-emerald-400 text-xs font-mono font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    <span>AUDIT IN REVIEW STUDIO</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF & CREDIBILITY STANDARDS SECTION */}
        <section className="neu-card p-8 sm:p-10 space-y-8 border border-neutral-700/60 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.06] pb-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>FRONTIER CALIBRATION BENCHMARKS</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-mono uppercase">
                Aligned with RLHF & Frontier Lab Audits
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md font-sans">
              Modeled after the exact code evaluation rubrics and adversarial screening tests used by leading AI data platforms and research labs.
            </p>
          </div>

          {/* Lab Partner Badges */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-2 opacity-80">
            {["Alignerr", "Scale AI", "Mindrift", "OpenAI", "Anthropic", "Google DeepMind"].map(
              (name) => (
                <div
                  key={name}
                  className="neu-inset px-4 py-2 rounded-xl font-mono text-xs font-bold text-neutral-300 tracking-wider uppercase border border-white/[0.05]"
                >
                  {name}
                </div>
              )
            )}
          </div>

          {/* 3 Credibility Data Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 font-mono">
            <div className="neu-inset p-5 rounded-xl space-y-2 border border-rose-500/20 bg-rose-500/5">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-rose-400">78%</span>
                <span className="text-[10px] text-neutral-400 uppercase font-bold">FAILURE RATE</span>
              </div>
              <h4 className="text-xs font-bold text-white uppercase">Initial Edge-Case Blindness</h4>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                Most engineers miss boundary defects and subtle pointer mutations because traditional LeetCode does not test adversarial auditing.
              </p>
            </div>

            <div className="neu-inset p-5 rounded-xl space-y-2 border border-emerald-500/20 bg-emerald-500/5">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-400">6.2x</span>
                <span className="text-[10px] text-neutral-400 uppercase font-bold">SCREENING PASS RATE</span>
              </div>
              <h4 className="text-xs font-bold text-white uppercase">Calibrated Ground Truth</h4>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                Candidates trained on discrepancy diff scoring achieve 6.2x higher agreement with expert benchmark engineers.
              </p>
            </div>

            <div className="neu-inset p-5 rounded-xl space-y-2 border border-purple-500/20 bg-purple-500/5">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-purple-400">70+</span>
                <span className="text-[10px] text-neutral-400 uppercase font-bold">BENCHMARK DEFECTS</span>
              </div>
              <h4 className="text-xs font-bold text-white uppercase">Comprehensive Taxonomy</h4>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                Covers race conditions, memory aliasing, sliding window bounds, greedy traps, deceptive Big-O claims, and mutable arguments.
              </p>
            </div>
          </div>
        </section>


        {/* COMPARISON SECTION: Side-by-Side Sleek Split Matrix */}
        <section className="space-y-8">
          <div className="space-y-3 text-center sm:text-left">

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Code Synthesis vs. Code Evaluation
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 max-w-2xl font-normal">
              Traditional coding platforms test rote memory. Modern AI evaluations test your ability to audit, catch hallucinations, and benchmark reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column (Traditional LeetCode) wrapped in .neu-card */}
            <div className="neu-card p-6 sm:p-8 space-y-6 opacity-80 hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <h3 className="text-lg font-bold text-neutral-300 uppercase tracking-tight font-mono">
                  Traditional LeetCode
                </h3>
                <span className="neu-inset px-2.5 py-1 text-[11px] font-mono text-neutral-400">
                  SYNTHESIS
                </span>
              </div>

              <ul className="space-y-3 text-sm text-neutral-400 font-sans">
                <li className="flex items-start gap-3 py-1">
                  <span className="font-mono text-rose-400 font-bold shrink-0">✕</span>
                  <span>Writes code from scratch with rote syntax recall.</span>
                </li>
                <li className="flex items-start gap-3 py-1">
                  <span className="font-mono text-rose-400 font-bold shrink-0">✕</span>
                  <span>Binary pass/fail based solely on test-case execution.</span>
                </li>
                <li className="flex items-start gap-3 py-1">
                  <span className="font-mono text-rose-400 font-bold shrink-0">✕</span>
                  <span>Ignores deceptive or hallucinated natural language AI commentary.</span>
                </li>
                <li className="flex items-start gap-3 py-1">
                  <span className="font-mono text-rose-400 font-bold shrink-0">✕</span>
                  <span>Zero calibration for false positives (rejecting good code).</span>
                </li>
              </ul>
            </div>

            {/* Right Column (EvalForge) wrapped in .neu-card with subtle accent glow border-t-emerald-500/40 */}
            <div className="neu-card border-t-2 border-t-emerald-500/40 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <h3 className="text-lg font-bold text-white uppercase tracking-tight font-mono">
                  EvalForge Simulator
                </h3>
                <span className="neu-active-pill px-3 py-1 text-[11px] font-mono text-emerald-400 font-bold">
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
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              The 6-Dimensional Rubric Matrix
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 max-w-2xl font-normal">
              Structured evaluation frameworks aligned with OpenAI, Anthropic, Scale AI, and Google DeepMind code assessment standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Bento Card 1: Functional Correctness (Spans 2 cols on lg) */}
            <div className="lg:col-span-2 neu-card hover:translate-y-[-2px] transition-transform duration-200 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <h3 className="text-lg font-bold text-white tracking-tight font-mono">
                  1. Functional Correctness
                </h3>
                <span className="neu-active-pill px-2.5 py-0.5 text-xs text-emerald-400 font-mono font-bold">
                  30% WEIGHT
                </span>
              </div>
              <p className="text-sm text-neutral-300 leading-normal">
                Accurately classify whether the code solves standard cases or contains fatal logic crashes, off-by-one errors, infinite loops, and unhandled branch regressions.
              </p>
            </div>

            {/* Bento Card 2: Edge-Case Analysis */}
            <div className="neu-card hover:translate-y-[-2px] transition-transform duration-200 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <h3 className="text-lg font-bold text-white tracking-tight font-mono">
                  2. Edge-Case Analysis
                </h3>
                <span className="neu-active-pill px-2.5 py-0.5 text-xs text-neutral-300 font-mono font-bold">
                  25% WEIGHT
                </span>
              </div>
              <p className="text-sm text-neutral-300 leading-normal">
                Identify boundary vulnerabilities: empty arrays, single nodes, duplicates, negative numbers, and integer overflows.
              </p>
            </div>

            {/* Bento Card 3: Complexity & Big-O */}
            <div className="neu-card hover:translate-y-[-2px] transition-transform duration-200 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <h3 className="text-base font-bold text-white tracking-tight font-mono">
                  3. Complexity & Big-O
                </h3>
                <span className="neu-active-pill px-2.5 py-0.5 text-xs text-neutral-300 font-mono font-bold">
                  15% WEIGHT
                </span>
              </div>
              <p className="text-sm text-neutral-300 leading-normal">
                Spot asymptotic regressions: quadratic string copies, nested lookups, and unneeded heap overhead.
              </p>
            </div>

            {/* Bento Card 4: Explanation Auditing */}
            <div className="neu-card hover:translate-y-[-2px] transition-transform duration-200 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <h3 className="text-base font-bold text-white tracking-tight font-mono">
                  4. Explanation Auditing
                </h3>
                <span className="neu-active-pill px-2.5 py-0.5 text-xs text-neutral-300 font-mono font-bold">
                  15% WEIGHT
                </span>
              </div>
              <p className="text-sm text-neutral-300 leading-normal">
                Catch deceptive or hallucinated commentary claiming different algorithmic invariants than the code.
              </p>
            </div>

            {/* Bento Card 5 & 6 Combined / Grouped */}
            <div className="neu-card hover:translate-y-[-2px] transition-transform duration-200 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <h3 className="text-base font-bold text-white tracking-tight font-mono">
                  5. Instruction Compliance
                </h3>
                <span className="neu-active-pill px-2.5 py-0.5 text-xs text-neutral-300 font-mono font-bold">
                  15% WEIGHT
                </span>
              </div>
              <p className="text-sm text-neutral-300 leading-normal">
                Verify strict adherence to constraints: in-place mutations, auxiliary space bounds, and exact return types.
              </p>
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION: High-End Developer Banner */}
        <section className="neu-card p-10 sm:p-16 flex flex-col items-center justify-center text-center space-y-6">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight font-mono uppercase">
              Calibrate Your Code Audit Acuity
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 font-normal leading-relaxed font-sans">
              Practice on 75+ benchmarks across calibrated defect categories or enter the timed multi-question FAANG/FinTech Online Assessment.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/practice"
              className="w-full sm:w-auto h-12 px-8 rounded-xl font-mono font-black text-xs uppercase bg-white text-black hover:bg-neutral-200 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
            >
              <span>START PRACTICE CATALOG</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/oa"
              className="w-full sm:w-auto h-12 px-8 rounded-xl neu-button font-mono font-bold text-xs uppercase text-neutral-300 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
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
