"use client";

import React, { useState } from "react";
import { QuestionItem, QuestionLanguage } from "@/types/question";
import { cn } from "@/lib/utils";
import { BookOpen, Brain } from "lucide-react";

export function ProblemContextPane({
  question,
}: {
  question: QuestionItem;
  selectedLanguage?: QuestionLanguage;
}) {
  const [activeTab, setActiveTab] = useState<"spec" | "commentary">("spec");

  const topicLabel = question.topic.replace("_", " ").toUpperCase();
  const diffColor =
    question.difficulty === "easy"
      ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
      : question.difficulty === "medium"
      ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
      : "text-rose-400 border-rose-500/30 bg-rose-500/10";

  return (
    <div className="neu-card p-6 flex flex-col gap-5 font-['Hanken_Grotesk'] text-neutral-200 select-text">
      {/* Header Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        <div className="flex gap-2 font-mono text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("spec")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer",
              activeTab === "spec"
                ? "neu-inset text-white font-bold border border-white/10"
                : "neu-button text-neutral-400 hover:text-white"
            )}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Specification</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("commentary")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer",
              activeTab === "commentary"
                ? "neu-inset text-white font-bold border border-white/10"
                : "neu-button text-neutral-400 hover:text-white"
            )}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>AI Commentary</span>
          </button>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="neu-inset px-2.5 py-1 rounded-md text-neutral-300">
            {topicLabel}
          </span>
          <span className={cn("px-2.5 py-1 rounded-md font-bold uppercase border", diffColor)}>
            {question.difficulty}
          </span>
        </div>
      </div>

      {activeTab === "spec" ? (
        <div className="space-y-5 flex-1 text-sm">
          {/* Problem Title & Description */}
          <div>
            <h2 className="text-xl font-bold text-white mb-2 font-mono">
              {question.title}
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed font-sans">
              {question.problem_statement.description}
            </p>
          </div>

          {/* Examples in Inset Wells */}
          {question.problem_statement.examples?.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold uppercase text-neutral-400 tracking-wider block">
                Examples
              </span>
              <div className="space-y-2.5 font-mono text-xs">
                {question.problem_statement.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="neu-inset p-4 space-y-2"
                  >
                    <div>
                      <span className="text-neutral-500 block text-[10px] font-bold">Input:</span>
                      <pre className="text-neutral-200 overflow-x-auto whitespace-pre-wrap">{ex.input}</pre>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px] font-bold">Output:</span>
                      <pre className="text-emerald-400 overflow-x-auto whitespace-pre-wrap">{ex.output}</pre>
                    </div>
                    {ex.explanation && (
                      <p className="text-neutral-400 font-sans text-xs pt-1 italic">
                        Note: {ex.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Constraints */}
          {question.problem_statement.constraints?.length > 0 && (
            <div className="space-y-2 pt-1 font-mono text-xs">
              <span className="font-bold uppercase text-neutral-400 tracking-wider block">
                Constraints & Invariants
              </span>
              <ul className="space-y-1.5 text-neutral-300 list-disc pl-4">
                {question.problem_statement.constraints.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 flex-1 text-sm font-sans">
          <div className="neu-inset p-4 space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-purple-400 block">
              AI-Generated Solution Summary
            </span>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {question.ai_response?.stated_explanation || "No AI explanation provided."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="neu-inset p-3.5">
              <span className="text-neutral-500 block text-[10px] font-bold">CLAIMED TIME:</span>
              <span className="font-bold text-white">{question.ai_response?.stated_time_complexity || "O(N)"}</span>
            </div>
            <div className="neu-inset p-3.5">
              <span className="text-neutral-500 block text-[10px] font-bold">CLAIMED SPACE:</span>
              <span className="font-bold text-white">{question.ai_response?.stated_space_complexity || "O(1)"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
