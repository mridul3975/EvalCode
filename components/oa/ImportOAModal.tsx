"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { OACompanyTrack, OAProblem } from "@/types/oa";
import { saveCustomOAProblem, saveCustomOATrack } from "@/lib/oa/storage";
import { getStoredGeminiKey } from "@/lib/gemini";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  X,
  Link as LinkIcon,
  FileText,
  Clock,
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

interface ImportOAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackImported: (track: OACompanyTrack, problem: OAProblem) => void;
}

const POPULAR_SLUGS = [
  { slug: "amazon-lru-query-result-cache", label: "Amazon | LRU Query Cache" },
  { slug: "waymo-obstacle-aware-return-to-origin", label: "Waymo | Obstacle-Aware Path" },
  { slug: "stripe-rule-driven-transaction-fraud-detection", label: "Stripe | Fraud Rule Engine" },
  { slug: "citadel-market-maker-order-flow", label: "Citadel | Market Making Flow" },
  { slug: "amazon-course-order-and-cycle", label: "Amazon | Course Order & Cycle" },
];

const COMPANIES = [
  "Stripe",
  "Amazon",
  "Citadel",
  "Anthropic",
  "OpenAI",
  "Waymo",
  "Google",
  "Meta",
  "Two Sigma",
  "Uber",
  "Microsoft",
  "Robinhood",
];

export function ImportOAModal({ isOpen, onClose, onTrackImported }: ImportOAModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"link" | "prompt">("link");
  const [urlOrSlug, setUrlOrSlug] = useState("");
  const [rawText, setRawText] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string>("Amazon");
  const [durationMins, setDurationMins] = useState<number>(75);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [importedTrack, setImportedTrack] = useState<OACompanyTrack | null>(null);
  const [importedProblem, setImportedProblem] = useState<OAProblem | null>(null);

  if (!isOpen) return null;

  const handleReset = () => {
    setUrlOrSlug("");
    setRawText("");
    setError(null);
    setImportedTrack(null);
    setImportedProblem(null);
    setIsLoading(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "link" && !urlOrSlug.trim()) {
      setError("Please paste a FastPrep / GitHub link or problem slug.");
      return;
    }

    if (mode === "prompt" && !rawText.trim()) {
      setError("Please paste the OA problem description or prompt text.");
      return;
    }

    setIsLoading(true);
    setLoadingStep("Fetching problem schema & specifications...");

    try {
      const geminiKey = getStoredGeminiKey() || undefined;

      const timer1 = setTimeout(() => {
        setLoadingStep("Extracting signatures, constraints & sample test cases...");
      }, 1000);

      const timer2 = setTimeout(() => {
        setLoadingStep("Calibrating starter code & Bar Raiser evaluation rubric...");
      }, 2200);

      const res = await fetch("/api/oa/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          urlOrSlug: mode === "link" ? urlOrSlug.trim() : undefined,
          rawText: mode === "prompt" ? rawText.trim() : undefined,
          targetCompany: selectedCompany,
          targetDurationMins: durationMins,
          apiKey: geminiKey,
        }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to import and synthesize OA problem");
      }

      // Save to localStorage
      saveCustomOAProblem(data.problem);
      saveCustomOATrack(data.track);

      setImportedProblem(data.problem);
      setImportedTrack(data.track);
      onTrackImported(data.track, data.problem);
      setIsLoading(false);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "An error occurred while importing the OA question.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl neu-card p-6 sm:p-9 space-y-6 font-['Hanken_Grotesk'] text-[#e2e2e5] border border-white/10 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2">
            <span className="neu-active-pill px-2.5 py-0.5 text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ONLINE ASSESSMENT INGESTION ENGINE</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-mono">
            IMPORT REAL-WORLD OA
          </h2>
          <p className="text-xs sm:text-sm font-sans text-neutral-400 leading-relaxed">
            Import interview problems from the Tech-OA repo or FastPrep, or paste raw OA prompts.
            EvalForge synthesizes test cases, starter code in Python/TypeScript/C++, and sets up a timed assessment track.
          </p>
        </div>

        {/* Success View */}
        {importedTrack && importedProblem ? (
          <div className="space-y-6 py-2 animate-in zoom-in-95 duration-200">
            <div className="neu-inset p-5 sm:p-6 space-y-4 border border-emerald-500/30 bg-emerald-950/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block">
                    SUCCESSFULLY IMPORTED & CALIBRATED
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white font-mono uppercase">
                    {importedProblem.title}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
                <div className="neu-card p-2.5">
                  <span className="text-neutral-500 text-[10px] block">COMPANY</span>
                  <span className="font-bold text-white">{importedTrack.companyProfile}</span>
                </div>
                <div className="neu-card p-2.5">
                  <span className="text-neutral-500 text-[10px] block">TIME ALLOCATED</span>
                  <span className="font-bold text-amber-400">{Math.round(importedTrack.totalTimeSeconds / 60)} MINS</span>
                </div>
                <div className="neu-card p-2.5">
                  <span className="text-neutral-500 text-[10px] block">TEST CASES</span>
                  <span className="font-bold text-emerald-400">{importedProblem.testCases.length} SUITES</span>
                </div>
                <div className="neu-card p-2.5">
                  <span className="text-neutral-500 text-[10px] block">STATUS</span>
                  <span className="font-bold text-sky-400">READY IN LOBBY</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto neu-button px-6 py-3 rounded-xl font-mono text-xs font-bold uppercase text-neutral-300 hover:text-white cursor-pointer"
              >
                VIEW IN OA LOBBY
              </button>

              <button
                type="button"
                onClick={() => {
                  handleClose();
                  router.push(`/oa/${importedTrack.id}`);
                }}
                className="w-full sm:w-auto neu-button bg-white text-black hover:bg-neutral-200 px-6 py-3 rounded-xl font-mono text-xs font-black uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>LAUNCH ASSESSMENT NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Input Form */
          <form onSubmit={handleImport} className="space-y-5">
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 neu-inset p-1 rounded-xl text-xs font-mono">
              <button
                type="button"
                onClick={() => setMode("link")}
                className={cn(
                  "py-2 px-3 rounded-lg font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer",
                  mode === "link"
                    ? "neu-inset text-white font-black border border-white/10"
                    : "text-neutral-400 hover:text-white"
                )}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>LINK OR SLUG</span>
              </button>

              <button
                type="button"
                onClick={() => setMode("prompt")}
                className={cn(
                  "py-2 px-3 rounded-lg font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer",
                  mode === "prompt"
                    ? "neu-inset text-white font-black border border-white/10"
                    : "text-neutral-400 hover:text-white"
                )}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>RAW PROMPT / CODE</span>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-200 font-mono">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Link Mode Input */}
            {mode === "link" && (
              <div className="space-y-3 font-mono">
                <label className="text-xs font-bold text-white uppercase flex items-center justify-between">
                  <span>FASTPREP / GITHUB URL OR PROBLEM SLUG:</span>
                  <span className="text-neutral-400 font-normal">e.g. amazon-lru-query-result-cache</span>
                </label>
                <input
                  type="text"
                  placeholder="https://www.fastprep.io/problems/amazon-lru-query-result-cache or slug"
                  value={urlOrSlug}
                  onChange={(e) => setUrlOrSlug(e.target.value)}
                  disabled={isLoading}
                  className="w-full p-3.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-emerald-400 transition-colors"
                />

                {/* Popular Quick Suggestions */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-neutral-500 uppercase block">Quick Test Suggestions:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_SLUGS.map((item) => (
                      <button
                        key={item.slug}
                        type="button"
                        onClick={() => setUrlOrSlug(item.slug)}
                        className="px-2.5 py-1 rounded-md text-[10px] font-mono neu-button hover:text-emerald-400 text-neutral-300 border border-white/5 cursor-pointer transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Prompt Mode Input */}
            {mode === "prompt" && (
              <div className="space-y-2 font-mono">
                <label className="text-xs font-bold text-white uppercase flex items-center justify-between">
                  <span>PASTE OA PROMPT OR INTERVIEW NOTES:</span>
                  <span className="text-neutral-400 font-normal">LEETCODE / OA SPEC</span>
                </label>
                <textarea
                  placeholder="e.g. Stripe Payment Fraud Engine: Given a list of transactions [id, amount, timestamp, merchant], detect suspicious patterns where..."
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  disabled={isLoading}
                  rows={6}
                  className="w-full p-3.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-emerald-400 transition-colors leading-relaxed"
                />
              </div>
            )}

            {/* Track Settings Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs pt-1">
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-300 uppercase block">
                  COMPANY PROFILE:
                </label>
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  disabled={isLoading}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-emerald-400 cursor-pointer"
                >
                  {COMPANIES.map((comp) => (
                    <option key={comp} value={comp} className="bg-[#121416] text-white">
                      {comp}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-neutral-300 uppercase block">
                  TOTAL TIMER DURATION:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[60, 75, 90].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDurationMins(mins)}
                      className={cn(
                        "py-2 px-2 rounded-lg text-center font-bold uppercase transition-all cursor-pointer",
                        durationMins === mins
                          ? "neu-inset text-white font-black border border-white/10"
                          : "neu-button text-neutral-400 hover:text-white"
                      )}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Submit Action */}
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-4">
              <div className="text-neutral-500 text-[11px] font-mono">
                {isLoading ? (
                  <span className="flex items-center gap-2 text-emerald-400 animate-pulse">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{loadingStep}</span>
                  </span>
                ) : (
                  <span>Outputs HackerRank-style global timed track</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || (mode === "link" ? !urlOrSlug.trim() : !rawText.trim())}
                className="neu-button bg-white text-black hover:bg-neutral-200 px-6 py-3 rounded-xl font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer shadow-lg shrink-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>IMPORTING...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>IMPORT & CREATE TRACK</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
