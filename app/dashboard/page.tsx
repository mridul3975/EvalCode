"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getStoredProfile, getAssessmentHistory, getStoredSubmissions } from "@/lib/storage";
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

  useEffect(() => {
    setProfile(getStoredProfile());
    setHistory(getAssessmentHistory());
    setSubmissions(getStoredSubmissions());
    setIsLoading(false);
  }, []);

  if (isLoading || !profile) {
    return <WorkspaceSkeleton />;
  }

  const mastery = profile.dimensional_mastery;
  const deltas = profile.dimensional_deltas;

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Hero Banner: Profile & Readiness Index */}
      <ReadinessProfileCard profile={profile} />

      {/* Critical Deficit Alert Banner if any dimension < 60% */}
      {mastery.edge_cases < 60 && (
        <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  Critical Deficit Detected
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300">
                  {mastery.edge_cases.toFixed(1)}% Mastery
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">
                Edge-Case Analysis Deficit
              </h3>
              <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                Your boundary-condition detection rate is currently 48.0%. In AI-trainer technical screeners, missing boundary crashes is the single largest point deduction.
              </p>
            </div>
          </div>

          <Link
            href="/practice?defect=edge_case_blindness"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-zinc-950 font-bold text-xs shadow-md transition-colors cursor-pointer shrink-0"
          >
            <span>Practice Edge Cases Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 2-Column: Multidimensional Competency Matrix & Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: 6-Axis Competency Radar Chart */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                6-Axis Competency Radar
              </span>
              <p className="text-xs text-zinc-400 mt-0.5">
                Evaluated against the 90% benchmark screening threshold
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Benchmark: 90%
            </span>
          </div>

          <CompetencyRadarChart data={mastery} />
        </div>

        {/* Right: Detailed Dimension Mastery Bars with Deltas */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Multidimensional Competency Matrix
              </span>
              <p className="text-xs text-zinc-400 mt-0.5">
                Rolling 20-evaluation moving average with trend deltas
              </p>
            </div>
            <span className="text-[11px] text-zinc-500">Target &ge; 90%</span>
          </div>

          <div className="space-y-3 pt-1">
            <ReadinessProgressBar
              label="Logic Debugging & Root Cause"
              value={mastery.correctness}
              delta={deltas.correctness}
            />
            <ReadinessProgressBar
              label="Edge-Case & Boundary Analysis"
              value={mastery.edge_cases}
              delta={deltas.edge_cases}
            />
            <ReadinessProgressBar
              label="Complexity & Big-O Invariants"
              value={mastery.complexity}
              delta={deltas.complexity}
            />
            <ReadinessProgressBar
              label="Explanation & Hallucination Auditing"
              value={mastery.explanation}
              delta={deltas.explanation}
            />
            <ReadinessProgressBar
              label="Communication & Review Structure"
              value={mastery.communication}
              delta={deltas.communication}
            />
            <ReadinessProgressBar
              label="Proposed Remediation & Debugging"
              value={mastery.debugging}
              delta={deltas.debugging}
            />
          </div>
        </div>
      </div>

      {/* Topic & Defect Taxonomy Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
            Granular Taxonomy Diagnostics
          </h3>
          <span className="text-xs text-zinc-500">
            Topic Mastery &times; Defect Detection Rate
          </span>
        </div>

        <TaxonomyHeatmap
          topicStats={profile.topic_stats}
          defectStats={profile.defect_stats}
        />
      </div>

      {/* Recent Assessment & Practice Audit History */}
      <MockHistoryTable />
    </div>
  );
}
