"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CompanyProfile, OAPhase } from "@/types/oa";
import { cn } from "@/lib/utils";
import {
  Clock,
  AlertTriangle,
  Code2,
  FileText,
  Sparkles,
  ArrowRight,
  LogOut,
  Play,
  Shield,
} from "lucide-react";

interface OANavbarProps {
  companyProfile: CompanyProfile;
  problemTitle: string;
  timeRemainingSeconds: number;
  currentPhase: OAPhase;
  onPhaseChange: (phase: OAPhase) => void;
  onSubmit: () => void;
  onRunTests?: () => void;
  isRunningTests?: boolean;
  isSubmitting?: boolean;
}

export function OANavbar({
  companyProfile,
  problemTitle,
  timeRemainingSeconds,
  currentPhase,
  onPhaseChange,
  onSubmit,
  onRunTests,
  isRunningTests = false,
  isSubmitting = false,
}: OANavbarProps) {
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const minutes = Math.floor(timeRemainingSeconds / 60);
  const seconds = timeRemainingSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const isTimeCritical = timeRemainingSeconds <= 300; // Under 5 minutes

  const companyBadgeColor = {
    Citadel: "border-amber-500/30 text-amber-400 bg-amber-500/10",
    Google: "border-sky-500/30 text-sky-400 bg-sky-500/10",
    Meta: "border-blue-500/30 text-blue-400 bg-blue-500/10",
    Fintech: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    "Two Sigma": "border-purple-500/30 text-purple-400 bg-purple-500/10",
  }[companyProfile] || "border-neutral-800 text-neutral-300 bg-neutral-900";

  return (
    <header className="h-[52px] w-full bg-[#0d0e11] border-b border-neutral-800/80 px-4 flex items-center justify-between font-sans shrink-0 z-40 select-none">
      {/* Left: Exit & Problem Metadata */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setShowExitConfirm(true)}
          className="text-neutral-400 hover:text-rose-400 hover:bg-neutral-900 px-2 py-1 rounded text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Exit Assessment"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-mono">Exit</span>
        </button>

        <span className="h-4 w-[1px] bg-neutral-800" />

        <div className="flex items-center gap-2">
          <span className={cn("px-2 py-0.5 rounded text-[11px] font-mono font-medium border", companyBadgeColor)}>
            {companyProfile} OA
          </span>
          <h1 className="text-sm font-medium text-neutral-200 truncate max-w-[200px] md:max-w-xs lg:max-w-md">
            {problemTitle}
          </h1>
        </div>
      </div>

      {/* Center: Stepper Tabs */}
      <div className="hidden md:flex items-center bg-neutral-950/80 border border-neutral-800/80 rounded-lg p-0.5 text-xs font-mono">
        <button
          type="button"
          onClick={() => onPhaseChange("code")}
          className={cn(
            "px-3 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer",
            currentPhase === "code"
              ? "bg-neutral-800 text-white font-medium shadow-sm"
              : "text-neutral-400 hover:text-white"
          )}
        >
          <Code2 className="w-3 h-3" />
          <span>1. Code & Test</span>
        </button>

        <button
          type="button"
          onClick={() => onPhaseChange("explanation")}
          className={cn(
            "px-3 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer",
            currentPhase === "explanation"
              ? "bg-neutral-800 text-white font-medium shadow-sm"
              : "text-neutral-400 hover:text-white"
          )}
        >
          <FileText className="w-3 h-3" />
          <span>2. Explanation</span>
        </button>

        <button
          type="button"
          onClick={() => onPhaseChange("followups")}
          className={cn(
            "px-3 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer",
            currentPhase === "followups"
              ? "bg-neutral-800 text-white font-medium shadow-sm"
              : "text-neutral-400 hover:text-white"
          )}
        >
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>3. Gemini Defense</span>
        </button>
      </div>

      {/* Right: Timer & Phase CTAs */}
      <div className="flex items-center gap-2.5">
        {/* Countdown Timer with Tabular Numerals */}
        <div
          className={cn(
            "px-2.5 py-1 rounded border flex items-center gap-1.5 font-mono text-xs font-medium tabular-nums transition-colors",
            isTimeCritical
              ? "bg-rose-950/30 border-rose-500/50 text-rose-400 animate-pulse"
              : "bg-neutral-900/80 border-neutral-800 text-neutral-300"
          )}
        >
          <Clock className={cn("w-3.5 h-3.5", isTimeCritical ? "text-rose-400" : "text-neutral-500")} />
          <span>{timeFormatted}</span>
        </div>

        {/* Run Code Button (when in code phase) */}
        {currentPhase === "code" && onRunTests && (
          <button
            type="button"
            onClick={onRunTests}
            disabled={isRunningTests}
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white px-3 py-1.5 rounded text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3 h-3 fill-current text-emerald-400" />
            <span>{isRunningTests ? "Running..." : "Run"}</span>
          </button>
        )}

        {/* Phase CTA */}
        {currentPhase === "code" && (
          <button
            type="button"
            onClick={() => onPhaseChange("explanation")}
            className="bg-white hover:bg-neutral-200 text-black px-3.5 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <span>Next: Explain</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        {currentPhase === "explanation" && (
          <button
            type="button"
            onClick={() => onPhaseChange("followups")}
            className="bg-emerald-500 hover:bg-emerald-400 text-black px-3.5 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <span>Enter Defense</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        )}

        {currentPhase === "followups" && (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-95 text-black px-3.5 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Auditing..." : "Submit OA"}</span>
          </button>
        )}
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2.5 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white font-mono uppercase">Exit Timed Assessment?</h3>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              Exiting will terminate this active session. Any unsubmitted code or technical responses will not be evaluated against the {companyProfile} benchmark.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="px-3 py-1.5 rounded bg-neutral-800 text-neutral-300 hover:text-white"
              >
                Cancel
              </button>
              <Link
                href="/oa"
                className="px-3 py-1.5 rounded bg-rose-500 hover:bg-rose-600 text-white font-medium"
              >
                Exit Assessment
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
