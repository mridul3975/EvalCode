"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { QuestionItem, QuestionLanguage } from "@/types/question";
import { reviewTitle } from "@/lib/review-presentation";

export function ProblemContextPane({ question }: { question: QuestionItem; selectedLanguage?: QuestionLanguage }) {
  const [tab, setTab] = useState<"spec" | "commentary">("spec");
  return <section className="surface min-w-0 overflow-hidden">
    <div className="flex gap-1 border-b border-neutral-800 px-4 py-2" aria-label="Problem context">
      {([['spec', 'Problem'], ['commentary', 'Supplied explanation']] as const).map(([key, label]) => <button type="button" key={key} aria-pressed={tab === key} onClick={() => setTab(key)} className={`min-h-10 rounded-md px-3 text-sm ${tab === key ? "bg-neutral-700/50 text-white" : "text-neutral-400 hover:text-white"}`}>{label}</button>)}
    </div>
    <div className="space-y-4 p-5">
      {tab === "spec" ? <>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-400"><span>{question.topic.replaceAll("_", " ")}</span><span className="capitalize">{question.difficulty}</span></div>
        <h2 className="text-xl font-semibold">{reviewTitle(question)}</h2>
        <div className="markdown"><ReactMarkdown remarkPlugins={[remarkGfm]}>{question.problem_statement.description}</ReactMarkdown></div>
        <details className="border-t border-neutral-800 pt-3"><summary className="cursor-pointer text-sm font-medium text-neutral-300">Examples and constraints</summary>
          <div className="mt-4 space-y-4">{question.problem_statement.examples.map((example, index) => <div key={index} className="space-y-2 text-xs">
            <p className="text-neutral-400">Example {index + 1}</p><pre className="overflow-x-auto whitespace-pre-wrap rounded-md bg-[#0e1117] p-3 text-neutral-200">{`Input: ${example.input}\nOutput: ${example.output}`}</pre>{example.explanation && <p className="text-sm text-neutral-400">{example.explanation}</p>}
          </div>)}<ul className="list-disc space-y-1 pl-4 text-sm text-neutral-400">{question.problem_statement.constraints.map((constraint, index) => <li key={index}>{constraint}</li>)}</ul></div>
        </details>
      </> : <>
        <h3 className="text-base font-medium">Check the explanation against the code</h3>
        <div className="markdown"><ReactMarkdown remarkPlugins={[remarkGfm]}>{question.ai_response.stated_explanation || "No explanation supplied."}</ReactMarkdown></div>
        <dl className="flex gap-8 border-t border-neutral-800 pt-3 text-sm"><div><dt className="text-neutral-400">Claimed time</dt><dd className="mt-1 font-mono">{question.ai_response.stated_time_complexity || "Not supplied"}</dd></div><div><dt className="text-neutral-400">Claimed space</dt><dd className="mt-1 font-mono">{question.ai_response.stated_space_complexity || "Not supplied"}</dd></div></dl>
      </>}
    </div>
  </section>;
}
