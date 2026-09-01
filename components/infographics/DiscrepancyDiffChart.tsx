import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

export interface DiscrepancyDiffChartProps {
  matchedCount: number;
  missedCount: number;
  hallucinatedCount: number;
}

export function DiscrepancyDiffChart({
  matchedCount,
  missedCount,
  hallucinatedCount,
}: DiscrepancyDiffChartProps) {
  const total = matchedCount + missedCount + hallucinatedCount;
  const matchPct = total > 0 ? (matchedCount / total) * 100 : 0;
  const missedPct = total > 0 ? (missedCount / total) * 100 : 0;
  const hallPct = total > 0 ? (hallucinatedCount / total) * 100 : 0;

  return (
    <div className="obsidian-inset p-6 space-y-4 font-mono">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-[#b9cbc1]">
        <span>DIAGNOSTIC DISCREPANCY RATIO</span>
        <span className="text-[#83958c]">{matchedCount} MATCHED / {total} ITEMS</span>
      </div>

      {/* Recessed Segmented Progress Track */}
      <div className="h-4 w-full bg-[#0c0e10] rounded-full overflow-hidden flex gap-1 p-0.5 border border-black/40 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.8)]">
        {matchPct > 0 && (
          <div
            style={{ width: `${matchPct}%` }}
            className="bg-[#00ffc2] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(0,255,194,0.4)]"
            title={`Matched: ${matchedCount}`}
          />
        )}
        {missedPct > 0 && (
          <div
            style={{ width: `${missedPct}%` }}
            className="bg-[#ff4d4d] rounded-full transition-all duration-500"
            title={`Missed: ${missedCount}`}
          />
        )}
        {hallPct > 0 && (
          <div
            style={{ width: `${hallPct}%` }}
            className="bg-[#ffe149] rounded-full transition-all duration-500"
            title={`Hallucinated: ${hallucinatedCount}`}
          />
        )}
      </div>

      <div className="flex items-center justify-between text-xs pt-2 border-t border-[rgba(255,255,255,0.06)] font-mono font-bold uppercase">
        <div className="flex items-center gap-1.5 text-[#00ffc2]">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>MATCHED: {matchedCount}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#ff8080]">
          <XCircle className="w-3.5 h-3.5" />
          <span>MISSED (FN): {missedCount}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#ffe149]">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>PHANTOM (FP): {hallucinatedCount}</span>
        </div>
      </div>
    </div>
  );
}

export function ReadinessProgressBar({
  label,
  value,
  target = 90,
  delta,
  className,
}: {
  label: string;
  value: number;
  target?: number;
  delta?: number;
  className?: string;
}) {
  const isCritical = value < 60;
  const isOptimal = value >= target;

  return (
    <div className={cn("flex flex-col py-3 border-b border-[rgba(255,255,255,0.05)] font-['Hanken_Grotesk']", className)}>
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-sm sm:text-base font-bold text-white uppercase tracking-tight">
          {label}
        </span>
        <div className="flex items-baseline gap-2">
          {delta !== undefined && delta !== 0 && (
            <span className={cn("text-xs font-mono font-bold", delta > 0 ? "text-[#00ffc2]" : "text-[#ff8080]")}>
              {delta > 0 ? `+${delta.toFixed(1)}%` : `${delta.toFixed(1)}%`}
            </span>
          )}
          <span className="text-xl sm:text-2xl font-black text-white font-mono">
            {value.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <span
          className={cn(
            isCritical
              ? "obsidian-chip-critical"
              : isOptimal
              ? "obsidian-chip-optimal"
              : "obsidian-chip-neutral"
          )}
        >
          {isCritical ? "CRITICAL DEFICIT" : isOptimal ? "OPTIMAL" : "DEVELOPING"}
        </span>

        {/* Recessed Inset Track with Glowing Mint Fill */}
        <div className="flex-1 h-3 bg-[#121416] rounded-full overflow-hidden relative shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8),inset_-1px_-1px_2px_rgba(255,255,255,0.04)] border border-black/50">
          {/* 90% Target line */}
          <div className="absolute right-[10%] top-0 bottom-0 w-0.5 bg-white/40 z-10" />
          <div
            className="h-full bg-gradient-to-r from-[#00e1ab] to-[#00ffc2] rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(0,255,194,0.35)]"
            style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
