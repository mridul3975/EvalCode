"use client";

import React from "react";
import { OAProblem, OAQuestionState } from "@/types/oa";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

interface PreSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: () => void;
  problems: OAProblem[];
  weights: Record<string, number>;
  questionsState: Record<string, OAQuestionState>;
  timeRemainingSeconds: number;
  isSubmitting?: boolean;
}

export function PreSubmitModal({
  isOpen,
  onClose,
  onConfirmSubmit,
  problems,
  weights,
  questionsState,
  timeRemainingSeconds,
  isSubmitting = false,
}: PreSubmitModalProps) {
  if (!isOpen) return null;

  const minutes = Math.floor(timeRemainingSeconds / 60);
  const seconds = timeRemainingSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Analyze readiness & warnings
  let unattemptedCount = 0;
  let failingCount = 0;
  let readyCount = 0;

  const matrix = problems.map((prob, idx) => {
    const state = questionsState[prob.id];
    const weight = weights[prob.id] || 0;
    const visibleTotal = state?.visibleTestsTotal || prob.testCases.filter((tc) => !tc.isHidden).length;
    const visiblePassed = state?.visibleTestsPassed || 0;
    const hasCode = Boolean(state?.code && state.code.trim().length > 30);

    let status: "ready" | "failing" | "unattempted" = "unattempted";
    let message = "Not Attempted";
    let badgeClass = "bg-neutral-800 text-neutral-400 border-neutral-700";
    let icon = <HelpCircle className="w-3.5 h-3.5 text-neutral-400 shrink-0" />;

    if (!hasCode && visiblePassed === 0) {
      status = "unattempted";
      unattemptedCount++;
      message = "No code written";
      badgeClass = "bg-neutral-900 border-neutral-800 text-neutral-400";
      icon = <HelpCircle className="w-3.5 h-3.5 text-neutral-500 shrink-0" />;
    } else if (visiblePassed === visibleTotal && visibleTotal > 0) {
      status = "ready";
      readyCount++;
      message = `${visiblePassed}/${visibleTotal} Tests Passed (Ready)`;
      badgeClass = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
      icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    } else {
      status = "failing";
      failingCount++;
      message = `${visiblePassed}/${visibleTotal} Tests Passed (Failing Tests)`;
      badgeClass = "bg-amber-500/10 border-amber-500/30 text-amber-400";
      icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
    }

    return {
      order: idx + 1,
      problem: prob,
      weight,
      status,
      message,
      badgeClass,
      icon,
      visiblePassed,
      visibleTotal,
    };
  });

  const hasWarnings = unattemptedCount > 0 || failingCount > 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl rounded-2xl bg-[#0e1013] border border-neutral-800 p-6 sm:p-7 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-mono">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/10 text-neutral-200 border border-white/10">
                Pre-Submission Audit
              </span>
              <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold text-white tabular-nums">{timeFormatted}</span> remaining
              </span>
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight font-mono">
              Finish Assessment Confirmation
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Warning Banner if unattempted or failing */}
        {hasWarnings && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 leading-relaxed">
              <span className="font-bold block">Attention: Potential Unfinished Work</span>
              <p className="text-amber-200/90 text-[11px]">
                {unattemptedCount > 0 && `${unattemptedCount} question(s) unattempted. `}
                {failingCount > 0 && `${failingCount} question(s) have failing tests. `}
                Submitting now locks your solutions and advances to Phase 2 (Technical Defense) and Gemini scoring.
              </p>
            </div>
          </div>
        )}

        {/* Question Matrix Table */}
        <div className="space-y-2 font-mono text-xs">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
            Submission Status Matrix:
          </span>

          <div className="space-y-2">
            {matrix.map((item) => (
              <div
                key={item.problem.id}
                className="p-3.5 rounded-xl bg-[#131519] border border-neutral-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-neutral-800 text-neutral-300 shrink-0">
                    Q{item.order}
                  </span>
                  <div className="min-w-0">
                    <span className="text-white font-bold block truncate text-xs">
                      {item.problem.title}
                    </span>
                    <span className="text-[10px] text-neutral-500 block">
                      {item.weight} pts • {item.problem.difficulty}
                    </span>
                  </div>
                </div>

                <div className={cn("px-2.5 py-1 rounded-md border flex items-center gap-1.5 text-[11px] shrink-0 font-medium", item.badgeClass)}>
                  {item.icon}
                  <span>{item.message}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between gap-3 font-mono text-xs">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-colors cursor-pointer font-bold"
          >
            Return to Assessment
          </button>

          <button
            type="button"
            onClick={onConfirmSubmit}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50"
          >
            <span>{hasWarnings ? "Submit Anyway" : "Confirm & Proceed"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
