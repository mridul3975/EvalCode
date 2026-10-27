"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { SEED_QUESTIONS } from "@/data/seed-questions";

const sample = ["def reverse_list(head):", "    prev, current = None, head", "    while current:", "        current.next = prev", "        prev = current", "        current = current.next", "    return prev"];
export default function LandingPage() {
  const [answer, setAnswer] = useState<"correct" | "issue" | null>(null);
  return <div className="page-shell !py-12 sm:!py-20">
    <section className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
      <div>
        <h1 className="max-w-xl text-5xl font-semibold leading-[1.08] tracking-[-.035em] sm:text-6xl">Read the code.<br /><span className="text-emerald-200">Trust your judgment.</span></h1>
        <p className="mt-6 max-w-lg text-lg leading-8 text-neutral-400">Practice the part of engineering that starts after code is written. Find subtle issues in AI-generated implementations and learn to explain why they matter.</p>
        <Link href="/practice/q_ll_001" className="btn-primary mt-8">Try your first review<ArrowRight size={17} /></Link>
        <p className="mt-4 text-sm text-neutral-400">No account or API key required.</p>
      </div>
      <div className="overflow-hidden rounded-xl border border-neutral-700 bg-[#13161c]">
        <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4"><span className="font-mono text-sm text-neutral-300">reverse_list.py</span><span className="text-xs text-neutral-400">Try a quick review</span></div>
        <div className="overflow-x-auto bg-[#0e1117] py-5 font-mono text-[13px] leading-7 sm:text-sm">
          {sample.map((line, index) => <div key={line} className={`flex min-w-max pr-5 ${answer && index === 3 ? "bg-amber-400/10" : ""}`}><span className="w-11 shrink-0 pr-4 text-right text-xs text-neutral-500">{index + 1}</span><code className={`whitespace-pre ${index === 0 || index === 2 || index === 6 ? "text-violet-200" : "text-slate-200"}`}>{line}</code></div>)}
        </div>
        <div className="space-y-4 p-5">
          {!answer ? <><p className="text-sm font-medium">Does this correctly reverse the list?</p><div className="grid grid-cols-2 gap-3"><button className="btn-secondary" onClick={() => setAnswer("correct")}>Looks correct</button><button className="btn-secondary" onClick={() => setAnswer("issue")}>There’s an issue</button></div></> : <div role="status" className="space-y-3"><p className="flex items-center gap-2 text-sm font-medium text-emerald-200"><Check size={16} />{answer === "issue" ? "Good catch. The next node is lost." : "Look again at line 4."}</p><p className="text-sm leading-6 text-neutral-300">Overwriting <code>current.next</code> loses the rest of the list. Save the next node before changing the pointer.</p><button className="inline-flex min-h-10 items-center gap-2 text-xs text-neutral-400 hover:text-white" onClick={() => setAnswer(null)}><RotateCcw size={13} />Try again</button></div>}
        </div>
      </div>
    </section>
    <section className="mt-20 grid gap-10 border-t border-neutral-800 pt-12 sm:mt-28 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
      <div><h2 className="max-w-sm text-3xl font-semibold">A useful review goes beyond “works for me.”</h2><p className="mt-4 max-w-md leading-7 text-neutral-400">Build a habit of checking the specification, tracing edge cases, and backing your findings with evidence.</p><Link href="/practice" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-emerald-200">Explore {SEED_QUESTIONS.length} practice questions<ArrowRight size={16} /></Link></div>
      <ol className="divide-y divide-neutral-800">{[
        ["Read independently", "Review the implementation and its explanation without seeing the reference findings."],
        ["Make your case", "Choose a verdict, cite code, and describe concrete inputs that support your judgment."],
        ["Compare and improve", "See what matched, what you missed, and where your findings need stronger evidence."],
      ].map(([title, detail], index) => <li key={title} className="flex gap-5 py-5 first:pt-0"><span className="pt-0.5 font-mono text-sm text-neutral-500">{index + 1}</span><div><h3 className="font-medium">{title}</h3><p className="mt-2 text-sm leading-7 text-neutral-400">{detail}</p></div></li>)}</ol>
    </section>
    <section className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-neutral-800 pt-8"><div><h2 className="text-xl font-semibold">Ready to practice under time pressure?</h2><p className="mt-2 text-sm text-neutral-400">Take a 50-minute review mock or a multi-problem coding assessment.</p></div><div className="flex flex-wrap gap-3"><Link className="btn-secondary" href="/assessment">Review mock</Link><Link className="btn-secondary" href="/oa">Coding assessments<ArrowRight size={16} /></Link></div></section>
  </div>;
}
