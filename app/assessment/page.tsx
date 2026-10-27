"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { SEED_QUESTIONS } from "@/data/seed-questions";
import { getActiveAssessmentSession, saveActiveAssessmentSession } from "@/lib/storage";
import type { AssessmentSession } from "@/types/submission";
import { Dialog } from "@/components/ui/Dialog";
export default function AssessmentPage() {
  const router = useRouter();
  const [active, setActive] = useState<AssessmentSession | null>(null);
  const [restart, setRestart] = useState(false);
  useEffect(() => setActive(getActiveAssessmentSession()), []);
  const inProgress = active && !active.is_completed;
  function start() {
    const ids = ["q_ll_001", "q_slide_001", "q_dp_001", "q_mut_001", "q_expl_001"].filter(id => SEED_QUESTIONS.some(question => question.id === id));
    saveActiveAssessmentSession({ id: `session_${Date.now()}`, start_time: Date.now(), duration_seconds: 3000, remaining_seconds: 3000,
      question_ids: ids, active_question_index: 0, flagged_questions: [], submissions: {}, is_completed: false });
    router.push("/assessment/session");
  }
  return <div className="page-shell"><div className="max-w-3xl"><h1 className="page-heading">A focused code-review mock</h1><p className="page-description">Five independent reviews. Fifty minutes. A chance to see how clearly you reason when time is limited.</p></div>
    <div className="mt-10 grid gap-10 border-y border-neutral-800 py-8 lg:grid-cols-[1.4fr_1fr]">
      <section><h2 className="text-xl font-semibold">What to expect</h2><ul className="mt-5 space-y-5 text-sm leading-7 text-neutral-400"><li><strong className="font-medium text-neutral-100">Read before judging.</strong> Each question includes a specification, code, and a supplied explanation. Correct implementations are possible.</li><li><strong className="font-medium text-neutral-100">Support your review.</strong> Choose a verdict, cite findings, and assess time and space complexity. Save each review before moving on.</li><li><strong className="font-medium text-neutral-100">Get feedback at the end.</strong> The report compares your saved judgments with reference findings. Unanswered questions score zero.</li></ul></section>
      <section className="border-t border-neutral-800 pt-7 lg:border-l lg:border-t-0 lg:pl-9 lg:pt-0"><Clock size={24} className="text-emerald-200" /><h2 className="mt-4 text-xl font-semibold">{inProgress ? "Pick up where you left off" : "Set aside 50 minutes"}</h2><p className="mt-3 text-sm leading-7 text-neutral-400">{inProgress ? `${Math.ceil(active.remaining_seconds / 60)} minutes remain in your saved mock.` : "The timer runs while the mock is open. Drafts and saved reviews stay in this browser; the mock submits when time runs out."}</p>
        {inProgress ? <Link href="/assessment/session" className="btn-primary mt-6">Resume mock<ArrowRight size={16} /></Link> : <button onClick={start} className="btn-primary mt-6">Start review mock<ArrowRight size={16} /></button>}
        {inProgress && <button className="mt-3 block min-h-10 text-xs text-neutral-400 hover:text-white" onClick={() => setRestart(true)}>Start a new mock instead</button>}
        <Link href="/practice" className="mt-4 block py-2 text-sm text-neutral-400 hover:text-white">Practice without a timer</Link>
      </section>
    </div>
    {restart && <Dialog label="Start a new mock" onClose={() => setRestart(false)}><div className="space-y-5 p-6"><h2 className="text-xl">Replace the active mock?</h2><p className="text-sm text-neutral-400">Your current mock will end without a score. Previously completed mocks stay in your history.</p><div className="flex flex-wrap justify-end gap-3"><button className="btn-secondary" onClick={() => setRestart(false)}>Keep current mock</button><button className="btn-primary" onClick={start}>Start a new mock</button></div></div></Dialog>}
  </div>;
}
