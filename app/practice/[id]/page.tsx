"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { SEED_QUESTIONS } from "@/data/seed-questions";
import { QuestionItem, QuestionLanguage } from "@/types/question";
import { EvaluationSubmission, EvaluationResult } from "@/types/submission";
import { ProblemContextPane } from "@/components/review-studio/ProblemContextPane";
import { CodeViewer } from "@/components/review-studio/CodeViewer";
import { EvaluationForm } from "@/components/review-studio/EvaluationForm";
import { DisagreementMatrix } from "@/components/review-studio/DisagreementMatrix";
import { AIChatAssistant } from "@/components/review-studio/AIChatAssistant";
import { getStoredSubmissions, saveStoredSubmission, getCustomQuestions } from "@/lib/storage";
import { evaluateSubmission } from "@/lib/scoring-engine";
import { getCodeForLanguage, getAvailableLanguages, getLanguageLabel } from "@/lib/language-utils";
import { WorkspaceSkeleton } from "@/components/boneyard/WorkspaceSkeleton";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Share2,
  Check,
  Code2,
  FileEdit,
  BarChart3,
  Sparkles,
} from "lucide-react";

export default function ReviewStudioPage() {
  const routeParams = useParams();
  const questionId = (routeParams?.id as string) || "";

  const [question, setQuestion] = useState<QuestionItem | null>(null);
  const [submission, setSubmission] = useState<EvaluationSubmission | null>(null);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLineForCite, setSelectedLineForCite] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<QuestionLanguage>("python");
  const [mobileTab, setMobileTab] = useState<"code" | "form" | "assistant">("code");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const customQuestions = getCustomQuestions();
    const allQuestions = [...SEED_QUESTIONS, ...customQuestions];
    const q = allQuestions.find((item) => item.id === questionId);

    if (!q) {
      setIsLoading(false);
      return;
    }
    setQuestion(q);
    setSelectedLanguage(q.language);

    const stored = getStoredSubmissions()[questionId];
    if (stored) {
      setSubmission(stored.submission);
      setResult(stored.result);
      setMobileTab("form");
    } else {
      setSubmission(null);
      setResult(null);
    }
    setIsLoading(false);
  }, [questionId]);

  if (isLoading) {
    return <WorkspaceSkeleton />;
  }

  if (!question) {
    notFound();
  }

  const availableLangs = getAvailableLanguages(question);
  const currentCode = getCodeForLanguage(question, selectedLanguage);

  const handleSubmitEvaluation = (subData: EvaluationSubmission) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const evalResult = evaluateSubmission(subData, question);
      setSubmission(subData);
      setResult(evalResult);
      saveStoredSubmission(
        question.id,
        subData,
        evalResult,
        question.topic,
        question.ground_truth.defect_type || question.ground_truth.error_categories[0]
      );
      setIsSubmitting(false);
      setMobileTab("form");
    }, 400);
  };

  const handleRetry = () => {
    setSubmission(null);
    setResult(null);
    setSelectedLineForCite(null);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const allSeedIds = SEED_QUESTIONS.map((item) => item.id);
  const currentIndex = allSeedIds.indexOf(question.id);
  const nextQuestionId =
    currentIndex >= 0 && currentIndex < allSeedIds.length - 1
      ? allSeedIds[currentIndex + 1]
      : undefined;

  return (
    <div className="w-full flex-1 flex flex-col bg-[#121416] text-[#e2e2e5] font-['Hanken_Grotesk'] antialiased">
      {/* Sub-Header Toolbar */}
      <div
        className={cn(
          "w-full mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[rgba(255,255,255,0.08)] transition-all duration-300",
          isSidebarOpen ? "max-w-[1800px]" : "max-w-[1400px]"
        )}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/practice"
            className="neu-extruded bg-[#1e2022] px-3.5 py-2 rounded-lg flex items-center gap-2 font-mono text-xs font-bold text-[#b9cbc1] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>CATALOG</span>
          </Link>
          <span className="font-mono text-xs text-[#83958c]">
            {currentIndex >= 0 ? `#${currentIndex + 1} / ${SEED_QUESTIONS.length}` : "AI BENCHMARK"}
          </span>
          <h1 className="font-mono text-xs sm:text-sm font-bold text-white uppercase tracking-tight truncate max-w-md">
            {question.title}
          </h1>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          {/* Gemini AI Assistant Sidebar Toggle Button */}
          <button
            type="button"
            onClick={() => {
              setIsSidebarOpen((prev) => !prev);
              if (!isSidebarOpen && mobileTab !== "assistant") {
                setMobileTab("assistant");
              }
            }}
            className={cn(
              "neu-extruded px-3.5 py-2 rounded-lg flex items-center gap-2 font-mono text-xs font-bold transition-all cursor-pointer",
              isSidebarOpen
                ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.25)]"
                : "bg-[#1e2022] text-[#b9cbc1] hover:text-white"
            )}
            title={isSidebarOpen ? "Collapse Gemini Assistant Sidebar" : "Open Gemini Assistant Sidebar"}
          >
            <Sparkles className={cn("w-4 h-4", isSidebarOpen ? "text-emerald-600" : "text-emerald-400")} />
            <span className="hidden sm:inline">GEMINI ASSISTANT</span>
            <span className="sm:hidden">AI</span>
            <span
              className={cn(
                "text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-black",
                isSidebarOpen
                  ? "bg-black text-white"
                  : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
              )}
            >
              2.5 FLASH
            </span>
          </button>

          <button
            onClick={handleShare}
            className="neu-extruded bg-[#1e2022] px-3.5 py-2 rounded-lg flex items-center gap-2 font-mono text-xs font-bold text-[#b9cbc1] hover:text-white transition-colors cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">LINK COPIED</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">SHARE</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sticky Tab Switcher Bar */}
      <div className="lg:hidden sticky top-20 z-40 bg-[#121416]/95 backdrop-blur-md px-4 py-2 border-b border-white/10 flex gap-2 font-mono text-xs">
        <button
          onClick={() => setMobileTab("code")}
          className={cn(
            "flex-1 py-2.5 rounded-lg font-bold uppercase transition-all flex items-center justify-center gap-1.5 text-[11px]",
            mobileTab === "code"
              ? "bg-white text-black font-black"
              : "bg-[#1e2022] text-[#b9cbc1]"
          )}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>SPEC</span>
        </button>

        <button
          onClick={() => setMobileTab("form")}
          className={cn(
            "flex-1 py-2.5 rounded-lg font-bold uppercase transition-all flex items-center justify-center gap-1.5 text-[11px]",
            mobileTab === "form"
              ? "bg-white text-black font-black"
              : "bg-[#1e2022] text-[#b9cbc1]"
          )}
        >
          {result ? <BarChart3 className="w-3.5 h-3.5" /> : <FileEdit className="w-3.5 h-3.5" />}
          <span>{result ? "MATRIX" : "FORM"}</span>
        </button>

        <button
          onClick={() => {
            setMobileTab("assistant");
            setIsSidebarOpen(true);
          }}
          className={cn(
            "flex-1 py-2.5 rounded-lg font-bold uppercase transition-all flex items-center justify-center gap-1.5 text-[11px]",
            mobileTab === "assistant"
              ? "bg-white text-black font-black"
              : "bg-[#1e2022] text-[#b9cbc1]"
          )}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>AI ASSISTANT</span>
        </button>
      </div>

      {/* Main Responsive Grid Canvas with Dedicated Right Sidebar */}
      <main
        className={cn(
          "flex-grow w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 transition-all duration-300 pb-16",
          isSidebarOpen ? "max-w-[1800px]" : "max-w-[1400px]"
        )}
      >
        <div className="flex flex-col xl:flex-row gap-6 sm:gap-8 items-start">
          {/* Main 2-Column Practice Workspace Area */}
          <div className="flex-1 min-w-0 w-full grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Left Column: Problem Spec & Code Snippet */}
            <div
              className={cn(
                "flex-col gap-6 sm:gap-8",
                mobileTab === "code" ? "flex" : "hidden lg:flex"
              )}
            >
              <ProblemContextPane question={question} selectedLanguage={selectedLanguage} />
              <CodeViewer
                code={currentCode}
                language={getLanguageLabel(selectedLanguage)}
                onSelectLine={(line) => setSelectedLineForCite(line)}
                availableLanguages={availableLangs}
                selectedLanguage={selectedLanguage}
                onLanguageChange={(lang) => setSelectedLanguage(lang)}
              />
            </div>

            {/* Right Column: Audit Form or Discrepancy Matrix */}
            <div
              className={cn(
                "flex-col",
                mobileTab === "form" ? "flex" : "hidden lg:flex"
              )}
            >
              {submission && result ? (
                <DisagreementMatrix
                  question={question}
                  submission={submission}
                  result={result}
                  onRetry={handleRetry}
                  nextQuestionId={nextQuestionId}
                  selectedLanguage={selectedLanguage}
                  onOpenAssistant={() => {
                    setIsSidebarOpen(true);
                    setMobileTab("assistant");
                  }}
                />
              ) : (
                <EvaluationForm
                  question={question}
                  initialValues={submission || undefined}
                  onSubmit={handleSubmitEvaluation}
                  isSubmitting={isSubmitting}
                  onLineCiteRequested={selectedLineForCite}
                />
              )}
            </div>

            {/* Mobile Tab View for Assistant */}
            <div
              className={cn(
                "flex-col xl:hidden h-[600px]",
                mobileTab === "assistant" ? "flex" : "hidden"
              )}
            >
              <AIChatAssistant
                question={question}
                candidateVerdict={submission?.verdict}
                isSidebar={true}
                onClose={() => setMobileTab("code")}
              />
            </div>
          </div>

          {/* Desktop Dedicated Right Sidebar Panel */}
          {isSidebarOpen && (
            <aside className="hidden xl:flex w-[380px] 2xl:w-[430px] shrink-0 sticky top-20 h-[calc(100vh-6.5rem)] flex-col animate-in fade-in slide-in-from-right-4 duration-300">
              <AIChatAssistant
                question={question}
                candidateVerdict={submission?.verdict}
                onClose={() => setIsSidebarOpen(false)}
                isSidebar={true}
              />
            </aside>
          )}
        </div>
      </main>

      {/* Floating Re-open Tab when Sidebar is Collapsed on Desktop */}
      {!isSidebarOpen && (
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          title="Open Gemini AI Assistant Sidebar"
          className="hidden xl:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-[#1e2022] hover:bg-white hover:text-black text-white border-l border-y border-white/20 pl-3 pr-2.5 py-4 rounded-l-xl shadow-2xl items-center gap-2 cursor-pointer transition-all hover:pr-4 group"
        >
          <div className="flex flex-col items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <Sparkles className="w-4 h-4 text-emerald-400 group-hover:text-black transition-colors" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest [writing-mode:vertical-lr] rotate-180 text-[#b9cbc1] group-hover:text-black transition-colors">
              GEMINI AI
            </span>
          </div>
        </button>
      )}
    </div>
  );
}
