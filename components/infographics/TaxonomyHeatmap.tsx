"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface TaxonomyMatrixProps {
  topicStats: Record<string, { attempts: number; avg_score: number }>;
  defectStats: Record<string, { attempts: number; detection_rate: number }>;
}

export function TaxonomyHeatmap({ topicStats, defectStats }: TaxonomyMatrixProps) {
  const topics = [
    { key: "linked_lists", label: "LINKED LISTS" },
    { key: "trees", label: "TREES & GRAPHS" },
    { key: "dp", label: "DYNAMIC PROGRAMMING" },
    { key: "arrays", label: "ARRAYS & STRINGS" },
    { key: "stacks_queues", label: "STACKS & QUEUES" },
  ];

  const defects = [
    { key: "subtle_logic_bug", label: "SUBTLE LOGIC BUGS" },
    { key: "edge_case_blindness", label: "EDGE-CASE BLINDNESS" },
    { key: "deceptive_explanation", label: "DECEPTIVE EXPLANATIONS" },
    { key: "complexity_regression", label: "COMPLEXITY REGRESSIONS" },
  ];

  function getCellColor(attempts: number, score: number): { bg: string; text: string; badge: string } {
    if (attempts === 0) return { bg: "bg-[#0a0b0d] border-[#242830]", text: "text-zinc-500", badge: "NOT STARTED" };
    if (score >= 90) return { bg: "bg-[#00ffc2]/10 border-[#00ffc2]/40", text: "text-[#00ffc2]", badge: "READY" };
    if (score >= 80) return { bg: "bg-amber-500/10 border-amber-500/40", text: "text-amber-300", badge: "BORDERLINE" };
    if (score >= 70) return { bg: "bg-orange-500/10 border-orange-500/40", text: "text-orange-300", badge: "NEEDS WORK" };
    return { bg: "bg-rose-500/10 border-rose-500/40", text: "text-rose-400", badge: "DEFICIT" };
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full font-mono">
      {/* Topic Mastery Column */}
      <div className="bg-[#121417] border-2 border-[#242830] rounded-none p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-[#242830] pb-3">
          <span className="text-xs font-black uppercase tracking-widest text-zinc-300">
            DSA TOPIC MASTERY
          </span>
          <span className="text-[10px] text-zinc-500 font-bold">ROLLING 20 ATTEMPTS</span>
        </div>
        <div className="space-y-2 pt-1">
          {topics.map((t) => {
            const stat = topicStats[t.key] || { attempts: 0, avg_score: 0 };
            const style = getCellColor(stat.attempts, stat.avg_score);
            return (
              <div
                key={t.key}
                className={cn(
                  "flex items-center justify-between p-3 rounded-none border text-xs transition-colors",
                  style.bg
                )}
              >
                <div className="flex flex-col">
                  <span className="font-bold text-zinc-200">{t.label}</span>
                  <span className="text-[10px] text-zinc-400">{stat.attempts} EVALUATIONS</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("font-black text-sm", style.text)}>
                    {stat.attempts > 0 ? `${stat.avg_score.toFixed(0)}%` : "0%"}
                  </span>
                  <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-none bg-[#0a0b0d] border border-[#242830] text-zinc-300">
                    {style.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Defect Detection Rate Column */}
      <div className="bg-[#121417] border-2 border-[#242830] rounded-none p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-[#242830] pb-3">
          <span className="text-xs font-black uppercase tracking-widest text-zinc-300">
            DEFECT DETECTION ACCURACY
          </span>
          <span className="text-[10px] text-zinc-500 font-bold">TARGET: &ge;85%</span>
        </div>
        <div className="space-y-2 pt-1">
          {defects.map((d) => {
            const stat = defectStats[d.key] || { attempts: 0, detection_rate: 0 };
            const style = getCellColor(stat.attempts, stat.detection_rate);
            return (
              <div
                key={d.key}
                className={cn(
                  "flex items-center justify-between p-3 rounded-none border text-xs transition-colors",
                  style.bg
                )}
              >
                <div className="flex flex-col">
                  <span className="font-bold text-zinc-200">{d.label}</span>
                  <span className="text-[10px] text-zinc-400">{stat.attempts} EVALUATIONS</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("font-black text-sm", style.text)}>
                    {stat.attempts > 0 ? `${stat.detection_rate.toFixed(0)}%` : "0%"}
                  </span>
                  <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-none bg-[#0a0b0d] border border-[#242830] text-zinc-300">
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
