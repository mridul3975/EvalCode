"use client";

import React from "react";
import { formatTime, cn } from "@/lib/utils";
import { Flag, Send, Timer } from "lucide-react";

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
    <div className="w-full bg-[#16181a] border-b border-[rgba(255,255,255,0.06)] px-4 sm:px-8 py-3.5 sticky top-14 z-40 text-white font-mono shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
      <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Assessment Mode Label & Question Nav Pills */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00ffc2] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-white font-['Hanken_Grotesk']">
              Mock Exam Session
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
                    "w-9 h-8 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer flex items-center justify-center",
                    isCurrent
                      ? "bg-[#00ffc2] text-[#002116] shadow-[0_2px_10px_rgba(0,255,194,0.35)] font-black scale-105"
                      : isAnswered
                      ? "bg-[#282a2c] text-[#00ffc2] border border-[#00ffc2]/30"
                      : "obsidian-inset text-[#b9cbc1] hover:text-white hover:border-[rgba(255,255,255,0.1)]"
                  )}
                >
                  Q{idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Flag, Timer, Finish CTA */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Flag button */}
          <button
            onClick={() => onToggleFlag(currentQuestionId)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer",
              isCurrentFlagged
                ? "bg-[#ffe149]/20 text-[#ffe149] border border-[#ffe149]/40"
                : "obsidian-inset text-[#b9cbc1] hover:text-white"
            )}
          >
            <Flag className={cn("w-3.5 h-3.5", isCurrentFlagged && "fill-[#ffe149]")} />
            <span>{isCurrentFlagged ? "FLAGGED" : "FLAG"}</span>
          </button>

          {/* Live Countdown Timer */}
          <div
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase font-mono shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6)]",
              isCritical
                ? "bg-[#a90219] text-[#ffdad6] animate-pulse"
                : isUrgent
                ? "bg-[#ffe149]/20 text-[#ffe149] border border-[#ffe149]/30"
                : "bg-[#121416] text-[#00ffc2] border border-[rgba(255,255,255,0.06)]"
            )}
          >
            <Timer className="w-3.5 h-3.5" />
            <span className="text-sm font-bold">{formatTime(remainingSeconds)}</span>
          </div>

          {/* Finish Button */}
          <button
            onClick={onSubmitSession}
            className="obsidian-btn-primary px-5 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>FINISH EXAM</span>
          </button>
        </div>
      </div>
    </div>
  );
}
