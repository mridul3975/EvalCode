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
} from "lucide-react";

export function ProblemContextPane({ question, selectedLanguage }: { question: QuestionItem; selectedLanguage?: QuestionLanguage }) {
  const [activeTab, setActiveTab] = useState<"statement" | "explanation">("statement");
  const [isExplanationExpanded, setIsExplanationExpanded] = useState(true);

  const problem = question.problem_statement;
  const ai = question.ai_response;

  return (
    <div className="flex flex-col h-full bg-[#121416] border-4 border-white text-white font-['Hanken_Grotesk']">
      {/* Top Tab Bar */}
      <div className="flex items-center justify-between border-b-4 border-white bg-[#121416] px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("statement")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 text-xs font-black uppercase transition-none cursor-pointer border-2",
              activeTab === "statement"
                ? "bg-white text-black border-white"
                : "border-transparent text-zinc-300 hover:bg-white hover:text-black hover:border-white"
            )}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>SPECIFICATION</span>
          </button>

          <button
            onClick={() => setActiveTab("explanation")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 text-xs font-black uppercase transition-none cursor-pointer border-2",
              activeTab === "explanation"
                ? "bg-white text-black border-white"
                : "border-transparent text-zinc-300 hover:bg-white hover:text-black hover:border-white"
            )}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI COMMENTARY</span>
          </button>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 border border-white">
            {question.topic.replace("_", " ")}
          </span>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-white text-black border border-white">
            {question.difficulty}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-zinc-200">
        {activeTab === "statement" ? (
          <>
            {/* Title & Description */}
            <div className="space-y-3">
              <h1 className="text-2xl font-black uppercase tracking-tight text-white">
                {question.title}
              </h1>
              <div className="whitespace-pre-wrap leading-relaxed text-zinc-300 text-xs sm:text-sm font-sans">
                {problem.description}
              </div>
            </div>

            {/* Examples */}
            {problem.examples && problem.examples.length > 0 && (
              <div className="space-y-4 pt-2">
                <span className="text-xs font-black uppercase tracking-widest text-white block border-b-2 border-white pb-1 font-mono">
                  EXAMPLE TEST CASES
                </span>
                {problem.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-4 border-2 border-white bg-[#0a0b0d] text-xs font-mono space-y-2"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-zinc-500 font-bold uppercase w-16 shrink-0">Input:</span>
                      <span className="text-white select-all font-bold">{ex.input}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-zinc-500 font-bold uppercase w-16 shrink-0">Output:</span>
                      <span className="text-white select-all font-bold">{ex.output}</span>
                    </div>
                    {ex.explanation && (
                      <div className="text-zinc-400 font-sans text-xs pt-2 border-t border-zinc-800">
                        <strong className="text-white font-mono uppercase text-[10px]">Note: </strong>
                        {ex.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Constraints */}
            {problem.constraints && problem.constraints.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-black uppercase tracking-widest text-white block border-b-2 border-white pb-1 font-mono">
                  CONSTRAINTS & INVARIANTS
                </span>
                <div className="p-4 border-2 border-white bg-[#0a0b0d]">
                  <ul className="list-disc list-inside space-y-1.5 text-xs text-zinc-300 pl-1 font-mono">
                    {problem.constraints.map((c, idx) => (
                      <li key={idx}>
                        <span className="text-white">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </>
        ) : (
          /* AI Explanation Tab */
          <div className="space-y-6">
            <div className="p-6 border-4 border-white bg-[#0a0b0d] space-y-4">
              <div className="flex items-center justify-between border-b-2 border-white pb-2">
                <span className="text-xs font-black uppercase tracking-widest text-white">
                  AI NATURAL LANGUAGE COMMENTARY
                </span>
                <button
                  onClick={() => setIsExplanationExpanded(!isExplanationExpanded)}
                  className="text-zinc-400 hover:text-white p-1 cursor-pointer"
                >
                  {isExplanationExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              {isExplanationExpanded && (
                <div className="text-xs text-zinc-200 leading-relaxed font-sans p-4 border border-zinc-700 bg-[#121416]">
                  {ai.stated_explanation}
                </div>
              )}
            </div>

            {/* AI Claimed Complexities */}
            <div className="grid grid-cols-2 gap-4 font-mono">
              <div className="p-4 border-2 border-white bg-[#0a0b0d] flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-zinc-400">
                  AI CLAIMED TIME
                </span>
                <span className="text-lg font-black text-white">
                  {ai.stated_time_complexity}
                </span>
              </div>

              <div className="p-4 border-2 border-white bg-[#0a0b0d] flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-zinc-400">
                  AI CLAIMED SPACE
                </span>
                <span className="text-lg font-black text-white">
                  {ai.stated_space_complexity}
                </span>
              </div>
            </div>

            <div className="p-4 border-2 border-white bg-white text-black text-xs font-mono leading-relaxed">
              <strong>AUDITING DIRECTIVE:</strong> Read the commentary skeptically. AI models frequently describe algorithms they did not actually implement in the code.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
