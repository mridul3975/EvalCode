"use client";

import React, { useState } from "react";
import { QuestionItem, QuestionLanguage } from "@/types/question";
import { getLanguageLabel } from "@/lib/language-utils";
import { cn } from "@/lib/utils";
import { BookOpen, Brain } from "lucide-react";

export function ProblemContextPane({
  question,
  selectedLanguage = "python",
}: {
  question: QuestionItem;
  selectedLanguage?: QuestionLanguage;
}) {
  const [activeTab, setActiveTab] = useState<"spec" | "commentary">("spec");

  const topicLabel = question.topic.replace("_", " ").toUpperCase();
  const diffColor =
    question.difficulty === "easy"
      ? "text-emerald-700 bg-emerald-50 border-emerald-300"
      : question.difficulty === "medium"
      ? "text-amber-700 bg-amber-50 border-amber-300"
      : "text-rose-700 bg-rose-50 border-rose-300";

  return (
    <div className="contrast-card rounded-xl p-6 sm:p-8 flex flex-col gap-6 font-['Hanken_Grotesk'] text-[#121416] h-full shadow-xl">
      {/* 70/30 Contrast Light Spec Header Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-300 pb-3">
        <div className="flex gap-4 font-mono text-xs font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setActiveTab("spec")}
            className={cn(
              "flex items-center gap-2 pb-2 transition-colors cursor-pointer border-b-2",
              activeTab === "spec"
                ? "border-[#121416] text-[#121416] font-black"
                : "border-transparent text-gray-500 hover:text-[#121416]"
            )}
          >
            <BookOpen className="w-4 h-4" />
            <span>SPECIFICATION</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("commentary")}
            className={cn(
              "flex items-center gap-2 pb-2 transition-colors cursor-pointer border-b-2",
              activeTab === "commentary"
                ? "border-[#121416] text-[#121416] font-black"
                : "border-transparent text-gray-500 hover:text-[#121416]"
            )}
          >
            <Brain className="w-4 h-4" />
            <span>AI COMMENTARY</span>
          </button>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="border border-gray-300 px-2.5 py-1 rounded-md uppercase font-bold text-gray-600 bg-gray-50">
            {topicLabel}
          </span>
          <span className={cn("border px-2.5 py-1 rounded-md uppercase font-bold", diffColor)}>
            {question.difficulty}
          </span>
        </div>
      </div>

      {activeTab === "spec" ? (
        <div className="space-y-6 flex-1">
          {/* Problem Title & Description */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#121416] mb-3">
              {question.title}
            </h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed font-sans font-medium">
              {question.problem_statement.description}
            </p>
          </div>

          {/* Example Test Cases */}
          {question.problem_statement.examples.length > 0 && (
            <div>
              <h3 className="text-xs font-mono font-bold text-gray-600 uppercase tracking-wider mb-2">
                EXAMPLE TEST CASES
              </h3>
              <div className="space-y-2">
                {question.problem_statement.examples.map((ex, i) => (
                  <div
                    key={i}
                    className="contrast-card-inset p-4 rounded-lg font-mono text-xs text-gray-800 space-y-1.5 border border-gray-200"
                  >
                    <div className="grid grid-cols-[80px_1fr] gap-2">
                      <span className="text-gray-500 font-bold">INPUT:</span>
                      <span className="font-semibold">{ex.input}</span>
                    </div>
                    <div className="grid grid-cols-[80px_1fr] gap-2">
                      <span className="text-gray-500 font-bold">OUTPUT:</span>
                      <span className="font-semibold text-gray-900">{ex.output}</span>
                    </div>
                    {ex.explanation && (
                      <div className="text-[11px] text-gray-600 font-sans italic pt-1 border-t border-gray-200 mt-1">
                        Note: {ex.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Constraints & Invariants */}
          {question.problem_statement.constraints.length > 0 && (
            <div>
              <h3 className="text-xs font-mono font-bold text-gray-600 uppercase tracking-wider mb-2">
                CONSTRAINTS &amp; INVARIANTS
              </h3>
              <div className="contrast-card-inset p-4 rounded-lg font-mono text-xs text-gray-800 border border-gray-200">
                <ul className="list-disc pl-4 space-y-1">
                  {question.problem_statement.constraints.map((c, idx) => (
                    <li key={idx} className="font-semibold">{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* AI Commentary Tab */
        <div className="space-y-4 flex-1 font-mono text-xs text-gray-800">
          <div className="contrast-card-inset p-4 rounded-lg space-y-2 border border-gray-200">
            <span className="text-xs font-bold text-gray-600 uppercase block">
              AI MODEL CLAIMED COMPLEXITY
            </span>
            <div className="grid grid-cols-2 gap-2 text-gray-900 font-bold">
              <div>Time: {question.ai_response.stated_time_complexity || "O(N)"}</div>
              <div>Space: {question.ai_response.stated_space_complexity || "O(1)"}</div>
            </div>
          </div>

          <div className="contrast-card-inset p-4 rounded-lg space-y-2 border border-gray-200">
            <span className="text-xs font-bold text-gray-600 uppercase block">
              AI MODEL NATURAL LANGUAGE EXPLANATION
            </span>
            <p className="text-sm font-sans text-gray-800 leading-relaxed">
              {question.ai_response.stated_explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
