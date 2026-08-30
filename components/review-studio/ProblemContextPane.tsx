"use client";

import React, { useState } from "react";
import { QuestionItem, QuestionLanguage } from "@/types/question";
import { getLanguageLabel } from "@/lib/language-utils";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Sparkles,
  AlertCircle,
  Clock,
  Database,
  ChevronDown,
  ChevronUp,
  Tag,
  CheckCircle2,
} from "lucide-react";

export function ProblemContextPane({ question, selectedLanguage }: { question: QuestionItem; selectedLanguage?: QuestionLanguage }) {
  const [activeTab, setActiveTab] = useState<"statement" | "explanation">("statement");
  const [isExplanationExpanded, setIsExplanationExpanded] = useState(true);

  const problem = question.problem_statement;
  const ai = question.ai_response;

  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-800/90 rounded-2xl overflow-hidden shadow-xl">
      {/* Top Tab Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/70 px-4 py-2.5 backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab("statement")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              activeTab === "statement"
                ? "bg-zinc-800 text-white shadow-sm border border-zinc-700/60"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
            )}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Problem Specification</span>
          </button>

          <button
            onClick={() => setActiveTab("explanation")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              activeTab === "explanation"
                ? "bg-zinc-800 text-purple-300 shadow-sm border border-purple-500/30"
                : "text-zinc-400 hover:text-purple-300 hover:bg-zinc-800/50"
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Commentary & Claims</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-zinc-400 uppercase bg-zinc-800 px-2 py-0.5 rounded-md border border-zinc-700">
            {question.topic.replace("_", " ")}
          </span>
          <span
            className={cn(
              "text-[10px] font-bold text-zinc-300 uppercase px-2 py-0.5 rounded-md border",
              question.difficulty === "easy"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : question.difficulty === "medium"
                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                : "bg-rose-500/10 text-rose-400 border-rose-500/30"
            )}
          >
            {question.difficulty}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm text-zinc-300">
        {activeTab === "statement" ? (
          <>
            {/* Title & Description */}
            <div className="space-y-2">
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                {question.title}
              </h1>
              <div className="whitespace-pre-wrap leading-relaxed text-zinc-300 text-xs sm:text-sm font-sans">
                {problem.description}
              </div>
            </div>

            {/* Examples */}
            {problem.examples && problem.examples.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Example Test Cases
                </span>
                {problem.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/90 text-xs font-mono space-y-2"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-zinc-500 font-semibold w-14 shrink-0">Input:</span>
                      <span className="text-emerald-300 select-all">{ex.input}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-zinc-500 font-semibold w-14 shrink-0">Output:</span>
                      <span className="text-sky-300 select-all">{ex.output}</span>
                    </div>
                    {ex.explanation && (
                      <div className="text-zinc-400 font-sans text-[11px] pt-1.5 border-t border-zinc-800/80">
                        <span className="text-zinc-500 font-semibold">Explanation: </span>
                        {ex.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Constraints */}
            {problem.constraints && problem.constraints.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  Constraints & Invariants
                </span>
                <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/70">
                  <ul className="list-disc list-inside space-y-1.5 text-xs text-zinc-300 pl-1 font-mono">
                    {problem.constraints.map((c, idx) => (
                      <li key={idx}>
                        <span className="text-zinc-300">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </>
        ) : (
          /* AI Explanation Tab */
          <div className="space-y-5">
            <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                    AI Natural Language Commentary
                  </span>
                </div>
                <button
                  onClick={() => setIsExplanationExpanded(!isExplanationExpanded)}
                  className="text-zinc-400 hover:text-zinc-200 p-1"
                >
                  {isExplanationExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              {isExplanationExpanded && (
                <div className="text-xs text-purple-100/90 leading-relaxed font-sans bg-zinc-950/60 p-3.5 rounded-xl border border-purple-900/30">
                  {ai.stated_explanation}
                </div>
              )}
            </div>

            {/* AI Claimed Complexities */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-sky-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                    AI Claimed Time
                  </span>
                  <span className="text-sm font-mono font-bold text-sky-300">
                    {ai.stated_time_complexity}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Database className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                    AI Claimed Space
                  </span>
                  <span className="text-sm font-mono font-bold text-emerald-300">
                    {ai.stated_space_complexity}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-300/90 leading-relaxed flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Auditing Directive:</strong> Read the commentary skeptically. AI models often generate plausible, fluent explanations describing algorithms they did not actually implement in code.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
