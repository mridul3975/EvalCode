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
  FileCode,
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
    <div className="flex flex-col h-full bg-[#141618] border border-white/10 rounded-xl overflow-hidden shadow-2xl font-mono">
      {/* Console Header Tabs */}
      <div className="p-3 bg-[#181a1d] border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <Terminal className="w-4 h-4 text-sky-400 shrink-0" />
          <span className="text-xs font-bold uppercase text-white tracking-wider mr-2 shrink-0">
            TEST CONSOLE
          </span>

          {visibleCases.map((tc, idx) => {
            const res = testResults.find((r) => r.testCaseId === tc.id);
            return (
              <button
                key={tc.id}
                type="button"
                onClick={() => setSelectedTab(idx)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer shrink-0",
                  selectedTab === idx
                    ? "bg-white text-black font-black shadow-md"
                    : "bg-[#1e2022] text-[#b9cbc1] hover:text-white"
                )}
              >
                {res ? (
                  res.passed ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <XCircle className="w-3 h-3 text-rose-400" />
                  )
                ) : (
                  <span className="w-2 h-2 rounded-full bg-zinc-600" />
                )}
                <span>CASE {idx + 1}</span>
              </button>
            );
          })}
        </div>

        {/* Global Test Pass Indicator */}
        {totalRun > 0 && (
          <div className="flex items-center gap-2 text-xs shrink-0">
            <span
              className={cn(
                "px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border",
                passedCount === totalRun
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                  : "bg-amber-500/10 border-amber-500/40 text-amber-400"
              )}
            >
              {passedCount} / {totalRun} PASSED
            </span>
          </div>
        )}
      </div>

      {/* Test Case Details Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
        {isRunning ? (
          <div className="h-full flex items-center justify-center gap-3 text-emerald-400 animate-pulse">
            <Clock className="w-4 h-4 animate-spin" />
            <span className="text-xs font-bold">EXECUTING AGAINST TEST HARNESS...</span>
          </div>
        ) : activeCase ? (
          <div className="space-y-4">
            {/* Description & Status */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs text-[#b9cbc1] font-bold">
                {activeCase.description}
              </span>
              {activeResult && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#83958c]">
                    Execution: {activeResult.executionTimeMs} ms
                  </span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-black uppercase",
                      activeResult.passed
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                    )}
                  >
                    {activeResult.passed ? "ACCEPTED" : "WRONG ANSWER"}
                  </span>
                </div>
              )}
            </div>

            {/* Error Banner if any */}
            {activeResult?.error && (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-rose-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>RUNTIME / SYNTAX EXCEPTION</span>
                </div>
                <pre className="font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">{activeResult.error}</pre>
              </div>
            )}

            {/* Input Data */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-[#83958c] font-bold uppercase tracking-wider block">
                INPUT PARAMETERS
              </span>
              <div className="p-3 rounded-lg bg-[#0c0e10] border border-white/5 text-white font-mono text-xs overflow-x-auto">
                <pre>{activeCase.input}</pre>
              </div>
            </div>

            {/* Expected vs Actual Output */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Expected Output */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-[#83958c] font-bold uppercase tracking-wider block">
                  EXPECTED RETURN VALUE
                </span>
                <div className="p-3 rounded-lg bg-[#0c0e10] border border-white/5 text-emerald-400 font-mono text-xs overflow-x-auto min-h-[48px]">
                  <pre>{JSON.stringify(activeCase.expected, null, 2)}</pre>
                </div>
              </div>

              {/* Actual Output */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-[#83958c] font-bold uppercase tracking-wider block">
                  ACTUAL RETURN VALUE
                </span>
                <div
                  className={cn(
                    "p-3 rounded-lg bg-[#0c0e10] border font-mono text-xs overflow-x-auto min-h-[48px]",
                    activeResult
                      ? activeResult.passed
                        ? "border-emerald-500/30 text-emerald-400"
                        : "border-rose-500/30 text-rose-400"
                      : "border-white/5 text-gray-500"
                  )}
                >
                  <pre>
                    {activeResult ? (activeResult.actual !== undefined ? JSON.stringify(activeResult.actual, null, 2) : "None") : "Click 'Run Tests' to inspect output"}
                  </pre>
                </div>
              </div>
            </div>

            {/* Stdout Logs if any */}
            {activeResult?.stdout && (
              <div className="space-y-1.5">
                <span className="text-[10px] text-[#83958c] font-bold uppercase tracking-wider block">
                  STANDARD OUTPUT (STDOUT)
                </span>
                <div className="p-3 rounded-lg bg-[#0c0e10] border border-white/5 text-zinc-300 font-mono text-[11px] overflow-x-auto">
                  <pre>{activeResult.stdout}</pre>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-[#83958c]">
            NO TEST CASES REGISTERED
          </div>
        )}
      </div>
    </div>
  );
}
