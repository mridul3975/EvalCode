"use client";

import React from "react";
import { OAFollowUpQuestion } from "@/types/oa";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  Shield,
  Zap,
} from "lucide-react";

interface FollowUpRoundProps {
  questions: OAFollowUpQuestion[];
  responses: Record<string, string>;
  onResponseChange: (questionId: string, answer: string) => void;
  onSubmitAssessment: () => void;
  isLoadingQuestions?: boolean;
  isSubmitting?: boolean;
}

const CATEGORY_META = {
  scale_and_constraints: {
    label: "SCALE & CONSTRAINTS",
    color: "border-sky-500/30 text-sky-400 bg-sky-500/10",
  },
  edge_case_and_stability: {
    label: "EDGE CASES & STABILITY",
    color: "border-amber-500/30 text-amber-400 bg-amber-500/10",
  },
  complexity_reduction: {
    label: "COMPLEXITY REDUCTION",
    color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
  },
  architecture_tradeoffs: {
    label: "SYSTEM TRADE-OFFS",
    color: "border-purple-500/30 text-purple-400 bg-purple-500/10",
  },
};

export function FollowUpRound({
  questions,
  responses,
  onResponseChange,
  onSubmitAssessment,
  isLoadingQuestions = false,
  isSubmitting = false,
}: FollowUpRoundProps) {
  const allAnswered = questions.length > 0 && questions.every((q) => (responses[q.id] || "").trim().length >= 10);

  return (
    <div className="flex flex-col h-full bg-[#0d0e11] font-mono text-neutral-200">
      {/* Header */}
      <div className="h-9 px-4 bg-[#121418] border-b border-neutral-800/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <h3 className="text-xs font-semibold text-neutral-300">
            Phase 3: Gemini Principal Defense Round
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400">
          Gemini 2.5 Flash
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 p-5 overflow-y-auto space-y-5 text-xs">
        {/* Banner */}
        <div className="p-3.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80 text-xs text-neutral-400 space-y-1">
          <div className="flex items-center gap-1.5 text-neutral-200 font-medium font-sans">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>High-Stakes Technical Defense</span>
          </div>
          <p className="font-sans text-xs text-neutral-400 leading-relaxed">
            Gemini analyzed your code and generated targeted follow-ups probing scale limits, edge-case failure modes, and concurrency trade-offs. Answer clearly to defend your score.
          </p>
        </div>

        {isLoadingQuestions ? (
          <div className="h-48 flex flex-col items-center justify-center gap-2.5 text-emerald-400 font-mono">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-xs font-medium">
              Generating tailored follow-up questions...
            </span>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q, idx) => {
              const meta = CATEGORY_META[q.category] || {
                label: "SYSTEM ARCHITECTURE",
                color: "border-neutral-800 text-neutral-300 bg-neutral-900",
              };
              const answer = responses[q.id] || "";

              return (
                <div
                  key={q.id}
                  className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-neutral-800 text-white font-mono text-[10px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span className={cn("px-2 py-0.5 rounded text-[10px] font-mono font-medium border", meta.color)}>
                        {meta.label}
                      </span>
                    </div>

                    {answer.trim().length >= 10 && (
                      <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Answered</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm font-sans font-medium text-white leading-relaxed">
                    {q.question}
                  </p>

                  <textarea
                    rows={4}
                    value={answer}
                    onChange={(e) => onResponseChange(q.id, e.target.value)}
                    placeholder="Provide a technical defense: cite data structure invariants, algorithmic modifications, or memory trade-offs..."
                    className="w-full p-3 rounded-lg bg-[#0d0e11] border border-neutral-800/80 text-neutral-200 text-xs font-mono placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/80 transition-colors"
                  />

                  <div className="flex justify-between items-center text-[10px] text-neutral-500 font-mono">
                    <span>Minimum 10 characters</span>
                    <span>{answer.length} characters</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="h-12 px-4 bg-[#121418] border-t border-neutral-800/80 flex items-center justify-between gap-3 shrink-0">
        <span className="text-xs text-neutral-500 font-mono">
          {Object.values(responses).filter((a) => a.trim().length >= 10).length} of {questions.length} questions defended
        </span>

        <button
          type="button"
          onClick={onSubmitAssessment}
          disabled={!allAnswered || isSubmitting}
          className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-95 text-black px-4 py-1.5 rounded text-xs font-medium font-sans flex items-center gap-1.5 cursor-pointer disabled:opacity-40 transition-all shadow-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Computing Benchmark...</span>
            </>
          ) : (
            <>
              <span>Submit & Reveal Score</span>
              <Zap className="w-3.5 h-3.5 fill-current" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
