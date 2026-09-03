"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CompanyProfile, OAPhase, OAProblem, OAQuestionState } from "@/types/oa";
import { cn } from "@/lib/utils";
import {
  Clock,
  AlertTriangle,
  Play,
  Shield,
  LayoutGrid,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  LogOut,
  Send,
} from "lucide-react";

interface OANavbarProps {
  companyProfile: CompanyProfile;
  trackTitle: string;
  problems: OAProblem[];
  weights: Record<string, number>;
  questionsState: Record<string, OAQuestionState>;
  activeProblemId: string;
  onSelectProblem: (problemId: string) => void;
  timeRemainingSeconds: number;
  currentPhase: OAPhase;
  onOpenDrawer: () => void;
  onOpenSubmitModal: () => void;
  onRunTests?: () => void;
  isRunningTests?: boolean;
  isSubmitting?: boolean;
}

export function OANavbar({
  companyProfile,
  trackTitle,
  problems,
  weights,
  questionsState,
  activeProblemId,
  onSelectProblem,
  timeRemainingSeconds,
  currentPhase,
  onOpenDrawer,
  onOpenSubmitModal,
  onRunTests,
  isRunningTests = false,
  isSubmitting = false,
}: OANavbarProps) {
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // HH:MM:SS format
  const hours = Math.floor(timeRemainingSeconds / 3600);
  const minutes = Math.floor((timeRemainingSeconds % 3600) / 60);
  const seconds = timeRemainingSeconds % 60;
  const timeFormatted = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Warning thresholds: Yellow at < 15m (900s), Blinking red at < 5m (300s)
  const isWarning = timeRemainingSeconds <= 900 && timeRemainingSeconds > 300;
  const isCritical = timeRemainingSeconds <= 300;

  const companyBadgeColor = {
    Citadel: "border-amber-500/40 text-amber-400 bg-amber-500/10",
    Google: "border-sky-500/40 text-sky-400 bg-sky-500/10",
    Meta: "border-blue-500/40 text-blue-400 bg-blue-500/10",
    Fintech: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
    "Two Sigma": "border-purple-500/40 text-purple-400 bg-purple-500/10",
    Amazon: "border-orange-500/40 text-orange-400 bg-orange-500/10",
  }[companyProfile] || "border-neutral-800 text-neutral-300 bg-neutral-900";

  return (
    <header className="h-[54px] w-full bg-[#0d0e11] border-b border-neutral-800/80 px-3 sm:px-4 flex items-center justify-between font-sans shrink-0 z-40 select-none">
      {/* Left: Company Track Badge & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => setShowExitConfirm(true)}
          className="text-neutral-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-neutral-900 transition-colors cursor-pointer shrink-0"
          title="Exit Assessment"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>

        <span className="h-4 w-[1px] bg-neutral-800 shrink-0" />

        <div className="flex items-center gap-2 min-w-0">
          <span className={cn("px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border shrink-0", companyBadgeColor)}>
            {companyProfile} OA
          </span>
          <h1 className="text-xs sm:text-sm font-semibold text-white truncate max-w-[120px] sm:max-w-[200px] md:max-w-xs font-mono">
            {trackTitle}
          </h1>
        </div>
      </div>

      {/* Center: Question Selector Tabs (HackerRank / CodeSignal style) */}
      <div className="flex items-center gap-1.5 overflow-x-auto px-2 scrollbar-none font-mono text-xs">
        {problems.map((p, idx) => {
          const state = questionsState[p.id];
          const isSelected = p.id === activeProblemId && currentPhase === "workspace";
          const visiblePassed = state?.visibleTestsPassed || 0;
          const visibleTotal = state?.visibleTestsTotal || p.testCases.filter((tc) => !tc.isHidden).length;
          const isPassing = state?.status === "TESTS_PASSING" || (visiblePassed === visibleTotal && visibleTotal > 0);
          const isAttempted = visiblePassed > 0 || (state?.code && state.code.length > 30);

          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectProblem(p.id)}
              className={cn(
                "px-3 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap text-xs font-medium",
                isSelected
                  ? "neu-inset text-white font-bold border border-white/10"
                  : "neu-button text-neutral-400 hover:text-neutral-200"
              )}
            >
              <span className="font-bold">Q{idx + 1}</span>
              <span className="hidden xl:inline truncate max-w-[110px] text-[11px] text-neutral-300">
                {p.title}
              </span>

              {/* Status & Test count badge */}
              <span
                className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1",
                  isPassing
                    ? "neu-active-pill text-emerald-400 border-emerald-500/30"
                    : isAttempted
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                    : "bg-black/40 text-neutral-500 border border-white/5"
                )}
              >
                <span>({visiblePassed}/{visibleTotal})</span>
                {isPassing ? (
                  <CheckCircle2 className="w-2.5 h-2.5" />
                ) : isAttempted ? (
                  <span>•</span>
                ) : null}
              </span>
            </button>
          );
        })}

        {/* Matrix Overview Drawer Button */}
        <button
          type="button"
          onClick={onOpenDrawer}
          className="neu-button p-2 rounded-xl text-neutral-400 hover:text-white transition-colors cursor-pointer ml-1"
          title="Open Question Matrix Drawer"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right: Global Timer & Submit Button */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Global Timer (HH:MM:SS) */}
        <div
          className={cn(
            "px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-mono text-xs font-bold tabular-nums transition-colors",
            isCritical
              ? "bg-rose-950/40 border-rose-500/60 text-rose-400 animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.3)]"
              : isWarning
              ? "bg-amber-950/30 border-amber-500/40 text-amber-400"
              : "neu-inset border-white/5 text-neutral-200"
          )}
          title={`Deadline: ${timeFormatted}`}
        >
          <Clock className={cn("w-3.5 h-3.5", isCritical ? "text-rose-400" : isWarning ? "text-amber-400" : "text-neutral-400")} />
          <span>{timeFormatted}</span>
        </div>

        {/* Run Tests Button (when in workspace) */}
        {currentPhase === "workspace" && onRunTests && (
          <button
            type="button"
            onClick={onRunTests}
            disabled={isRunningTests}
            className="neu-button text-neutral-200 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3 h-3 fill-current text-emerald-400" />
            <span className="hidden sm:inline">{isRunningTests ? "Testing..." : "Run"}</span>
          </button>
        )}

        {/* Finish & Submit Assessment Button */}
        <button
          type="button"
          onClick={onOpenSubmitModal}
          disabled={isSubmitting}
          className="bg-white hover:bg-neutral-200 text-black px-4 py-1.5 rounded-xl text-xs font-black font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.2)] disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Send className="w-3 h-3" />
          <span className="hidden sm:inline">Finish Assessment</span>
          <span className="sm:hidden">Finish</span>
        </button>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6 max-w-md w-full space-y-4 shadow-2xl font-mono">
            <div className="flex items-center gap-2.5 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white uppercase">Exit Active Assessment?</h3>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              Exiting will terminate this active session. Any unsubmitted code or technical defenses will not be audited against the {companyProfile} benchmark.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2 text-xs">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="px-3.5 py-2 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <Link
                href="/oa"
                className="px-3.5 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold cursor-pointer"
              >
                Exit Session
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
