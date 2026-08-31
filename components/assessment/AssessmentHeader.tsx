"use client";

import React, { useEffect, useState } from "react";
import { formatTime, cn } from "@/lib/utils";
import { Timer, AlertTriangle, Send, Flag, ShieldAlert } from "lucide-react";

export interface AssessmentHeaderProps {
  remainingSeconds: number;
  totalSeconds?: number;
  onTimeExpired: () => void;
  onSubmitSession: () => void;
  activeQuestionIndex: number;
  totalQuestions: number;
  flaggedQuestions: string[];
  answeredQuestionIds: string[];
  currentQuestionId: string;
  onSelectQuestion: (index: number) => void;
  onToggleFlag: (questionId: string) => void;
}

export function AssessmentHeader({
  remainingSeconds,
  onTimeExpired,
  onSubmitSession,
  activeQuestionIndex,
  totalQuestions,
  flaggedQuestions,
  answeredQuestionIds,
  currentQuestionId,
  onSelectQuestion,
  onToggleFlag,
}: AssessmentHeaderProps) {
  const isUrgent = remainingSeconds <= 300; // < 5 mins
  const isCritical = remainingSeconds <= 60; // < 1 min

  const isCurrentFlagged = flaggedQuestions.includes(currentQuestionId);

  return (
    <div className="w-full bg-zinc-950 border-b border-zinc-800/80 px-4 py-3 sticky top-14 z-40 backdrop-blur-md">
      <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Assessment Mode Label & Question Pills */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              Mock Assessment
            </span>
          </div>

          {/* Question Nav Pills */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalQuestions }).map((_, idx) => {
              const isCurrent = activeQuestionIndex === idx;
              const isAnswered = answeredQuestionIds.includes(`q_${idx}`);
              return (
                <button
                  key={idx}
                  onClick={() => onSelectQuestion(idx)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center border",
                    isCurrent
                      ? "bg-emerald-500 text-zinc-950 border-emerald-400 shadow-md scale-105"
                      : isAnswered
                      ? "bg-zinc-800 text-emerald-400 border-zinc-700"
                      : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
                  )}
                >
                  Q{idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Flag CTA, Timer, Submit CTA */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Flag button */}
          <button
            onClick={() => onToggleFlag(currentQuestionId)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer",
              isCurrentFlagged
                ? "bg-amber-500/10 text-amber-400 border-amber-500/40"
                : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200"
            )}
          >
            <Flag className={cn("w-3.5 h-3.5", isCurrentFlagged && "fill-amber-400")} />
            <span>{isCurrentFlagged ? "Flagged" : "Flag for Review"}</span>
          </button>

          {/* Live Countdown Timer */}
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-bold text-xs transition-colors",
              isCritical
                ? "bg-rose-950/50 border-rose-500 text-rose-400 animate-pulse"
                : isUrgent
                ? "bg-amber-950/40 border-amber-500/50 text-amber-300"
                : "bg-zinc-900 border-zinc-800 text-zinc-200"
            )}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>{formatTime(remainingSeconds)}</span>
          </div>

          {/* Submit Assessment CTA */}
          <button
            onClick={onSubmitSession}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Finish & Submit</span>
          </button>
        </div>
      </div>
    </div>
  );
}
