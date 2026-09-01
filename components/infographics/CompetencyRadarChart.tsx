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
  height = 540,
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
          <RadarChart cx="50%" cy="50%" outerRadius="88%" data={chartData}>
            <PolarGrid stroke="#525866" strokeWidth={1.5} />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#ffffff", fontSize: 13, fontWeight: 900, fontFamily: "monospace" }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "#a1a1aa", fontSize: 10, fontFamily: "monospace", fontWeight: 700 }}
              stroke="#525866"
            />
            {/* Target 90% benchmark outline in pure dashed white */}
            <Radar
              name="Target Benchmark (90%)"
              dataKey="target"
              stroke="#ffffff"
              strokeDasharray="6 6"
              strokeWidth={2}
              fill="#ffffff"
              fillOpacity={0.08}
            />
            {/* Candidate actual polygon in pure solid white */}
            <Radar
              name="Candidate Score"
              dataKey="candidate"
              stroke="#ffffff"
              strokeWidth={3.5}
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

      <div className="flex flex-wrap items-center justify-center gap-8 mt-4 text-xs text-white font-mono font-black uppercase">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white/40 border-2 border-white" />
          <span>CANDIDATE COMPETENCY</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-1 border-t-2 border-dashed border-white" />
          <span>TARGET BENCHMARK (90%)</span>
        </div>
      </div>
    </div>
  );
}
