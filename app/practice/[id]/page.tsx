"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { SEED_QUESTIONS } from "@/data/seed-questions";
import { QuestionItem, QuestionLanguage } from "@/types/question";
import { EvaluationSubmission, EvaluationResult } from "@/types/submission";
import { ProblemContextPane } from "@/components/review-studio/ProblemContextPane";
import { CodeViewer } from "@/components/review-studio/CodeViewer";
import { EvaluationForm } from "@/components/review-studio/EvaluationForm";
import { DisagreementMatrix } from "@/components/review-studio/DisagreementMatrix";
import { AIChatAssistant } from "@/components/review-studio/AIChatAssistant";
import { PracticeAttemptWorkspace } from "@/components/practice/PracticeAttemptWorkspace";
import { getStoredSubmissions, saveStoredSubmission, getCustomQuestions } from "@/lib/storage";
import { evaluateSubmission } from "@/lib/scoring-engine";
import { getCodeForLanguage, getAvailableLanguages } from "@/lib/language-utils";
import { WorkspaceSkeleton } from "@/components/boneyard/WorkspaceSkeleton";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Share2,
  Check,
  Code2,
  FileEdit,
  Sparkles,
  ShieldAlert,
  Terminal,
} from "lucide-react";

function ReviewStudioContent() {
  const routeParams = useParams();
  const searchParams = useSearchParams();
  const questionId = (routeParams?.id as string) || "";

  const initialModeParam = searchParams.get("mode");
  const [studioMode, setStudioMode] = useState<"audit" | "attempt">(
    initialModeParam === "attempt" ? "attempt" : "audit"
  );

  const [question, setQuestion] = useState<QuestionItem | null>(null);
  const [submission, setSubmission] = useState<EvaluationSubmission | null>(null);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLineForCite, setSelectedLineForCite] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<QuestionLanguage>("python");
  const [mobileTab, setMobileTab] = useState<"code" | "form" | "assistant">("code");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const handleModeChange = (mode: "audit" | "attempt") => {
    setStudioMode(mode);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("mode", mode);
      window.history.replaceState(null, "", url.toString());
    }
  };

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
    setMobileTab("form");
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0e11] text-neutral-200 font-['Hanken_Grotesk'] antialiased flex flex-col">
      {/* Top Navigation Strip */}
      <header className="h-12 border-b border-neutral-800/80 bg-neutral-950/70 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 font-mono text-xs gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/practice"
            className="text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Practice Catalog</span>
          </Link>

          <span className="h-4 w-[1px] bg-neutral-800 shrink-0" />

          <span className="font-semibold text-white truncate max-w-xs sm:max-w-md">
            {question.title}
          </span>
        </div>

        {/* Center: Mode Switcher */}
        <div className="flex items-center gap-1 neu-inset p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => handleModeChange("audit")}
            className={cn(
              "px-3 py-1 rounded-lg font-mono text-[11px] font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer",
              studioMode === "audit"
                ? "neu-inset text-white font-bold border border-white/10"
                : "neu-button text-neutral-400 hover:text-white"
            )}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Audit Buggy Code</span>
            <span className="md:hidden">Audit</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange("attempt")}
            className={cn(
              "px-3 py-1 rounded-lg font-mono text-[11px] font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer",
              studioMode === "attempt"
                ? "neu-inset text-emerald-300 font-bold border border-emerald-500/30"
                : "neu-button text-neutral-400 hover:text-white"
            )}
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Attempt From Scratch</span>
            <span className="md:hidden">Attempt</span>
          </button>
        </div>

        {/* Right Tools: Share & Gemini Copilot */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleShare}
            className="p-1.5 px-2.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 text-[11px]">Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3 h-3" />
                <span className="text-[11px]">Share</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={cn(
              "px-3 py-1.5 rounded flex items-center gap-1.5 transition-all cursor-pointer font-semibold",
              isSidebarOpen
                ? "bg-emerald-500 text-black shadow-sm"
                : "bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
            )}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Gemini Copilot</span>
          </button>
        </div>
      </header>

      {/* Mobile Tab Stepper */}
      <div className="lg:hidden flex border-b border-neutral-800 bg-neutral-950 font-mono text-xs">
        <button
          onClick={() => setMobileTab("code")}
          className={cn(
            "flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 font-medium",
            mobileTab === "code"
              ? "border-white text-white font-bold"
              : "border-transparent text-neutral-400"
          )}
        >
          {studioMode === "audit" ? <Code2 className="w-3.5 h-3.5" /> : <Terminal className="w-3.5 h-3.5" />}
          <span>{studioMode === "audit" ? "Spec & Code" : "Problem Spec"}</span>
        </button>

        <button
          onClick={() => setMobileTab("form")}
          className={cn(
            "flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 font-medium",
            mobileTab === "form"
              ? "border-white text-white font-bold"
              : "border-transparent text-neutral-400"
          )}
        >
          <FileEdit className="w-3.5 h-3.5" />
          <span>
            {studioMode === "audit"
              ? result
                ? "Results"
                : "Audit Form"
              : "Editor & Tests"}
          </span>
        </button>

        <button
          onClick={() => setMobileTab("assistant")}
          className={cn(
            "flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 font-medium",
            mobileTab === "assistant"
              ? "border-emerald-400 text-emerald-400 font-bold"
              : "border-transparent text-neutral-400"
          )}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Assistant</span>
        </button>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto">
          {/* Left Column (5 Cols) */}
          <div
            className={cn(
              "lg:col-span-5 flex flex-col gap-6",
              mobileTab === "code" ? "flex" : "hidden lg:flex"
            )}
          >
            <ProblemContextPane
              question={question}
              selectedLanguage={selectedLanguage}
            />

            {studioMode === "audit" && (
              <CodeViewer
                code={currentCode}
                language={selectedLanguage.toUpperCase()}
                onSelectLine={(line) => setSelectedLineForCite(line)}
                availableLanguages={availableLangs}
                selectedLanguage={selectedLanguage}
                onLanguageChange={(lang) => setSelectedLanguage(lang)}
              />
            )}
          </div>

          {/* Right Column (7 Cols) */}
          <div
            className={cn(
              "lg:col-span-7 flex flex-col gap-6",
              mobileTab === "form" ? "flex" : "hidden lg:flex"
            )}
          >
            {studioMode === "audit" ? (
              result && submission ? (
                <DisagreementMatrix
                  question={question}
                  submission={submission}
                  result={result}
                  onRetry={handleRetry}
                  nextQuestionId={
                    SEED_QUESTIONS[
                      (SEED_QUESTIONS.findIndex((q) => q.id === question.id) + 1) %
                        SEED_QUESTIONS.length
                    ]?.id
                  }
                  selectedLanguage={selectedLanguage}
                  onOpenAssistant={() => setIsSidebarOpen(true)}
                />
              ) : (
                <EvaluationForm
                  question={question}
                  initialValues={submission || undefined}
                  onSubmit={handleSubmitEvaluation}
                  isSubmitting={isSubmitting}
                  onLineCiteRequested={selectedLineForCite}
                />
              )
            ) : (
              <PracticeAttemptWorkspace
                question={question}
                initialLanguage={selectedLanguage}
                onSwitchToAuditMode={() => handleModeChange("audit")}
              />
            )}
          </div>

          {/* Mobile Dedicated Tab for Assistant */}
          {mobileTab === "assistant" && (
            <div className="lg:hidden col-span-12 h-[calc(100vh-120px)]">
              <AIChatAssistant
                question={question}
                candidateCode={currentCode}
                candidateVerdict={submission?.verdict}
                isSidebar={true}
              />
            </div>
          )}
        </main>

        {/* Right Collapsible Desktop Sidebar for Gemini Copilot */}
        {isSidebarOpen && (
          <aside className="hidden lg:block w-[400px] shrink-0 border-l border-neutral-800/80 bg-neutral-950 p-4 h-[calc(100vh-48px)] sticky top-12 z-20 animate-in slide-in-from-right-4 duration-200">
            <AIChatAssistant
              question={question}
              candidateCode={currentCode}
              candidateVerdict={submission?.verdict}
              isSidebar={true}
              onClose={() => setIsSidebarOpen(false)}
            />
          </aside>
        )}
      </div>
    </div>
  );
}

export default function ReviewStudioPage() {
  return (
    <Suspense fallback={<WorkspaceSkeleton />}>
      <ReviewStudioContent />
    </Suspense>
  );
}
