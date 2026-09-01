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
  height = 500,
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
    <div className="w-full flex flex-col items-center justify-center font-mono">
      <div className="w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="82%" data={chartData}>
            <PolarGrid stroke="#282a2c" strokeWidth={1.5} />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#e2e2e5", fontSize: 11, fontWeight: 700, fontFamily: "monospace" }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "#83958c", fontSize: 9, fontFamily: "monospace" }}
              stroke="#282a2c"
            />
            {/* Target 90% benchmark outline */}
            <Radar
              name="Target Benchmark (90%)"
              dataKey="target"
              stroke="#ffffff"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              fill="#ffffff"
              fillOpacity={0.05}
            />
            {/* Candidate actual polygon with White glow */}
            <Radar
              name="Candidate Score"
              dataKey="candidate"
              stroke="#ffffff"
              strokeWidth={2.5}
              fill="#ffffff"
              fillOpacity={0.25}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#121416",
                borderColor: "#282a2c",
                borderWidth: "1px",
                borderRadius: "8px",
                fontSize: "12px",
                fontFamily: "monospace",
                color: "#e2e2e5",
                boxShadow: "0 8px 24px rgba(0,0,0,0.7)",
              }}
              itemStyle={{ color: "#ffffff" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 mt-2 text-xs text-[#b9cbc1] font-mono font-bold uppercase">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-sm bg-white/30 border border-white" />
          <span>CANDIDATE COMPETENCY</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 border-t border-dashed border-white" />
          <span>TARGET BENCHMARK (90%)</span>
        </div>
      </div>
    </div>
  );
}
