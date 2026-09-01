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
    <div className="flex flex-col gap-2.5 p-4 rounded-none bg-[#0a0b0d] border border-[#242830] font-mono">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
        <span className="text-zinc-300">DIAGNOSTIC DISCREPANCY RATIO</span>
        <span className="text-zinc-500">{matchedCount} MATCHED / {total} ITEMS</span>
      </div>

      {/* Segmented multi-color progress bar */}
      <div className="h-3 w-full bg-[#121417] border border-[#242830] rounded-none overflow-hidden flex gap-0.5 p-0.5">
        {matchPct > 0 && (
          <div
            style={{ width: `${matchPct}%` }}
            className="bg-[#00ffc2] transition-all duration-700"
            title={`Matched: ${matchedCount}`}
          />
        )}
        {missedPct > 0 && (
          <div
            style={{ width: `${missedPct}%` }}
            className="bg-[#ff4d4d] transition-all duration-700"
            title={`Missed (False Negatives): ${missedCount}`}
          />
        )}
        {hallPct > 0 && (
          <div
            style={{ width: `${hallPct}%` }}
            className="bg-amber-400 transition-all duration-700"
            title={`Hallucinated (False Positives): ${hallucinatedCount}`}
          />
        )}
      </div>

      <div className="flex items-center justify-between text-xs pt-1 border-t border-[#242830] font-bold">
        <div className="flex items-center gap-1.5 text-[#00ffc2]">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>MATCHED: {matchedCount}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#ff4d4d]">
          <XCircle className="w-3.5 h-3.5" />
          <span>MISSED (FN): {missedCount}</span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-400">
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
  value: number; // 0 to 100
  target?: number;
  delta?: number;
  className?: string;
}) {
  const isCritical = value < 60 && value > 0;
  const isOptimal = value >= target;

  return (
    <div className={cn("flex flex-col gap-1 font-mono", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-300 flex items-center gap-2 uppercase tracking-wide">
          {label}
          {isCritical && (
            <span className="text-[9px] uppercase font-black tracking-widest px-1.5 py-0.2 rounded-none bg-[#ff4d4d]/20 text-[#ff4d4d] border border-[#ff4d4d]/40">
              CRITICAL DEFICIT
            </span>
          )}
        </span>
        <div className="flex items-center gap-2">
          {delta !== undefined && (
            <span
              className={cn(
                "text-[10px] font-mono font-bold",
                delta > 0 ? "text-[#00ffc2]" : delta < 0 ? "text-[#ff4d4d]" : "text-zinc-500"
              )}
            >
              {delta > 0 ? `+${delta.toFixed(1)}%` : `${delta.toFixed(1)}%`}
            </span>
          )}
          <span className="font-black text-white">{value.toFixed(1)}%</span>
        </div>
      </div>
      <div className="h-2 w-full bg-[#0a0b0d] border border-[#242830] rounded-none overflow-hidden relative">
        {/* Target line at 90% */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-[#00ffc2] z-10 opacity-75"
          style={{ left: `${target}%` }}
        />
        <div
          className={cn(
            "h-full rounded-none transition-all duration-700",
            isCritical
              ? "bg-[#ff4d4d]"
              : isOptimal
              ? "bg-[#00ffc2]"
              : value >= 80
              ? "bg-amber-400"
              : value > 0
              ? "bg-orange-400"
              : "bg-zinc-700"
          )}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}
