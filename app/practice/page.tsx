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
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-8 space-y-8 font-mono">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 border-[#242830] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
            <Code2 className="w-6 h-6 text-[#00ffc2]" />
            <span>PRACTICE REVIEW STUDIO ({SEED_QUESTIONS.length} PROBLEMS)</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Audit AI-generated code snippets across calibrated defect categories with instant Discrepancy Diff feedback.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/assessment"
            className="flex items-center gap-2 px-4 py-2 rounded-none bg-[#121417] border-2 border-[#242830] hover:border-[#00ffc2]/50 text-xs font-bold text-zinc-200 transition-colors"
          >
            <span>TIMED MOCK ASSESSMENT</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#00ffc2]" />
          </Link>
        </div>
      </div>

      {/* Adaptive Recommendation Banner */}
      {adaptiveRec && (
        <div className="p-5 rounded-none bg-[#121417] border-2 border-amber-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-none bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
              <Target className="w-4 h-4 text-amber-400" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                  ADAPTIVE WEAKNESS RECOMMENDATION
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded-none bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  3X SAMPLING WEIGHT
                </span>
              </div>
              <h3 className="text-sm font-black text-white uppercase">
                {adaptiveRec.sessionTitle}
              </h3>
              <p className="text-xs text-zinc-400 max-w-2xl font-sans leading-relaxed">
                {adaptiveRec.reason}
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedDefect(adaptiveRec.suggestedDefectCategory)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-none bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs shadow-md transition-colors cursor-pointer shrink-0"
          >
            <span>FILTER WEAK QUESTIONS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter Controls Bar */}
      <div className="p-4 rounded-none bg-[#121417] border-2 border-[#242830] space-y-4">
        {/* Search & Selectors */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search problems, topics, or keywords (e.g., 'subsets', 'min stack', 'cycle')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0b0d] border border-[#242830] rounded-none pl-9 pr-4 py-2 text-xs text-zinc-200 focus:outline-none focus:border-[#00ffc2] font-mono"
            />
          </div>

          {/* Difficulty & Language Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto font-mono">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-[#0a0b0d] border border-[#242830] rounded-none px-3 py-2 text-xs text-zinc-300 focus:outline-none cursor-pointer font-bold"
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
              className="bg-[#0a0b0d] border border-[#242830] rounded-none px-3 py-2 text-xs text-zinc-300 focus:outline-none cursor-pointer font-bold"
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
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-mono">
          {topics.map((t) => {
            const isSelected = selectedTopic === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setSelectedTopic(t.key)}
                className={cn(
                  "px-3 py-1.5 rounded-none text-xs font-bold uppercase transition-colors cursor-pointer border whitespace-nowrap",
                  isSelected
                    ? "bg-[#00ffc2] text-[#0a0b0d] border-[#00ffc2]"
                    : "bg-[#0a0b0d] text-zinc-400 border-[#242830] hover:text-white hover:border-zinc-700"
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Showing count indicator */}
      <div className="flex items-center justify-between text-xs text-zinc-500 px-1 font-mono">
        <span>SHOWING <strong className="text-white">{filteredQuestions.length}</strong> OF <strong className="text-white">{SEED_QUESTIONS.length}</strong> QUESTIONS</span>
        {(selectedTopic !== "all" || selectedDifficulty !== "all" || selectedLanguage !== "all" || searchQuery) && (
          <button
            onClick={() => {
              setSelectedTopic("all");
              setSelectedDifficulty("all");
              setSelectedLanguage("all");
              setSelectedDefect("all");
              setSearchQuery("");
            }}
            className="text-[#00ffc2] hover:underline uppercase font-bold cursor-pointer"
          >
            RESET FILTERS
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
              className="p-5 rounded-none bg-[#121417] border-2 border-[#242830] hover:border-[#00ffc2]/50 transition-colors flex flex-col justify-between space-y-4 shadow-sm group font-mono"
            >
              {/* Header metadata */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-none bg-[#0a0b0d] text-zinc-300 border border-[#242830]">
                      {q.topic.replace("_", " ")}
                    </span>
                    <div className="flex items-center gap-1">
                      {getAvailableLanguages(q).map((lang) => (
                        <span key={lang} className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-none bg-[#0a0b0d] text-zinc-400 border border-[#242830]">
                          {getLanguageLabel(lang)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "text-[10px] font-black uppercase px-2 py-0.5 rounded-none border",
                        q.difficulty === "easy"
                          ? "bg-[#00ffc2]/10 text-[#00ffc2] border-[#00ffc2]/30"
                          : q.difficulty === "medium"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          : "bg-[#ff4d4d]/10 text-[#ff4d4d] border-[#ff4d4d]/30"
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
                <h3 className="text-sm font-black text-white group-hover:text-[#00ffc2] transition-colors uppercase">
                  {q.title}
                </h3>

                {/* Defect Taxonomy Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-none bg-[#0a0b0d] text-zinc-300 border border-[#242830]">
                    {defectMeta.label}
                  </span>
                </div>

                {/* Snippet preview description */}
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-sans">
                  {q.problem_statement.description}
                </p>
              </div>

              {/* Card Footer with Status & Action */}
              <div className="pt-3 border-t border-[#242830] flex items-center justify-between font-mono">
                <div>
                  {hasAttempted ? (
                    <div className="flex items-center gap-1.5 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00ffc2]" />
                      <span className="text-zinc-400 font-bold">AUDITED:</span>
                      <span className="font-black text-[#00ffc2]">
                        {(score * 10).toFixed(0)}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">NOT YET AUDITED</span>
                  )}
                </div>

                <Link
                  href={`/practice/${q.id}`}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-none bg-[#00ffc2] hover:bg-white text-[#0a0b0d] font-black text-xs transition-colors cursor-pointer"
                >
                  <span>{hasAttempted ? "RE-AUDIT" : "AUDIT SOLUTION"}</span>
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
