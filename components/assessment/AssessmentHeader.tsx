"use client";

import React from "react";
import { formatTime, cn } from "@/lib/utils";
import { Flag, Send } from "lucide-react";

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
  const isUrgent = remainingSeconds <= 300;
  const isCritical = remainingSeconds <= 60;
  const isCurrentFlagged = flaggedQuestions.includes(currentQuestionId);

  return (
    <div className="w-full bg-[#121416] border-b-4 border-white px-4 sm:px-8 py-3 sticky top-14 z-40 text-white font-mono">
      <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Assessment Mode Label & Question Pills */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-rose-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-white font-['Hanken_Grotesk']">
              TIMED ASSESSMENT
            </span>
          </div>

          {/* Question Nav Buttons */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalQuestions }).map((_, idx) => {
              const isCurrent = activeQuestionIndex === idx;
              const isAnswered = answeredQuestionIds.includes(`q_${idx}`);
              return (
                <button
                  key={idx}
                  onClick={() => onSelectQuestion(idx)}
                  className={cn(
                    "w-9 h-8 text-xs font-black uppercase transition-none cursor-pointer flex items-center justify-center border-2",
                    isCurrent
                      ? "bg-white text-black border-white"
                      : isAnswered
                      ? "bg-zinc-800 text-white border-zinc-600"
                      : "bg-[#0a0b0d] text-zinc-400 border-white hover:bg-white hover:text-black"
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
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase border-2 transition-none cursor-pointer",
              isCurrentFlagged
                ? "bg-amber-400 text-black border-amber-400 font-black"
                : "bg-[#0a0b0d] text-zinc-300 border-white hover:bg-white hover:text-black"
            )}
          >
            <Flag className={cn("w-3.5 h-3.5", isCurrentFlagged && "fill-current")} />
            <span>{isCurrentFlagged ? "FLAGGED" : "FLAG"}</span>
          </button>

          {/* Live Countdown Timer */}
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 border-2 text-xs font-black uppercase",
              isCritical
                ? "bg-rose-500 text-white border-rose-500 animate-pulse"
                : isUrgent
                ? "bg-amber-400 text-black border-amber-400"
                : "bg-white text-black border-white"
            )}
          >
            <span>REMAINING:</span>
            <span className="text-sm font-black">{formatTime(remainingSeconds)}</span>
          </div>

          {/* Final Submit Button */}
          <button
            onClick={onSubmitSession}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-black hover:bg-black hover:text-white font-black text-xs uppercase border-2 border-white transition-none cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>FINISH EXAM</span>
          </button>
        </div>
      </div>
    </div>
  );
}
