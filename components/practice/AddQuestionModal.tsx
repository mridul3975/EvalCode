"use client";

import React, { useState } from "react";
import { QuestionItem } from "@/types/question";
import { generateQuestionFromRawText, getStoredGeminiKey, saveStoredGeminiKey } from "@/lib/gemini";
import { saveCustomQuestion } from "@/lib/storage";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  X,
  Key,
  Code2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
} from "lucide-react";

export function AddQuestionModal({
  isOpen,
  onClose,
  onQuestionAdded,
}: {
  isOpen: boolean;
  onClose: () => void;
  onQuestionAdded: (question: QuestionItem) => void;
}) {
  const [rawText, setRawText] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("python");
  const [customKey, setCustomKey] = useState(getStoredGeminiKey() || "");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    saveStoredGeminiKey(customKey.trim());
    setShowKeyInput(false);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) {
      setError("Please paste a problem description, raw code, or LeetCode prompt.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const newQuestion = await generateQuestionFromRawText(
        rawText,
        preferredLanguage,
        customKey.trim() || undefined
      );

      // Save to localStorage
      saveCustomQuestion(newQuestion);
      onQuestionAdded(newQuestion);
      setIsGenerating(false);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to generate calibrated question with Gemini AI.");
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl obsidian-card p-6 sm:p-10 space-y-6 font-['Hanken_Grotesk'] text-[#e2e2e5]">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isGenerating}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-[#b9cbc1] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 border-b border-[rgba(255,255,255,0.08)] pb-4">
          <div className="flex items-center justify-between">
            <span className="obsidian-chip-optimal flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GEMINI AI QUESTION BENCHMARK INGESTION</span>
            </span>

            <button
              type="button"
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="text-xs font-mono text-[#b9cbc1] hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-white" />
              <span>{getStoredGeminiKey() ? "CUSTOM KEY SET" : "API KEY"}</span>
            </button>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            ADD QUESTION VIA AI PASTE
          </h2>
          <p className="text-xs sm:text-sm font-mono text-[#b9cbc1]">
            Paste any raw problem prompt or buggy code snippet. Gemini AI will format the spec, generate a calibrated defect, and add it to your Practice Catalog.
          </p>
        </div>

        {/* API Key Drawer Option */}
        {showKeyInput && (
          <div className="obsidian-inset p-4 space-y-3 font-mono text-xs border border-[#282a2c]">
            <span className="font-bold text-white uppercase block">CUSTOM GEMINI API KEY (OPTIONAL)</span>
            <p className="text-[#b9cbc1]">
              By default, EvalForge uses the server key in <code>.env.local</code>. Enter your own key below if needed:
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                className="flex-1 p-2 rounded bg-[#0c0e10] border border-[#282a2c] text-white text-xs font-mono"
              />
              <button
                type="button"
                onClick={handleSaveKey}
                className="obsidian-btn-primary px-4 py-2 text-xs font-bold uppercase cursor-pointer"
              >
                SAVE KEY
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-[#a90219]/20 border border-[#a90219]/40 flex items-start gap-2.5 text-xs text-[#ffdad6] font-mono">
            <AlertCircle className="w-4 h-4 text-[#ffb3ae] shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-white uppercase flex items-center justify-between">
              <span>PASTE RAW PROBLEM TEXT OR CODE:</span>
              <span className="text-[#83958c]">LEETCODE / PROMPT / CODE</span>
            </label>
            <textarea
              placeholder="e.g. Write a function to check if a linked list contains a cycle. Given head node, return True if cycle exists, else False..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              disabled={isGenerating}
              rows={6}
              className="w-full p-4 rounded-xl bg-[#0c0e10] border border-[#282a2c] text-white text-xs font-mono focus:outline-none focus:border-white leading-relaxed"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs pt-2">
            <div className="flex items-center gap-3">
              <span className="font-bold text-[#b9cbc1] uppercase">LANGUAGE:</span>
              {[
                { key: "python", label: "PYTHON" },
                { key: "javascript", label: "JAVASCRIPT" },
                { key: "cpp", label: "C++" },
              ].map((lang) => (
                <button
                  key={lang.key}
                  type="button"
                  onClick={() => setPreferredLanguage(lang.key)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer",
                    preferredLanguage === lang.key
                      ? "bg-white text-[#121416] font-black"
                      : "obsidian-inset text-[#b9cbc1] hover:text-white"
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={isGenerating || !rawText.trim()}
              className="w-full sm:w-auto obsidian-btn-primary px-8 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.25)]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#121416]" />
                  <span>CALIBRATING BENCHMARK...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>GENERATE & ADD QUESTION</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
