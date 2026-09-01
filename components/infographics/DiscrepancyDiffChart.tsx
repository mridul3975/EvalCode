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
    <div className="flex flex-col gap-3 p-6 border-4 border-white bg-[#121416] text-white font-mono">
      <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
        <span>DIAGNOSTIC DISCREPANCY RATIO</span>
        <span className="text-zinc-400">{matchedCount} MATCHED / {total} ITEMS</span>
      </div>

      {/* Segmented brutalist progress bar */}
      <div className="h-5 w-full bg-[#121416] border-2 border-white flex gap-1 p-0.5">
        {matchPct > 0 && (
          <div
            style={{ width: `${matchPct}%` }}
            className="bg-white transition-all duration-500"
            title={`Matched: ${matchedCount}`}
          />
        )}
        {missedPct > 0 && (
          <div
            style={{ width: `${missedPct}%` }}
            className="bg-rose-500 transition-all duration-500"
            title={`Missed: ${missedCount}`}
          />
        )}
        {hallPct > 0 && (
          <div
            style={{ width: `${hallPct}%` }}
            className="bg-amber-400 transition-all duration-500"
            title={`Hallucinated: ${hallucinatedCount}`}
          />
        )}
      </div>

      <div className="flex items-center justify-between text-xs pt-2 border-t-2 border-white font-black uppercase">
        <div className="flex items-center gap-1.5 text-white">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>MATCHED: {matchedCount}</span>
        </div>
        <div className="flex items-center gap-1.5 text-rose-400">
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
  const isCritical = value < 60;
  const isOptimal = value >= target;

  return (
    <div className={cn("flex flex-col border-b-2 border-black pb-4 font-['Hanken_Grotesk']", className)}>
      <div className="flex justify-between items-end mb-2">
        <span className="text-base sm:text-lg font-black uppercase">{label}</span>
        <div className="flex items-baseline gap-2">
          {delta !== undefined && delta !== 0 && (
            <span className={cn("text-xs font-mono font-bold", delta > 0 ? "text-emerald-700" : "text-rose-600")}>
              {delta > 0 ? `+${delta.toFixed(1)}%` : `${delta.toFixed(1)}%`}
            </span>
          )}
          <span className="text-2xl sm:text-3xl font-black">{value.toFixed(1)}%</span>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <span className="bg-black text-white px-2 py-0.5 text-[10px] font-black uppercase tracking-widest shrink-0 font-mono">
          {isCritical ? "CRITICAL DEFICIT" : isOptimal ? "OPTIMAL" : "DEVELOPING"}
        </span>
        <div className="flex-1 h-3.5 bg-white border-2 border-black relative overflow-hidden">
          {/* Target line at 90% */}
          <div className="absolute right-[10%] top-0 bottom-0 w-1 bg-black z-10" />
          <div
            className="h-full bg-black transition-all duration-700"
            style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
