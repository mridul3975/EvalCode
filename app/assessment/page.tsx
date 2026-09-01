"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SEED_QUESTIONS } from "@/data/seed-questions";
import { saveActiveAssessmentSession, getActiveAssessmentSession } from "@/lib/storage";
import { AssessmentSession } from "@/types/submission";
import {
  Timer,
  ShieldAlert,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  Flame,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AssessmentOnboardingPage() {
  const router = useRouter();
  const [selectedTrack, setSelectedTrack] = useState<"general" | "python" | "javascript" | "cpp">("general");

  const handleStartAssessment = () => {
    let eligible = SEED_QUESTIONS;
    if (selectedTrack !== "general") {
      const matchTrack = SEED_QUESTIONS.filter((q) => q.language === selectedTrack);
      if (matchTrack.length >= 3) eligible = matchTrack;
    }

    const questionIds = eligible.slice(0, 5).map((q) => q.id);

    const newSession: AssessmentSession = {
      id: `session_${Date.now()}`,
      start_time: Date.now(),
      duration_seconds: 3000,
      remaining_seconds: 3000,
      question_ids: questionIds,
      active_question_index: 0,
      flagged_questions: [],
      submissions: {},
      is_completed: false,
    };

    saveActiveAssessmentSession(newSession);
    router.push("/assessment/session");
  };

  const existingSession = typeof window !== "undefined" ? getActiveAssessmentSession() : null;

  return (
    <div className="min-h-screen bg-[#121416] text-[#e2e2e5] font-['Hanken_Grotesk']">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Top Header */}
        <div className="space-y-4 max-w-3xl">

          <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight leading-none">
            TIMED MOCK ASSESSMENT
          </h1>

          <p className="text-base sm:text-lg text-[#b9cbc1] font-normal leading-relaxed">
            Simulate standard 50-minute code evaluation screening tests for platforms like Mindrift, Alignerr, and Scale AI.
          </p>
        </div>

        {/* Existing Session Prompt if active */}
        {existingSession && !existingSession.is_completed && (
          <div className="obsidian-card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-l-4 border-[#ffe149]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="obsidian-chip-neutral text-[#ffe149]">IN PROGRESS</span>
                <h3 className="text-xl font-bold text-white uppercase">ACTIVE SESSION DETECTED</h3>
              </div>
              <p className="text-xs sm:text-sm font-mono text-[#b9cbc1]">
                You have a saved test session with {Math.round(existingSession.remaining_seconds / 60)} minutes remaining.
              </p>
            </div>

            <Link
              href="/assessment/session"
              className="obsidian-btn-primary px-6 py-3 text-xs font-bold uppercase tracking-wider shrink-0"
            >
              RESUME SESSION ➔
            </Link>
          </div>
        )}

        {/* Rules & Calibration 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="obsidian-card p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#121416] flex items-center justify-center text-[#00ffc2] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.04)]">
              <Timer className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-mono font-bold text-[#b9cbc1] uppercase tracking-widest block">
              01 / STRICT DURATION
            </span>
            <h3 className="text-xl font-bold text-white uppercase">50-MINUTE TIMER</h3>
            <p className="text-xs text-[#b9cbc1] font-sans leading-relaxed">
              Global countdown timer with autosave across page refreshes. The session auto-submits upon timer expiration.
            </p>
          </div>

          <div className="obsidian-card p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#121416] flex items-center justify-center text-[#00ffc2] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.04)]">
              <Layers className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-mono font-bold text-[#b9cbc1] uppercase tracking-widest block">
              02 / CURATED FORMAT
            </span>
            <h3 className="text-xl font-bold text-white uppercase">5 CODE AUDITS</h3>
            <p className="text-xs text-[#b9cbc1] font-sans leading-relaxed">
              Balanced distribution across Easy, Medium, and Hard benchmarks covering logic bugs, edge cases, and Big-O regressions.
            </p>
          </div>

          <div className="obsidian-card p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#121416] flex items-center justify-center text-[#00ffc2] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.04)]">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-mono font-bold text-[#b9cbc1] uppercase tracking-widest block">
              03 / BENCHMARK SCORING
            </span>
            <h3 className="text-xl font-bold text-white uppercase">READINESS INDEX</h3>
            <p className="text-xs text-[#b9cbc1] font-sans leading-relaxed">
              Submissions are scored using weighted Discrepancy Diffs against Ground Truth benchmarks with a 90% target threshold.
            </p>
          </div>
        </div>

        {/* Track Selection & Launch Pod */}
        <div className="obsidian-card p-8 sm:p-12 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-[#b9cbc1] uppercase tracking-widest">
              STEP 2: CHOOSE FOCUS AREA
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              SELECT CODING LANGUAGE
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
            {[
              { key: "general", label: "GENERAL (ALL)" },
              { key: "python", label: "PYTHON TRACK" },
              { key: "javascript", label: "JAVASCRIPT" },
              { key: "cpp", label: "C++ TRACK" },
            ].map((track) => {
              const isActive = selectedTrack === track.key;
              return (
                <button
                  key={track.key}
                  type="button"
                  onClick={() => setSelectedTrack(track.key as any)}
                  className={cn(
                    "p-4 rounded-xl font-bold uppercase text-xs sm:text-sm transition-all cursor-pointer",
                    isActive
                      ? "bg-[#00ffc2] text-[#002116] shadow-[0_4px_16px_rgba(0,255,194,0.3)] font-black"
                      : "obsidian-inset text-[#b9cbc1] hover:text-white hover:border-[rgba(255,255,255,0.1)]"
                  )}
                >
                  {track.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleStartAssessment}
            className="obsidian-btn-primary w-full py-5 text-base sm:text-lg font-bold uppercase tracking-wider flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>START 50-MINUTE ASSESSMENT</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
