"use client";
import Link from "next/link";
import { Flag, ArrowLeft, Check } from "lucide-react";
import { formatTime } from "@/lib/utils";
export interface AssessmentHeaderProps {
  remainingSeconds: number; totalSeconds?: number; onTimeExpired: () => void; onSubmitSession: () => void;
  activeQuestionIndex: number; totalQuestions: number; questionIds: string[]; flaggedQuestions: string[];
  answeredQuestionIds: string[]; currentQuestionId: string; onSelectQuestion: (index: number) => void;
  onToggleFlag: (questionId: string) => void;
}
export function AssessmentHeader(props: AssessmentHeaderProps) {
  const flagged = props.flaggedQuestions.includes(props.currentQuestionId);
  return <header className="border-b border-neutral-800 px-4 py-3 text-white sm:px-6">
    <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-x-4 gap-y-3">
      <div className="flex items-center gap-3"><Link className="icon-button -ml-2" href="/assessment" aria-label="Leave mock and resume later"><ArrowLeft size={18} /></Link><span className="hidden text-sm font-medium sm:inline">Review mock</span>
        <nav className="flex gap-1" aria-label="Mock questions">{props.questionIds.map((id, index) => <button key={id} onClick={() => props.onSelectQuestion(index)} aria-current={props.activeQuestionIndex === index ? "step" : undefined} aria-label={`Question ${index + 1}${props.answeredQuestionIds.includes(id) ? ", saved" : ""}${props.flaggedQuestions.includes(id) ? ", flagged" : ""}`}
          className={`flex h-10 min-w-8 items-center justify-center gap-1 rounded-md px-2 text-sm ${props.activeQuestionIndex === index ? "bg-emerald-200 text-emerald-950" : "text-neutral-300 hover:bg-white/5"}`}>{index + 1}{props.answeredQuestionIds.includes(id) && <Check size={11} />}</button>)}</nav></div>
      <div className="flex items-center gap-2"><button className="icon-button" aria-label={flagged ? "Unflag question" : "Flag question"} aria-pressed={flagged} onClick={() => props.onToggleFlag(props.currentQuestionId)}><Flag size={17} fill={flagged ? "currentColor" : "none"} /></button>
        <span className={`font-mono text-sm tabular-nums ${props.remainingSeconds <= 300 ? "text-amber-200" : "text-neutral-300"}`} aria-label={`${formatTime(props.remainingSeconds)} remaining`}>{formatTime(props.remainingSeconds)}</span>
        <button className="btn-primary !px-3" onClick={props.onSubmitSession}>Finish<span className="hidden sm:inline">mock</span></button></div>
    </div>
  </header>;
}
