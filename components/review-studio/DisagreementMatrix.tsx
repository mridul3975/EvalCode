"use client";

import React from "react";
import Link from "next/link";
import { QuestionItem, QuestionLanguage } from "@/types/question";
import { EvaluationSubmission, EvaluationResult } from "@/types/submission";
import { DiscrepancyDiffChart } from "@/components/infographics/DiscrepancyDiffChart";
import { CodeDiffViewer } from "@/components/review-studio/CodeDiffViewer";
import { getCodeForLanguage, getLanguageLabel } from "@/lib/language-utils";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Sparkles,
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
    <div className="neu-extruded bg-[#121416] rounded-xl p-6 sm:p-8 flex flex-col h-full font-['Hanken_Grotesk'] text-[#e2e2e5] border border-white/5 shadow-2xl space-y-6">
      {/* 70/30 Neumorphic Results Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-4">
        <div>
          <span className="obsidian-chip-optimal">
            AUDIT MATRIX RESULTS
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">
            DIAGNOSTIC DISCREPANCY SCORE
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] font-mono text-[#b9cbc1] uppercase block">SCORE</span>
            <span className="text-3xl font-black text-white font-mono">{scorePct}%</span>
          </div>

          <span
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase",
              isPass
                ? "bg-white text-black font-black"
                : "bg-[#a90219] text-[#ffdad6]"
            )}
          >
            {isPass ? "BENCHMARK MET" : "MISALIGNED"}
          </span>
        </div>
      </div>

      {/* Discrepancy Diff Segmented Bar */}
      <DiscrepancyDiffChart
        matchedCount={matchedCount}
        missedCount={missedCount}
        hallucinatedCount={hallucinatedCount}
      />

      {/* Discrepancy Items List */}
      <div className="space-y-3 font-mono text-xs">
        <span className="text-xs font-bold text-white uppercase block">GROUND TRUTH FEEDBACK</span>
        {result.discrepancy_items?.map((item, idx) => (
          <div
            key={idx}
            className={cn(
              "p-3.5 rounded-lg border flex items-start gap-2.5",
              item.status === "matched"
                ? "bg-[#16181a] border-white/30 text-white"
                : item.status === "missed"
                ? "bg-[#a90219]/20 border-[#a90219]/40 text-[#ffdad6]"
                : "bg-[#ffe149]/15 border-[#ffe149]/30 text-[#ffe149]"
            )}
          >
            {item.status === "matched" ? (
              <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-0.5">
              <span className="font-bold uppercase tracking-wider block">[{item.status.toUpperCase()}] {item.category}</span>
              <p className="text-xs font-sans opacity-90">{item.explanation}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Ground Truth Code Diff */}
      <div className="space-y-2">
        <span className="text-xs font-mono font-bold text-white uppercase block">SOLUTION REFACTORED DIFF</span>
        <CodeDiffViewer
          buggyCode={originalCode}
          correctedCode={cleanCode}
          language={getLanguageLabel(selectedLanguage)}
        />
      </div>

      {/* Interactive Gemini AI Assistant Banner */}
      {onOpenAssistant && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#181a1d] to-[#1e2022] border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-white uppercase block">
                GEMINI AI AUDIT COPILOT
              </span>
              <p className="text-[11px] text-[#83958c]">
                Have questions about this defect, your score, or the solution diff?
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenAssistant}
            className="neu-extruded bg-[#282a2c] hover:bg-white hover:text-black text-white px-3.5 py-2 rounded-lg font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>OPEN ASSISTANT</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>
      )}

      {/* Action Footer */}
      <div className="border-t border-[rgba(255,255,255,0.08)] pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 mt-auto font-mono text-xs">
        <button
          onClick={onRetry}
          className="w-full sm:w-auto obsidian-btn-secondary px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RE-AUDIT PROBLEM</span>
        </button>

        {nextQuestionId ? (
          <Link
            href={`/practice/${nextQuestionId}`}
            className="w-full sm:w-auto neu-extruded bg-white text-[#121416] px-6 py-2.5 rounded-lg font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#e2e2e5] transition-colors cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          >
            <span>NEXT BENCHMARK</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <Link
            href="/dashboard"
            className="w-full sm:w-auto neu-extruded bg-white text-[#121416] px-6 py-2.5 rounded-lg font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#e2e2e5] transition-colors cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          >
            <span>VIEW DASHBOARD</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
