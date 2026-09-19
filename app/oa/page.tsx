"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { OA_TRACKS, OA_PROBLEMS } from "@/data/oa-problems";
import { CompanyProfile, OACompanyTrack, OAProblem } from "@/types/oa";
import { getCustomOATracks, getCustomOAProblems, deleteCustomOATrack } from "@/lib/oa/storage";
import { ImportOAModal } from "@/components/oa/ImportOAModal";
import { cn } from "@/lib/utils";
import {
  Timer,
  Sparkles,
  ArrowRight,
  Flame,
  Layers,
  Cpu,
  CheckCircle2,
  Building2,
  Shield,
  HelpCircle,
  Clock,
  ChevronRight,
  Zap,
  Trash2,
} from "lucide-react";

const COMPANY_FILTERS: Array<{ key: string; label: string }> = [
  { key: "all", label: "ALL TRACKS" },
  { key: "Stripe", label: "STRIPE" },
  { key: "Amazon", label: "AMAZON AWS" },
  { key: "Anthropic", label: "ANTHROPIC" },
  { key: "OpenAI", label: "OPENAI" },
  { key: "Waymo", label: "WAYMO" },
  { key: "Citadel", label: "CITADEL" },
  { key: "Google", label: "GOOGLE" },
  { key: "Meta", label: "META" },
  { key: "Two Sigma", label: "TWO SIGMA" },
  { key: "Fintech", label: "ZURICH FINTECH" },
];

export default function OALobbyPage() {
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [customTracks, setCustomTracks] = useState<OACompanyTrack[]>([]);
  const [customProblems, setCustomProblems] = useState<OAProblem[]>([]);

  const refreshCustomData = () => {
    setCustomTracks(getCustomOATracks());
    setCustomProblems(getCustomOAProblems());
  };

  useEffect(() => {
    refreshCustomData();
  }, []);

  // Merge custom tracks with official catalog
  const allTracks = useMemo(() => {
    const customIds = new Set(customTracks.map((t) => t.id));
    return [...customTracks, ...OA_TRACKS.filter((t) => !customIds.has(t.id))];
  }, [customTracks]);

  // Merge custom problems with official catalog
  const allProblems = useMemo(() => {
    const customIds = new Set(customProblems.map((p) => p.id));
    return [...customProblems, ...OA_PROBLEMS.filter((p) => !customIds.has(p.id))];
  }, [customProblems]);

  const filteredTracks = allTracks.filter(
    (t) => selectedCompany === "all" || t.companyProfile === selectedCompany
  );

  const handleDeleteCustomTrack = (trackId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to remove this custom OA track?")) {
      deleteCustomOATrack(trackId);
      refreshCustomData();
    }
  };

  return (
    <div className="min-h-screen bg-[#121416] text-[#e2e2e5] font-['Hanken_Grotesk'] antialiased">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        {/* Header Hero & Action Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 border-b border-white/[0.06] pb-8">
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-none font-mono">
              70–90 MINUTE MULTI-PROBLEM ASSESSMENTS
            </h1>

            <p className="text-base sm:text-lg text-[#b9cbc1] font-normal leading-relaxed">
              Realistic high-stakes technical coding screenings modeled after Citadel, Stripe, Amazon, and Tier-1 hiring standards.
              Allocate time across 2–4 problems under a global countdown clock, defend algorithmic invariants, and justify your code directly before a Gemini Principal Staff Bar Raiser.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsImportModalOpen(true)}
              className="w-full sm:w-auto neu-button px-6 py-4 rounded-xl font-mono text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 text-white hover:text-white border border-emerald-500/30 hover:border-emerald-400 transition-all cursor-pointer shadow-lg group"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>+ IMPORT OA VIA LINK / AI</span>
            </button>
          </div>
        </div>

        {/* Company Filters */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
          {COMPANY_FILTERS.map((comp) => (
            <button
              key={comp.key}
              type="button"
              onClick={() => setSelectedCompany(comp.key)}
              className={cn(
                "px-4 py-2 rounded-xl font-bold uppercase transition-all whitespace-nowrap cursor-pointer",
                selectedCompany === comp.key
                  ? "neu-inset text-white font-black border border-white/20"
                  : "neu-button text-neutral-400 hover:text-white"
              )}
            >
              {comp.label}
            </button>
          ))}
        </div>

        {/* Assessment Tracks Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between font-mono text-xs">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>SELECT AN ASSESSMENT TRACK</span>
            </h2>
            <span className="text-neutral-400 font-mono">
              Showing {filteredTracks.length} Assessment Tracks
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {filteredTracks.map((track) => {
              const isCustom = customTracks.some((ct) => ct.id === track.id);
              const companyBadgeColor: Record<string, string> = {
                Citadel: "border-amber-500/40 text-amber-400 bg-amber-500/10",
                Google: "border-sky-500/40 text-sky-400 bg-sky-500/10",
                Meta: "border-blue-500/40 text-blue-400 bg-blue-500/10",
                Fintech: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
                "Two Sigma": "border-purple-500/40 text-purple-400 bg-purple-500/10",
                Amazon: "border-orange-500/40 text-orange-400 bg-orange-500/10",
                Stripe: "border-indigo-500/40 text-indigo-400 bg-indigo-500/10",
                Anthropic: "border-rose-500/40 text-rose-400 bg-rose-500/10",
                OpenAI: "border-teal-500/40 text-teal-400 bg-teal-500/10",
                Waymo: "border-cyan-500/40 text-cyan-400 bg-cyan-500/10",
                Uber: "border-white/40 text-white bg-white/10",
                Microsoft: "border-blue-400/40 text-blue-300 bg-blue-400/10",
                Robinhood: "border-lime-500/40 text-lime-400 bg-lime-500/10",
              };
              const badgeStyle = companyBadgeColor[track.companyProfile] || "border-white/20 text-white bg-white/10";

              const trackProblems = track.problemIds
                .map((id) => allProblems.find((p) => p.id === id))
                .filter(Boolean);

              const durationMins = Math.round(track.totalTimeSeconds / 60);

              return (
                <div
                  key={track.id}
                  className="neu-card p-6 sm:p-8 space-y-6 flex flex-col justify-between transition-all group hover:translate-y-[-2px] relative"
                >
                  <div className="space-y-5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap font-mono">
                          <span className={cn("px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border", badgeStyle)}>
                            {track.companyProfile}
                          </span>
                          {isCustom && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              CUSTOM IMPORT
                            </span>
                          )}
                          <span className="neu-active-pill px-2.5 py-0.5 text-[10px] font-bold text-neutral-300">
                            {track.problemIds.length} {track.problemIds.length === 1 ? "PROBLEM" : "PROBLEMS"}
                          </span>
                          <span className="text-[11px] text-neutral-400">
                            100 TOTAL POINTS
                          </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors font-mono">
                          {track.title}
                        </h3>
                        <p className="text-xs font-mono text-neutral-400">
                          {track.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1.5 font-mono text-xs text-neutral-300 neu-inset px-3.5 py-2">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span className="font-bold text-white">{durationMins} MINS</span>
                        </div>

                        {isCustom && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteCustomTrack(track.id, e)}
                            title="Delete custom imported track"
                            className="p-2 rounded-xl text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
                      {track.description}
                    </p>

                    {/* Problems Breakdown Matrix */}
                    <div className="neu-inset p-4 space-y-2.5 font-mono text-xs">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                        Included Assessment Problems:
                      </span>
                      <div className="space-y-2">
                        {trackProblems.map((prob, idx) => {
                          const weight = track.problemWeights[prob!.id] || 0;
                          return (
                            <div
                              key={prob!.id}
                              className="flex items-center justify-between text-[11px] text-neutral-300 hover:text-white"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className="text-neutral-500 font-bold">Q{idx + 1}:</span>
                                <span className="truncate">{prob!.title}</span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0 text-neutral-400">
                                <span
                                  className={cn(
                                    "px-1.5 py-0.2 rounded text-[9px] uppercase font-bold",
                                    prob!.difficulty === "Hard" ? "text-rose-400" : "text-amber-400"
                                  )}
                                >
                                  {prob!.difficulty}
                                </span>
                                <span className="font-bold text-white">{weight} pts</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                      {track.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-black/40 text-neutral-400 border border-white/5"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="pt-5 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center gap-2 text-neutral-400">
                      <span>Global Timer</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">HackerRank Standard</span>
                    </div>

                    <Link
                      href={`/oa/${track.id}`}
                      className="neu-button bg-white text-black hover:bg-neutral-200 px-5 py-2.5 rounded-xl font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg"
                    >
                      <span>START {durationMins}-MIN OA</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* In-App Import Modal */}
      <ImportOAModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onTrackImported={() => {
          refreshCustomData();
        }}
      />
    </div>
  );
}
