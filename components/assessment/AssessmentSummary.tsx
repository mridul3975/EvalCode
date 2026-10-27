"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { AssessmentSession } from "@/types/submission";
import { SEED_QUESTIONS } from "@/data/seed-questions";
import { reviewTitle } from "@/lib/review-presentation";
import { CodeDiffViewer } from "@/components/review-studio/CodeDiffViewer";

export function AssessmentSummary({ session }: { session: AssessmentSession }) {
  const results = session.results || {};
  const completed = Object.keys(results).length;
  const minutes = Math.max(0, Math.round((session.duration_seconds - session.remaining_seconds) / 60));
  return <div className="page-shell">
    <div className="flex flex-wrap items-start justify-between gap-5"><div><h1 className="page-heading">Mock review results</h1><p className="page-description">{completed} of {session.question_ids.length} reviews submitted · {minutes} minutes used</p></div><div className="text-right"><p className="text-sm text-neutral-400">Overall score</p><p className="stat-number mt-1 text-4xl font-semibold text-emerald-200">{(session.total_score || 0).toFixed(0)}%</p></div></div>
    <p className="mt-5 max-w-3xl text-sm leading-7 text-neutral-400">Use the findings below to identify what to practice. Unsubmitted questions contribute zero to this mock’s average.</p>
    <section className="mt-8 divide-y divide-neutral-800 border-y border-neutral-800">
      {session.question_ids.map((id, index) => {
        const question = SEED_QUESTIONS.find(value => value.id === id);
        const result = results[id];
        return <details key={id} className="py-5"><summary className="flex cursor-pointer list-none items-start justify-between gap-5"><div><h2 className="text-base font-medium"><span className="mr-3 font-mono text-sm text-neutral-500">{index + 1}.</span>{question ? reviewTitle(question) : id}</h2><p className="mt-2 text-xs text-neutral-400">{result ? (result.verdict_accuracy ? "Verdict matched the reference" : "Revisit your verdict") : "Not submitted"} · Expand for feedback</p></div><span className="font-mono text-base text-emerald-200">{result ? (result.overall_score * 10).toFixed(0) : "0"}%</span></summary>
          {result ? <div className="mt-6 space-y-5"><p className="max-w-3xl text-sm leading-7 text-neutral-300">{result.feedback_summary}</p><dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[["Correctness", result.dimensional_scores.correctness], ["Edge cases", result.dimensional_scores.edge_cases], ["Complexity", result.dimensional_scores.complexity], ["Explanation", result.dimensional_scores.explanation]].map(([label, value]) => <div key={label}><dt className="text-xs text-neutral-400">{label}</dt><dd className="mt-1 font-mono text-sm">{Number(value).toFixed(1)} / 10</dd></div>)}</dl>
            <ul className="space-y-3">{result.discrepancy_items.map(item => <li key={item.id} className="border-t border-neutral-800 pt-3"><span className={`text-xs font-medium ${item.status === "matched" ? "text-emerald-200" : "text-amber-200"}`}>{item.status === "matched" ? "Matched" : item.status === "missed" ? "Missed" : "Needs stronger evidence"}</span><p className="mt-1 text-sm leading-7 text-neutral-300">{item.explanation || item.ground_truth_item || item.user_finding}</p></li>)}</ul>
            {question && <CodeDiffViewer buggyCode={question.ai_response.code} correctedCode={question.ground_truth.corrected_code} language={question.language} />}
          </div> : <p className="mt-5 text-sm text-neutral-400">This review wasn’t saved before the mock finished. Try the question again in untimed practice.</p>}
        </details>;
      })}
    </section>
    <details className="mt-6"><summary className="cursor-pointer text-sm text-neutral-300">How the mock is scored</summary><p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-400">Each review compares your findings with a reference. Correctness contributes 30%, edge cases 25%, and complexity, explanation, and communication 15% each. The overall mock score averages all questions, including unanswered ones.</p></details>
    <div className="mt-9 flex flex-wrap gap-3"><Link className="btn-primary" href="/practice">Practice another review<ArrowRight size={16} /></Link><Link className="btn-secondary" href="/dashboard">View progress</Link><Link className="btn-secondary" href="/assessment">Start another mock</Link></div>
  </div>;
}
