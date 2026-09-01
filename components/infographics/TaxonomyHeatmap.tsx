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

  function getTopicBadge(attempts: number, score: number) {
    if (attempts === 0) return { badge: "NOT STARTED", className: "obsidian-chip-neutral" };
    if (score >= 90) return { badge: "OPTIMAL", className: "obsidian-chip-optimal" };
    if (score >= 80) return { badge: "DEVELOPING", className: "obsidian-chip-neutral" };
    if (score >= 70) return { badge: "NEEDS WORK", className: "obsidian-chip-neutral text-[#ffe149]" };
    return { badge: "CRITICAL DEFICIT", className: "obsidian-chip-critical" };
  }

  return (
    <div className="obsidian-card p-6 sm:p-10 space-y-8 font-['Hanken_Grotesk']">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.06)] pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-[#b9cbc1] uppercase tracking-widest">
            TAXONOMIC BREAKDOWN
          </span>
          <h3 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mt-1">
            DIMENSIONAL TAXONOMY
          </h3>
        </div>
        <span className="text-xs font-mono text-[#83958c] uppercase">
          EVALUATED ACROSS 75+ BENCHMARKS
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Topic Mastery */}
        <div className="space-y-4">
          <h4 className="text-xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00ffc2]" />
            <span>TOPIC MASTERY</span>
          </h4>

          <div className="space-y-3">
            {topics.map((t) => {
              const stat = topicStats[t.key] || { attempts: 0, avg_score: 0 };
              const badgeInfo = getTopicBadge(stat.attempts, stat.avg_score);
              return (
                <div
                  key={t.key}
                  className="obsidian-inset p-4 flex items-center justify-between hover:border-[rgba(255,255,255,0.1)] transition-colors"
                >
                  <div>
                    <div className="text-base sm:text-lg font-bold text-white uppercase">{t.label}</div>
                    <div className="text-[11px] font-mono text-[#83958c] uppercase mt-0.5">
                      {stat.attempts} EVALUATIONS LOGGED
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                      {stat.attempts > 0 ? `${stat.avg_score.toFixed(0)}%` : "0%"}
                    </span>
                    <span className={cn("mt-1", badgeInfo.className)}>
                      {badgeInfo.badge}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Defect Detection */}
        <div className="space-y-4">
          <h4 className="text-xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#36ffc4]" />
            <span>DEFECT DETECTION</span>
          </h4>

          <div className="space-y-3">
            {defects.map((d) => {
              const stat = defectStats[d.key] || { attempts: 0, detection_rate: 0 };
              const isCalibrated = stat.attempts > 0 && stat.detection_rate >= 85;
              return (
                <div
                  key={d.key}
                  className="obsidian-inset p-4 flex items-center justify-between hover:border-[rgba(255,255,255,0.1)] transition-colors"
                >
                  <div>
                    <div className="text-base sm:text-lg font-bold text-white uppercase">{d.label}</div>
                    <div className="text-[11px] font-mono text-[#83958c] uppercase mt-0.5">
                      TARGET &ge; 85% RECALL
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                      {stat.attempts > 0 ? `${stat.detection_rate.toFixed(0)}%` : "0%"}
                    </span>
                    <span
                      className={cn(
                        "mt-1",
                        isCalibrated
                          ? "obsidian-chip-optimal"
                          : stat.attempts > 0
                          ? "obsidian-chip-critical"
                          : "obsidian-chip-neutral"
                      )}
                    >
                      {isCalibrated ? "CALIBRATED" : stat.attempts > 0 ? "DEFICIT" : "NOT STARTED"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
