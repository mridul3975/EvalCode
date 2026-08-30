"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { QuestionItem, QuestionLanguage } from "@/types/question";
import { EvaluationSubmission, EvaluationResult } from "@/types/submission";
import { CodeDiffViewer } from "./CodeDiffViewer";
import { DiscrepancyDiffChart, ReadinessProgressBar } from "@/components/infographics/DiscrepancyDiffChart";
import { getCodeForLanguage, getCorrectedCodeForLanguage, getLanguageLabel } from "@/lib/language-utils";
import { getReadinessTier, cn } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Sparkles,
  BookOpen,
  Code2,
  Layers,
  HelpCircle,
} from "lucide-react";

export interface DisagreementMatrixProps {
  question: QuestionItem;
  submission: EvaluationSubmission;
  result: EvaluationResult;
  onRetry?: () => void;
  nextQuestionId?: string;
  selectedLanguage?: QuestionLanguage;
}

export function DisagreementMatrix({
  question,
  submission,
  result,
  onRetry,
  nextQuestionId,
  selectedLanguage,
}: DisagreementMatrixProps) {
  const activeLang = selectedLanguage || question.language;
  const [activeView, setActiveView] = useState<"matrix" | "diff" | "model_critique">("matrix");
  const tier = getReadinessTier(result.overall_score * 10);

  const matchedCount = result.discrepancy_items.filter((i) => i.status === "matched").length;
  const missedCount = result.discrepancy_items.filter((i) => i.status === "missed").length;
  const hallCount = result.discrepancy_items.filter((i) => i.status === "hallucinated").length;

  useEffect(() => {
    if (result.overall_score >= 8.5) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  }, [result.overall_score]);

  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-800/90 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Banner with Score Gauge */}
      <div className="p-6 border-b border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center border shadow-inner shrink-0"
            style={{
              borderColor: `${tier.color}40`,
              backgroundColor: `${tier.color}15`,
            }}
          >
            <span className="text-2xl font-black tracking-tight" style={{ color: tier.color }}>
              {result.overall_score.toFixed(1)}
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">/ 10</span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-white">Diagnostic Discrepancy Report</h2>
              <span
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full border"
                style={{
                  color: tier.color,
                  borderColor: `${tier.color}40`,
                  backgroundColor: `${tier.color}15`,
                }}
              >
                {tier.tier}
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
              {result.feedback_summary}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-all active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Review</span>
            </button>
          )}

          {nextQuestionId ? (
            <Link
              href={`/practice/${nextQuestionId}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>Next Problem</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              href="/practice"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>Practice Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveView("matrix")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              activeView === "matrix"
                ? "bg-zinc-800 text-emerald-400 border border-zinc-700 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Discrepancy Matrix</span>
          </button>

          <button
            onClick={() => setActiveView("diff")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              activeView === "diff"
                ? "bg-zinc-800 text-sky-400 border border-zinc-700 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Ground-Truth Diff</span>
          </button>

          <button
            onClick={() => setActiveView("model_critique")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              activeView === "model_critique"
                ? "bg-zinc-800 text-purple-400 border border-zinc-700 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Expert Critique</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
          {question.id}
        </span>
      </div>

      {/* Body Viewport */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {activeView === "matrix" && (
          <>
            {/* Dimensional Score Breakdown & Diagnostic Ratio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-3.5">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Dimensional Score Breakdown
                </span>
                <div className="space-y-2.5">
                  <ReadinessProgressBar
                    label="Functional Correctness (30%)"
                    value={result.dimensional_scores.correctness * 10}
                  />
                  <ReadinessProgressBar
                    label="Edge-Case Analysis (25%)"
                    value={result.dimensional_scores.edge_cases * 10}
                  />
                  <ReadinessProgressBar
                    label="Complexity & Big-O (15%)"
                    value={result.dimensional_scores.complexity * 10}
                  />
                  <ReadinessProgressBar
                    label="Explanation Auditing (15%)"
                    value={result.dimensional_scores.explanation * 10}
                  />
                  <ReadinessProgressBar
                    label="Communication Quality (15%)"
                    value={(result.dimensional_scores.communication ?? 8) * 10}
                  />
                </div>
              </div>

              <DiscrepancyDiffChart
                matchedCount={matchedCount}
                missedCount={missedCount}
                hallucinatedCount={hallCount}
              />
            </div>

            {/* 3-Column Diagnostic Disagreement Matrix */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Side-by-Side Diagnostic Gap Matrix
                </span>
                <span className="text-[11px] text-zinc-500">
                  Candidate Findings vs Expert Ground Truth
                </span>
              </div>

              <div className="space-y-3.5">
                {result.discrepancy_items.map((item) => {
                  const isMatch = item.status === "matched";
                  const isMissed = item.status === "missed";
                  const isHallucinated = item.status === "hallucinated";

                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "p-4 rounded-2xl border transition-all space-y-3.5 shadow-sm",
                        isMatch && "bg-emerald-950/15 border-emerald-800/40",
                        isMissed && "bg-rose-950/15 border-rose-800/40",
                        isHallucinated && "bg-amber-950/15 border-amber-800/40"
                      )}
                    >
                      {/* Top Header line */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {isMatch && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          {isMissed && <XCircle className="w-4 h-4 text-rose-400" />}
                          {isHallucinated && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                          <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                            {item.category} Evaluation
                          </span>
                        </div>

                        <span
                          className={cn(
                            "text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border",
                            isMatch && "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                            isMissed && "bg-rose-500/10 text-rose-400 border-rose-500/30",
                            isHallucinated && "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          )}
                        >
                          {item.status.toUpperCase()}
                        </span>
                      </div>

                      {/* 3-Column Content Box */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        {/* Col 1: Candidate */}
                        <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                            What You Reported
                          </span>
                          <p className="text-zinc-300 font-mono leading-relaxed">
                            {item.user_finding || "No finding reported for this dimension."}
                          </p>
                        </div>

                        {/* Col 2: Ground Truth */}
                        <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                            Ground Truth (Expert Benchmark)
                          </span>
                          <p className="text-zinc-300 font-mono leading-relaxed">
                            {item.ground_truth_item || "N/A"}
                          </p>
                        </div>

                        {/* Col 3: Diagnostic Gap */}
                        <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                            Diagnostic Feedback
                          </span>
                          <p className="text-zinc-300 leading-relaxed font-sans">{item.explanation}</p>
                        </div>
                      </div>

                      {/* Expandable Why This Matters pedagogical note */}
                      {item.why_it_matters && (
                        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 flex items-start gap-2.5">
                          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-zinc-200">Why This Matters in Technical Screening: </span>
                            {item.why_it_matters}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {activeView === "diff" && (
          <div className="space-y-4">
            <CodeDiffViewer
              buggyCode={getCodeForLanguage(question, activeLang)}
              correctedCode={getCorrectedCodeForLanguage(question, activeLang)}
              language={getLanguageLabel(activeLang)}
            />
          </div>
        )}

        {activeView === "model_critique" && (
          <div className="space-y-5">
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Model Critique Summary</h3>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                {question.ground_truth.model_critique_summary}
              </p>
            </div>

            {/* Expected Issues Detail List */}
            {question.ground_truth.expected_issues.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Registered Expert Defect Catalog
                </span>
                {question.ground_truth.expected_issues.map((iss) => (
                  <div
                    key={iss.id}
                    className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-mono">{iss.id}</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {iss.dimension}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-400">
                        Line(s): {iss.line_numbers.join(", ")}
                      </span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed font-sans">{iss.description}</p>
                    {iss.failing_input_example && (
                      <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-[11px] text-amber-300">
                        Failing Vector: {iss.failing_input_example}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
