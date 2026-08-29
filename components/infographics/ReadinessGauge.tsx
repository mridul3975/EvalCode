"use client";

import React from "react";
import { getReadinessTier } from "@/lib/utils";

export interface ReadinessGaugeProps {
  score: number; // 0 to 100
  target?: number; // default 90.0
  size?: number; // default 200
  showDetails?: boolean;
}

export function ReadinessGauge({
  score,
  target = 90.0,
  size = 220,
  showDetails = true,
}: ReadinessGaugeProps) {
  const tier = getReadinessTier(score);
  const strokeWidth = 14;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* SVG Circular Gauge */}
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-zinc-800/80"
            fill="transparent"
          />
          {/* Target marker circle (90%) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#10B981"
            strokeWidth={2}
            strokeDasharray="4 6"
            className="opacity-40"
            fill="transparent"
          />
          {/* Active progress track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={tier.color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold tracking-tight text-white">
            {score.toFixed(1)}%
          </span>
          <span
            className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 mt-1 rounded-full border"
            style={{
              color: tier.color,
              borderColor: `${tier.color}40`,
              backgroundColor: `${tier.color}15`,
            }}
          >
            {tier.tier}
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="mt-3 flex items-center gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Target Benchmark: {target.toFixed(1)}%+</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tier.color }} />
            <span>Current Status: {tier.tier}</span>
          </div>
        </div>
      )}
    </div>
  );
}
