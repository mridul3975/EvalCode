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
  correctness: number;
  edge_cases: number;
  complexity: number;
  explanation: number;
  communication: number;
  debugging: number;
}

export interface CompetencyRadarChartProps {
  data: CompetencyRadarData;
  benchmark?: number;
  height?: number;
}

export function CompetencyRadarChart({
  data,
  benchmark = 90,
  height = 320,
}: CompetencyRadarChartProps) {
  const chartData = [
    {
      subject: "CORRECTNESS",
      candidate: data.correctness,
      target: benchmark,
      fullMark: 100,
    },
    {
      subject: "EDGE CASES",
      candidate: data.edge_cases,
      target: benchmark,
      fullMark: 100,
    },
    {
      subject: "COMPLEXITY",
      candidate: data.complexity,
      target: benchmark,
      fullMark: 100,
    },
    {
      subject: "EXPLANATION",
      candidate: data.explanation,
      target: benchmark,
      fullMark: 100,
    },
    {
      subject: "COMMUNICATION",
      candidate: data.communication,
      target: benchmark,
      fullMark: 100,
    },
    {
      subject: "REMEDIATION",
      candidate: data.debugging,
      target: benchmark,
      fullMark: 100,
    },
  ];

  return (
    <div className="w-full flex flex-col items-center font-mono">
      <div className="w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="#242830" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#e2e8f0", fontSize: 10, fontWeight: 700, fontFamily: "monospace" }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "#64748b", fontSize: 9, fontFamily: "monospace" }}
              stroke="#242830"
            />
            {/* Target 90% benchmark outline */}
            <Radar
              name="Benchmark (90%)"
              dataKey="target"
              stroke="#00ffc2"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              fill="#00ffc2"
              fillOpacity={0.06}
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
                backgroundColor: "#0a0b0d",
                borderColor: "#242830",
                borderRadius: "0px",
                fontSize: "11px",
                fontFamily: "monospace",
                color: "#e2e8f0",
              }}
              itemStyle={{ color: "#00ffc2" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-6 mt-1 text-xs text-zinc-400 font-mono font-bold">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-none bg-sky-400/40 border border-sky-400" />
          <span>CANDIDATE COMPETENCY</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 border-t border-dashed border-[#00ffc2]" />
          <span>TARGET BENCHMARK (90%)</span>
        </div>
      </div>
    </div>
  );
}
