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
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-12 space-y-10 font-['Hanken_Grotesk'] text-white">
      {/* Top Banner */}
      <div className="border-b-4 border-white pb-8">
        <div className="text-xs font-mono font-black uppercase tracking-widest px-3 py-1 bg-white text-black inline-block mb-3">
          SIMULATED SCREENING EXAM
        </div>
        <h1 className="text-4xl sm:text-7xl font-black uppercase tracking-tight">
          TIMED MOCK ASSESSMENT
        </h1>
        <p className="text-base sm:text-xl text-zinc-300 font-mono mt-2">
          50-MINUTE SCREENING SIMULATION CALIBRATED FOR ALIGNERR, MINDRIFT & SCALE AI
        </p>
      </div>

      {/* Existing Session Prompt if active */}
      {existingSession && !existingSession.is_completed && (
        <div className="p-6 sm:p-8 border-4 border-white bg-white text-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
          <div className="space-y-1">
            <h3 className="text-2xl font-black uppercase">ACTIVE TEST SESSION IN PROGRESS</h3>
            <p className="text-sm font-mono text-zinc-700">
              You have a saved test session with {Math.round(existingSession.remaining_seconds / 60)} minutes remaining.
            </p>
          </div>
          <Link
            href="/assessment/session"
            className="px-8 py-4 bg-black text-white font-black uppercase text-sm hover:bg-zinc-800 transition-none shrink-0"
          >
            RESUME SESSION ➔
          </Link>
        </div>
      )}

      {/* Rules & Calibration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 border-4 border-white bg-[#121416] space-y-4">
          <div className="text-xs font-mono font-black uppercase text-zinc-400 border-b-2 border-white pb-2">
            01 / TIMING
          </div>
          <h3 className="text-2xl font-black uppercase">50-MINUTE TIMER</h3>
          <p className="text-xs font-sans text-zinc-300 leading-relaxed">
            Global countdown timer with autosave across page refreshes. The session auto-submits upon timer expiration.
          </p>
        </div>

        <div className="p-8 border-4 border-white bg-[#121416] space-y-4">
          <div className="text-xs font-mono font-black uppercase text-zinc-400 border-b-2 border-white pb-2">
            02 / FORMAT
          </div>
          <h3 className="text-2xl font-black uppercase">5 CODE AUDITS</h3>
          <p className="text-xs font-sans text-zinc-300 leading-relaxed">
            Balanced distribution across Easy, Medium, and Hard benchmarks covering logic bugs, edge cases, and Big-O regressions.
          </p>
        </div>

        <div className="p-8 border-4 border-white bg-[#121416] space-y-4">
          <div className="text-xs font-mono font-black uppercase text-zinc-400 border-b-2 border-white pb-2">
            03 / SCORING
          </div>
          <h3 className="text-2xl font-black uppercase">READINESS INDEX</h3>
          <p className="text-xs font-sans text-zinc-300 leading-relaxed">
            Submissions are scored using weighted Discrepancy Diffs against Ground Truth benchmarks with a 90% target threshold.
          </p>
        </div>
      </div>

      {/* Track Selection & Start Launch Card */}
      <div className="p-8 sm:p-14 border-4 border-black bg-white text-black space-y-8 shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]">
        <div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mb-2">
            SELECT EVALUATION TRACK
          </h2>
          <p className="text-sm font-mono uppercase text-zinc-700">
            Choose your primary programming language or take the General Multi-Language track.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
          {[
            { key: "general", label: "GENERAL (ALL)" },
            { key: "python", label: "PYTHON TRACK" },
            { key: "javascript", label: "JAVASCRIPT" },
            { key: "cpp", label: "C++ TRACK" },
          ].map((track) => (
            <button
              key={track.key}
              type="button"
              onClick={() => setSelectedTrack(track.key as any)}
              className={`p-4 border-4 text-center font-black uppercase text-sm transition-none cursor-pointer ${
                selectedTrack === track.key
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-black hover:bg-zinc-100"
              }`}
            >
              {track.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleStartAssessment}
          className="w-full py-6 bg-black text-white hover:bg-zinc-800 font-black text-2xl uppercase transition-none tracking-wider text-center cursor-pointer shadow-[8px_8px_0px_0px_rgba(120,120,120,1)]"
        >
          START 50-MINUTE ASSESSMENT ➔
        </button>
      </div>
    </div>
  );
}
