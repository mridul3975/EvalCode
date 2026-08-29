"use client";

import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export interface CompetencyRadarData {
  correctness: number; // 0 to 100
  edge_cases: number;
  complexity: number;
  explanation: number;
  communication: number;
  debugging: number;
}

export interface CompetencyRadarChartProps {
  data: CompetencyRadarData;
  benchmark?: number; // default 90
  height?: number; // default 320
}

export function CompetencyRadarChart({
  data,
  benchmark = 90,
  height = 320,
}: CompetencyRadarChartProps) {
  const chartData = [
    {
      subject: "Correctness",
      candidate: data.correctness,
      target: benchmark,
      fullMark: 100,
    },
    {
      subject: "Edge Cases",
      candidate: data.edge_cases,
      target: benchmark,
      fullMark: 100,
    },
    {
      subject: "Complexity",
      candidate: data.complexity,
      target: benchmark,
      fullMark: 100,
    },
    {
      subject: "Explanation",
      candidate: data.explanation,
      target: benchmark,
      fullMark: 100,
    },
    {
      subject: "Communication",
      candidate: data.communication,
      target: benchmark,
      fullMark: 100,
    },
    {
      subject: "Remediation",
      candidate: data.debugging,
      target: benchmark,
      fullMark: 100,
    },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="#27272a" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#a1a1aa", fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "#52525b", fontSize: 9 }}
              stroke="#27272a"
            />
            {/* Target 90% benchmark outline */}
            <Radar
              name="Benchmark (90%)"
              dataKey="target"
              stroke="#10b981"
              strokeDasharray="3 3"
              strokeWidth={1.5}
              fill="#10b981"
              fillOpacity={0.05}
            />
            {/* Candidate actual polygon */}
            <Radar
              name="Candidate Score"
              dataKey="candidate"
              stroke="#38bdf8"
              strokeWidth={2}
              fill="#38bdf8"
              fillOpacity={0.35}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                borderColor: "#3f3f46",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#f4f4f5",
              }}
              itemStyle={{ color: "#38bdf8" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-6 mt-1 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-sky-400/40 border border-sky-400" />
          <span>Candidate Competency</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 border-t border-dashed border-emerald-400" />
          <span>Target Benchmark (90%)</span>
        </div>
      </div>
    </div>
  );
}
