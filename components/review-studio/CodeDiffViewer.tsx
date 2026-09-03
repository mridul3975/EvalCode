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
    <div className="flex flex-col neu-card p-4 overflow-hidden font-mono text-xs gap-3">
      {/* Header with Mode Toggle & Copy */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <GitCompare className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wide">
            Ground-Truth Fix Diff
          </span>
          <span className="neu-active-pill text-[10px] font-mono text-neutral-300 px-2.5 py-0.5 uppercase">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#090a0d] border border-white/[0.05] rounded-lg p-1 text-[10px] gap-1">
            <button
              type="button"
              onClick={() => setViewMode("unified")}
              className={cn(
                "px-2.5 py-1 rounded-md flex items-center gap-1 transition-all cursor-pointer",
                viewMode === "unified"
                  ? "neu-inset text-white font-bold border border-white/10"
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
                "px-2.5 py-1 rounded-md flex items-center gap-1 transition-all cursor-pointer",
                viewMode === "split"
                  ? "neu-inset text-white font-bold border border-white/10"
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
            className="neu-button flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white px-3 py-1 rounded-lg transition-all cursor-pointer"
          >
            {copiedCorrected ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Fix</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Viewports Wrapped in Inset Wells */}
      {viewMode === "unified" ? (
        <div className="neu-inset p-3.5 overflow-x-auto space-y-1 max-h-[380px] overflow-y-auto leading-relaxed font-mono text-xs">
          {/* Show Original with flaws (-) then Corrected (+) */}
          {buggyLines.map((line, idx) => {
            const isDifferent = correctedLines[idx] !== line;
            return (
              <div
                key={`orig-${idx}`}
                className={cn(
                  "flex items-start gap-2 px-2 py-0.5 rounded",
                  isDifferent
                    ? "bg-rose-950/30 text-rose-300 border-l-2 border-rose-500"
                    : "text-neutral-400"
                )}
              >
                <span className="w-6 text-neutral-600 select-none text-[10px]">{idx + 1}</span>
                <span className="w-3 select-none font-bold text-rose-400">{isDifferent ? "-" : " "}</span>
                <pre className="whitespace-pre overflow-x-auto">{line || " "}</pre>
              </div>
            );
          })}
          <div className="border-t border-white/[0.08] my-2 pt-2 text-[10px] text-emerald-400 font-bold uppercase tracking-wider px-2">
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
                    ? "bg-emerald-950/30 text-emerald-300 border-l-2 border-emerald-500 font-medium"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          {/* Buggy AI Code View wrapped in .neu-inset */}
          <div className="neu-inset p-3 flex flex-col">
            <div className="pb-2 mb-2 border-b border-rose-900/30 text-[10px] font-bold text-rose-400 flex items-center justify-between uppercase">
              <span>Original AI Code (Flaws)</span>
              <span className="text-rose-400/70">{buggyLines.length} lines</span>
            </div>
            <div className="overflow-x-auto space-y-0.5 max-h-[360px] overflow-y-auto leading-relaxed">
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

          {/* Corrected Ground-Truth View wrapped in .neu-inset */}
          <div className="neu-inset p-3 flex flex-col">
            <div className="pb-2 mb-2 border-b border-emerald-900/30 text-[10px] font-bold text-emerald-400 flex items-center justify-between uppercase">
              <span>Corrected Ground Truth</span>
              <span className="text-emerald-400/70">{correctedLines.length} lines</span>
            </div>
            <div className="overflow-x-auto space-y-0.5 max-h-[360px] overflow-y-auto leading-relaxed">
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
