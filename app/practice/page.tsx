"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SEED_QUESTIONS } from "@/data/seed-questions";
import { getStoredSubmissions, getBookmarks, toggleBookmark } from "@/lib/storage";
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
  Filter,
} from "lucide-react";

export default function PracticeCatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedDefect, setSelectedDefect] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 6;

  const [submissions, setSubmissions] = useState<Record<string, any>>({});
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    setSubmissions(getStoredSubmissions());
    setBookmarks(getBookmarks());
  }, []);

  // Reset page to 1 when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTopic, selectedLanguage, selectedDifficulty, selectedDefect]);

  const handleBookmarkToggle = (e: React.MouseEvent, qId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = toggleBookmark(qId);
    setBookmarks(updated);
  };

  // Filtered Questions
  const filteredQuestions = SEED_QUESTIONS.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.problem_statement.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTopic = selectedTopic === "all" || q.topic === selectedTopic;
    const matchesLanguage = selectedLanguage === "all" || q.language === selectedLanguage;
    const matchesDifficulty = selectedDifficulty === "all" || q.difficulty === selectedDifficulty;

    const qDefect = q.ground_truth.defect_type || q.ground_truth.error_categories[0];
    const matchesDefect = selectedDefect === "all" || qDefect === selectedDefect;

    return matchesSearch && matchesTopic && matchesLanguage && matchesDifficulty && matchesDefect;
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
    if (diff === "easy") return "text-emerald-600";
    if (diff === "medium") return "text-amber-600";
    return "text-rose-600";
  };

  return (
    <div className="min-h-screen bg-[#1a1b1e] text-white flex flex-col font-['Hanken_Grotesk'] antialiased">
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col space-y-6 sm:space-y-10 py-6 sm:py-10">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-4 sm:pb-6 border-b border-white/10">
          <div className="space-y-2 sm:space-y-3">

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none uppercase">
              PRACTICE REVIEW STUDIO <span className="text-gray-500 font-normal">({SEED_QUESTIONS.length})</span>
            </h1>

          </div>

          <div>
            <Link
              href="/assessment"
              className="w-full sm:w-auto neu-button-primary px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg font-bold text-xs sm:text-sm tracking-wide uppercase flex items-center justify-center space-x-2 group cursor-pointer"
            >
              <span>LAUNCH MOCK TEST</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </header>

        {/* Filters Section: Soft Beveled Neumorphic Convex */}
        <section className="neu-convex p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search Bar */}
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="SEARCH PROBLEMS, TOPICS, KEYWORDS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="neu-input w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-mono focus:ring-0 uppercase"
              />
            </div>

            {/* Dropdowns */}
            <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-4 shrink-0">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="neu-input py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-mono appearance-none uppercase text-white cursor-pointer"
              >
                {difficulties.map((d) => (
                  <option key={d.key} value={d.key} className="bg-[#1a1b1e] text-white">
                    {d.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="neu-input py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-mono appearance-none uppercase text-white cursor-pointer"
              >
                {languages.map((l) => (
                  <option key={l.key} value={l.key} className="bg-[#1a1b1e] text-white">
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Topic Tags - Touch scrollable on mobile */}
          <div className="flex flex-wrap sm:flex-wrap gap-2 pt-1 overflow-x-auto pb-1">
            {topics.map((t) => {
              const isSelected = selectedTopic === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setSelectedTopic(t.key)}
                  className={cn(
                    "neu-button px-3 py-1.5 rounded text-[11px] sm:text-xs font-mono uppercase transition-colors cursor-pointer shrink-0",
                    isSelected
                      ? "bg-white text-[#1a1b1e] font-bold"
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Results Status */}
        <div className="text-xs font-mono text-gray-400 uppercase tracking-widest flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span>
            SHOWING <span className="text-white font-bold">{Math.min(filteredQuestions.length, startIndex + 1)} - {Math.min(filteredQuestions.length, startIndex + ITEMS_PER_PAGE)}</span> OF <span className="text-white font-bold">{filteredQuestions.length}</span> (PAGE {currentPage} OF {totalPages})
          </span>
          {(selectedTopic !== "all" || selectedDifficulty !== "all" || selectedLanguage !== "all" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedTopic("all");
                setSelectedDifficulty("all");
                setSelectedLanguage("all");
                setSelectedDefect("all");
                setSearchQuery("");
              }}
              className="text-xs underline uppercase font-bold text-gray-300 hover:text-white cursor-pointer"
            >
              RESET FILTERS
            </button>
          )}
        </div>

        {/* Question Grid: 70/30 Neumorphic Internal Contrast Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {paginatedQuestions.map((q) => {
            const subData = submissions[q.id];
            const hasAttempted = !!subData;
            const score = subData?.result?.overall_score;
            const isBookmarked = bookmarks.includes(q.id);
            const defectMeta = getDefectMeta(q.ground_truth.defect_type || q.ground_truth.error_categories[0]);

            return (
              <article
                key={q.id}
                className="neu-convex-white flex flex-col p-5 sm:p-6 h-full border border-black/5 relative group rounded-xl"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="neu-badge-light px-2 py-0.5 rounded-sm text-[10px] font-mono text-gray-700 uppercase font-bold">
                      {q.topic.replace("_", " ")}
                    </span>
                    {getAvailableLanguages(q).map((lang) => (
                      <span key={lang} className="neu-badge-light px-2 py-0.5 rounded-sm text-[10px] font-mono text-gray-700 uppercase font-bold">
                        {getLanguageLabel(lang)}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className={cn("text-xs font-black uppercase tracking-wider", getDifficultyColor(q.difficulty))}>
                      {q.difficulty}
                    </span>
                    <button
                      onClick={(e) => handleBookmarkToggle(e, q.id)}
                      aria-label="Bookmark"
                      className="text-gray-400 hover:text-gray-800 transition-colors p-1 cursor-pointer"
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-5 h-5 fill-gray-900 text-gray-900" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight mb-2.5 leading-snug text-gray-900">
                  {q.title}
                </h2>

                <div className="mb-3">
                  <span className="inline-block border border-gray-400 px-2 py-0.5 rounded-sm text-[10px] font-mono text-gray-700 uppercase tracking-widest font-bold">
                    {defectMeta.label}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans flex-grow">
                  {q.problem_statement.description}
                </p>

                <div className="mt-6 pt-3.5 border-t border-black/10 flex justify-between items-center">
                  <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest font-bold">
                    {hasAttempted ? `AUDITED: ${(score * 10).toFixed(0)}%` : "NOT YET AUDITED"}
                  </span>
                  <Link
                    href={`/practice/${q.id}`}
                    className="neu-button-light px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 hover:bg-gray-900 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>{hasAttempted ? "RE-AUDIT" : "AUDIT"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </section>

        {/* Pagination Section: Neumorphic Dark Bar */}
        {totalPages > 1 && (
          <section className="neu-convex p-3 sm:p-4 mt-6 sm:mt-8 flex justify-between items-center rounded-xl">
            <button
              onClick={() => {
                setCurrentPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={currentPage === 1}
              className="neu-button px-3 sm:px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">PREVIOUS</span>
            </button>

            <div className="flex space-x-1.5 sm:space-x-2 font-mono text-xs sm:text-sm">
              {getPageNumbers().map((page, idx) => {
                if (page === "...") {
                  return (
                    <span key={`ellipsis-${idx}`} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-500 font-bold">
                      ...
                    </span>
                  );
                }
                const isCurrent = currentPage === page;
                return (
                  <button
                    key={`page-${page}`}
                    onClick={() => {
                      setCurrentPage(page as number);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={cn(
                      "neu-button w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center cursor-pointer transition-colors text-xs sm:text-sm",
                      isCurrent
                        ? "bg-white text-[#1a1b1e] font-bold shadow-md"
                        : "text-gray-400 hover:text-white"
                    )}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                setCurrentPage((p) => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={currentPage === totalPages}
              className="neu-button px-3 sm:px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="hidden sm:inline">NEXT</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
