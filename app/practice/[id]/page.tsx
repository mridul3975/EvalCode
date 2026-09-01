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
  const [mobileTab, setMobileTab] = useState<"code" | "form">("code");

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
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[rgba(255,255,255,0.08)]">
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

        <button
          onClick={handleShare}
          className="neu-extruded bg-[#1e2022] px-3.5 py-2 rounded-lg flex items-center gap-2 font-mono text-xs font-bold text-[#b9cbc1] hover:text-white transition-colors cursor-pointer self-end sm:self-auto"
        >
          {copiedLink ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>LINK COPIED</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>SHARE</span>
            </>
          )}
        </button>
      </div>

      {/* Mobile Sticky Tab Switcher Bar */}
      <div className="lg:hidden sticky top-20 z-40 bg-[#121416]/95 backdrop-blur-md px-4 py-2 border-b border-white/10 flex gap-2 font-mono text-xs">
        <button
          onClick={() => setMobileTab("code")}
          className={cn(
            "flex-1 py-2.5 rounded-lg font-bold uppercase transition-all flex items-center justify-center gap-2",
            mobileTab === "code"
              ? "bg-white text-black font-black"
              : "bg-[#1e2022] text-[#b9cbc1]"
          )}
        >
          <Code2 className="w-4 h-4" />
          <span>CODE & SPEC</span>
        </button>

        <button
          onClick={() => setMobileTab("form")}
          className={cn(
            "flex-1 py-2.5 rounded-lg font-bold uppercase transition-all flex items-center justify-center gap-2",
            mobileTab === "form"
              ? "bg-white text-black font-black"
              : "bg-[#1e2022] text-[#b9cbc1]"
          )}
        >
          {result ? <BarChart3 className="w-4 h-4" /> : <FileEdit className="w-4 h-4" />}
          <span>{result ? "RESULTS MATRIX" : "AUDIT FORM"}</span>
        </button>
      </div>

      {/* Main Responsive Grid Canvas */}
      <main className="flex-grow w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 pb-16">
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
      </main>
    </div>
  );
}
