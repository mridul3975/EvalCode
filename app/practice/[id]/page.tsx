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
import { getStoredSubmissions, saveStoredSubmission } from "@/lib/storage";
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
    const q = SEED_QUESTIONS.find((item) => item.id === questionId);
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
      setMobileTab("form"); // switch to results on mobile if already evaluated
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
    return notFound();
  }

  const currentIndex = SEED_QUESTIONS.findIndex((q) => q.id === questionId);
  const nextQuestion = SEED_QUESTIONS[currentIndex + 1] || null;
  const availableLanguages = getAvailableLanguages(question);
  const activeCode = getCodeForLanguage(question, selectedLanguage);

  const handleSubmitEvaluation = (sub: EvaluationSubmission) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const evaluationResult = evaluateSubmission(sub, question);
      setSubmission(sub);
      setResult(evaluationResult);
      saveStoredSubmission(
        question.id,
        sub,
        evaluationResult,
        question.topic,
        question.ground_truth.defect_type || question.ground_truth.error_categories[0]
      );
      setIsSubmitting(false);
      setMobileTab("form"); // Switch to show results matrix on mobile
    }, 400);
  };

  const handleRetry = () => {
    setResult(null);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#121416] text-white font-['Hanken_Grotesk']">
      {/* Header Bar */}
      <div className="border-b-2 border-white/15 bg-[#121416] px-4 sm:px-8 py-3 flex items-center justify-between sticky top-14 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <Link
            href="/practice"
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-white text-black px-2.5 py-1.5 rounded-md hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CATALOG</span>
          </Link>

          <div className="flex items-center gap-2 font-mono">
            <span className="text-xs font-bold text-zinc-400 hidden md:inline">
              #{currentIndex + 1} / {SEED_QUESTIONS.length}:
            </span>
            <h2 className="text-xs sm:text-sm md:text-base font-bold text-white uppercase truncate max-w-[160px] sm:max-w-xs md:max-w-md">
              {question.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md obsidian-inset text-white text-xs font-mono font-bold uppercase hover:bg-white/10 transition-colors cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>COPIED</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">SHARE</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Tab Switcher (< lg) */}
      <div className="lg:hidden flex border-b border-[rgba(255,255,255,0.08)] bg-[#16181a] px-4 py-2 sticky top-[106px] z-20 font-mono text-xs">
        <div className="grid grid-cols-2 w-full gap-2 p-1 bg-[#121416] rounded-xl border border-black/40">
          <button
            onClick={() => setMobileTab("code")}
            className={cn(
              "flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-bold uppercase transition-all",
              mobileTab === "code"
                ? "bg-white text-[#121416] shadow-sm font-black"
                : "text-[#b9cbc1] hover:text-white"
            )}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>CODE & CONTEXT</span>
          </button>

          <button
            onClick={() => setMobileTab("form")}
            className={cn(
              "flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-bold uppercase transition-all",
              mobileTab === "form"
                ? "bg-white text-[#121416] shadow-sm font-black"
                : "text-[#b9cbc1] hover:text-white"
            )}
          >
            {result ? <BarChart3 className="w-3.5 h-3.5" /> : <FileEdit className="w-3.5 h-3.5" />}
            <span>{result ? "RESULTS MATRIX" : "AUDIT FORM"}</span>
          </button>
        </div>
      </div>

      {/* Main Split Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 sm:p-6 lg:p-8 max-w-[1750px] w-full mx-auto">
        {/* Left Viewport: Problem Context + Code Viewer */}
        <div
          className={cn(
            "flex flex-col gap-6",
            mobileTab === "form" ? "hidden lg:flex" : "flex"
          )}
        >
          <div className="flex-1 min-h-[260px]">
            <ProblemContextPane question={question} selectedLanguage={selectedLanguage} />
          </div>
          <div className="flex-1 min-h-[360px]">
            <CodeViewer
              code={activeCode}
              language={getLanguageLabel(selectedLanguage)}
              onSelectLine={(line) => {
                setSelectedLineForCite(line);
                setMobileTab("form"); // Auto switch to form when line is cited on mobile
              }}
              availableLanguages={availableLanguages}
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </div>
        </div>

        {/* Right Viewport: Evaluation Form OR Disagreement Matrix */}
        <div
          className={cn(
            "flex flex-col min-h-[500px]",
            mobileTab === "code" ? "hidden lg:flex" : "flex"
          )}
        >
          {result && submission ? (
            <DisagreementMatrix
              question={question}
              submission={submission}
              result={result}
              onRetry={handleRetry}
              nextQuestionId={nextQuestion?.id}
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
      </div>
    </div>
  );
}
