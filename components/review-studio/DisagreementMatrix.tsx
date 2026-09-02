"use client";

import React from "react";
import Link from "next/link";
import { QuestionItem, QuestionLanguage } from "@/types/question";
import { EvaluationSubmission, EvaluationResult } from "@/types/submission";
import { DiscrepancyDiffChart } from "@/components/infographics/DiscrepancyDiffChart";
import { CodeDiffViewer } from "@/components/review-studio/CodeDiffViewer";
import { getCodeForLanguage } from "@/lib/language-utils";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Award,
} from "lucide-react";

export function DisagreementMatrix({
  question,
  submission,
  result,
  onRetry,
  nextQuestionId,
  selectedLanguage = "python",
  onOpenAssistant,
}: {
  question: QuestionItem;
  submission: EvaluationSubmission;
  result: EvaluationResult;
  onRetry: () => void;
  nextQuestionId?: string;
  selectedLanguage?: QuestionLanguage;
  onOpenAssistant?: () => void;
}) {
  const scorePct = (result.overall_score * 10).toFixed(0);
  const isPass = result.overall_score >= 8.0;
  const originalCode = getCodeForLanguage(question, selectedLanguage);
  const cleanCode = question.ground_truth.corrected_code || originalCode;

  const matchedCount = result.matched_issues?.length || 0;
  const missedCount = result.missed_issues?.length || 0;
  const hallucinatedCount = result.hallucinated_issues?.length || 0;

  return (
    <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-5 sm:p-6 flex flex-col gap-6 font-['Hanken_Grotesk'] text-neutral-200 shadow-xl backdrop-blur-sm">
      {/* Score Header & Metric Badges */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono uppercase text-neutral-400 font-semibold">
              Diagnostic Audit Score
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Calibration Assessment
          </h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-3xl font-extrabold text-white">{scorePct}%</span>
            <span className="text-xs text-neutral-500">ACCURACY</span>
          </div>

          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase border",
              isPass
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/30 text-rose-400"
            )}
          >
            {isPass ? "Benchmark Met" : "Misaligned"}
          </span>
        </div>
      </div>

      {/* Discrepancy Diff Segmented Bar */}
      <DiscrepancyDiffChart
        matchedCount={matchedCount}
        missedCount={missedCount}
        hallucinatedCount={hallucinatedCount}
      />

      {/* Ground Truth Feedback List */}
      <div className="space-y-3 font-mono text-xs">
        <span className="text-xs font-semibold text-neutral-300 uppercase block font-mono">
          Ground Truth Finding Breakdown
        </span>
        <div className="space-y-2">
          {result.discrepancy_items?.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                "p-3 rounded-lg border flex items-start gap-2.5",
                item.status === "matched"
                  ? "bg-emerald-950/10 border-emerald-500/30 text-emerald-300"
                  : item.status === "missed"
                  ? "bg-rose-950/10 border-rose-500/30 text-rose-300"
                  : "bg-amber-950/10 border-amber-500/30 text-amber-300"
              )}
            >
              {item.status === "matched" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : item.status === "missed" ? (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 space-y-0.5 font-sans">
                <div className="flex justify-between items-center font-mono text-[10px]">
                  <span className="font-bold uppercase tracking-wider">
                    {item.status === "matched"
                      ? "✓ MATCHED GROUND TRUTH"
                      : item.status === "missed"
                      ? "✕ MISSED VULNERABILITY"
                      : "⚠ FALSE POSITIVE (HALLUCINATION)"}
                  </span>
                  <span className="text-neutral-400 uppercase">{item.category}</span>
                </div>
                <p className="text-xs leading-relaxed">{item.explanation || item.ground_truth_item || item.user_finding}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Code Diff Viewer */}
      <CodeDiffViewer
        buggyCode={originalCode}
        correctedCode={cleanCode}
        language={selectedLanguage.toUpperCase()}
      />

      {/* Assistant Quick Banner */}
      {onOpenAssistant && (
        <div className="p-3.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80 flex items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-neutral-300">Have questions on this ground truth or Big-O analysis?</span>
          </div>
          <button
            type="button"
            onClick={onOpenAssistant}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors cursor-pointer shrink-0"
          >
            Ask Gemini Studio
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-800 font-mono text-xs">
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Re-Audit Question</span>
        </button>

        {nextQuestionId ? (
          <Link
            href={`/practice/${nextQuestionId}`}
            className="px-5 py-2 rounded-lg bg-white hover:bg-neutral-200 text-black font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>Next Question</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <Link
            href="/practice"
            className="px-5 py-2 rounded-lg bg-white hover:bg-neutral-200 text-black font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>Return to Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
