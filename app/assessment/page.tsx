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
} from "lucide-react";

export default function AssessmentOnboardingPage() {
  const router = useRouter();
  const [selectedTrack, setSelectedTrack] = useState<"general" | "python" | "javascript" | "cpp">("general");

  const handleStartAssessment = () => {
    // Pick 5 balanced questions: 2 Easy, 2 Medium, 1 Hard/Compound
    let eligible = SEED_QUESTIONS;
    if (selectedTrack !== "general") {
      const matchTrack = SEED_QUESTIONS.filter((q) => q.language === selectedTrack);
      if (matchTrack.length >= 3) eligible = matchTrack;
    }

    const questionIds = eligible.slice(0, 5).map((q) => q.id);

    const newSession: AssessmentSession = {
      id: `session_${Date.now()}`,
      start_time: Date.now(),
      duration_seconds: 3000, // 50 minutes (3000s)
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
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Top Banner */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <Timer className="w-3.5 h-3.5" />
          <span>Calibrated Technical Screening Simulation</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Timed Mock Assessment
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
          Simulate standard 50-minute code evaluation screening tests for platforms like Mindrift, Alignerr, and Scale AI.
        </p>
      </div>

      {/* Existing Session Prompt if active */}
      {existingSession && !existingSession.is_completed && (
        <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-white">Active Assessment In Progress</h3>
              <p className="text-xs text-zinc-400">
                You have a saved test session with {Math.round(existingSession.remaining_seconds / 60)} minutes remaining.
              </p>
            </div>
          </div>
          <Link
            href="/assessment/session"
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors shrink-0"
          >
            Resume Test Session
          </Link>
        </div>
      )}

      {/* Rules & Calibration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-emerald-400">
            <Timer className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">50-Minute Strict Timer</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Global countdown timer with autosave across page refreshes. The session auto-submits upon timer expiration.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-sky-400">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">5-Question Battery</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Calibrated distribution with 2 Easy, 2 Medium, and 1 Hard across varied defect types (Logic, Edge Cases, Complexity, Deceptive AI).
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-purple-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Anti-Leak Environment</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            No live grading or hints during the test. Complete ground-truth diagnostics and Readiness Index $R$ generated on final submission.
          </p>
        </div>
      </div>

      {/* Track Selection & Start */}
      <div className="p-8 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">Assessment Track Focus</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Choose language battery or take the comprehensive mixed DSA battery.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[
              { key: "general", label: "Mixed Battery" },
              { key: "python", label: "Python" },
              { key: "javascript", label: "JavaScript" },
              { key: "cpp", label: "C++" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setSelectedTrack(t.key as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  selectedTrack === t.key
                    ? "bg-zinc-800 text-emerald-400 border-emerald-500/40"
                    : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Ready to calibrate your evaluation accuracy against RLHF hiring thresholds.</span>
          </div>

          <button
            onClick={handleStartAssessment}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-xl transition-transform hover:scale-[1.02] cursor-pointer"
          >
            <span>Begin 50-Minute Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
