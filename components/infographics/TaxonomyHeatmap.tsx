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
    if (attempts === 0) return { badge: "NOT STARTED", bg: "bg-white text-black" };
    if (score >= 90) return { badge: "READY", bg: "bg-white text-black font-black" };
    if (score >= 80) return { badge: "BORDERLINE", bg: "bg-zinc-200 text-black font-bold" };
    if (score >= 70) return { badge: "NEEDS WORK", bg: "bg-zinc-300 text-black font-bold" };
    return { badge: "DEFICIT", bg: "bg-black text-white border border-white" };
  }

  return (
    <div className="border-4 border-white w-full flex flex-col font-['Hanken_Grotesk']">
      {/* Massive Taxonomy Header */}
      <div className="bg-[#121416] text-white p-6 sm:p-10 border-b-4 border-white">
        <h3 className="font-black text-5xl sm:text-7xl uppercase tracking-tighter leading-none">
          TAXONOMY
        </h3>
      </div>

      {/* 50/50 Split: Left Dark (Topics) / Right White (Defects) */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left: Topic Mastery (Dark) */}
        <div className="p-6 sm:p-12 md:border-r-4 border-white bg-[#121416] text-white flex flex-col justify-between">
          <div>
            <h4 className="font-black text-2xl sm:text-3xl uppercase mb-6 pb-4 border-b-4 border-white tracking-tight">
              TOPIC MASTERY
            </h4>
            <div className="flex flex-col divide-y-2 divide-zinc-800">
              {topics.map((t) => {
                const stat = topicStats[t.key] || { attempts: 0, avg_score: 0 };
                const badgeInfo = getTopicBadge(stat.attempts, stat.avg_score);
                return (
                  <div key={t.key} className="flex justify-between items-center py-5">
                    <div>
                      <div className="text-xl sm:text-2xl font-black uppercase">{t.label}</div>
                      <div className="text-xs font-mono font-bold uppercase text-zinc-400 mt-0.5">
                        {stat.attempts} EVALUATIONS
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-3xl sm:text-4xl font-black">
                        {stat.attempts > 0 ? `${stat.avg_score.toFixed(0)}%` : "0%"}
                      </span>
                      <span className={cn("text-[10px] px-2 py-0.5 font-bold uppercase mt-1", badgeInfo.bg)}>
                        {badgeInfo.badge}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Defect Detection (Inverted Solid White) */}
        <div className="p-6 sm:p-12 bg-white text-black flex flex-col justify-between">
          <div>
            <h4 className="font-black text-2xl sm:text-3xl uppercase mb-6 pb-4 border-b-4 border-black tracking-tight">
              DEFECT DETECTION
            </h4>
            <div className="flex flex-col divide-y-2 divide-zinc-200">
              {defects.map((d) => {
                const stat = defectStats[d.key] || { attempts: 0, detection_rate: 0 };
                return (
                  <div key={d.key} className="flex justify-between items-center py-5">
                    <div>
                      <div className="text-xl sm:text-2xl font-black uppercase">{d.label}</div>
                      <div className="text-xs font-mono font-bold uppercase text-zinc-600 mt-0.5">
                        TARGET &ge; 85%
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-3xl sm:text-4xl font-black">
                        {stat.attempts > 0 ? `${stat.detection_rate.toFixed(0)}%` : "0%"}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 font-bold uppercase mt-1 bg-black text-white">
                        {stat.attempts > 0 && stat.detection_rate >= 85 ? "CALIBRATED" : "NOT STARTED"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
