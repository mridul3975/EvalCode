"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { QuestionItem, QuestionLanguage } from "@/types/question";
import { EvaluationSubmission, EvaluationResult } from "@/types/submission";
import { CodeDiffViewer } from "./CodeDiffViewer";
import { DiscrepancyDiffChart } from "@/components/infographics/DiscrepancyDiffChart";
import { getCodeForLanguage, getCorrectedCodeForLanguage, getLanguageLabel } from "@/lib/language-utils";
import { getReadinessTier, cn } from "@/lib/utils";
import {
  RotateCcw,
  ArrowRight,
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
    <div className="flex flex-col h-full bg-[#121416] border-4 border-white text-white font-['Hanken_Grotesk']">
      {/* Top Banner with Score Gauge */}
      <div className="p-6 border-b-4 border-white bg-white text-black flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
        <div className="flex items-center gap-5">
          <div className="p-4 border-4 border-black bg-white flex flex-col items-center justify-center shrink-0">
            <span className="text-4xl font-black tracking-tight">
              {result.overall_score.toFixed(1)}
            </span>
            <span className="text-xs font-mono font-bold">/ 10</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-black uppercase">DIAGNOSTIC DISCREPANCY REPORT</h2>
              <span className="text-xs font-black px-2 py-0.5 bg-black text-white uppercase font-mono">
                {tier.tier}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-sans max-w-xl text-zinc-800 leading-relaxed font-bold">
              {result.feedback_summary}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end font-mono">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-1.5 px-4 py-2 border-2 border-black bg-white hover:bg-black hover:text-white font-bold text-xs uppercase transition-none cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RE-AUDIT</span>
            </button>
          )}

          {nextQuestionId && (
            <Link
              href={`/practice/${nextQuestionId}`}
              className="flex items-center gap-1.5 px-5 py-2 bg-black text-white hover:bg-zinc-800 font-black text-xs uppercase border-2 border-black transition-none cursor-pointer"
            >
              <span>NEXT QUESTION</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 p-3 border-b-4 border-white bg-[#121416] font-mono">
        <button
          onClick={() => setActiveView("matrix")}
          className={cn(
            "px-4 py-1.5 text-xs font-black uppercase transition-none cursor-pointer border-2",
            activeView === "matrix"
              ? "bg-white text-black border-white"
              : "border-transparent text-zinc-300 hover:bg-white hover:text-black hover:border-white"
          )}
        >
          DISCREPANCY MATRIX
        </button>

        <button
          onClick={() => setActiveView("diff")}
          className={cn(
            "px-4 py-1.5 text-xs font-black uppercase transition-none cursor-pointer border-2",
            activeView === "diff"
              ? "bg-white text-black border-white"
              : "border-transparent text-zinc-300 hover:bg-white hover:text-black hover:border-white"
          )}
        >
          SOLUTION CODE DIFF
        </button>

        <button
          onClick={() => setActiveView("model_critique")}
          className={cn(
            "px-4 py-1.5 text-xs font-black uppercase transition-none cursor-pointer border-2",
            activeView === "model_critique"
              ? "bg-white text-black border-white"
              : "border-transparent text-zinc-300 hover:bg-white hover:text-black hover:border-white"
          )}
        >
          BENCHMARK CRITIQUE
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* VIEW 1: Discrepancy Matrix */}
        {activeView === "matrix" && (
          <div className="space-y-6 font-mono">
            {/* Diff Chart */}
            <DiscrepancyDiffChart
              matchedCount={matchedCount}
              missedCount={missedCount}
              hallucinatedCount={hallCount}
            />

            {/* Matrix Items */}
            <div className="space-y-4 font-['Hanken_Grotesk']">
              <h3 className="text-xl font-black uppercase">
                CALIBRATED DISCREPANCY AUDIT ITEMS ({result.discrepancy_items.length})
              </h3>

              <div className="space-y-4">
                {result.discrepancy_items.map((item, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "p-5 border-4 space-y-2",
                      item.status === "matched"
                        ? "bg-[#121416] border-white text-white"
                        : item.status === "missed"
                        ? "bg-rose-950/40 border-rose-500 text-white"
                        : "bg-amber-950/40 border-amber-500 text-white"
                    )}
                  >
                    <div className="flex items-center justify-between border-b-2 border-current pb-2 font-mono">
                      <span className="text-xs font-black uppercase tracking-wider">
                        {item.category.replace("_", " ")}
                      </span>
                      <span className="text-xs font-black uppercase px-2 py-0.5 bg-black border border-current">
                        {item.status === "matched"
                          ? "[✓] EXACT MATCH"
                          : item.status === "missed"
                          ? "[X] MISSED DEFECT"
                          : "[!] PHANTOM BUG"}
                      </span>
                    </div>

                    <div className="text-sm font-sans space-y-1 pt-1">
                      <div>
                        <strong className="font-mono uppercase text-xs">Ground Truth: </strong>
                        {item.ground_truth_item || "Benchmark expected finding"}
                      </div>
                      <div>
                        <strong className="font-mono uppercase text-xs">Your Finding: </strong>
                        {item.user_finding || "None reported"}
                      </div>
                      {item.explanation && (
                        <div className="text-xs opacity-80 pt-1">
                          <strong className="font-mono uppercase text-[10px]">Explanation: </strong>
                          {item.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Code Diff */}
        {activeView === "diff" && (
          <div className="space-y-4">
            <CodeDiffViewer
              buggyCode={getCodeForLanguage(question, activeLang)}
              correctedCode={getCorrectedCodeForLanguage(question, activeLang)}
              language={getLanguageLabel(activeLang)}
            />
          </div>
        )}

        {/* VIEW 3: Model Critique */}
        {activeView === "model_critique" && (
          <div className="space-y-6">
            <div className="p-6 border-4 border-white bg-[#0a0b0d] space-y-4 font-mono">
              <h3 className="text-xl font-black uppercase text-white font-['Hanken_Grotesk']">
                GROUND-TRUTH BENCHMARK ANALYSIS
              </h3>
              <div className="p-4 bg-[#121416] border-2 border-white space-y-3 font-sans text-sm text-zinc-200">
                <p>
                  <strong className="font-mono uppercase text-xs text-white">Defect Category: </strong>
                  {question.ground_truth.defect_type || question.ground_truth.error_categories[0]}
                </p>
                <p>
                  <strong className="font-mono uppercase text-xs text-white">Optimal Complexity: </strong>
                  {question.ground_truth.optimal_complexity.time} time, {question.ground_truth.optimal_complexity.space} space
                </p>
                <p>
                  <strong className="font-mono uppercase text-xs text-white">Problem Summary: </strong>
                  {question.problem_statement.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
