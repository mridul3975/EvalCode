"use client";

import React from "react";
import { FormFieldWrapper } from "@/components/boneyard/FormWrappers";
import { cn } from "@/lib/utils";
import {
  FileText,
  Clock,
  HardDrive,
  Sparkles,
  ArrowRight,
  ShieldAlert,
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
    <div className="flex flex-col h-full bg-[#141618] border border-white/10 rounded-xl overflow-hidden shadow-2xl font-mono">
      {/* Form Header */}
      <div className="p-4 bg-[#181a1d] border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-bold uppercase text-white tracking-wider">
            PHASE 2: SELF-EXPLANATION & BIG-O AUDIT
          </h3>
        </div>
        <span className="obsidian-chip-optimal text-[10px]">REQUIRED BEFORE DEFENSE</span>
      </div>

      {/* Form Body */}
      <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6">
        {/* Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/40 to-[#1e2022] border border-sky-500/20 text-xs text-[#b9cbc1] space-y-1">
          <span className="font-bold text-white uppercase block">
            Why Written Self-Explanation Matters:
          </span>
          <p className="font-sans text-xs leading-relaxed">
            In Citadel, Google, and FinTech assessments, human reviewers and bar-raiser AI evaluate the coherence of your technical reasoning, asymptotic claims, and defense of architectural trade-offs.
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
            placeholder="e.g., We maintain a sliding window over the event stream using a double-ended queue. For order book updates, prices are indexed in a hash map for O(1) retrieval and accumulated into top-k heaps..."
            className="w-full p-3.5 rounded-xl bg-[#0c0e10] border border-white/10 text-white text-xs font-mono placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors"
          />
          <div className="flex justify-between items-center text-[10px] text-[#83958c]">
            <span>Minimum 20 characters recommended</span>
            <span>{approach.length} characters</span>
          </div>
        </FormFieldWrapper>

        {/* Complexity Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Time Complexity */}
          <FormFieldWrapper
            label="2. Asymptotic Time Complexity"
            required={true}
            description="Worst-case upper bound of your submitted implementation."
          >
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {COMPLEXITY_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => onClaimedTimeChange(preset)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer",
                      claimedTime === preset
                        ? "bg-white text-black font-black"
                        : "bg-[#0c0e10] text-[#b9cbc1] hover:text-white border border-white/10"
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
                className="w-full p-2.5 rounded-lg bg-[#0c0e10] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-white"
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
                      "px-2.5 py-1 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer",
                      claimedSpace === preset
                        ? "bg-white text-black font-black"
                        : "bg-[#0c0e10] text-[#b9cbc1] hover:text-white border border-white/10"
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
                className="w-full p-2.5 rounded-lg bg-[#0c0e10] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-white"
              />
            </div>
          </FormFieldWrapper>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="p-4 bg-[#181a1d] border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
        <button
          type="button"
          onClick={onBackToCode}
          className="neu-extruded bg-[#1e2022] hover:bg-white hover:text-black text-[#b9cbc1] px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer"
        >
          ➔ BACK TO CODE EDITOR
        </button>

        <button
          type="button"
          onClick={onProceedToDefense}
          disabled={!isValid || isLoading}
          className="neu-extruded bg-emerald-400 hover:bg-emerald-300 text-black px-6 py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-40 shadow-[0_0_20px_rgba(52,211,153,0.35)]"
        >
          <span>{isLoading ? "TRIGGERING GEMINI..." : "PROCEED TO GEMINI DEFENSE"}</span>
          <Sparkles className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
