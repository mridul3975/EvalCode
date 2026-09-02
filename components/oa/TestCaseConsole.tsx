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
    <div className="flex flex-col h-full bg-[#0d0e11] font-mono select-none">
      {/* Drawer Header Tabs with Flat Underline Active States */}
      <div className="h-9 px-3 bg-[#121418] border-b border-neutral-800/80 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-none h-full">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300 mr-2 shrink-0">
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
                  "h-full text-xs font-mono transition-all flex items-center gap-1.5 border-b-2 px-2 cursor-pointer shrink-0",
                  isSelected
                    ? "border-white text-white font-semibold"
                    : "border-transparent text-neutral-400 hover:text-neutral-200"
                )}
              >
                {res ? (
                  res.passed ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <XCircle className="w-3 h-3 text-rose-400" />
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
                "px-2 py-0.5 rounded text-[10px] font-mono font-medium border",
                passedCount === totalRun
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-400"
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
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>Executing test harness...</span>
          </div>
        ) : activeCase ? (
          <div className="space-y-3">
            {/* Description & Status */}
            <div className="flex items-center justify-between border-b border-neutral-800/60 pb-2">
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
                      "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
                      activeResult.passed
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
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
              <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-300 text-xs space-y-1 font-mono">
                <div className="flex items-center gap-1.5 text-rose-400 text-[10px] font-bold">
                  <AlertCircle className="w-3 h-3" />
                  <span>RUNTIME EXCEPTION</span>
                </div>
                <pre className="text-[11px] overflow-x-auto whitespace-pre-wrap">{activeResult.error}</pre>
              </div>
            )}

            {/* Inputs & Outputs Grid */}
            <div className="space-y-2">
              <div>
                <span className="text-[10px] text-neutral-500 font-mono block mb-1">
                  INPUT PARAMETERS
                </span>
                <div className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800/50 text-neutral-300 font-mono text-xs overflow-x-auto">
                  <pre>{activeCase.input}</pre>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <span className="text-[10px] text-neutral-500 font-mono block mb-1">
                    EXPECTED OUTPUT
                  </span>
                  <div className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800/50 text-emerald-400 font-mono text-xs overflow-x-auto">
                    <pre>{JSON.stringify(activeCase.expected, null, 2)}</pre>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-neutral-500 font-mono block mb-1">
                    ACTUAL OUTPUT
                  </span>
                  <div
                    className={cn(
                      "p-2.5 rounded-lg bg-neutral-950/60 border font-mono text-xs overflow-x-auto",
                      activeResult
                        ? activeResult.passed
                          ? "border-emerald-500/30 text-emerald-400"
                          : "border-rose-500/30 text-rose-400"
                        : "border-neutral-800/50 text-neutral-500"
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
                  <span className="text-[10px] text-neutral-500 font-mono block mb-1">
                    STDOUT
                  </span>
                  <div className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800/50 text-neutral-400 font-mono text-[11px] overflow-x-auto">
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
