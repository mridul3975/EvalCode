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
  height = 460,
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
          <RadarChart cx="50%" cy="50%" outerRadius="82%" data={chartData}>
            <PolarGrid stroke="#3f454d" strokeWidth={1.5} />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#ffffff", fontSize: 12, fontWeight: 900, fontFamily: "monospace" }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "monospace", fontWeight: 700 }}
              stroke="#475569"
            />
            {/* Target 90% benchmark outline */}
            <Radar
              name="Benchmark (90%)"
              dataKey="target"
              stroke="#00ffc2"
              strokeDasharray="5 5"
              strokeWidth={2.5}
              fill="#00ffc2"
              fillOpacity={0.1}
            />
            {/* Candidate actual polygon */}
            <Radar
              name="Candidate Score"
              dataKey="candidate"
              stroke="#ffffff"
              strokeWidth={3}
              fill="#ffffff"
              fillOpacity={0.35}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#000000",
                borderColor: "#ffffff",
                borderWidth: "2px",
                borderRadius: "0px",
                fontSize: "12px",
                fontFamily: "monospace",
                fontWeight: "bold",
                color: "#ffffff",
              }}
              itemStyle={{ color: "#ffffff" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 mt-3 text-xs text-zinc-300 font-mono font-black uppercase">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white/40 border-2 border-white" />
          <span>CANDIDATE COMPETENCY</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 border-t-2 border-dashed border-[#00ffc2]" />
          <span className="text-[#00ffc2]">TARGET BENCHMARK (90%)</span>
        </div>
      </div>
    </div>
  );
}
