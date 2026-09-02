"use client";

import React from "react";
import { OAFollowUpQuestion, OAFollowUpResponse } from "@/types/oa";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  HelpCircle,
  Send,
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
    color: "border-sky-500/40 text-sky-400 bg-sky-500/10",
  },
  edge_case_and_stability: {
    label: "EDGE CASES & STABILITY",
    color: "border-amber-500/40 text-amber-400 bg-amber-500/10",
  },
  complexity_reduction: {
    label: "COMPLEXITY REDUCTION",
    color: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
  },
  architecture_tradeoffs: {
    label: "SYSTEM TRADE-OFFS",
    color: "border-purple-500/40 text-purple-400 bg-purple-500/10",
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
    <div className="flex flex-col h-full bg-[#141618] border border-white/10 rounded-xl overflow-hidden shadow-2xl font-mono">
      {/* Header */}
      <div className="p-4 bg-[#181a1d] border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold uppercase text-white tracking-wider">
            PHASE 3: GEMINI PRINCIPAL STAFF DEFENSE ROUND
          </h3>
        </div>
        <span className="obsidian-chip-optimal text-[10px]">GEMINI 2.5 FLASH AUDIT</span>
      </div>

      {/* Body */}
      <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6">
        {/* Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-[#1e2022] border border-emerald-500/30 text-xs text-[#b9cbc1] space-y-1">
          <div className="flex items-center gap-2 text-white font-bold uppercase">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>High-Stakes Technical Defense:</span>
          </div>
          <p className="font-sans text-xs leading-relaxed">
            Gemini analyzed your submitted implementation and generated targeted questions probing scalability limits, edge-case failure modes, and concurrency trade-offs. Answer clearly to defend your score before the hiring bar.
          </p>
        </div>

        {isLoadingQuestions ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3 text-emerald-400 font-mono">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-xs font-bold tracking-wider">
              GEMINI IS EXAMINING CODE & GENERATING FOLLOW-UPS...
            </span>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((q, idx) => {
              const meta = CATEGORY_META[q.category] || {
                label: "SYSTEM ARCHITECTURE",
                color: "border-white/20 text-white bg-white/10",
              };
              const answer = responses[q.id] || "";

              return (
                <div
                  key={q.id}
                  className="p-5 rounded-xl bg-[#0c0e10] border border-white/10 space-y-3 shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-white text-black font-black text-[10px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className={cn("px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border", meta.color)}>
                        {meta.label}
                      </span>
                    </div>

                    {answer.trim().length >= 10 && (
                      <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>ANSWERED</span>
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
                    className="w-full p-3 rounded-xl bg-[#141618] border border-white/10 text-white text-xs font-mono placeholder:text-zinc-600 focus:outline-none focus:border-emerald-400 transition-colors"
                  />

                  <div className="flex justify-between items-center text-[10px] text-[#83958c]">
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
      <div className="p-4 bg-[#181a1d] border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
        <span className="text-xs text-[#83958c]">
          {Object.values(responses).filter((a) => a.trim().length >= 10).length} of {questions.length} questions defended
        </span>

        <button
          type="button"
          onClick={onSubmitAssessment}
          disabled={!allAnswered || isSubmitting}
          className="neu-extruded bg-gradient-to-r from-emerald-400 to-teal-400 hover:opacity-90 text-black px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-40 shadow-[0_0_20px_rgba(52,211,153,0.4)]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>COMPUTING BENCHMARK...</span>
            </>
          ) : (
            <>
              <span>SUBMIT & REVEAL OA SCORE</span>
              <Zap className="w-4 h-4 fill-current" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
