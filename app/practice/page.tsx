"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SEED_QUESTIONS } from "@/data/seed-questions";
import { QuestionItem } from "@/types/question";
import { PracticeAttempt } from "@/types/submission";
import {
  getStoredSubmissions,
  getBookmarks,
  toggleBookmark,
  getCustomQuestions,
  getStoredAttempts,
} from "@/lib/storage";
import { AddQuestionModal } from "@/components/practice/AddQuestionModal";
import { getDefectMeta } from "@/lib/core/defect-pipeline";
import { getAvailableLanguages, getLanguageLabel } from "@/lib/language-utils";
import { cn } from "@/lib/utils";
import {
  Search,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Code2,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

export default function PracticeCatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedDefect, setSelectedDefect] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "attempted" | "audited" | "bookmarked">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const ITEMS_PER_PAGE = 6;

  const [submissions, setSubmissions] = useState<Record<string, any>>({});
  const [attempts, setAttempts] = useState<Record<string, PracticeAttempt>>({});
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [allQuestions, setAllQuestions] = useState<QuestionItem[]>(SEED_QUESTIONS);

  useEffect(() => {
    setSubmissions(getStoredSubmissions());
    setAttempts(getStoredAttempts());
    setBookmarks(getBookmarks());
    const custom = getCustomQuestions();
    if (custom.length > 0) {
      setAllQuestions([...custom, ...SEED_QUESTIONS]);
    }
  }, []);

  const handleQuestionAdded = (newQuestion: QuestionItem) => {
    setAllQuestions((prev) => [newQuestion, ...prev]);
    setCurrentPage(1);
  };

  // Reset page to 1 when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTopic, selectedLanguage, selectedDifficulty, selectedDefect, selectedStatus]);

  const handleBookmarkToggle = (e: React.MouseEvent, qId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = toggleBookmark(qId);
    setBookmarks(updated);
  };

  // Filtered Questions
  const filteredQuestions = allQuestions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.problem_statement.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTopic = selectedTopic === "all" || q.topic === selectedTopic;
    const matchesLanguage = selectedLanguage === "all" || q.language === selectedLanguage;
    const matchesDifficulty = selectedDifficulty === "all" || q.difficulty === selectedDifficulty;

    const qDefect = q.ground_truth.defect_type || q.ground_truth.error_categories[0];
    const matchesDefect = selectedDefect === "all" || qDefect === selectedDefect;

    let matchesStatus = true;
    if (selectedStatus === "audited") {
      matchesStatus = Boolean(submissions[q.id]);
    } else if (selectedStatus === "attempted") {
      matchesStatus = Boolean(attempts[q.id]);
    } else if (selectedStatus === "bookmarked") {
      matchesStatus = bookmarks.includes(q.id);
    }

    return matchesSearch && matchesTopic && matchesLanguage && matchesDifficulty && matchesDefect && matchesStatus;
  });

  const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedQuestions = filteredQuestions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const topics = [
    { key: "all", label: "ALL" },
    { key: "linked_lists", label: "LINKED LISTS" },
    { key: "stacks_queues", label: "STACKS & QUEUES" },
    { key: "trees", label: "TREES & BST" },
    { key: "graphs", label: "GRAPHS" },
    { key: "backtracking", label: "BACKTRACKING" },
    { key: "heaps", label: "HEAPS & PQ" },
    { key: "intervals", label: "INTERVALS" },
    { key: "greedy", label: "GREEDY" },
    { key: "arrays", label: "ARRAYS" },
    { key: "strings", label: "STRINGS" },
    { key: "dp", label: "DYNAMIC PROG" },
  ];

  const languages = [
    { key: "all", label: "ALL LANGUAGES" },
    { key: "python", label: "PYTHON" },
    { key: "javascript", label: "JAVASCRIPT" },
    { key: "cpp", label: "C++" },
  ];

  const difficulties = [
    { key: "all", label: "ALL DIFFICULTIES" },
    { key: "easy", label: "EASY" },
    { key: "medium", label: "MEDIUM" },
    { key: "hard", label: "HARD" },
  ];

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const getDifficultyColor = (diff: string) => {
    if (diff === "easy") return "text-emerald-400";
    if (diff === "medium") return "text-amber-400";
    return "text-rose-400";
  };

  return (
    <div className="min-h-screen bg-[#0c0d10] text-white flex flex-col font-['Hanken_Grotesk'] antialiased">
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col space-y-6 sm:space-y-10 py-6 sm:py-10">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-4 sm:pb-6 border-b border-white/[0.06]">
          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none uppercase flex items-center gap-3 font-mono">
              <span>PRACTICE REVIEW STUDIO</span>
              <span className="text-neutral-500 font-normal text-2xl sm:text-4xl">({allQuestions.length})</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto neu-button px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide uppercase flex items-center justify-center space-x-2 text-white hover:text-white transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>+ ADD QUESTION VIA AI</span>
            </button>

            <Link
              href="/assessment"
              className="w-full sm:w-auto neu-button bg-white text-black hover:bg-neutral-200 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-black text-xs sm:text-sm tracking-wide uppercase flex items-center justify-center space-x-2 group cursor-pointer shadow-lg"
            >
              <span>LAUNCH MOCK TEST</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </header>

        {/* Filters Section */}
        <section className="neu-card p-5 sm:p-6 flex flex-col gap-4">
          {/* Status Segmented Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.04]">
            <div className="flex items-center gap-1 neu-inset p-1 rounded-xl text-xs font-mono">
              <button
                type="button"
                onClick={() => setSelectedStatus("all")}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-bold uppercase transition-all cursor-pointer",
                  selectedStatus === "all"
                    ? "neu-inset text-white font-black border border-white/10"
                    : "text-neutral-400 hover:text-white"
                )}
              >
                ALL ({allQuestions.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus("audited")}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer",
                  selectedStatus === "audited"
                    ? "neu-inset text-amber-400 font-black border border-amber-500/30"
                    : "text-neutral-400 hover:text-white"
                )}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>AUDITED ({Object.keys(submissions).length})</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus("attempted")}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer",
                  selectedStatus === "attempted"
                    ? "neu-inset text-emerald-400 font-black border border-emerald-500/30"
                    : "text-neutral-400 hover:text-white"
                )}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>ATTEMPTED ({Object.keys(attempts).length})</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus("bookmarked")}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer",
                  selectedStatus === "bookmarked"
                    ? "neu-inset text-sky-400 font-black border border-sky-500/30"
                    : "text-neutral-400 hover:text-white"
                )}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>SAVED ({bookmarks.length})</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search Bar */}
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="SEARCH PROBLEMS, TOPICS, KEYWORDS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="neu-inset w-full pl-10 pr-4 py-3 rounded-xl text-xs sm:text-sm font-mono text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/20 uppercase"
              />
            </div>

            {/* Dropdowns */}
            <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3 shrink-0">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="neu-button py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-mono appearance-none uppercase text-white cursor-pointer"
              >
                {difficulties.map((d) => (
                  <option key={d.key} value={d.key} className="bg-[#121316] text-white">
                    {d.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="neu-button py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-mono appearance-none uppercase text-white cursor-pointer"
              >
                {languages.map((l) => (
                  <option key={l.key} value={l.key} className="bg-[#121316] text-white">
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Topic Tags */}
          <div className="flex flex-wrap gap-2 pt-1 overflow-x-auto pb-1">
            {topics.map((t) => {
              const isSelected = selectedTopic === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setSelectedTopic(t.key)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all duration-200 cursor-pointer uppercase shrink-0",
                    isSelected
                      ? "neu-inset text-emerald-400 font-bold border border-emerald-500/30"
                      : "neu-button text-neutral-400 hover:text-white"
                  )}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Questions Grid */}
        <section className="space-y-6">
          {paginatedQuestions.length === 0 ? (
            <div className="neu-inset p-12 text-center rounded-2xl font-mono text-neutral-400 space-y-3">
              <p className="text-lg font-bold">NO BENCHMARK QUESTIONS FOUND MATCHING YOUR FILTERS.</p>
              <p className="text-xs text-neutral-500">Try clearing your search query or adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedQuestions.map((q) => {
                const isBookmarked = bookmarks.includes(q.id);
                const prevSub = submissions[q.id];
                const prevAttempt = attempts[q.id];
                const primaryDefect = q.ground_truth.defect_type || q.ground_truth.error_categories[0];
                const defectMeta = getDefectMeta(primaryDefect);
                const isCustom = q.id.startsWith("custom_");

                return (
                  <div
                    key={q.id}
                    className="neu-card group relative flex flex-col justify-between p-6 h-full transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Top Row: Meta Tags & Bookmarking */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 font-mono flex-wrap gap-y-1">
                          <span className={cn("text-xs font-black uppercase px-2 py-0.5 rounded-md neu-inset", getDifficultyColor(q.difficulty))}>
                            {q.difficulty}
                          </span>
                          <span className="text-neutral-600">•</span>
                          <span className="text-xs text-neutral-400 font-bold uppercase">
                            {q.topic.replace("_", " ")}
                          </span>
                          {isCustom && (
                            <span className="bg-purple-950/60 border border-purple-500/30 text-purple-400 text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold">
                              AI CREATED
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => handleBookmarkToggle(e, q.id)}
                          className="text-neutral-500 hover:text-white transition-colors p-1 cursor-pointer"
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="w-5 h-5 text-emerald-400 fill-emerald-400" />
                          ) : (
                            <Bookmark className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {/* Status Badges Row if attempted or audited */}
                      {(prevSub || prevAttempt) && (
                        <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono">
                          {prevSub && (
                            <span className="neu-active-pill text-amber-400 border-amber-500/30 px-2 py-0.5 font-bold uppercase flex items-center gap-1">
                              <ShieldAlert className="w-3 h-3" />
                              <span>Audited ({Math.round(prevSub.result.overall_score * 10)}%)</span>
                            </span>
                          )}
                          {prevAttempt && (
                            <span
                              className={cn(
                                "neu-active-pill px-2 py-0.5 font-bold uppercase flex items-center gap-1 border",
                                prevAttempt.isAllPassed
                                  ? "text-emerald-400 border-emerald-500/30"
                                  : "text-amber-400 border-amber-500/30"
                              )}
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Attempted ({prevAttempt.passedCount}/{prevAttempt.totalCount})</span>
                            </span>
                          )}
                        </div>
                      )}

                      {/* Question Title */}
                      <Link href={`/practice/${q.id}`} className="block group-hover:text-emerald-400 transition-colors">
                        <h3 className="text-lg sm:text-xl font-bold uppercase leading-snug tracking-tight text-white line-clamp-2 font-mono">
                          {q.title}
                        </h3>
                      </Link>

                      {/* Description Snippet */}
                      <p className="text-xs text-neutral-400 leading-relaxed font-sans line-clamp-3">
                        {q.problem_statement.description}
                      </p>
                    </div>

                    {/* Bottom Row: Defect Chip & Dual Action Buttons */}
                    <div className="pt-5 mt-6 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <span className="font-mono text-[10px] uppercase font-bold neu-inset text-neutral-300 px-2.5 py-1 shrink-0 w-fit">
                        {defectMeta.label}
                      </span>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Audit Mode Button */}
                        <Link
                          href={`/practice/${q.id}?mode=audit`}
                          className="neu-button px-3 py-2 text-xs font-mono font-bold uppercase rounded-lg flex items-center space-x-1.5 text-neutral-300 hover:text-white cursor-pointer"
                          title="Audit AI code for defects"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                          <span>{prevSub ? "RE-AUDIT" : "AUDIT"}</span>
                        </Link>

                        {/* Attempt Mode Button */}
                        <Link
                          href={`/practice/${q.id}?mode=attempt`}
                          className="neu-button-primary px-3.5 py-2 text-xs font-mono font-bold uppercase rounded-lg flex items-center space-x-1.5 text-emerald-300 border border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-950/60 cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                          title="Solve this problem from scratch"
                        >
                          <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{prevAttempt ? "RE-ATTEMPT" : "ATTEMPT"}</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="neu-card p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
              <div className="text-neutral-400">
                SHOWING <span className="text-white font-bold">{startIndex + 1}</span> TO{" "}
                <span className="text-white font-bold">
                  {Math.min(startIndex + ITEMS_PER_PAGE, filteredQuestions.length)}
                </span>{" "}
                OF <span className="text-white font-bold">{filteredQuestions.length}</span> BENCHMARKS
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="neu-button p-2 text-neutral-300 hover:text-white disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {getPageNumbers().map((page, idx) =>
                  typeof page === "number" ? (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        "w-8 h-8 rounded-lg font-bold flex items-center justify-center transition-all cursor-pointer font-mono text-xs",
                        currentPage === page
                          ? "neu-inset text-emerald-400 border border-emerald-500/30"
                          : "neu-button text-neutral-400 hover:text-white"
                      )}
                    >
                      {page}
                    </button>
                  ) : (
                    <span key={idx} className="px-2 text-neutral-600">
                      {page}
                    </span>
                  )
                )}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="neu-button p-2 text-neutral-300 hover:text-white disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* AI Question Generation Modal */}
      {isAddModalOpen && (
        <AddQuestionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onQuestionAdded={handleQuestionAdded}
        />
      )}
    </div>
  );
}
