"use client";

import React, { useState } from "react";
import { OATestCase, OATestResult } from "@/types/oa";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  AlertCircle,
} from "lucide-react";

interface TestCaseConsoleProps {
  testCases: OATestCase[];
  testResults: OATestResult[];
  isRunning?: boolean;
}

export function TestCaseConsole({
  testCases,
  testResults,
  isRunning = false,
}: TestCaseConsoleProps) {
  const visibleCases = testCases.filter((tc) => !tc.isHidden);
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const activeCase = visibleCases[selectedTab] || visibleCases[0];
  const activeResult = testResults.find((r) => r.testCaseId === activeCase?.id);

  const passedCount = testResults.filter((r) => r.passed).length;
  const totalRun = testResults.length;

  return (
    <div className="flex flex-col h-full bg-[#0c0d10] font-mono select-none">
      {/* Header Tabs: Tactile Neomorphic Buttons (Elevated when inactive, Inset when selected) */}
      <div className="h-11 px-3 bg-[#101114] border-b border-white/[0.04] flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none h-full py-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-300 mr-2 shrink-0">
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            <span>Test Cases</span>
          </div>

          {visibleCases.map((tc, idx) => {
            const res = testResults.find((r) => r.testCaseId === tc.id);
            const isSelected = selectedTab === idx;
            return (
              <button
                key={tc.id}
                type="button"
                onClick={() => setSelectedTab(idx)}
                className={cn(
                  "text-xs font-mono transition-all flex items-center gap-1.5 px-3 py-1 cursor-pointer shrink-0 rounded-lg",
                  isSelected
                    ? "neu-inset text-white font-bold border border-white/10"
                    : "neu-button text-neutral-400 hover:text-white"
                )}
              >
                {res ? (
                  res.passed ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-3 h-3 text-rose-400 shrink-0" />
                  )
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                )}
                <span>Case {idx + 1}</span>
              </button>
            );
          })}
        </div>

        {/* Status Indicator */}
        {totalRun > 0 && (
          <div className="flex items-center gap-2 text-[11px] shrink-0">
            <span
              className={cn(
                "px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border",
                passedCount === totalRun
                  ? "neu-active-pill text-emerald-400 border-emerald-500/30"
                  : "neu-active-pill text-amber-400 border-amber-500/30"
              )}
            >
              {passedCount}/{totalRun} Passed
            </span>
          </div>
        )}
      </div>

      {/* Drawer Content */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
        {isRunning ? (
          <div className="h-full flex items-center justify-center gap-2 text-emerald-400 animate-pulse font-mono">
            <Clock className="w-4 h-4 animate-spin" />
            <span className="font-bold">Executing test harness...</span>
          </div>
        ) : activeCase ? (
          <div className="space-y-3">
            {/* Description & Status */}
            <div className="flex items-center justify-between border-b border-white/[0.05] pb-2">
              <span className="text-xs text-neutral-300 font-sans font-medium">
                {activeCase.description}
              </span>
              {activeResult && (
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[10px] text-neutral-500">
                    {activeResult.executionTimeMs} ms
                  </span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                      activeResult.passed
                        ? "neu-active-pill text-emerald-400 border-emerald-500/30"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                    )}
                  >
                    {activeResult.passed ? "Accepted" : "Wrong Answer"}
                  </span>
                </div>
              )}
            </div>

            {/* Error Banner if any */}
            {activeResult?.error && (
              <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-rose-300 text-xs space-y-1 font-mono shadow-inner">
                <div className="flex items-center gap-1.5 text-rose-400 text-[10px] font-bold">
                  <AlertCircle className="w-3 h-3" />
                  <span>RUNTIME EXCEPTION</span>
                </div>
                <pre className="text-[11px] overflow-x-auto whitespace-pre-wrap">{activeResult.error}</pre>
              </div>
            )}

            {/* Inputs & Outputs Grid in Inset Wells */}
            <div className="space-y-2.5">
              <div>
                <span className="text-[10px] text-neutral-400 font-mono block mb-1 uppercase tracking-wider font-bold">
                  INPUT PARAMETERS
                </span>
                <div className="neu-inset p-4 font-mono text-xs overflow-x-auto text-neutral-300">
                  <pre>{activeCase.input}</pre>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-neutral-400 font-mono block mb-1 uppercase tracking-wider font-bold">
                    EXPECTED OUTPUT
                  </span>
                  <div className="neu-inset p-4 font-mono text-xs overflow-x-auto text-emerald-400">
                    <pre>{JSON.stringify(activeCase.expected, null, 2)}</pre>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-neutral-400 font-mono block mb-1 uppercase tracking-wider font-bold">
                    ACTUAL OUTPUT
                  </span>
                  <div
                    className={cn(
                      "neu-inset p-4 font-mono text-xs overflow-x-auto",
                      activeResult
                        ? activeResult.passed
                          ? "text-emerald-400"
                          : "text-rose-400"
                        : "text-neutral-500"
                    )}
                  >
                    <pre>
                      {activeResult ? (activeResult.actual !== undefined ? JSON.stringify(activeResult.actual, null, 2) : "None") : "Click 'Run' to inspect"}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Stdout Logs if any */}
              {activeResult?.stdout && (
                <div>
                  <span className="text-[10px] text-neutral-400 font-mono block mb-1 uppercase tracking-wider font-bold">
                    STDOUT LOGS
                  </span>
                  <div className="neu-inset p-4 text-neutral-400 font-mono text-[11px] overflow-x-auto">
                    <pre>{activeResult.stdout}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-neutral-500">
            No test cases registered
          </div>
        )}
      </div>
    </div>
  );
}
