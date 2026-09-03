"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  getMultiOAResultById,
  getMultiOAResults,
  getOAResultById,
  getOAResults,
} from "@/lib/oa/storage";
import {
  OAMultiAssessmentResult,
  OAAssessmentResult,
  HiringBarVerdict,
} from "@/types/oa";
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
  BookOpen,
} from "lucide-react";

export default function OAResultsPage() {
  const params = useParams();
  const resultId = (params?.id as string) || "";

  const [multiResult, setMultiResult] = useState<OAMultiAssessmentResult | null>(null);
  const [legacyResult, setLegacyResult] = useState<OAAssessmentResult | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<string>("");
  const [expandedTestMatrix, setExpandedTestMatrix] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // 1. Try finding multi-question result
    const multi = getMultiOAResultById(resultId);
    if (multi) {
      setMultiResult(multi);
      if (multi.questions.length > 0) {
        setActiveCodeTab(multi.questions[0].problemId);
      }
      return;
    }

    // 2. Fallback to any recent multi-question result
    const allMulti = getMultiOAResults();
    const firstMulti = Object.values(allMulti)[0];
    if (firstMulti) {
      setMultiResult(firstMulti);
      if (firstMulti.questions.length > 0) {
        setActiveCodeTab(firstMulti.questions[0].problemId);
      }
      return;
    }

    // 3. Fallback to legacy single result
    const legacy = getOAResultById(resultId);
    if (legacy) {
      setLegacyResult(legacy);
      return;
    }

    const allLegacy = getOAResults();
    const firstLegacy = Object.values(allLegacy)[0];
    if (firstLegacy) {
      setLegacyResult(firstLegacy);
    }
  }, [resultId]);

  if (!multiResult && !legacyResult) {
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

  // Verdict Metadata
  const verdictMeta: Record<
    HiringBarVerdict,
    { label: string; sub: string; color: string; bg: string; border: string }
  > = {
    STRONG_PASS: {
      label: "STRONG PASS — TIER-1 HIRED",
      sub: "Exceeded the Bar-Raiser benchmark across algorithmic optimality, code modularity, and technical defense.",
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
      sub: "Partially passed test harness or showed minor asymptotic fragility in the follow-up defense.",
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

  // Render Multi-Question Assessment Result
  if (multiResult) {
    const verdict = verdictMeta[multiResult.hiringBarVerdict] || verdictMeta.BORDERLINE;
    const durationMinutes = Math.round(multiResult.totalTimeAllocatedSeconds / 60);
    const timeSpentMinutes = Math.round(multiResult.timeSpentSeconds / 60);

    const radarData = {
      correctness: multiResult.correctnessScore,
      edge_cases: Number(
        (
          (multiResult.totalTestsPassed / Math.max(1, multiResult.totalTestsCount)) *
          100
        ).toFixed(1)
      ),
      complexity: multiResult.complexityScore,
      explanation: multiResult.qualityScore,
      communication: multiResult.communicationScore,
      debugging: 85,
    };

    const activeQuestion =
      multiResult.questions.find((q) => q.problemId === activeCodeTab) ||
      multiResult.questions[0];

    const toggleProblemTests = (problemId: string) => {
      setExpandedTestMatrix((prev) => ({
        ...prev,
        [problemId]: !prev[problemId],
      }));
    };

    return (
      <div className="min-h-screen bg-[#121416] text-[#e2e2e5] font-['Hanken_Grotesk'] antialiased py-10 sm:py-14 select-none">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Executive Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap font-mono">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                {multiResult.companyProfile} ONLINE ASSESSMENT REPORT
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#1e2022] text-[#b9cbc1] border border-white/5">
                {multiResult.questions.length} PROBLEMS EVALUATED
              </span>
              <span className="text-xs text-neutral-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {timeSpentMinutes} of {durationMinutes} mins utilized
                </span>
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-mono">
                  {multiResult.trackTitle}
                </h1>
                <p className="text-sm text-[#b9cbc1] font-sans mt-1">
                  Full multi-question diagnostic evaluated against {multiResult.companyProfile} hiring benchmarks.
                </p>
              </div>

              {/* Hiring Bar Verdict Badge */}
              <div
                className={cn(
                  "p-4 sm:p-5 rounded-2xl border flex items-center gap-4 shrink-0 font-mono",
                  verdict.bg,
                  verdict.border
                )}
              >
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <Award className={cn("w-6 h-6", verdict.color)} />
                </div>
                <div>
                  <span className={cn("text-sm sm:text-base font-black uppercase tracking-wider block", verdict.color)}>
                    {verdict.label}
                  </span>
                  <p className="text-[11px] text-neutral-300 font-sans max-w-xs leading-relaxed">
                    {verdict.sub}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Aggregate Score Strips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
            <div className="p-4 rounded-xl bg-[#0c0e10] border border-white/10 text-center space-y-1">
              <span className="text-[10px] text-[#83958c] block uppercase">OVERALL SCORE</span>
              <span className="text-3xl font-black text-white">{multiResult.overallScore}</span>
              <span className="text-[10px] text-neutral-500 block">/ 100 POINTS</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0c0e10] border border-white/10 text-center space-y-1">
              <span className="text-[10px] text-[#83958c] block uppercase">TOTAL TESTS PASSED</span>
              <span className="text-3xl font-black text-emerald-400">
                {multiResult.totalTestsPassed}
              </span>
              <span className="text-[10px] text-neutral-500 block">
                / {multiResult.totalTestsCount} CASES
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#0c0e10] border border-white/10 text-center space-y-1">
              <span className="text-[10px] text-[#83958c] block uppercase">CODE QUALITY</span>
              <span className="text-3xl font-black text-sky-400">{multiResult.qualityScore}</span>
              <span className="text-[10px] text-neutral-500 block">/ 100 BAR</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0c0e10] border border-white/10 text-center space-y-1">
              <span className="text-[10px] text-[#83958c] block uppercase">DEFENSE REASONING</span>
              <span className="text-3xl font-black text-purple-400">{multiResult.communicationScore}</span>
              <span className="text-[10px] text-neutral-500 block">/ 100 BAR</span>
            </div>
          </div>

          {/* Section 1: Per-Question Score & Test Breakdown Matrix */}
          <div className="obsidian-card p-6 sm:p-8 space-y-6 font-mono">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-black uppercase text-white tracking-wider">
                  1. MULTI-QUESTION PERFORMANCE MATRIX ({multiResult.questions.length} PROBLEMS)
                </h2>
              </div>
              <span className="text-[10px] text-neutral-400">
                100% VISIBLE + HIDDEN TEST COVERAGE
              </span>
            </div>

            <div className="space-y-4">
              {multiResult.questions.map((q) => {
                const totalVisible = q.visibleTestsTotal;
                const totalHidden = q.hiddenTestsTotal;
                const totalPassed = q.visibleTestsPassed + q.hiddenTestsPassed;
                const totalCount = totalVisible + totalHidden;
                const isExpanded = Boolean(expandedTestMatrix[q.problemId]);

                return (
                  <div
                    key={q.problemId}
                    className="p-5 rounded-2xl bg-[#0c0e10] border border-white/10 space-y-4"
                  >
                    {/* Problem Row Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-200">
                            Q{q.orderIndex}
                          </span>
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                              q.difficulty === "Hard"
                                ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                            )}
                          >
                            {q.difficulty}
                          </span>
                          <span className="text-[11px] text-neutral-400">{q.topic}</span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-white">
                          {q.problemTitle}
                        </h3>
                      </div>

                      {/* Score & Tests Pill */}
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <span className="text-xs text-neutral-400 block">SCORE EARNED</span>
                          <span className="text-xl font-black text-white">
                            {q.questionScore}{" "}
                            <span className="text-xs text-neutral-500 font-normal">
                              / {q.weight} pts
                            </span>
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-xs text-neutral-400 block">TESTS PASSED</span>
                          <span className="text-xl font-black text-emerald-400">
                            {totalPassed}{" "}
                            <span className="text-xs text-neutral-500 font-normal">
                              / {totalCount}
                            </span>
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleProblemTests(q.problemId)}
                          className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 transition-colors cursor-pointer"
                          title="Toggle Test Case Details"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Question Summary Strip */}
                    <div className="p-3 rounded-xl bg-[#141619] border border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-300">
                      <div>
                        <span className="text-neutral-500">Visible Tests: </span>
                        <span className="text-white font-bold">{q.visibleTestsPassed}/{totalVisible}</span>
                        <span className="mx-2 text-neutral-600">•</span>
                        <span className="text-neutral-500">Hidden Edge Cases: </span>
                        <span className="text-emerald-400 font-bold">{q.hiddenTestsPassed}/{totalHidden}</span>
                      </div>
                      <div className="text-neutral-400 text-[11px]">
                        <span>Claimed: {q.timeComplexity} time / {q.spaceComplexity} space</span>
                      </div>
                    </div>

                    {/* Expandable Test Case Results */}
                    {isExpanded && (
                      <div className="pt-2 space-y-3">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                          Test Case Suite Breakdown ({q.testResults.length} Cases):
                        </span>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {q.testResults.map((tc, idx) => (
                            <div
                              key={tc.testCaseId || idx}
                              className={cn(
                                "p-3.5 rounded-xl border flex flex-col justify-between gap-2 text-xs",
                                tc.passed
                                  ? "bg-[#090a0c] border-emerald-500/20"
                                  : "bg-rose-950/20 border-rose-500/30"
                              )}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  {tc.passed ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  ) : (
                                    <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                  )}
                                  <span className="text-white font-bold text-xs truncate">
                                    {tc.description || `Test Case #${idx + 1}`}
                                  </span>
                                </div>
                                <span
                                  className={cn(
                                    "px-1.5 py-0.2 rounded text-[9px] font-black uppercase shrink-0",
                                    tc.passed ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                                  )}
                                >
                                  {tc.passed ? "PASSED" : "FAILED"}
                                </span>
                              </div>

                              <div className="flex justify-between text-[10px] text-neutral-500 pt-1 border-t border-white/5">
                                <span>{tc.isHidden ? "🔒 Hidden Edge Case" : "👁️ Visible Test"}</span>
                                <span>{tc.executionTimeMs} ms</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
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

              <ReadinessGauge score={multiResult.overallScore} size={220} />

              <div className="w-full space-y-2 text-xs font-mono">
                <div className="flex justify-between text-[#83958c]">
                  <span>Correctness (50%):</span>
                  <span className="text-white font-bold">{multiResult.correctnessScore}%</span>
                </div>
                <div className="flex justify-between text-[#83958c]">
                  <span>Code Quality (15%):</span>
                  <span className="text-white font-bold">{multiResult.qualityScore}%</span>
                </div>
                <div className="flex justify-between text-[#83958c]">
                  <span>Asymptotic Optimality (15%):</span>
                  <span className="text-white font-bold">{multiResult.complexityScore}%</span>
                </div>
                <div className="flex justify-between text-[#83958c]">
                  <span>Written Defense (20%):</span>
                  <span className="text-white font-bold">{multiResult.communicationScore}%</span>
                </div>
              </div>
            </div>

            {/* Right: Competency Radar Chart (8 cols) */}
            <div className="lg:col-span-8 obsidian-card p-6 sm:p-8 flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    FAANG & QUANT COMPETENCY RADAR
                  </span>
                </div>
                <span className="text-[10px] text-[#83958c]">BENCHMARK: 90.0</span>
              </div>

              <div className="w-full flex items-center justify-center">
                <CompetencyRadarChart data={radarData} height={340} />
              </div>
            </div>
          </div>

          {/* Section 2: Senior Staff Bar-Raiser Critique */}
          <div className="obsidian-card p-6 sm:p-8 space-y-6 font-mono">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-black uppercase text-white tracking-wider">
                  2. SENIOR STAFF BAR-RAISER HOLISTIC AUDIT
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
                  {multiResult.barRaiserCritique?.summary}
                </p>
                <div className="pt-2 border-t border-white/5 text-[11px] text-[#83958c]">
                  Completed {multiResult.questions.length} problems under timed conditions.
                </div>
              </div>

              {/* Asymptotic & Idiomatic Analysis */}
              <div className="lg:col-span-2 p-5 rounded-xl bg-[#0c0e10] border border-white/10 space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#83958c] uppercase tracking-wider block">
                    ASYMPTOTIC ANALYSIS
                  </span>
                  <p className="font-sans text-xs text-[#b9cbc1] leading-relaxed">
                    {multiResult.barRaiserCritique?.asymptoticAnalysis}
                  </p>
                </div>

                <div className="space-y-1 pt-2 border-t border-white/5">
                  <span className="text-[10px] font-bold text-[#83958c] uppercase tracking-wider block">
                    IDIOMATIC QUALITY & CODE SMELLS
                  </span>
                  <p className="font-sans text-xs text-[#b9cbc1] leading-relaxed">
                    {multiResult.barRaiserCritique?.idiomaticQuality}
                  </p>
                  {multiResult.barRaiserCritique?.codeSmells?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {multiResult.barRaiserCritique.codeSmells.map((smell, idx) => (
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

          {/* Section 3: Gemini Follow-Up Defense Round Evaluation */}
          {multiResult.geminiFollowUps?.length > 0 && (
            <div className="obsidian-card p-6 sm:p-8 space-y-6 font-mono">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-black uppercase text-white tracking-wider">
                    3. GEMINI TARGETED DEFENSE EVALUATION
                  </h3>
                </div>
                <span className="text-[10px] text-[#83958c]">20% TOTAL SCORE WEIGHT</span>
              </div>

              <div className="space-y-4">
                {multiResult.geminiFollowUps.map((fu, idx) => (
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
                        CANDIDATE DEFENSE:
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

          {/* Section 4: Submitted Code Inspector per Question */}
          <div className="obsidian-card p-6 sm:p-8 space-y-5 font-mono">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-black uppercase text-white tracking-wider">
                  4. SUBMITTED CODE INSPECTOR
                </h3>
              </div>
              <span className="text-[10px] text-neutral-400">
                ACTIVE LANGUAGE: {activeQuestion?.language.toUpperCase()}
              </span>
            </div>

            {/* Question Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {multiResult.questions.map((q) => (
                <button
                  key={q.problemId}
                  type="button"
                  onClick={() => setActiveCodeTab(q.problemId)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                    activeCodeTab === q.problemId
                      ? "bg-white text-black shadow-sm"
                      : "bg-[#141618] text-neutral-400 hover:text-white border border-white/5"
                  )}
                >
                  Q{q.orderIndex}: {q.problemTitle}
                </button>
              ))}
            </div>

            {/* Code Body */}
            {activeQuestion && (
              <div className="p-4 rounded-xl bg-[#0c0e10] border border-white/10 overflow-x-auto text-xs font-mono text-zinc-200">
                <pre>
                  <code>{activeQuestion.submittedCode || "// No code submitted"}</code>
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
              <span>PRACTICE ANOTHER ASSESSMENT</span>
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

  // Fallback Single Question Result View
  return (
    <div className="min-h-screen bg-[#121416] text-[#e2e2e5] font-['Hanken_Grotesk'] antialiased py-10 sm:py-14 select-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <h1 className="text-3xl font-black font-mono text-white uppercase">
          {legacyResult?.problemTitle} Assessment Report
        </h1>
        <div className="obsidian-card p-6">
          <p className="text-sm font-mono text-neutral-300">
            Overall Score: {legacyResult?.overallScore} / 100 • Verdict: {legacyResult?.hiringBarVerdict}
          </p>
        </div>
        <Link href="/oa" className="obsidian-btn-secondary px-6 py-3 font-mono text-xs inline-block">
          RETURN TO OA SIMULATOR
        </Link>
      </div>
    </div>
  );
}
