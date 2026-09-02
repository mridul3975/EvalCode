"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, GitCompare, LayoutList, Columns } from "lucide-react";

export interface CodeDiffViewerProps {
  buggyCode: string;
  correctedCode: string;
  language: string;
}

export function CodeDiffViewer({
  buggyCode,
  correctedCode,
  language,
}: CodeDiffViewerProps) {
  const [copiedCorrected, setCopiedCorrected] = useState(false);
  const [viewMode, setViewMode] = useState<"unified" | "split">("unified");

  const buggyLines = buggyCode.split("\n");
  const correctedLines = correctedCode.split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(correctedCode);
    setCopiedCorrected(true);
    setTimeout(() => setCopiedCorrected(false), 2000);
  };

  return (
    <div className="flex flex-col bg-neutral-950/80 border border-neutral-800/80 rounded-xl overflow-hidden shadow-xl font-mono text-xs">
      {/* Header with Mode Toggle & Copy */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900/60 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <GitCompare className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-semibold text-neutral-200">
            Ground-Truth Fix Diff
          </span>
          <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded uppercase">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded p-0.5 text-[10px]">
            <button
              type="button"
              onClick={() => setViewMode("unified")}
              className={cn(
                "px-2 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer",
                viewMode === "unified"
                  ? "bg-neutral-800 text-white font-bold"
                  : "text-neutral-400 hover:text-white"
              )}
            >
              <LayoutList className="w-3 h-3" />
              <span>Unified</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={cn(
                "px-2 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer",
                viewMode === "split"
                  ? "bg-neutral-800 text-white font-bold"
                  : "text-neutral-400 hover:text-white"
              )}
            >
              <Columns className="w-3 h-3" />
              <span>Side-by-Side</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded transition-colors cursor-pointer"
          >
            {copiedCorrected ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Fix</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Viewports */}
      {viewMode === "unified" ? (
        <div className="p-3 overflow-x-auto space-y-0.5 max-h-[380px] overflow-y-auto bg-neutral-950/60 leading-relaxed font-mono text-xs">
          {/* Show Original with flaws (-) then Corrected (+) */}
          {buggyLines.map((line, idx) => {
            const isDifferent = correctedLines[idx] !== line;
            return (
              <div
                key={`orig-${idx}`}
                className={cn(
                  "flex items-start gap-2 px-2 py-0.5 rounded",
                  isDifferent
                    ? "bg-rose-950/20 text-rose-300 border-l-2 border-rose-500"
                    : "text-neutral-400"
                )}
              >
                <span className="w-6 text-neutral-600 select-none text-[10px]">{idx + 1}</span>
                <span className="w-3 select-none font-bold">{isDifferent ? "-" : " "}</span>
                <pre className="whitespace-pre overflow-x-auto">{line || " "}</pre>
              </div>
            );
          })}
          <div className="border-t border-neutral-800/60 my-2 pt-2 text-[10px] text-neutral-500 font-bold uppercase tracking-wider px-2">
            Corrected Target Implementation:
          </div>
          {correctedLines.map((line, idx) => {
            const isDifferent = buggyLines[idx] !== line;
            return (
              <div
                key={`corr-${idx}`}
                className={cn(
                  "flex items-start gap-2 px-2 py-0.5 rounded",
                  isDifferent
                    ? "bg-emerald-950/20 text-emerald-300 border-l-2 border-emerald-500 font-medium"
                    : "text-neutral-400"
                )}
              >
                <span className="w-6 text-neutral-600 select-none text-[10px]">{idx + 1}</span>
                <span className="w-3 select-none font-bold text-emerald-400">{isDifferent ? "+" : " "}</span>
                <pre className="whitespace-pre overflow-x-auto">{line || " "}</pre>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-800 text-xs font-mono">
          {/* Buggy AI Code View */}
          <div className="flex flex-col bg-rose-950/10">
            <div className="px-3 py-1.5 bg-rose-950/20 border-b border-rose-900/30 text-[10px] font-semibold text-rose-400 flex items-center justify-between">
              <span>Original AI Code (Flaws)</span>
              <span className="text-rose-500/80">{buggyLines.length} lines</span>
            </div>
            <div className="p-3 overflow-x-auto space-y-0.5 max-h-[380px] overflow-y-auto leading-relaxed">
              {buggyLines.map((line, idx) => {
                const isDifferent = correctedLines[idx] !== line;
                return (
                  <div
                    key={idx}
                    className={cn(
                      "flex items-start gap-2 px-1.5 py-0.5 rounded",
                      isDifferent ? "bg-rose-950/40 text-rose-300 border-l-2 border-rose-500" : "text-neutral-400"
                    )}
                  >
                    <span className="w-6 text-neutral-600 select-none text-[10px]">{idx + 1}</span>
                    <pre className="whitespace-pre overflow-x-auto">{line || " "}</pre>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Corrected Ground-Truth View */}
          <div className="flex flex-col bg-emerald-950/10">
            <div className="px-3 py-1.5 bg-emerald-950/20 border-b border-emerald-900/30 text-[10px] font-semibold text-emerald-400 flex items-center justify-between">
              <span>Corrected Ground Truth</span>
              <span className="text-emerald-500/80">{correctedLines.length} lines</span>
            </div>
            <div className="p-3 overflow-x-auto space-y-0.5 max-h-[380px] overflow-y-auto leading-relaxed">
              {correctedLines.map((line, idx) => {
                const isDifferent = buggyLines[idx] !== line;
                return (
                  <div
                    key={idx}
                    className={cn(
                      "flex items-start gap-2 px-1.5 py-0.5 rounded",
                      isDifferent ? "bg-emerald-950/40 text-emerald-300 border-l-2 border-emerald-500 font-medium" : "text-neutral-400"
                    )}
                  >
                    <span className="w-6 text-neutral-600 select-none text-[10px]">{idx + 1}</span>
                    <pre className="whitespace-pre overflow-x-auto">{line || " "}</pre>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
