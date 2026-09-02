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
  Shield,
} from "lucide-react";

interface OANavbarProps {
  companyProfile: CompanyProfile;
  problemTitle: string;
  timeRemainingSeconds: number;
  currentPhase: OAPhase;
  onPhaseChange: (phase: OAPhase) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function OANavbar({
  companyProfile,
  problemTitle,
  timeRemainingSeconds,
  currentPhase,
  onPhaseChange,
  onSubmit,
  isSubmitting = false,
}: OANavbarProps) {
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const minutes = Math.floor(timeRemainingSeconds / 60);
  const seconds = timeRemainingSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const isTimeCritical = timeRemainingSeconds <= 300; // Under 5 minutes

  const companyBadgeColor = {
    Citadel: "border-amber-500/40 text-amber-400 bg-amber-500/10",
    Google: "border-sky-500/40 text-sky-400 bg-sky-500/10",
    Meta: "border-blue-500/40 text-blue-400 bg-blue-500/10",
    Fintech: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
    "Two Sigma": "border-purple-500/40 text-purple-400 bg-purple-500/10",
  }[companyProfile] || "border-white/20 text-white bg-white/10";

  return (
    <header className="w-full bg-[#141618] border-b border-white/10 sticky top-0 z-40 px-4 sm:px-6 py-3 font-mono">
      <div className="max-w-[1900px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Company & Problem Info */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <button
            type="button"
            onClick={() => setShowExitConfirm(true)}
            className="neu-extruded bg-[#1e2022] hover:bg-rose-950/40 hover:text-rose-400 px-3 py-1.5 rounded-lg text-xs font-bold text-[#b9cbc1] transition-all flex items-center gap-1.5 cursor-pointer"
            title="Exit Assessment"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">EXIT</span>
          </button>

          <div className="flex items-center gap-2">
            <span className={cn("px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border", companyBadgeColor)}>
              {companyProfile} OA
            </span>
            <h1 className="text-xs sm:text-sm font-bold text-white uppercase tracking-tight truncate max-w-[280px] lg:max-w-md">
              {problemTitle}
            </h1>
          </div>
        </div>

        {/* Center: Phase Progression Stepper */}
        <div className="flex items-center gap-1.5 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => onPhaseChange("code")}
            className={cn(
              "px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer",
              currentPhase === "code"
                ? "bg-white text-black font-black shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                : "text-[#b9cbc1] hover:text-white bg-[#1e2022]"
            )}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>1. CODE & TEST</span>
          </button>

          <span className="text-white/20">➔</span>

          <button
            type="button"
            onClick={() => onPhaseChange("explanation")}
            className={cn(
              "px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer",
              currentPhase === "explanation"
                ? "bg-white text-black font-black shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                : "text-[#b9cbc1] hover:text-white bg-[#1e2022]"
            )}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>2. EXPLANATION</span>
          </button>

          <span className="text-white/20">➔</span>

          <button
            type="button"
            onClick={() => onPhaseChange("followups")}
            className={cn(
              "px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer",
              currentPhase === "followups"
                ? "bg-white text-black font-black shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                : "text-[#b9cbc1] hover:text-white bg-[#1e2022]"
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>3. GEMINI DEFENSE</span>
          </button>
        </div>

        {/* Right: Countdown Clock & Submit Action */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Countdown Clock */}
          <div
            className={cn(
              "px-3 py-1.5 rounded-lg border flex items-center gap-2 font-mono text-xs font-bold transition-all",
              isTimeCritical
                ? "bg-rose-500/10 border-rose-500/50 text-rose-400 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                : "bg-[#1e2022] border-white/10 text-white"
            )}
          >
            <Clock className={cn("w-3.5 h-3.5", isTimeCritical ? "text-rose-400 animate-spin" : "text-[#b9cbc1]")} />
            <span className="tracking-widest">{timeFormatted}</span>
            {isTimeCritical && <span className="text-[9px] font-black uppercase text-rose-400">URGENT</span>}
          </div>

          {/* Action Button */}
          {currentPhase === "code" && (
            <button
              type="button"
              onClick={() => onPhaseChange("explanation")}
              className="neu-extruded bg-white hover:bg-zinc-200 text-black px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.25)]"
            >
              <span>NEXT: EXPLAIN</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {currentPhase === "explanation" && (
            <button
              type="button"
              onClick={() => onPhaseChange("followups")}
              className="neu-extruded bg-emerald-400 hover:bg-emerald-300 text-black px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(52,211,153,0.3)]"
            >
              <span>ENTER DEFENSE ROUND</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          )}

          {currentPhase === "followups" && (
            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="neu-extruded bg-gradient-to-r from-emerald-400 to-teal-400 hover:opacity-90 text-black px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-[0_0_20px_rgba(52,211,153,0.4)]"
            >
              <span>{isSubmitting ? "AUDITING..." : "SUBMIT ASSESSMENT"}</span>
              <Shield className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="obsidian-card p-6 sm:p-8 max-w-md w-full space-y-5 border border-rose-500/30">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-black uppercase font-mono">EXIT TIMED ASSESSMENT?</h3>
            </div>
            <p className="text-xs text-[#b9cbc1] font-sans leading-relaxed">
              Exiting will terminate the 40-minute screening clock. Any unsubmitted code or technical defenses will not be graded against the {companyProfile} benchmark.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 rounded-lg bg-[#1e2022] text-[#b9cbc1] hover:text-white"
              >
                CANCEL
              </button>
              <Link
                href="/oa"
                className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold"
              >
                EXIT ASSESSMENT
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
