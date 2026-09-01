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
    <div className="w-full flex flex-col min-h-screen bg-[#121416] text-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-8 space-y-12 w-full">
        {/* Top Hero: 70/30 Editorial Acuity Overview */}
        <ReadinessProfileCard profile={profile} />

        {/* Start Audit CTA Banner */}
        <section className="bg-[#121416] text-white p-6 sm:p-12 lg:p-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 border-4 border-white font-['Hanken_Grotesk']">
          <div className="max-w-3xl">
            <h2 className="font-black text-4xl sm:text-6xl lg:text-7xl uppercase leading-none mb-4">
              START AUDIT
            </h2>
            <p className="text-base sm:text-xl font-light text-zinc-300 font-sans leading-relaxed">
              Practice evaluating real-world model outputs across 75+ benchmarks or launch a 3-question timed Mock Assessment to build your Evaluator Readiness Score.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto shrink-0">
            <Link
              href="/practice"
              className="bg-white text-black font-black uppercase text-lg sm:text-xl px-8 py-5 hover:bg-zinc-200 transition-none border-4 border-white text-center cursor-pointer"
            >
              EXPLORE PRACTICE ➔
            </Link>
            <Link
              href="/assessment"
              className="bg-[#121416] text-white font-black uppercase text-lg sm:text-xl px-8 py-5 border-4 border-white hover:bg-white hover:text-black transition-none text-center cursor-pointer"
            >
              LAUNCH MOCK
            </Link>
          </div>
        </section>

        {/* 50/50 Charts Row: 6-Axis Radar & Competency Matrix */}
        <section className="grid grid-cols-1 lg:grid-cols-2 border-4 border-white">
          {/* Radar Chart Panel (Dark) */}
          <div className="p-6 sm:p-12 lg:border-r-4 border-white flex flex-col justify-between bg-[#121416] text-white space-y-6">
            <div className="border-b-4 border-white pb-4">
              <h3 className="font-['Hanken_Grotesk'] font-black text-3xl sm:text-4xl uppercase tracking-tight">
                6-AXIS RADAR
              </h3>
              <p className="text-xs font-mono uppercase text-zinc-400 mt-1">
                EVALUATED AGAINST 90% SCREENING BENCHMARK
              </p>
            </div>

            <CompetencyRadarChart data={mastery} />
          </div>

          {/* Competency Matrix Panel (Inverted Solid White) */}
          <div className="p-6 sm:p-12 flex flex-col bg-white text-black space-y-6 font-['Hanken_Grotesk']">
            <div className="border-b-4 border-black pb-4">
              <h3 className="font-black text-3xl sm:text-4xl uppercase tracking-tight">
                COMPETENCY MATRIX
              </h3>
              <p className="text-xs font-mono uppercase text-zinc-700 mt-1 font-bold">
                TARGET &ge; 90.0%
              </p>
            </div>

            <div className="flex flex-col gap-4 flex-1">
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

        {/* Taxonomy Section: 50/50 Topic Mastery & Defect Detection */}
        <TaxonomyHeatmap
          topicStats={profile.topic_stats}
          defectStats={profile.defect_stats}
        />

        {/* Mock History / Empty State Block */}
        <MockHistoryTable history={history} />

        {/* Reset Progress Button */}
        <div className="flex justify-center pt-4 pb-8">
          <button
            onClick={handleReset}
            disabled={isResetting}
            className="text-xs font-black uppercase tracking-widest border-b-2 border-white hover:bg-white hover:text-black transition-none px-4 py-2 cursor-pointer font-mono"
          >
            {isResetting ? "RESETTING..." : "RESET PROGRESS TO 0"}
          </button>
        </div>
      </div>
    </div>
  );
}
