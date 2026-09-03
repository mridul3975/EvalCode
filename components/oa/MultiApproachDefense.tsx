"use client";

import React, { useState } from "react";
import { OAProblem, OAQuestionState } from "@/types/oa";
import { cn } from "@/lib/utils";
import {
  FileText,
  Sparkles,
  ArrowRight,
  Code2,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  HelpCircle,
} from "lucide-react";

interface MultiApproachDefenseProps {
  problems: OAProblem[];
  weights: Record<string, number>;
  questionsState: Record<string, OAQuestionState>;
  onUpdateQuestionApproach: (
    problemId: string,
    approach: string,
    time: string,
    space: string
  ) => void;
  onProceedToGeminiDefense: () => void;
  isLoadingFollowUps?: boolean;
}

const COMPLEXITY_OPTIONS = [
  "O(1)",
  "O(log N)",
  "O(N)",
  "O(N log K)",
  "O(N log N)",
  "O(K * V^2)",
  "O(V + E)",
  "O(N^2)",
  "O(2^N)",
];

const SPACE_OPTIONS = [
  "O(1)",
  "O(K)",
  "O(log N)",
  "O(N)",
  "O(V)",
  "O(V + E)",
  "O(N^2)",
];

export function MultiApproachDefense({
  problems,
  weights,
  questionsState,
  onUpdateQuestionApproach,
  onProceedToGeminiDefense,
  isLoadingFollowUps = false,
}: MultiApproachDefenseProps) {
  const [activeProblemId, setActiveProblemId] = useState<string>(problems[0]?.id || "");

  const activeProblem = problems.find((p) => p.id === activeProblemId) || problems[0];
  const activeState = questionsState[activeProblem.id] || {
    approach: "",
    claimedTime: "O(N)",
    claimedSpace: "O(1)",
    code: "",
    language: "python",
  };

  const handleApproachChange = (val: string) => {
    onUpdateQuestionApproach(
      activeProblem.id,
      val,
      activeState.claimedTime || "O(N)",
      activeState.claimedSpace || "O(1)"
    );
  };

  const handleTimeChange = (val: string) => {
    onUpdateQuestionApproach(
      activeProblem.id,
      activeState.approach || "",
      val,
      activeState.claimedSpace || "O(1)"
    );
  };

  const handleSpaceChange = (val: string) => {
    onUpdateQuestionApproach(
      activeProblem.id,
      activeState.approach || "",
      activeState.claimedTime || "O(N)",
      val
    );
  };

  const isCurrentComplete = Boolean(
    activeState.approach && activeState.approach.trim().length >= 15
  );

  const completedCount = problems.filter((p) => {
    const s = questionsState[p.id];
    return Boolean(s?.approach && s.approach.trim().length >= 15);
  }).length;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0d0e11] text-neutral-200 font-sans overflow-hidden select-none">
      {/* Top Phase Header */}
      <div className="h-14 px-6 bg-[#121418] border-b border-neutral-800/80 flex items-center justify-between shrink-0 font-mono">
        <div className="flex items-center gap-2.5">
          <Layers className="w-4 h-4 text-sky-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wide">
            Phase 2: Technical Approach & Defense Justification
          </h2>
          <span className="text-neutral-500">•</span>
          <span className="text-xs text-neutral-400">
            Completed: {completedCount} / {problems.length}
          </span>
        </div>

        <button
          type="button"
          onClick={onProceedToGeminiDefense}
          disabled={isLoadingFollowUps}
          className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-1.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isLoadingFollowUps ? "Generating Follow-Ups..." : "Enter Gemini Defense Round"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Left Sidebar: Problem Selector Tabs */}
        <div className="w-full lg:w-72 bg-[#0e1013] border-r border-neutral-800/80 p-4 space-y-2 shrink-0 font-mono">
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block px-1">
            Questions To Defend:
          </span>

          {problems.map((p, idx) => {
            const state = questionsState[p.id];
            const weight = weights[p.id] || 0;
            const isDone = Boolean(state?.approach && state.approach.trim().length >= 15);
            const isCurrent = p.id === activeProblemId;

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveProblemId(p.id)}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between text-xs cursor-pointer",
                  isCurrent
                    ? "bg-neutral-800/90 border-sky-500/50 text-white shadow-sm"
                    : "bg-[#131519] border-neutral-800/70 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40"
                )}
              >
                <div className="min-w-0 flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-neutral-900 text-neutral-300">
                    Q{idx + 1}
                  </span>
                  <div className="truncate">
                    <span className="font-bold block truncate">{p.title}</span>
                    <span className="text-[10px] text-neutral-500 block">
                      {weight} pts • {p.difficulty}
                    </span>
                  </div>
                </div>

                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <HelpCircle className="w-4 h-4 text-neutral-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Pane: Code Preview & Written Approach Entry */}
        <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-6 bg-[#0d0e11]">
          {/* Header */}
          <div className="border-b border-neutral-800 pb-4 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-sky-400 mb-1">
                <span>{activeProblem.companyProfile} OA</span>
                <span>•</span>
                <span>{activeProblem.difficulty}</span>
                <span>•</span>
                <span>{weights[activeProblem.id] || 0} pts</span>
              </div>
              <h3 className="text-xl font-black text-white font-mono uppercase">
                {activeProblem.title}
              </h3>
            </div>

            <div className="text-right font-mono text-xs text-neutral-500 hidden sm:block">
              <span>Target: {activeProblem.optimalComplexity.time}</span>
            </div>
          </div>

          {/* Submitted Code Preview (Collapsible/read-only) */}
          <div className="p-4 rounded-xl bg-[#0c0e10] border border-neutral-800 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-neutral-400 text-[11px]">
              <span className="flex items-center gap-1.5 text-neutral-300">
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Your Implementation ({activeState.language.toUpperCase()})</span>
              </span>
              <span>{activeState.code ? `${activeState.code.split("\n").length} lines` : "Empty"}</span>
            </div>
            <pre className="p-3 rounded-lg bg-[#08090b] text-neutral-300 text-[11px] overflow-x-auto max-h-48 border border-neutral-900 whitespace-pre-wrap">
              <code>{activeState.code || "// No code submitted for this question."}</code>
            </pre>
          </div>

          {/* Written Approach Field */}
          <div className="space-y-2 font-mono text-xs">
            <label className="text-xs font-bold text-neutral-200 uppercase tracking-wider block flex items-center justify-between">
              <span>Algorithmic Invariants & Solution Approach</span>
              <span className="text-[10px] text-neutral-500 lowercase">
                ({(activeState.approach || "").length} characters)
              </span>
            </label>
            <textarea
              value={activeState.approach || ""}
              onChange={(e) => handleApproachChange(e.target.value)}
              placeholder="Explain your approach, core data structures, amortized cost bounds, and how you addressed potential scale/concurrency issues..."
              className="w-full h-32 p-3.5 rounded-xl bg-[#0c0e10] border border-neutral-800 text-neutral-200 text-xs font-sans leading-relaxed focus:outline-none focus:border-sky-500 transition-colors resize-none"
            />
          </div>

          {/* Big-O Complexity Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                Claimed Time Complexity
              </label>
              <select
                value={activeState.claimedTime || "O(N)"}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#0c0e10] border border-neutral-800 text-white text-xs focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                {COMPLEXITY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                Claimed Space Complexity
              </label>
              <select
                value={activeState.claimedSpace || "O(1)"}
                onChange={(e) => handleSpaceChange(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#0c0e10] border border-neutral-800 text-white text-xs focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                {SPACE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
