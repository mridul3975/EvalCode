"use client";
import { useState } from "react";
import type { QuestionLanguage } from "@/types/question";
import { getLanguageLabel } from "@/lib/language-utils";
import { blindCode } from "@/lib/review-presentation";
import { Copy, Check } from "lucide-react";

function highlight(line: string) {
  return line.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b(?:def|class|return|if|else|elif|for|while|in|import|from|as|with|try|except|raise|function|const|let|var|new|throw|public|private|static|void|int|boolean|null|None|True|False|true|false|break|continue|and|or|not)\b|\b\d+\b|#.*$|\/\/.*$)/g).map((part, i) => <span key={i} className={
    /^['"]/.test(part) ? "text-amber-200" : /^(#|\/\/)/.test(part) ? "text-slate-400" : /^\d/.test(part) ? "text-sky-200" : /^(def|class|return|if|else|elif|for|while|in|import|from|as|with|try|except|raise|function|const|let|var|new|throw|public|private|static|void|int|boolean|null|None|True|False|true|false|break|continue|and|or|not)$/.test(part) ? "text-violet-300" : ""}>{part}</span>);
}
export function CodeViewer({ code, language = "Python", onSelectLine, availableLanguages = [], selectedLanguage, onLanguageChange }: {
  code: string; language?: string; onSelectLine?: (line: number) => void; availableLanguages?: QuestionLanguage[];
  selectedLanguage?: QuestionLanguage; onLanguageChange?: (language: QuestionLanguage) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const [cited, setCited] = useState<number | null>(null);
  const visibleCode = blindCode(code);
  const lines = visibleCode.replace(/\n$/, "").split("\n");
  return <section className="surface min-w-0 overflow-hidden" aria-label="Implementation to review">
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 px-4 py-3">
      <h3 className="text-sm font-medium">Implementation</h3>
      <div className="flex items-center gap-2">
        {availableLanguages.length > 1 && onLanguageChange ? <label><span className="sr-only">Code language</span><select className="rounded-md border border-neutral-700 bg-[#1c2129] px-2 py-2 text-xs" value={selectedLanguage} onChange={event => onLanguageChange(event.target.value as QuestionLanguage)}>{availableLanguages.map(lang => <option key={lang} value={lang}>{getLanguageLabel(lang)}</option>)}</select></label> : <span className="text-xs text-neutral-400">{language}</span>}
        <button type="button" className="inline-flex min-h-10 items-center gap-1.5 rounded-md px-2 text-xs text-neutral-300 hover:bg-white/5" onClick={async () => {
          try { await navigator.clipboard.writeText(visibleCode); setCopied(true); setCopyError(""); setTimeout(() => setCopied(false), 1800); }
          catch { setCopyError("Copy unavailable. Select the code to copy it."); }
        }}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "Copied" : "Copy"}</button>
      </div>
    </div>
    {onSelectLine && <p className="border-b border-neutral-800 px-4 py-2 text-xs text-neutral-400" role="status">{cited ? `Line ${cited} added to your findings.` : "Select a line number to cite it in your findings."}</p>}
    {copyError && <p role="status" className="px-4 py-2 text-xs text-amber-200">{copyError}</p>}
    <div className="max-h-[65vh] overflow-auto bg-[#0e1117] py-4 font-mono text-[13px] leading-6 sm:text-sm" tabIndex={0} aria-label="Scrollable source code">
      {lines.map((line, index) => <div key={index} className="flex min-w-max hover:bg-white/[.035]">
        {onSelectLine ? <button type="button" aria-label={`Cite line ${index + 1}`} className="w-12 shrink-0 text-right pr-4 text-xs text-neutral-400 hover:text-emerald-200" onClick={() => { setCited(index + 1); onSelectLine(index + 1); }}>{index + 1}</button> : <span className="w-12 shrink-0 pr-4 text-right text-xs text-neutral-500">{index + 1}</span>}
        <code className="whitespace-pre pr-5 text-slate-200">{highlight(line || " ")}</code>
      </div>)}
    </div>
  </section>;
}
