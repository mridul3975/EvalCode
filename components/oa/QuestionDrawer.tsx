"use client";

import React from "react";
import { OAProblem, OAQuestionState, QuestionSubmissionState } from "@/types/oa";
import { cn } from "@/lib/utils";
import {
  X,
  CheckCircle2,
  Clock,
  Code2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

interface QuestionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  problems: OAProblem[];
  weights: Record<string, number>;
  questionsState: Record<string, OAQuestionState>;
  activeProblemId: string;
  onSelectProblem: (problemId: string) => void;
}

export function QuestionDrawer({
  isOpen,
  onClose,
  problems,
  weights,
  questionsState,
  activeProblemId,
  onSelectProblem,
}: QuestionDrawerProps) {
  if (!isOpen) return null;

  const totalPoints = problems.reduce((acc, p) => acc + (weights[p.id] || 0), 0);
  const attemptedCount = problems.filter((p) => {
    const s = questionsState[p.id]?.status;
    return s && s !== "NOT_STARTED";
  }).length;

  const getStatusBadge = (state?: OAQuestionState) => {
    const status: QuestionSubmissionState = state?.status || "NOT_STARTED";

    switch (status) {
      case "TESTS_PASSING":
        return {
          label: "Tests Passing",
          icon: <CheckCircle2 className="w-3 h-3 text-emerald-400" />,
          classes: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
        };
      case "IN_PROGRESS":
        return {
          label: "In Progress",
          icon: <Clock className="w-3 h-3 text-sky-400" />,
          classes: "border-sky-500/30 text-sky-400 bg-sky-500/10",
        };
      case "SUBMITTED":
        return {
          label: "Ready / Locked",
          icon: <CheckCircle2 className="w-3 h-3 text-purple-400" />,
          classes: "border-purple-500/30 text-purple-400 bg-purple-500/10",
        };
      case "NOT_STARTED":
      default:
        return {
          label: "Not Started",
          icon: <HelpCircle className="w-3 h-3 text-neutral-500" />,
          classes: "border-neutral-800 text-neutral-400 bg-neutral-900/60",
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div
        className="w-full max-w-md h-full bg-[#0e1013] border-l border-neutral-800 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="h-14 px-5 border-b border-neutral-800 flex items-center justify-between shrink-0 bg-[#121418]">
          <div className="flex items-center gap-2.5">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Assessment Matrix
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Strip */}
        <div className="p-4 bg-neutral-950/80 border-b border-neutral-800/80 flex items-center justify-between font-mono text-xs text-neutral-400">
          <div>
            <span>Attempted: </span>
            <span className="text-white font-bold">
              {attemptedCount} / {problems.length}
            </span>
          </div>
          <div>
            <span>Total Weight: </span>
            <span className="text-emerald-400 font-bold">{totalPoints} pts</span>
          </div>
        </div>

        {/* Question Cards List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono">
          {problems.map((prob, idx) => {
            const state = questionsState[prob.id];
            const weight = weights[prob.id] || 0;
            const badge = getStatusBadge(state);
            const isActive = prob.id === activeProblemId;
            const visiblePassed = state?.visibleTestsPassed || 0;
            const visibleTotal = state?.visibleTestsTotal || prob.testCases.filter((tc) => !tc.isHidden).length;

            return (
              <div
                key={prob.id}
                onClick={() => {
                  onSelectProblem(prob.id);
                  onClose();
                }}
                className={cn(
                  "p-4 rounded-xl border transition-all cursor-pointer text-xs flex flex-col justify-between gap-3 group",
                  isActive
                    ? "bg-neutral-900 border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.08)] ring-1 ring-white/20"
                    : "bg-[#121418] border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/60"
                )}
              >
                {/* Card Top Strip */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-black text-[11px] bg-neutral-800 text-neutral-200">
                      Q{idx + 1}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                        prob.difficulty === "Hard"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                      )}
                    >
                      {prob.difficulty}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-white bg-neutral-800/80 px-2 py-0.5 rounded">
                    {weight} pts
                  </span>
                </div>

                {/* Problem Title & Topic */}
                <div className="space-y-1">
                  <h3
                    className={cn(
                      "text-sm font-bold transition-colors line-clamp-1",
                      isActive ? "text-white" : "text-neutral-300 group-hover:text-white"
                    )}
                  >
                    {prob.title}
                  </h3>
                  <p className="text-[11px] text-neutral-500 font-sans">{prob.topic}</p>
                </div>

                {/* Card Footer Status */}
                <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[11px]">
                  <div className={cn("px-2 py-0.5 rounded flex items-center gap-1.5 border text-[10px]", badge.classes)}>
                    {badge.icon}
                    <span>{badge.label}</span>
                  </div>

                  <div className="text-neutral-400 flex items-center gap-1">
                    <span>
                      {visiblePassed}/{visibleTotal} Tests
                    </span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Drawer Footer Tip */}
        <div className="p-4 border-t border-neutral-800 bg-[#121418] text-[11px] font-mono text-neutral-400 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>You can switch between questions at any time. Code and test outputs are saved continuously.</span>
        </div>
      </div>
    </div>
  );
}
