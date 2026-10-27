"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Play } from "lucide-react";
import type { CompanyProfile, OAPhase, OAProblem, OAQuestionState } from "@/types/oa";
import { Dialog } from "@/components/ui/Dialog";
interface OANavbarProps {
  companyProfile: CompanyProfile; trackTitle: string; problems: OAProblem[]; weights: Record<string, number>;
  questionsState: Record<string, OAQuestionState>; activeProblemId: string; onSelectProblem: (id: string) => void;
  timeRemainingSeconds: number; currentPhase: OAPhase; onOpenDrawer: () => void; onOpenSubmitModal: () => void;
  onRunTests?: () => void; isRunningTests?: boolean; isSubmitting?: boolean;
}
export function OANavbar(props: OANavbarProps) {
  const [exit, setExit] = useState(false);
  const seconds = props.timeRemainingSeconds;
  const formatted = `${Math.floor(seconds / 3600).toString().padStart(2, "0")}:${Math.floor(seconds % 3600 / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
  return <header className="z-40 shrink-0 border-b border-neutral-800 bg-[#0c0e12] px-3 py-2 sm:px-5">
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
      <div className="flex min-w-0 items-center gap-2"><button className="icon-button" aria-label="Leave assessment" onClick={() => setExit(true)}><ArrowLeft size={18} /></button><span className="max-w-[190px] truncate text-sm font-medium sm:max-w-md">{props.trackTitle}</span></div>
      <div className="flex items-center gap-2"><span className={`font-mono text-xs tabular-nums sm:text-sm ${seconds <= 900 ? "text-amber-200" : "text-neutral-300"}`} aria-label={`${formatted} remaining`}>{formatted}</span>
        {props.currentPhase === "workspace" && props.onRunTests && <button className="btn-secondary !min-h-10 !px-3" aria-label={props.isRunningTests ? "Running tests" : "Run tests"} disabled={props.isRunningTests} onClick={props.onRunTests}><Play size={14} />{props.isRunningTests ? "Running…" : "Run"}</button>}
        <button className="btn-primary !min-h-10 !px-3" disabled={props.isSubmitting} onClick={props.onOpenSubmitModal}>Finish</button>
      </div>
    </div>
    <div className="mt-1 flex items-center gap-3"><label className="min-w-0 flex-1"><span className="sr-only">Active problem</span><select className="field !min-h-10 !py-2" value={props.activeProblemId} disabled={props.currentPhase !== "workspace"} onChange={event => props.onSelectProblem(event.target.value)}>{props.problems.map((problem, index) => <option key={problem.id} value={problem.id}>Question {index + 1}: {problem.title}{props.questionsState[problem.id]?.status === "TESTS_PASSING" ? " — tests passing" : ""}</option>)}</select></label><button className="min-h-10 shrink-0 px-2 text-xs text-neutral-400 hover:text-white" onClick={props.onOpenDrawer}>Overview</button></div>
    {exit && <Dialog label="Leave coding assessment" onClose={() => setExit(false)}><div className="space-y-5 p-6"><h2 className="text-xl font-semibold">Leave this assessment?</h2><p className="text-sm leading-7 text-neutral-400">Your work is saved periodically in this browser. The assessment clock continues based on when you started.</p><div className="flex flex-wrap justify-end gap-3"><button className="btn-secondary" onClick={() => setExit(false)}>Keep working</button><Link className="btn-primary" href="/oa">Leave assessment</Link></div></div></Dialog>}
  </header>;
}
