"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getOAResultById, getOAResults } from "@/lib/oa/storage";
import { OAAssessmentResult, HiringBarVerdict } from "@/types/oa";
import { ReadinessGauge } from "@/components/infographics/ReadinessGauge";
import { CompetencyRadarChart } from "@/components/infographics/CompetencyRadarChart";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Shield,
  Clock,
  Terminal,
  FileCode,
  Layers,
  ChevronDown,
  ChevronUp,
  Award,
} from "lucide-react";

export default function OAResultsPage() {
  const params = useParams();
  const resultId = (params?.id as string) || "";

  const [result, setResult] = useState<OAAssessmentResult | null>(null);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    const res = getOAResultById(resultId);
    if (res) {
      setResult(res);
    } else {
      // Fallback to most recent in storage if direct link
      const all = getOAResults();
      const first = Object.values(all)[0];
      if (first) setResult(first);
    }
  }, [resultId]);

  if (!result) {
    return (
      <div className="min-h-screen bg-[#121416] text-white flex flex-col items-center justify-center p-6 font-mono space-y-4">
        <h2 className="text-xl font-bold uppercase">NO OA ASSESSMENT RESULT FOUND</h2>
        <p className="text-xs text-[#b9cbc1]">
          The requested assessment report could not be found in local or remote storage.
        </p>
        <Link
          href="/oa"
          className="obsidian-btn-primary px-6 py-2.5 text-xs font-bold uppercase"
        >
          RETURN TO OA SIMULATOR
        </Link>
      </div>
    );
  }

  const verdictMeta: Record<
    HiringBarVerdict,
    { label: string; sub: string; color: string; bg: string; border: string }
  > = {
    STRONG_PASS: {
      label: "STRONG PASS — TIER-1 HIRED",
      sub: "Exceeded the Bar-Raiser benchmark across algorithmic optimality, code quality, and technical defense.",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/40",
    },
    PASS: {
      label: "PASS — ADVANCE TO ONSITE",
      sub: "Satisfies hiring expectations for algorithmic correctness and defense reasoning under time pressure.",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
    },
    BORDERLINE: {
      label: "BORDERLINE — COMMITTEE REVIEW",
      sub: "Partially passed test harness or showed minor asymptotic fragility in the follow-up round.",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/40",
    },
    FAIL: {
      label: "NOT READY — CRITICAL GAPS",
      sub: "Failed key hidden edge-case suites or demonstrated sub-optimal Big-O complexity under scale.",
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/40",
    },
  };

  const currentVerdict = verdictMeta[result.hiringBarVerdict] || verdictMeta.BORDERLINE;

  const radarData = {
    correctness: result.correctnessScore,
    edge_cases: result.correctnessScore,
    complexity: result.complexityScore,
    explanation: result.qualityScore,
    communication: result.communicationScore,
    debugging: result.qualityScore,
  };

  return (
    <div className="min-h-screen bg-[#121416] text-[#e2e2e5] font-['Hanken_Grotesk'] antialiased">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
        {/* Top Hero & Hiring Bar Verdict */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap font-mono text-xs">
            <Link
              href="/oa"
              className="neu-extruded bg-[#1e2022] px-3.5 py-1.5 rounded-lg text-[#b9cbc1] hover:text-white font-bold"
            >
              ➔ OA CATALOG
            </Link>
            <span className="text-[#83958c]">•</span>
            <span className="text-white font-bold uppercase">{result.companyProfile} SCREENING REPORT</span>
            <span className="text-[#83958c]">•</span>
            <span className="text-[#83958c]">Duration: {Math.round(result.timeSpentSeconds / 60)} mins</span>
          </div>

          <div
            className={cn(
              "p-6 sm:p-8 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl",
              currentVerdict.bg,
              currentVerdict.border
            )}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Award className={cn("w-6 h-6", currentVerdict.color)} />
                <span className={cn("text-xs sm:text-sm font-black font-mono tracking-widest uppercase", currentVerdict.color)}>
                  HIRING BAR VERDICT
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white font-mono uppercase tracking-tight">
                {currentVerdict.label}
              </h1>
              <p className="text-xs sm:text-sm text-[#b9cbc1] font-sans max-w-2xl leading-relaxed">
                {currentVerdict.sub}
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
              <div className="p-4 rounded-xl bg-[#0c0e10] border border-white/10 text-center">
                <span className="text-[10px] text-[#83958c] block uppercase">OVERALL SCORE</span>
                <span className="text-3xl font-black text-white">{result.overallScore}</span>
                <span className="text-[10px] text-gray-500 block">/ 100</span>
              </div>
              <div className="p-4 rounded-xl bg-[#0c0e10] border border-white/10 text-center">
                <span className="text-[10px] text-[#83958c] block uppercase">TESTS PASSED</span>
                <span className="text-3xl font-black text-emerald-400">
                  {result.testsPassed}
                </span>
                <span className="text-[10px] text-gray-500 block">/ {result.totalTests}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostic Infographics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 font-mono">
          {/* Left: Overall Readiness Gauge (4 cols) */}
          <div className="lg:col-span-4 obsidian-card p-6 sm:p-8 flex flex-col items-center justify-between gap-6">
            <div className="w-full flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                BENCHMARK CALIBRATION
              </span>
              <span className="obsidian-chip-optimal text-[10px]">TIER-1 BAR</span>
            </div>

            <ReadinessGauge score={result.overallScore} size={220} />

            <div className="w-full space-y-2 text-xs font-mono">
              <div className="flex justify-between text-[#83958c]">
                <span>Correctness (50%):</span>
                <span className="text-white font-bold">{result.correctnessScore}%</span>
              </div>
              <div className="flex justify-between text-[#83958c]">
                <span>Code Quality (15%):</span>
                <span className="text-white font-bold">{result.qualityScore}%</span>
              </div>
              <div className="flex justify-between text-[#83958c]">
                <span>Asymptotic Optimality (15%):</span>
                <span className="text-white font-bold">{result.complexityScore}%</span>
              </div>
              <div className="flex justify-between text-[#83958c]">
                <span>Follow-Up Defense (20%):</span>
                <span className="text-white font-bold">{result.communicationScore}%</span>
              </div>
            </div>
          </div>

          {/* Right: Competency Radar Chart (8 cols) */}
          <div className="lg:col-span-8 obsidian-card p-6 sm:p-8 flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  FAANG COMPETENCY RADAR
                </span>
              </div>
              <span className="text-[10px] text-[#83958c]">BENCHMARK: 90.0</span>
            </div>

            <div className="w-full flex items-center justify-center">
              <CompetencyRadarChart data={radarData} height={340} />
            </div>
          </div>
        </div>

        {/* Section 1: Test Case Matrix (Visible & Hidden Edge Cases) */}
        <div className="obsidian-card p-6 sm:p-8 space-y-5 font-mono">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-black uppercase text-white tracking-wider">
                1. TEST CASE SUITE MATRIX ({result.testsPassed} / {result.totalTests} PASSED)
              </h3>
            </div>
            <span className="text-[10px] text-[#83958c]">
              100% VISIBLE + HIDDEN EDGE CASES
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.testResults.map((tc, idx) => (
              <div
                key={tc.testCaseId || idx}
                className={cn(
                  "p-4 rounded-xl border flex flex-col justify-between gap-3 text-xs",
                  tc.passed
                    ? "bg-[#0c0e10] border-emerald-500/20"
                    : "bg-rose-950/20 border-rose-500/30"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {tc.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {tc.description || `Test Case #${idx + 1}`}
                      </span>
                      <span className="text-[10px] text-[#83958c]">
                        {tc.isHidden ? "🔒 HIDDEN EDGE CASE" : "👁️ VISIBLE TEST"} • {tc.executionTimeMs} ms
                      </span>
                    </div>
                  </div>

                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-black uppercase shrink-0",
                      tc.passed ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                    )}
                  >
                    {tc.passed ? "PASSED" : "FAILED"}
                  </span>
                </div>

                {tc.error && (
                  <pre className="p-2 rounded bg-rose-950/40 text-rose-300 text-[10px] overflow-x-auto whitespace-pre-wrap">
                    {tc.error}
                  </pre>
                )}

                <div className="flex justify-between items-center text-[10px] text-[#83958c] pt-2 border-t border-white/5">
                  <span>Expected: {JSON.stringify(tc.expected)}</span>
                  <span>Actual: {JSON.stringify(tc.actual)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Senior Staff Bar Raiser Critique */}
        <div className="obsidian-card p-6 sm:p-8 space-y-6 font-mono">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-black uppercase text-white tracking-wider">
                2. SENIOR STAFF BAR-RAISER CRITIQUE
              </h3>
            </div>
            <span className="obsidian-chip-optimal text-[10px]">PRINCIPAL AUDIT</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Executive Summary */}
            <div className="lg:col-span-1 p-5 rounded-xl bg-[#0c0e10] border border-white/10 space-y-3">
              <span className="text-[10px] font-bold text-[#83958c] uppercase tracking-wider block">
                AUDIT SUMMARY
              </span>
              <p className="font-sans text-xs sm:text-sm text-white leading-relaxed">
                {result.barRaiserCritique?.summary}
              </p>
              <div className="pt-2 border-t border-white/5 text-[11px] text-[#83958c]">
                Claimed: {result.claimedTimeComplexity} time / {result.claimedSpaceComplexity} space
              </div>
            </div>

            {/* Asymptotic & Idiomatic Analysis */}
            <div className="lg:col-span-2 p-5 rounded-xl bg-[#0c0e10] border border-white/10 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#83958c] uppercase tracking-wider block">
                  ASYMPTOTIC ANALYSIS
                </span>
                <p className="font-sans text-xs text-[#b9cbc1] leading-relaxed">
                  {result.barRaiserCritique?.asymptoticAnalysis}
                </p>
              </div>

              <div className="space-y-1 pt-2 border-t border-white/5">
                <span className="text-[10px] font-bold text-[#83958c] uppercase tracking-wider block">
                  IDIOMATIC QUALITY & CODE SMELLS
                </span>
                <p className="font-sans text-xs text-[#b9cbc1] leading-relaxed">
                  {result.barRaiserCritique?.idiomaticQuality}
                </p>
                {result.barRaiserCritique?.codeSmells?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {result.barRaiserCritique.codeSmells.map((smell, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px]"
                      >
                        ⚠️ {smell}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Follow-Up Defense Round Evaluation */}
        {result.geminiFollowUps?.length > 0 && (
          <div className="obsidian-card p-6 sm:p-8 space-y-6 font-mono">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-black uppercase text-white tracking-wider">
                  3. GEMINI FOLLOW-UP DEFENSE EVALUATION
                </h3>
              </div>
              <span className="text-[10px] text-[#83958c]">20% TOTAL SCORE WEIGHT</span>
            </div>

            <div className="space-y-4">
              {result.geminiFollowUps.map((fu, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-[#0c0e10] border border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                      DEFENSE QUESTION {idx + 1}
                    </span>
                    {fu.score !== undefined && (
                      <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[10px]">
                        DEFENSE SCORE: {fu.score} / 100
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm font-sans font-bold text-white leading-relaxed">
                    {fu.question}
                  </p>

                  <div className="p-3.5 rounded-lg bg-[#141618] border border-white/5 space-y-1">
                    <span className="text-[10px] text-gray-500 block uppercase font-mono">
                      CANDIDATE RESPONSE:
                    </span>
                    <p className="font-sans text-xs text-[#b9cbc1] whitespace-pre-wrap">
                      {fu.userAnswer}
                    </p>
                  </div>

                  {fu.feedback && (
                    <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 text-xs font-sans">
                      <span className="font-bold font-mono text-[10px] uppercase block">
                        BAR-RAISER FEEDBACK:
                      </span>
                      {fu.feedback}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Submitted Code Viewer Accordion */}
        <div className="obsidian-card p-6 sm:p-8 space-y-4 font-mono">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-black uppercase text-white tracking-wider">
                SUBMITTED CODE IMPLEMENTATION ({result.language.toUpperCase()})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowCode(!showCode)}
              className="neu-extruded bg-[#1e2022] px-3.5 py-1.5 rounded-lg text-xs font-bold text-[#b9cbc1] hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              <span>{showCode ? "HIDE CODE" : "VIEW CODE"}</span>
              {showCode ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showCode && (
            <div className="p-4 rounded-xl bg-[#0c0e10] border border-white/10 overflow-x-auto text-xs font-mono text-zinc-200">
              <pre>
                <code>{result.submittedCode}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <Link
            href="/oa"
            className="w-full sm:w-auto obsidian-btn-secondary px-6 py-3 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PRACTICE ANOTHER OA</span>
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto neu-extruded bg-white text-black px-8 py-3 rounded-lg font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          >
            <span>VIEW CANDIDATE PROFILE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
