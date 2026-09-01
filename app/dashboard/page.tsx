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
import { ArrowRight, Code2, Timer } from "lucide-react";

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

  return (
    <div className="w-full min-h-screen bg-[#121416] text-[#e2e2e5] font-['Hanken_Grotesk']">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 w-full">
        {/* Top Hero: Obsidian Tactile Readiness Profile */}
        <ReadinessProfileCard profile={profile} />

        {/* Start Audit CTA Action Pod */}
        <section className="obsidian-card p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-mono font-bold text-[#b9cbc1] uppercase tracking-widest">
              SCREENING BENCHMARKS & DRILLS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              START CODE AUDITING
            </h2>
            <p className="text-sm sm:text-base text-[#b9cbc1] font-normal leading-relaxed">
              Drill on 75+ calibrated model solutions in Review Studio or take a timed 50-minute exam to calibrate your readiness index against hiring thresholds.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto shrink-0">
            <Link
              href="/practice"
              className="obsidian-btn-primary px-8 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <Code2 className="w-4 h-4" />
              <span>PRACTICE CATALOG</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/assessment"
              className="obsidian-btn-secondary px-8 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <Timer className="w-4 h-4 text-[#00ffc2]" />
              <span>MOCK ASSESSMENT</span>
            </Link>
          </div>
        </section>

        {/* Dual Charts Row: 6-Axis Radar & Competency Matrix */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Radar Chart Card */}
          <div className="obsidian-card p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="border-b border-[rgba(255,255,255,0.06)] pb-4">
              <span className="text-xs font-mono font-bold text-[#b9cbc1] uppercase tracking-widest">
                6-DIMENSIONAL ACUITY
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">
                COMPETENCY RADAR
              </h3>
            </div>

            <CompetencyRadarChart data={mastery} />
          </div>

          {/* Competency Matrix Card */}
          <div className="obsidian-card p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="border-b border-[rgba(255,255,255,0.06)] pb-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#b9cbc1] uppercase tracking-widest">
                  EVALUATION DIMENSIONS
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">
                  COMPETENCY MATRIX
                </h3>
              </div>
              <span className="obsidian-chip-optimal">
                TARGET &ge; 90.0%
              </span>
            </div>

            <div className="flex flex-col gap-2 flex-1 justify-center">
              <ReadinessProgressBar
                label="Logic Debugging"
                value={mastery.correctness}
                delta={deltas.correctness}
              />
              <ReadinessProgressBar
                label="Boundary Analysis"
                value={mastery.edge_cases}
                delta={deltas.edge_cases}
              />
              <ReadinessProgressBar
                label="Big-O Invariants"
                value={mastery.complexity}
                delta={deltas.complexity}
              />
              <ReadinessProgressBar
                label="Hallucination Auditing"
                value={mastery.explanation}
                delta={deltas.explanation}
              />
              <ReadinessProgressBar
                label="Review Structure"
                value={mastery.communication}
                delta={deltas.communication}
              />
              <ReadinessProgressBar
                label="Proposed Fixes"
                value={mastery.debugging}
                delta={deltas.debugging}
              />
            </div>
          </div>
        </section>

        {/* Taxonomy Section */}
        <TaxonomyHeatmap
          topicStats={profile.topic_stats}
          defectStats={profile.defect_stats}
        />

        {/* Mock History Table */}
        <MockHistoryTable history={history} />

        {/* Reset Progress Control */}
        <div className="flex justify-center pt-2 pb-6">
          <button
            onClick={handleReset}
            disabled={isResetting}
            className="text-xs font-mono font-bold uppercase tracking-widest text-[#83958c] hover:text-white transition-colors cursor-pointer"
          >
            {isResetting ? "RESETTING..." : "RESET PROFILE PROGRESS"}
          </button>
        </div>
      </div>
    </div>
  );
}
