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
    <div className="border-y border-neutral-800 py-4">
      <h4 className="text-sm font-medium text-neutral-300">Finding agreement</h4>
      <div className="mt-3 flex h-1.5 overflow-hidden rounded bg-neutral-800" aria-hidden="true">
        <span className="bg-emerald-200" style={{ width: `${matchPct}%` }} />
        <span className="bg-rose-300" style={{ width: `${missedPct}%` }} />
        <span className="bg-amber-200" style={{ width: `${hallPct}%` }} />
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div><dt className="text-neutral-400">Matched</dt><dd className="mt-1 font-mono text-emerald-200">{matchedCount}</dd></div>
        <div><dt className="text-neutral-400">Missed</dt><dd className="mt-1 font-mono text-rose-200">{missedCount}</dd></div>
        <div><dt className="text-neutral-400">Unsupported</dt><dd className="mt-1 font-mono text-amber-200">{hallucinatedCount}</dd></div>
      </dl>
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
    <div className={cn("flex flex-col py-3 border-b border-[rgba(255,255,255,0.05)] font-sans", className)}>
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-sm sm:text-base font-bold text-white uppercase tracking-tight">
          {label}
        </span>
        <div className="flex items-baseline gap-2">
          {delta !== undefined && delta !== 0 && (
            <span className={cn("text-xs font-mono font-bold", delta > 0 ? "text-white" : "text-[#ff8080]")}>
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

        {/* Recessed Inset Track with Glowing White Fill */}
        <div className="flex-1 h-3 bg-[#121416] rounded-full overflow-hidden relative shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8),inset_-1px_-1px_2px_rgba(255,255,255,0.04)] border border-black/50">
          {/* 90% Target line */}
          <div className="absolute right-[10%] top-0 bottom-0 w-0.5 bg-white/40 z-10" />
          <div
            className="h-full bg-gradient-to-r from-zinc-400 to-white rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(255,255,255,0.35)]"
            style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
