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
    { key: "all", label: "All Topics" },
    { key: "linked_lists", label: "Linked Lists" },
    { key: "stacks_queues", label: "Stacks & Queues" },
    { key: "trees", label: "Trees & BST" },
    { key: "graphs", label: "Graphs" },
    { key: "backtracking", label: "Backtracking" },
    { key: "heaps", label: "Heaps & PQ" },
    { key: "intervals", label: "Intervals" },
    { key: "greedy", label: "Greedy" },
    { key: "arrays", label: "Arrays" },
    { key: "strings", label: "Strings" },
    { key: "dp", label: "Dynamic Prog" },
  ];

  const languages = [
    { key: "all", label: "All Languages" },
    { key: "python", label: "Python" },
    { key: "javascript", label: "JavaScript" },
    { key: "cpp", label: "C++" },
  ];

  const difficulties = [
    { key: "all", label: "All Difficulties" },
    { key: "easy", label: "Easy" },
    { key: "medium", label: "Medium" },
    { key: "hard", label: "Hard" },
  ];

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Code2 className="w-6 h-6 text-emerald-400" />
            <span>Practice Review Studio ({SEED_QUESTIONS.length} Problems)</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Audit AI-generated code snippets across calibrated defect categories with instant Discrepancy Diff feedback.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/assessment"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-200 transition-colors"
          >
            <span>Timed 50m Mock</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Adaptive Recommendation Banner */}
      {adaptiveRec && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-zinc-900/80 to-zinc-900 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
              <Target className="w-4 h-4 text-amber-400" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Adaptive Weakness Recommendation
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                  3x Sampling Weight
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">
                {adaptiveRec.sessionTitle}
              </h3>
              <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                {adaptiveRec.reason}
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedDefect(adaptiveRec.suggestedDefectCategory)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md transition-colors cursor-pointer shrink-0"
          >
            <span>Filter Weak Questions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter Controls Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        {/* Search & Selectors */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search problems, topics, or keywords (e.g., 'subsets', 'min stack', 'cycle', 'parentheses')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
            />
          </div>

          {/* Difficulty & Language Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none cursor-pointer"
            >
              {difficulties.map((d) => (
                <option key={d.key} value={d.key}>
                  {d.label}
                </option>
              ))}
            </select>

            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none cursor-pointer"
            >
              {languages.map((l) => (
                <option key={l.key} value={l.key}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Topic Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {topics.map((t) => {
            const isSelected = selectedTopic === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setSelectedTopic(t.key)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border",
                  isSelected
                    ? "bg-zinc-800 text-emerald-400 border-zinc-700 shadow-sm"
                    : "bg-zinc-950 text-zinc-400 border-zinc-800/80 hover:text-zinc-200"
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Showing count indicator */}
      <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
        <span>Showing <strong>{filteredQuestions.length}</strong> of <strong>{SEED_QUESTIONS.length}</strong> evaluation questions</span>
        {(selectedTopic !== "all" || selectedDifficulty !== "all" || selectedLanguage !== "all" || searchQuery) && (
          <button
            onClick={() => {
              setSelectedTopic("all");
              setSelectedDifficulty("all");
              setSelectedLanguage("all");
              setSelectedDefect("all");
              setSearchQuery("");
            }}
            className="text-emerald-400 hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredQuestions.map((q) => {
          const subData = submissions[q.id];
          const hasAttempted = !!subData;
          const score = subData?.result?.overall_score;
          const isBookmarked = bookmarks.includes(q.id);
          const defectMeta = getDefectMeta(q.ground_truth.defect_type || q.ground_truth.error_categories[0]);

          return (
            <div
              key={q.id}
              className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4 shadow-sm group"
            >
              {/* Header metadata */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {q.topic.replace("_", " ")}
                    </span>
                    <div className="flex items-center gap-1">
                      {getAvailableLanguages(q).map((lang) => (
                        <span key={lang} className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                          {getLanguageLabel(lang)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase px-2 py-0.5 rounded border",
                        q.difficulty === "easy"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : q.difficulty === "medium"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                      )}
                    >
                      {q.difficulty}
                    </span>
                    <button
                      onClick={(e) => handleBookmarkToggle(e, q.id)}
                      className="text-zinc-500 hover:text-amber-400 p-1 cursor-pointer"
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {q.title}
                </h3>

                {/* Defect Taxonomy Badge */}
                <div className="flex items-center gap-2">
                  <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full border", defectMeta.badgeClass)}>
                    {defectMeta.label}
                  </span>
                </div>

                {/* Snippet preview description */}
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {q.problem_statement.description}
                </p>
              </div>

              {/* Card Footer with Status & Action */}
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  {hasAttempted ? (
                    <div className="flex items-center gap-1.5 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-zinc-400">Audited:</span>
                      <span className="font-bold text-emerald-400 font-mono">
                        {(score * 10).toFixed(0)}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-zinc-500 font-mono">Not yet audited</span>
                  )}
                </div>

                <Link
                  href={`/practice/${q.id}`}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-transform hover:scale-[1.02] shadow-sm cursor-pointer"
                >
                  <span>{hasAttempted ? "Re-Audit" : "Audit Solution"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
