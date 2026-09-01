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
    <div className="flex flex-col min-h-screen bg-[#121416] text-white font-['Hanken_Grotesk']">
      {/* Top Marquee Ribbon */}
      <div className="w-full bg-white text-black border-b-4 border-white py-2 font-black text-xl sm:text-2xl tracking-tighter uppercase overflow-hidden whitespace-nowrap">
        <div className="animate-marquee px-4 font-mono">
          <span>AI CODE EVALUATION SIMULATOR /// CALIBRATED FOR ALIGNERR, MINDRIFT & SCALE AI /// 75+ BENCHMARKS LOADED /// AUDIT DEFECTS IN SECONDS /// &nbsp;</span>
          <span>AI CODE EVALUATION SIMULATOR /// CALIBRATED FOR ALIGNERR, MINDRIFT & SCALE AI /// 75+ BENCHMARKS LOADED /// AUDIT DEFECTS IN SECONDS /// &nbsp;</span>
        </div>
      </div>

      {/* HERO SECTION: 70/30 Editorial Split */}
      <section className="flex flex-col lg:flex-row w-full border-b-4 border-white">
        {/* Left 70%: Massive Typography & Overview */}
        <div className="lg:w-2/3 p-6 sm:p-12 lg:p-16 flex flex-col justify-between border-b-4 lg:border-b-0 lg:border-r-4 border-white bg-[#121416] text-white">
          <div>
            <div className="text-xs font-black uppercase tracking-widest mb-4 px-3 py-1 bg-white text-black inline-block border-2 border-white font-mono">
              AI EVALUATION & RLHF SIMULATOR
            </div>
            <h1 className="font-black text-5xl sm:text-7xl lg:text-[7vw] leading-[0.85] tracking-tighter uppercase mb-8 break-words">
              STOP SOLVING.<br />
              <span className="bg-white text-black px-3 inline-block mt-2">AUDIT AI CODE.</span>
            </h1>
            <p className="text-base sm:text-xl lg:text-2xl font-light max-w-2xl border-l-8 border-white pl-6 leading-relaxed text-zinc-200 font-sans">
              Screening tests at Alignerr, Mindrift, and Scale AI measure code evaluation: spotting subtle bugs, boundary regressions, and deceptive AI explanations.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap gap-4 font-black">
            <Link
              href="/practice"
              className="bg-white text-black font-black uppercase text-base sm:text-xl px-8 py-5 hover:bg-zinc-200 transition-none border-4 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] flex items-center gap-3 cursor-pointer"
            >
              <Code2 className="w-5 h-5" />
              <span>LAUNCH REVIEW STUDIO</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/assessment"
              className="bg-[#121416] text-white font-black uppercase text-base sm:text-xl px-8 py-5 border-4 border-white hover:bg-white hover:text-black transition-none flex items-center gap-3 cursor-pointer"
            >
              <Timer className="w-5 h-5" />
              <span>TAKE 50M MOCK</span>
            </Link>
          </div>
        </div>

        {/* Right 30%: High-Contrast Live Interactive Audit Teaser */}
        <div className="lg:w-1/3 p-6 sm:p-10 flex flex-col justify-center bg-white text-black border-white">
          <div className="border-4 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4 font-mono">
            <div className="flex items-center justify-between pb-3 border-b-4 border-black">
              <span className="text-xs font-black uppercase tracking-widest text-black">
                LIVE INTERACTIVE AUDIT
              </span>
              <span className="text-[10px] bg-black text-white px-2 py-0.5 font-bold uppercase">
                10S TEASER
              </span>
            </div>

            {/* Code Box */}
            <div className="p-3.5 bg-[#121416] text-white font-mono text-xs space-y-1 border-2 border-black overflow-x-auto">
              <div className="text-zinc-500">// Problem: Reverse Singly Linked List</div>
              <div><span className="text-purple-400">def</span> <span className="text-sky-300">reverseList</span>(head):</div>
              <div className="pl-4">prev = <span className="text-orange-300">None</span>; curr = head</div>
              <div className="pl-4"><span className="text-purple-400">while</span> curr:</div>
              <div className="pl-8 text-rose-300 bg-rose-950/60 px-1 border-l-2 border-rose-500">curr.next = prev  <span className="text-zinc-400">// Line 5</span></div>
              <div className="pl-8">prev = curr</div>
              <div className="pl-8">curr = curr.next</div>
              <div className="pl-4"><span className="text-purple-400">return</span> prev</div>
            </div>

            {!showTeaserResult ? (
              <div className="space-y-3 pt-2">
                <div className="text-xs font-black uppercase text-black font-['Hanken_Grotesk']">
                  WHAT IS YOUR VERDICT ON LINE 5?
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => handleTeaserSubmit("correct")}
                    className="p-3 border-2 border-black bg-white hover:bg-black hover:text-white font-black text-xs uppercase tracking-wider transition-none text-left flex items-center justify-between cursor-pointer"
                  >
                    <span>1. COMPLETELY CORRECT</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </button>
                  <button
                    onClick={() => handleTeaserSubmit("bug")}
                    className="p-3 border-2 border-black bg-white hover:bg-black hover:text-white font-black text-xs uppercase tracking-wider transition-none text-left flex items-center justify-between cursor-pointer"
                  >
                    <span>2. FATAL POINTER BUG</span>
                    <XCircle className="w-4 h-4 text-rose-600" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-black text-white border-2 border-black space-y-3 font-mono">
                <div className="flex items-center justify-between border-b-2 border-white pb-2">
                  <span className="text-xs font-black uppercase">
                    {selectedVerdict === "bug" ? "EXACT MATCH! 10/10" : "FALSE NEGATIVE! 0/10"}
                  </span>
                  <button
                    onClick={() => setShowTeaserResult(false)}
                    className="text-[10px] text-zinc-400 hover:text-white underline uppercase cursor-pointer"
                  >
                    TRY AGAIN
                  </button>
                </div>

                <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                  Line 5 overwrites <code>curr.next = prev</code> before saving a reference to <code>next_node</code>. Line 7 subsequently assigns <code>curr = curr.next</code> (which is now <code>prev</code>), causing an infinite loop oscillating on the first node!
                </p>

                <Link
                  href="/practice/q_ll_001"
                  className="block w-full py-3 bg-white text-black font-['Hanken_Grotesk'] font-black text-center text-xs uppercase hover:bg-zinc-200 transition-none"
                >
                  OPEN IN REVIEW STUDIO ➔
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PLATFORM LOGO STRIP */}
      <section className="py-6 border-b-4 border-white bg-white text-black">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 flex flex-wrap items-center justify-between gap-6 font-mono font-black uppercase text-xs sm:text-sm">
          <span>CALIBRATED FOR SCREENING AT:</span>
          <div className="flex flex-wrap items-center gap-8 text-black">
            <span className="border-b-2 border-black">ALIGNERR</span>
            <span className="border-b-2 border-black">MINDRIFT</span>
            <span className="border-b-2 border-black">SCALE AI / OUTLIER</span>
            <span className="border-b-2 border-black">TURING RLHF</span>
            <span className="border-b-2 border-black">ENTERPRISE CODE AUDIT</span>
          </div>
        </div>
      </section>

      {/* COMPARISON SECTION: LEETCODE VS EVALFORGE */}
      <section className="p-6 sm:p-12 lg:p-16 max-w-[1600px] mx-auto w-full space-y-10 border-b-4 border-white">
        <div className="border-b-4 border-white pb-6">
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
            CODE SYNTHESIS VS. CODE EVALUATION
          </h2>
          <p className="text-base sm:text-xl font-bold uppercase text-zinc-400 font-mono mt-2">
            WHY 90% OF LEETCODE PRACTITIONERS FAIL AI-TRAINER SCREENERS ON THEIR FIRST TRY
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Traditional LeetCode Card */}
          <div className="p-8 border-4 border-white bg-[#121416] space-y-6">
            <div className="flex items-center justify-between border-b-4 border-white pb-4">
              <h3 className="text-2xl font-black uppercase">TRADITIONAL LEETCODE</h3>
              <span className="px-2 py-0.5 bg-zinc-800 text-white text-xs font-mono uppercase font-bold">SYNTHESIS</span>
            </div>

            <ul className="space-y-4 text-sm font-mono text-zinc-300">
              <li className="flex items-start gap-3">
                <span className="font-bold text-rose-400 text-base">[X]</span>
                <span>Writes code from scratch with rote syntax recall.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-rose-400 text-base">[X]</span>
                <span>Binary pass/fail based solely on test-case execution.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-rose-400 text-base">[X]</span>
                <span>Ignores deceptive or hallucinated natural language AI commentary.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-rose-400 text-base">[X]</span>
                <span>Zero calibration for false positives (rejecting good code).</span>
              </li>
            </ul>
          </div>

          {/* EvalForge Card (Inverted White) */}
          <div className="p-8 border-4 border-black bg-white text-black space-y-6 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            <div className="flex items-center justify-between border-b-4 border-black pb-4">
              <h3 className="text-2xl font-black uppercase">EVALFORGE SIMULATOR</h3>
              <span className="px-2 py-0.5 bg-black text-white text-xs font-mono uppercase font-bold">EVALUATION</span>
            </div>

            <ul className="space-y-4 text-sm font-mono text-black font-bold">
              <li className="flex items-start gap-3">
                <span className="font-black text-base">[✓]</span>
                <span>Audits pre-generated AI solutions with calibrated defects.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-black text-base">[✓]</span>
                <span>Diagnostic Discrepancy Diff matches findings to Ground Truth.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-black text-base">[✓]</span>
                <span>Evaluates 6 dimensions: Correctness, Edge Cases, Complexity, etc.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-black text-base">[✓]</span>
                <span>Readiness Index benchmarks you against screening standards.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6-DIMENSIONAL RUBRIC MATRIX */}
      <section className="p-6 sm:p-12 lg:p-16 max-w-[1600px] mx-auto w-full space-y-10 border-b-4 border-white">
        <div className="border-b-4 border-white pb-6">
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
            THE 6-DIMENSIONAL RUBRIC MATRIX
          </h2>
          <p className="text-base sm:text-xl font-bold uppercase text-zinc-400 font-mono mt-2">
            EVERY SUBMISSION GRADED AGAINST STANDARD RLHF EVALUATION CRITERIA
          </p>
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
              className="p-6 border-4 border-white bg-[#121416] hover:bg-white hover:text-black transition-none space-y-4 group"
            >
              <div className="flex items-center justify-between border-b-2 border-current pb-3">
                <h3 className="text-lg font-black uppercase">{rub.title}</h3>
                <span className="text-xs font-mono font-bold px-2 py-0.5 border border-current">
                  {rub.weight}
                </span>
              </div>
              <p className="text-xs font-sans leading-relaxed text-zinc-300 group-hover:text-black">{rub.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="p-12 sm:p-24 flex flex-col items-center justify-center text-center bg-[#121416]">
        <div className="bg-white text-black p-8 sm:p-16 border-4 border-black shadow-[16px_16px_0px_0px_rgba(255,255,255,1)] max-w-4xl w-full space-y-8">
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none">
            CALIBRATE YOUR CODE AUDIT ACUITY
          </h2>
          <p className="text-lg sm:text-2xl font-bold uppercase font-mono">
            PRACTICE ON 75+ BENCHMARKS OR ENTER THE TIMED 3-QUESTION MOCK ASSESSMENT.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/practice"
              className="w-full sm:w-auto bg-black text-white font-black uppercase text-xl px-10 py-5 hover:bg-zinc-800 transition-none shadow-[6px_6px_0px_0px_rgba(100,100,100,1)] text-center cursor-pointer"
            >
              START PRACTICE CATALOG ➔
            </Link>
            <Link
              href="/assessment"
              className="w-full sm:w-auto bg-white text-black font-black uppercase text-xl px-10 py-5 border-4 border-black hover:bg-black hover:text-white transition-none text-center cursor-pointer"
            >
              TAKE MOCK TEST
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
