"use client";

import React from "react";
import { FormFieldWrapper } from "@/components/boneyard/FormWrappers";
import { cn } from "@/lib/utils";
import {
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Info,
} from "lucide-react";

interface ExplanationFormProps {
  approach: string;
  onApproachChange: (val: string) => void;
  claimedTime: string;
  onClaimedTimeChange: (val: string) => void;
  claimedSpace: string;
  onClaimedSpaceChange: (val: string) => void;
  onProceedToDefense: () => void;
  onBackToCode: () => void;
  isLoading?: boolean;
}

const COMPLEXITY_PRESETS = [
  "O(1)",
  "O(log N)",
  "O(N)",
  "O(N log N)",
  "O(N log K)",
  "O(N^2)",
  "O(V + E)",
  "O(2^N)",
];

export function ExplanationForm({
  approach,
  onApproachChange,
  claimedTime,
  onClaimedTimeChange,
  claimedSpace,
  onClaimedSpaceChange,
  onProceedToDefense,
  onBackToCode,
  isLoading = false,
}: ExplanationFormProps) {
  const isValid = approach.trim().length >= 20 && claimedTime && claimedSpace;

  return (
    <div className="flex flex-col h-full bg-[#0d0e11] font-mono text-neutral-200">
      {/* Form Header */}
      <div className="h-9 px-4 bg-[#121418] border-b border-neutral-800/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-sky-400" />
          <h3 className="text-xs font-semibold text-neutral-300">
            Phase 2: Self-Explanation & Complexity Audit
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400">
          Required Before Defense
        </span>
      </div>

      {/* Form Body */}
      <div className="flex-1 p-5 overflow-y-auto space-y-5 text-xs">
        {/* Info Banner */}
        <div className="p-3.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80 text-xs text-neutral-400 space-y-1">
          <div className="flex items-center gap-1.5 text-neutral-200 font-medium font-sans">
            <Info className="w-3.5 h-3.5 text-sky-400" />
            <span>Why Written Self-Explanation Matters</span>
          </div>
          <p className="font-sans text-xs text-neutral-400 leading-relaxed">
            In Citadel, Google, and Tier-1 FinTech assessments, human reviewers and bar-raiser AI evaluate the coherence of your technical reasoning and theoretical complexity bounds.
          </p>
        </div>

        {/* Approach Field */}
        <FormFieldWrapper
          label="1. Algorithmic Approach & Invariant Strategy"
          required={true}
          description="Summarize how your algorithm works, key data structures utilized, and how state transitions occur."
        >
          <textarea
            rows={5}
            value={approach}
            onChange={(e) => onApproachChange(e.target.value)}
            placeholder="e.g., We maintain an active temporal window over order events using a monotonic deque. Price levels are indexed in a hash map for O(1) retrieval and accumulated into top-k heaps..."
            className="w-full p-3 rounded-lg bg-neutral-950/60 border border-neutral-800/80 text-neutral-200 text-xs font-mono placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
          />
          <div className="flex justify-between items-center text-[10px] text-neutral-500 font-mono">
            <span>Minimum 20 characters required</span>
            <span>{approach.length} characters</span>
          </div>
        </FormFieldWrapper>

        {/* Complexity Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Time Complexity */}
          <FormFieldWrapper
            label="2. Asymptotic Time Complexity"
            required={true}
            description="Worst-case upper bound of your submitted code."
          >
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {COMPLEXITY_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => onClaimedTimeChange(preset)}
                    className={cn(
                      "px-2 py-0.5 rounded text-[11px] font-mono transition-all cursor-pointer",
                      claimedTime === preset
                        ? "bg-white text-black font-semibold"
                        : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
                    )}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={claimedTime}
                onChange={(e) => onClaimedTimeChange(e.target.value)}
                placeholder="Or custom: e.g. O(N log K)"
                className="w-full p-2 rounded bg-neutral-950/60 border border-neutral-800/80 text-neutral-200 text-xs font-mono focus:outline-none focus:border-neutral-500"
              />
            </div>
          </FormFieldWrapper>

          {/* Space Complexity */}
          <FormFieldWrapper
            label="3. Auxiliary Space Complexity"
            required={true}
            description="Peak memory consumed beyond the input stream."
          >
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {COMPLEXITY_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => onClaimedSpaceChange(preset)}
                    className={cn(
                      "px-2 py-0.5 rounded text-[11px] font-mono transition-all cursor-pointer",
                      claimedSpace === preset
                        ? "bg-white text-black font-semibold"
                        : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
                    )}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={claimedSpace}
                onChange={(e) => onClaimedSpaceChange(e.target.value)}
                placeholder="Or custom: e.g. O(P)"
                className="w-full p-2 rounded bg-neutral-950/60 border border-neutral-800/80 text-neutral-200 text-xs font-mono focus:outline-none focus:border-neutral-500"
              />
            </div>
          </FormFieldWrapper>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="h-12 px-4 bg-[#121418] border-t border-neutral-800/80 flex items-center justify-between gap-3 shrink-0">
        <button
          type="button"
          onClick={onBackToCode}
          className="text-neutral-400 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Code</span>
        </button>

        <button
          type="button"
          onClick={onProceedToDefense}
          disabled={!isValid || isLoading}
          className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-1.5 rounded text-xs font-medium font-sans flex items-center gap-1.5 cursor-pointer disabled:opacity-40 transition-colors shadow-sm"
        >
          <span>{isLoading ? "Triggering Gemini..." : "Proceed to Gemini Defense"}</span>
          <Sparkles className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
