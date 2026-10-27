"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bookmark, Check, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { SEED_QUESTIONS } from "@/data/seed-questions";
import type { QuestionItem, QuestionLanguage } from "@/types/question";
import { getBookmarks, toggleBookmark, getStoredSubmissions, getStoredAttempts, getCustomQuestions } from "@/lib/storage";
import { getAvailableLanguages, getLanguageLabel } from "@/lib/language-utils";
import { reviewTitle } from "@/lib/review-presentation";
import { AddQuestionModal } from "@/components/practice/AddQuestionModal";
import { GeminiApiKeyModal } from "@/components/practice/GeminiApiKeyModal";

const STARTER_IDS = ["q_ll_001", "q_slide_001", "q_dp_001", "q_mut_001", "q_expl_001"];
export default function PracticeCatalogPage() {
  const [questions, setQuestions] = useState<QuestionItem[]>(SEED_QUESTIONS);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [reviews, setReviews] = useState<ReturnType<typeof getStoredSubmissions>>({});
  const [attempts, setAttempts] = useState<ReturnType<typeof getStoredAttempts>>({});
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [language, setLanguage] = useState("all");
  const [status, setStatus] = useState("all");
  const [starters, setStarters] = useState(false);
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [keyOpen, setKeyOpen] = useState(false);
  useEffect(() => {
    setQuestions([...getCustomQuestions(), ...SEED_QUESTIONS]); setBookmarks(getBookmarks());
    setReviews(getStoredSubmissions()); setAttempts(getStoredAttempts());
  }, []);
  useEffect(() => setPage(1), [search, topic, difficulty, language, status, starters]);
  const topics = useMemo(() => [...new Set(questions.map(question => question.topic))].sort(), [questions]);
  const languages = useMemo(() => [...new Set(questions.flatMap(getAvailableLanguages))], [questions]);
  const filtered = questions.filter(question => {
    const title = reviewTitle(question).toLowerCase();
    return (title.includes(search.toLowerCase()) || question.problem_statement.description.toLowerCase().includes(search.toLowerCase())) && (topic === "all" || question.topic === topic) &&
      (difficulty === "all" || question.difficulty === difficulty) && (language === "all" || getAvailableLanguages(question).includes(language as QuestionLanguage)) &&
      (status === "all" || (status === "reviewed" && !!reviews[question.id]) || (status === "attempted" && !!attempts[question.id]) || (status === "saved" && bookmarks.includes(question.id))) &&
      (!starters || STARTER_IDS.includes(question.id));
  });
  const pageSize = 10;
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  function clearFilters() { setSearch(""); setTopic("all"); setDifficulty("all"); setLanguage("all"); setStatus("all"); setStarters(false); }
  return <div className="page-shell">
    <div className="flex flex-wrap items-start justify-between gap-5">
      <div><h1 className="page-heading">Code review practice</h1><p className="page-description">Read an implementation. Make a judgment. Learn what you missed.</p></div>
      <details className="relative"><summary className="btn-secondary cursor-pointer list-none">Practice tools</summary>
        <div className="absolute right-0 z-20 mt-2 w-60 rounded-lg border border-neutral-700 bg-[#1c2129] p-2 text-sm shadow-xl">
          <button className="min-h-11 w-full rounded px-3 text-left hover:bg-white/5" onClick={() => setAddOpen(true)}>Add a question with AI</button>
          <button className="min-h-11 w-full rounded px-3 text-left hover:bg-white/5" onClick={() => setKeyOpen(true)}>AI assistant settings</button>
          <Link className="flex min-h-11 items-center rounded px-3 hover:bg-white/5" href="/assessment">Take a timed mock</Link>
        </div>
      </details>
    </div>
    {Object.keys(reviews).length === 0 && <div className="my-7 flex flex-wrap items-center justify-between gap-4 border-y border-neutral-800 py-5">
      <div><h2 className="font-medium">Start with a short review</h2><p className="mt-1 text-sm text-neutral-400">Try reversing a linked list. No account or API key needed.</p></div>
      <Link className="btn-primary" href="/practice/q_ll_001">Start your first review<ArrowRight size={16} /></Link>
    </div>}
    <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
      <div className="flex flex-wrap gap-1" aria-label="Question status">{[["all", "All questions"], ["reviewed", "Reviewed"], ["attempted", "Solved"], ["saved", "Saved"]].map(([key, label]) => <button key={key} aria-pressed={status === key} onClick={() => setStatus(key)} className={`min-h-10 rounded-md px-3 text-sm ${status === key ? "bg-neutral-700/50 text-white" : "text-neutral-400 hover:text-white"}`}>{label}</button>)}</div>
      <label className="flex min-h-10 cursor-pointer items-center gap-2 text-sm text-neutral-300"><input type="checkbox" checked={starters} onChange={event => setStarters(event.target.checked)} />Starter set</label>
    </div>
    <div className="grid grid-cols-2 gap-3 py-5 lg:grid-cols-[2fr_1fr_1fr_1fr]">
      <label className="relative col-span-2 lg:col-span-1"><span className="sr-only">Search questions</span><Search size={16} className="pointer-events-none absolute left-3 top-3.5 text-neutral-400" /><input className="field pl-10" placeholder="Search questions…" value={search} onChange={event => setSearch(event.target.value)} /></label>
      <label><span className="sr-only">Topic</span><select className="field" value={topic} onChange={event => setTopic(event.target.value)}><option value="all">All topics</option>{topics.map(value => <option key={value} value={value}>{value.replaceAll("_", " ")}</option>)}</select></label>
      <label><span className="sr-only">Difficulty</span><select className="field" value={difficulty} onChange={event => setDifficulty(event.target.value)}><option value="all">All difficulties</option>{["easy", "medium", "hard"].map(value => <option key={value} value={value}>{value[0].toUpperCase() + value.slice(1)}</option>)}</select></label>
      <label><span className="sr-only">Language</span><select className="field" value={language} onChange={event => setLanguage(event.target.value)}><option value="all">All languages</option>{languages.map(value => <option key={value} value={value}>{getLanguageLabel(value)}</option>)}</select></label>
    </div>
    <p className="mb-3 text-xs text-neutral-400" role="status">{filtered.length} of {questions.length} questions · Answers are revealed after your review.</p>
    <div className="divide-y divide-neutral-800 border-y border-neutral-800">
      {visible.map(question => <article key={question.id} className="group flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1"><div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-neutral-400"><span className="capitalize">{question.difficulty}</span><span>{question.topic.replaceAll("_", " ")}</span>{reviews[question.id] && <span className="inline-flex items-center gap-1 text-emerald-300"><Check size={12} />Reviewed</span>}</div>
          <h2 className="text-base font-medium text-neutral-100"><Link href={`/practice/${question.id}`} className="hover:text-emerald-200">{reviewTitle(question)}</Link></h2>
          <p className="mt-2 text-xs text-neutral-400">{getAvailableLanguages(question).map(getLanguageLabel).join(" · ")}</p>
        </div>
        <div className="flex items-center gap-2"><button className="icon-button" aria-label={`${bookmarks.includes(question.id) ? "Unsave" : "Save"} ${reviewTitle(question)}`} aria-pressed={bookmarks.includes(question.id)} onClick={() => setBookmarks(toggleBookmark(question.id))}><Bookmark size={17} fill={bookmarks.includes(question.id) ? "currentColor" : "none"} /></button>
          <Link className="px-3 py-2 text-sm text-neutral-400 hover:text-white" href={`/practice/${question.id}?mode=attempt`}>Solve</Link>
          <Link className="btn-secondary" href={`/practice/${question.id}`}>{reviews[question.id] ? "View review" : "Review"}<ArrowRight size={15} /></Link></div>
      </article>)}
      {!visible.length && <div className="py-16 text-center"><h2 className="text-xl">No matching questions</h2><p className="mt-2 text-sm text-neutral-400">Try another topic or clear your filters.</p><button className="btn-secondary mt-5" onClick={clearFilters}>Clear filters</button></div>}
    </div>
    <div className="mt-6 flex items-center justify-between text-sm"><span className="text-neutral-400">Page {currentPage} of {pages}</span><div className="flex gap-2"><button className="btn-secondary" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage(value => value - 1)}><ChevronLeft size={16} />Previous</button><button className="btn-secondary" aria-label="Next page" disabled={currentPage === pages} onClick={() => setPage(value => value + 1)}>Next<ChevronRight size={16} /></button></div></div>
    <AddQuestionModal isOpen={addOpen} onClose={() => setAddOpen(false)} onQuestionAdded={question => { setQuestions(value => [question, ...value]); setPage(1); }} />
    <GeminiApiKeyModal isOpen={keyOpen} onClose={() => setKeyOpen(false)} />
  </div>;
}
