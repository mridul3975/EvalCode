"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, GitCompare, ArrowRight } from "lucide-react";

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

  const buggyLines = buggyCode.split("\n");
  const correctedLines = correctedCode.split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(correctedCode);
    setCopiedCorrected(true);
    setTimeout(() => setCopiedCorrected(false), 2000);
  };

  return (
    <div className="flex flex-col bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/80 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-zinc-200">
            Ground-Truth Implementation Comparison
          </span>
          <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded uppercase">
            {language}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-800 px-2.5 py-1 rounded transition-colors cursor-pointer"
        >
          {copiedCorrected ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied Corrected Code</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Corrected</span>
            </>
          )}
        </button>
      </div>

      {/* Side-by-Side Viewport */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-800 text-xs font-mono">
        {/* Buggy AI Code View */}
        <div className="flex flex-col bg-rose-950/10">
          <div className="px-4 py-1.5 bg-rose-950/30 border-b border-rose-900/30 text-[11px] font-semibold text-rose-400 flex items-center justify-between">
            <span>[ Original AI Code with Flaws ]</span>
            <span className="text-[10px] text-rose-500 font-mono">{buggyLines.length} lines</span>
          </div>
          <div className="p-3 overflow-x-auto space-y-0.5 max-h-[360px] overflow-y-auto">
            {buggyLines.map((line, idx) => (
              <div key={idx} className="flex items-start gap-3 py-0.5 hover:bg-rose-900/20 px-1 rounded">
                <span className="w-6 text-right select-none text-zinc-600 shrink-0">
                  {idx + 1}
                </span>
                <span className="text-rose-200/90 whitespace-pre">{line || " "}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Corrected Reference Code View */}
        <div className="flex flex-col bg-emerald-950/10">
          <div className="px-4 py-1.5 bg-emerald-950/30 border-b border-emerald-900/30 text-[11px] font-semibold text-emerald-400 flex items-center justify-between">
            <span>[ Verified Optimal Implementation ]</span>
            <span className="text-[10px] text-emerald-500 font-mono">
              {correctedLines.length} lines
            </span>
          </div>
          <div className="p-3 overflow-x-auto space-y-0.5 max-h-[360px] overflow-y-auto">
            {correctedLines.map((line, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 py-0.5 hover:bg-emerald-900/20 px-1 rounded"
              >
                <span className="w-6 text-right select-none text-zinc-600 shrink-0">
                  {idx + 1}
                </span>
                <span className="text-emerald-200/90 whitespace-pre">{line || " "}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
