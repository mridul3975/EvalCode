"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface TaxonomyMatrixProps {
  topicStats: Record<string, { attempts: number; avg_score: number }>;
  defectStats: Record<string, { attempts: number; detection_rate: number }>;
}

export function TaxonomyHeatmap({ topicStats, defectStats }: TaxonomyMatrixProps) {
  const topics = [
    { key: "linked_lists", label: "Linked Lists" },
    { key: "trees", label: "Trees & Graphs" },
    { key: "dp", label: "Dynamic Programming" },
    { key: "arrays", label: "Arrays" },
    { key: "strings", label: "Strings" },
  ];

  const defects = [
    { key: "subtle_logic_bug", label: "Subtle Logic Bugs" },
    { key: "edge_case_blindness", label: "Edge-Case Blindness" },
    { key: "deceptive_explanation", label: "Deceptive Explanations" },
    { key: "complexity_regression", label: "Complexity Regressions" },
  ];

  function getCellColor(score: number): { bg: string; text: string; badge: string } {
    if (score >= 90) return { bg: "bg-emerald-950/40 border-emerald-800/40", text: "text-emerald-300", badge: "Ready" };
    if (score >= 80) return { bg: "bg-amber-950/40 border-amber-800/40", text: "text-amber-300", badge: "Borderline" };
    if (score >= 70) return { bg: "bg-orange-950/40 border-orange-800/40", text: "text-orange-300", badge: "Needs Work" };
    return { bg: "bg-rose-950/50 border-rose-800/50", text: "text-rose-300", badge: "Deficit" };
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {/* Topic Mastery Column */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            DSA Topic Mastery
          </span>
          <span className="text-[11px] text-zinc-500">Rolling 20 Attempts</span>
        </div>
        <div className="space-y-2">
          {topics.map((t) => {
            const stat = topicStats[t.key] || { attempts: 0, avg_score: 75 };
            const style = getCellColor(stat.avg_score);
            return (
              <div
                key={t.key}
                className={cn(
                  "flex items-center justify-between p-2.5 rounded-lg border text-xs transition-colors",
                  style.bg
                )}
              >
                <div className="flex flex-col">
                  <span className="font-medium text-zinc-200">{t.label}</span>
                  <span className="text-[10px] text-zinc-400">{stat.attempts} evaluations</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("font-bold text-sm", style.text)}>
                    {stat.avg_score.toFixed(0)}%
                  </span>
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    {style.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Defect Detection Rate Column */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Defect Detection Accuracy
          </span>
          <span className="text-[11px] text-zinc-500">Target: &ge;85%</span>
        </div>
        <div className="space-y-2">
          {defects.map((d) => {
            const stat = defectStats[d.key] || { attempts: 0, detection_rate: 70 };
            const style = getCellColor(stat.detection_rate);
            return (
              <div
                key={d.key}
                className={cn(
                  "flex items-center justify-between p-2.5 rounded-lg border text-xs transition-colors",
                  style.bg
                )}
              >
                <div className="flex flex-col">
                  <span className="font-medium text-zinc-200">{d.label}</span>
                  <span className="text-[10px] text-zinc-400">{stat.attempts} evaluations</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("font-bold text-sm", style.text)}>
                    {stat.detection_rate.toFixed(0)}%
                  </span>
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    {style.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
