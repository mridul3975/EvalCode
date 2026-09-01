"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SEED_QUESTIONS } from "@/data/seed-questions";
import { QuestionItem } from "@/types/question";
import { getStoredSubmissions, getStoredProfile, getBookmarks, toggleBookmark } from "@/lib/storage";
import { getAdaptiveRecommendation } from "@/lib/core/adaptive-selector";
import { getDefectMeta } from "@/lib/core/defect-pipeline";
import { getAvailableLanguages, getLanguageLabel } from "@/lib/language-utils";
import { cn } from "@/lib/utils";
import {
  Search,
  Filter,
  Code2,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Target,
  Layers,
} from "lucide-react";

export default function PracticeCatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedDefect, setSelectedDefect] = useState<string>("all");

  const [submissions, setSubmissions] = useState<Record<string, any>>({});
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    setSubmissions(getStoredSubmissions());
    setBookmarks(getBookmarks());
    setProfile(getStoredProfile());
  }, []);

  const handleBookmarkToggle = (e: React.MouseEvent, qId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = toggleBookmark(qId);
    setBookmarks(updated);
  };

  const adaptiveRec = profile ? getAdaptiveRecommendation(profile, SEED_QUESTIONS) : null;

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

  const topics = [
    { key: "all", label: "ALL TOPICS" },
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

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-8 space-y-8 font-['Hanken_Grotesk'] text-white">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b-4 border-white pb-8">
        <div>
          <div className="text-xs font-mono font-black uppercase tracking-widest px-3 py-1 bg-white text-black inline-block mb-3">
            BENCHMARK CATALOG
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight">
            PRACTICE REVIEW STUDIO ({SEED_QUESTIONS.length})
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 font-mono mt-2">
            AUDIT AI-GENERATED CODE SNIPPETS ACROSS CALIBRATED DEFECT CATEGORIES
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/assessment"
            className="px-6 py-3.5 bg-white text-black font-black uppercase text-sm border-2 border-white hover:bg-black hover:text-white transition-none"
          >
            LAUNCH MOCK TEST ➔
          </Link>
        </div>
      </div>



      {/* Filter Controls Bar */}
      <div className="p-6 border-4 border-white bg-[#121416] space-y-6">
        {/* Search & Selectors */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="SEARCH PROBLEMS, TOPICS, OR KEYWORDS (e.g., 'subsets', 'reverse', 'cycle')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121416] border-2 border-white pl-10 pr-4 py-2.5 text-xs font-mono uppercase text-white focus:outline-none focus:bg-white focus:text-black placeholder:text-zinc-500"
            />
          </div>

          {/* Difficulty & Language Dropdown */}
          <div className="flex items-center gap-3 w-full sm:w-auto font-mono">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-[#121416] border-2 border-white px-4 py-2.5 text-xs font-bold text-white focus:outline-none cursor-pointer uppercase"
            >
              {difficulties.map((d) => (
                <option key={d.key} value={d.key} className="bg-black text-white">
                  {d.label}
                </option>
              ))}
            </select>

            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-[#121416] border-2 border-white px-4 py-2.5 text-xs font-bold text-white focus:outline-none cursor-pointer uppercase"
            >
              {languages.map((l) => (
                <option key={l.key} value={l.key} className="bg-black text-white">
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Topic Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono">
          {topics.map((t) => {
            const isSelected = selectedTopic === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setSelectedTopic(t.key)}
                className={cn(
                  "px-3.5 py-1.5 text-xs font-bold uppercase transition-none cursor-pointer border-2 whitespace-nowrap",
                  isSelected
                    ? "bg-white text-black border-white"
                    : "bg-[#121416] text-zinc-300 border-white hover:bg-white hover:text-black"
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Showing count indicator */}
      <div className="flex items-center justify-between text-xs font-mono uppercase px-1">
        <span>SHOWING <strong>{filteredQuestions.length}</strong> OF <strong>{SEED_QUESTIONS.length}</strong> QUESTIONS</span>
        {(selectedTopic !== "all" || selectedDifficulty !== "all" || selectedLanguage !== "all" || searchQuery) && (
          <button
            onClick={() => {
              setSelectedTopic("all");
              setSelectedDifficulty("all");
              setSelectedLanguage("all");
              setSelectedDefect("all");
              setSearchQuery("");
            }}
            className="underline uppercase font-bold cursor-pointer hover:bg-white hover:text-black px-2 py-0.5"
          >
            RESET FILTERS
          </button>
        )}
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuestions.map((q) => {
          const subData = submissions[q.id];
          const hasAttempted = !!subData;
          const score = subData?.result?.overall_score;
          const isBookmarked = bookmarks.includes(q.id);
          const defectMeta = getDefectMeta(q.ground_truth.defect_type || q.ground_truth.error_categories[0]);

          return (
            <div
              key={q.id}
              className="p-6 border-4 border-white bg-[#121416] hover:bg-white hover:text-black transition-none flex flex-col justify-between space-y-6 group shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
            >
              {/* Header metadata */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b-2 border-current pb-3 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 border border-current">
                      {q.topic.replace("_", " ")}
                    </span>
                    <div className="flex items-center gap-1">
                      {getAvailableLanguages(q).map((lang) => (
                        <span key={lang} className="text-[10px] uppercase font-bold px-1.5 py-0.5 border border-current">
                          {getLanguageLabel(lang)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 border border-current">
                      {q.difficulty}
                    </span>
                    <button
                      onClick={(e) => handleBookmarkToggle(e, q.id)}
                      className="p-1 cursor-pointer"
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 fill-current" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-black uppercase tracking-tight">
                  {q.title}
                </h3>

                {/* Defect Taxonomy Badge */}
                <div>
                  <span className="text-[10px] font-bold uppercase px-2 py-1 bg-black text-white group-hover:bg-white group-hover:text-black border border-current font-mono">
                    {defectMeta.label}
                  </span>
                </div>

                {/* Snippet preview description */}
                <p className="text-xs text-zinc-300 group-hover:text-black line-clamp-3 leading-relaxed font-sans">
                  {q.problem_statement.description}
                </p>
              </div>

              {/* Card Footer with Status & Action */}
              <div className="pt-4 border-t-2 border-current flex items-center justify-between font-mono">
                <div>
                  {hasAttempted ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase">
                      <span>AUDITED:</span>
                      <span className="font-black underline">
                        {(score * 10).toFixed(0)}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold uppercase text-zinc-400 group-hover:text-black">
                      NOT YET AUDITED
                    </span>
                  )}
                </div>

                <Link
                  href={`/practice/${q.id}`}
                  className="px-4 py-2 bg-white text-black group-hover:bg-black group-hover:text-white font-black text-xs uppercase transition-none border-2 border-current cursor-pointer"
                >
                  <span>{hasAttempted ? "RE-AUDIT" : "AUDIT"} ➔</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
