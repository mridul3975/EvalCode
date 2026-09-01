"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getStoredProfile, getAssessmentHistory, getStoredSubmissions, syncFromDatabase } from "@/lib/storage";
import { UserProfileStats } from "@/types/submission";
import { ReadinessProfileCard, MockHistoryTable } from "@/components/dashboard/ReadinessProfileCard";
import { CompetencyRadarChart } from "@/components/infographics/CompetencyRadarChart";
import { TaxonomyHeatmap } from "@/components/infographics/TaxonomyHeatmap";
import { ReadinessProgressBar } from "@/components/infographics/DiscrepancyDiffChart";
import { WorkspaceSkeleton } from "@/components/boneyard/WorkspaceSkeleton";
import {
  BarChart3,
  Sparkles,
  Target,
  ArrowRight,
  AlertTriangle,
  Flame,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfileStats | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  function reloadData() {
    setProfile(getStoredProfile());
    setHistory(getAssessmentHistory());
    setSubmissions(getStoredSubmissions());
  }

  useEffect(() => {
    reloadData();
    setIsLoading(false);

    // Sync cloud profile in background
    syncFromDatabase().then((cloudProf) => {
      if (cloudProf) {
        setProfile(cloudProf);
      }
    });
  }, []);

  function handleReset() {
    if (confirm("Are you sure you want to reset all evaluation and mock assessment progress? This will reset all scores and metrics to 0.")) {
      setIsResetting(true);
      import("@/lib/storage").then(({ clearAllProgress }) => {
        clearAllProgress();
        reloadData();
        setIsResetting(false);
      });
    }
  }

  if (isLoading || !profile) {
    return <WorkspaceSkeleton />;
  }

  const mastery = profile.dimensional_mastery;
  const deltas = profile.dimensional_deltas;
  const hasStarted = profile.total_evaluations_count > 0;

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Hero Banner: Profile & Readiness Index */}
      <ReadinessProfileCard profile={profile} />

      {/* Zero State / Onboarding Banner */}
      {!hasStarted && (
        <div className="p-6 rounded-none bg-[#121417] border-2 border-[#00ffc2]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden font-mono">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#00ffc2]">
                FRESH STARTING PROFILE
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-none bg-[#00ffc2]/10 text-[#00ffc2] border border-[#00ffc2]/30">
                READY TO EVALUATE
              </span>
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight">
              START YOUR FIRST AI CODE EVALUATION AUDIT
            </h3>
            <p className="text-xs text-zinc-400 max-w-2xl font-sans leading-relaxed">
              You currently have 0 completed reviews. Practice evaluating real-world model outputs across 75+ benchmarks or launch a 3-question timed Mock Assessment to build your Evaluator Readiness Score.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/practice"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-none bg-[#00ffc2] hover:bg-white text-[#0a0b0d] font-black text-xs shadow-md transition-colors cursor-pointer"
            >
              <span>EXPLORE 75+ QUESTIONS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/assessment"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-none bg-[#1a1d24] hover:bg-zinc-800 text-zinc-200 font-bold text-xs border border-[#242830] transition-colors cursor-pointer"
            >
              <span>LAUNCH MOCK TEST</span>
            </Link>
          </div>
        </div>
      )}

      {/* Critical Deficit Alert Banner (only shown after user has started and edge cases are low) */}
      {hasStarted && mastery.edge_cases < 60 && (
        <div className="p-5 rounded-none bg-rose-950/30 border-2 border-rose-500/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg animate-in fade-in font-mono">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-none bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-rose-400">
                  CRITICAL DEFICIT DETECTED
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded-none bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  {mastery.edge_cases.toFixed(1)}% MASTERY
                </span>
              </div>
              <h3 className="text-sm font-black text-white uppercase">
                EDGE-CASE ANALYSIS DEFICIT
              </h3>
              <p className="text-xs text-zinc-400 max-w-2xl font-sans leading-relaxed">
                Your boundary-condition detection rate is currently {mastery.edge_cases.toFixed(1)}%. In AI-trainer technical screeners, missing boundary crashes is the single largest point deduction.
              </p>
            </div>
          </div>

          <Link
            href="/practice?defect=edge_case_blindness"
            className="flex items-center gap-1.5 px-4 py-2 rounded-none bg-rose-500 hover:bg-rose-400 text-zinc-950 font-black text-xs shadow-md transition-colors cursor-pointer shrink-0"
          >
            <span>PRACTICE EDGE CASES</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 2-Column: Multidimensional Competency Matrix & Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono">
        {/* Left: 6-Axis Competency Radar Chart */}
        <div className="p-6 rounded-none bg-[#121417] border-2 border-[#242830] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-[#242830] pb-3">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-zinc-300">
                6-AXIS COMPETENCY RADAR
              </span>
              <p className="text-xs text-zinc-400 mt-0.5 font-sans">
                Evaluated against the 90% benchmark screening threshold
              </p>
            </div>
            <span className="text-xs font-bold text-[#00ffc2] bg-[#00ffc2]/10 px-2 py-0.5 rounded-none border border-[#00ffc2]/30">
              BENCHMARK: 90%
            </span>
          </div>

          <CompetencyRadarChart data={mastery} />
        </div>

        {/* Right: Detailed Dimension Mastery Bars with Deltas */}
        <div className="p-6 rounded-none bg-[#121417] border-2 border-[#242830] space-y-4">
          <div className="flex items-center justify-between border-b border-[#242830] pb-3">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-zinc-300">
                MULTIDIMENSIONAL COMPETENCY MATRIX
              </span>
              <p className="text-xs text-zinc-400 mt-0.5 font-sans">
                Rolling 20-evaluation moving average with trend deltas
              </p>
            </div>
            <span className="text-[11px] text-zinc-500 font-bold">TARGET &ge; 90%</span>
          </div>

          <div className="space-y-3 pt-1">
            <ReadinessProgressBar
              label="LOGIC DEBUGGING & ROOT CAUSE"
              value={mastery.correctness}
              delta={deltas.correctness}
            />
            <ReadinessProgressBar
              label="EDGE-CASE & BOUNDARY ANALYSIS"
              value={mastery.edge_cases}
              delta={deltas.edge_cases}
            />
            <ReadinessProgressBar
              label="COMPLEXITY & BIG-O INVARIANTS"
              value={mastery.complexity}
              delta={deltas.complexity}
            />
            <ReadinessProgressBar
              label="EXPLANATION & HALLUCINATION AUDITING"
              value={mastery.explanation}
              delta={deltas.explanation}
            />
            <ReadinessProgressBar
              label="COMMUNICATION & REVIEW STRUCTURE"
              value={mastery.communication}
              delta={deltas.communication}
            />
            <ReadinessProgressBar
              label="PROPOSED REMEDIATION & DEBUGGING"
              value={mastery.debugging}
              delta={deltas.debugging}
            />
          </div>
        </div>
      </div>

      {/* Topic & Defect Taxonomy Matrix */}
      <div className="space-y-4 font-mono">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-300">
            GRANULAR TAXONOMY DIAGNOSTICS
          </h3>
          <span className="text-xs text-zinc-500">
            TOPIC MASTERY &times; DEFECT DETECTION RATE
          </span>
        </div>

        <TaxonomyHeatmap
          topicStats={profile.topic_stats}
          defectStats={profile.defect_stats}
        />
      </div>

      {/* Recent Assessment & Practice Audit History */}
      <MockHistoryTable history={history} />

      {/* Reset Progress Control */}
      <div className="pt-4 flex justify-center font-mono">
        <button
          onClick={handleReset}
          disabled={isResetting}
          className="text-xs text-zinc-500 hover:text-rose-400 transition-colors font-bold uppercase tracking-wider underline underline-offset-4 cursor-pointer"
        >
          {isResetting ? "RESETTING..." : "RESET ALL PROGRESS TO 0"}
        </button>
      </div>
    </div>
  );
}
