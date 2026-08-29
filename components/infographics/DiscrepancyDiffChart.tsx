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
    <div className="flex flex-col gap-2.5 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-zinc-300">Diagnostic Discrepancy Ratio</span>
        <span className="text-zinc-500 font-mono">{matchedCount} Matched / {total} Total Items</span>
      </div>

      {/* Segmented multi-color progress bar */}
      <div className="h-3.5 w-full bg-zinc-800/80 rounded-full overflow-hidden flex gap-0.5 p-0.5">
        {matchPct > 0 && (
          <div
            style={{ width: `${matchPct}%` }}
            className="bg-emerald-500 rounded-l-full transition-all duration-700"
            title={`Matched: ${matchedCount}`}
          />
        )}
        {missedPct > 0 && (
          <div
            style={{ width: `${missedPct}%` }}
            className="bg-rose-500 transition-all duration-700"
            title={`Missed (False Negatives): ${missedCount}`}
          />
        )}
        {hallPct > 0 && (
          <div
            style={{ width: `${hallPct}%` }}
            className="bg-amber-500 rounded-r-full transition-all duration-700"
            title={`Hallucinated (False Positives): ${hallucinatedCount}`}
          />
        )}
      </div>

      <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-800/60">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Matched: {matchedCount}</span>
        </div>
        <div className="flex items-center gap-1.5 text-rose-400">
          <XCircle className="w-3.5 h-3.5" />
          <span>Missed (FN): {missedCount}</span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-400">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Phantom (FP): {hallucinatedCount}</span>
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
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-zinc-300 flex items-center gap-2">
          {label}
          {isCritical && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40">
              Critical Deficit
            </span>
          )}
        </span>
        <div className="flex items-center gap-2">
          {delta !== undefined && (
            <span
              className={cn(
                "text-[10px] font-mono",
                delta > 0 ? "text-emerald-400" : delta < 0 ? "text-rose-400" : "text-zinc-500"
              )}
            >
              {delta > 0 ? `+${delta.toFixed(1)}%` : `${delta.toFixed(1)}%`}
            </span>
          )}
          <span className="font-bold text-zinc-100 font-mono">{value.toFixed(1)}%</span>
        </div>
      </div>
      <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden relative">
        {/* Target line at 90% */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-emerald-400 z-10 opacity-75"
          style={{ left: `${target}%` }}
        />
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            isCritical
              ? "bg-rose-500"
              : isOptimal
              ? "bg-emerald-500"
              : value >= 80
              ? "bg-amber-500"
              : "bg-orange-500"
          )}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}
