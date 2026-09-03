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
    <div className="neu-card p-6 sm:p-8 flex flex-col gap-6 font-['Hanken_Grotesk'] text-neutral-200">
      {/* Score Header & Metric Badges */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono uppercase text-neutral-400 font-bold">
              Diagnostic Audit Score
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
            Calibration Assessment
          </h3>
        </div>

        {/* Elevated Diagnostic Discrepancy Score Card with Physical Badge */}
        <div className="neu-card p-4 sm:p-5 flex items-center gap-4 shrink-0">
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-3xl font-black text-white">{scorePct}%</span>
            <span className="text-[10px] text-neutral-400 font-bold">ACCURACY</span>
          </div>

          <span
            className={cn(
              "neu-active-pill px-4 py-2 text-xs font-mono font-bold uppercase",
              isPass
                ? "text-emerald-400 border-emerald-500/40"
                : "text-rose-400 border-rose-500/40"
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
        <span className="text-xs font-bold text-neutral-200 uppercase tracking-wider block font-mono">
          Ground Truth Finding Breakdown
        </span>
        <div className="space-y-2.5">
          {result.discrepancy_items?.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                "p-4 rounded-xl border flex items-start gap-3 text-xs shadow-inner",
                item.status === "matched"
                  ? "neu-inset border-emerald-500/30 text-emerald-300"
                  : item.status === "missed"
                  ? "neu-inset border-rose-500/30 text-rose-300"
                  : "neu-inset border-amber-500/30 text-amber-300"
              )}
            >
              {item.status === "matched" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : item.status === "missed" ? (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 space-y-1 font-sans">
                <div className="flex justify-between items-center font-mono text-[10px]">
                  <span className="font-bold uppercase tracking-wider">
                    {item.status === "matched"
                      ? "✓ MATCHED GROUND TRUTH"
                      : item.status === "missed"
                      ? "✕ MISSED VULNERABILITY"
                      : "⚠ FALSE POSITIVE (HALLUCINATION)"}
                  </span>
                  <span className="text-neutral-400 uppercase font-mono">{item.category}</span>
                </div>
                <p className="text-xs leading-relaxed text-neutral-200">{item.explanation || item.ground_truth_item || item.user_finding}</p>
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
        <div className="neu-inset p-4 flex items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-neutral-300">Have questions on this ground truth or Big-O analysis?</span>
          </div>
          <button
            type="button"
            onClick={onOpenAssistant}
            className="neu-button px-4 py-2 text-white font-bold transition-all cursor-pointer shrink-0"
          >
            Ask Gemini Studio
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.06] font-mono text-xs">
        <button
          type="button"
          onClick={onRetry}
          className="neu-button px-4 py-2.5 text-neutral-200 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Re-Audit Question</span>
        </button>

        {nextQuestionId ? (
          <Link
            href={`/practice/${nextQuestionId}`}
            className="neu-button px-5 py-2.5 bg-white text-black font-bold flex items-center gap-2 transition-all cursor-pointer hover:bg-neutral-200"
          >
            <span>Next Question</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <Link
            href="/practice"
            className="neu-button px-5 py-2.5 bg-white text-black font-bold flex items-center gap-2 transition-all cursor-pointer hover:bg-neutral-200"
          >
            <span>Return to Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
