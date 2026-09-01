"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SEED_QUESTIONS } from "@/data/seed-questions";
import { QuestionItem } from "@/types/question";
import { AssessmentSession, EvaluationSubmission } from "@/types/submission";
import {
  getActiveAssessmentSession,
  saveActiveAssessmentSession,
  saveCompletedAssessment,
} from "@/lib/storage";
import { evaluateSubmission } from "@/lib/scoring-engine";
import { AssessmentHeader } from "@/components/assessment/AssessmentHeader";
import { ProblemContextPane } from "@/components/review-studio/ProblemContextPane";
import { CodeViewer } from "@/components/review-studio/CodeViewer";
import { EvaluationForm } from "@/components/review-studio/EvaluationForm";
import { WorkspaceSkeleton } from "@/components/boneyard/WorkspaceSkeleton";
import { getLanguageLabel } from "@/lib/language-utils";
import {
  AlertTriangle,
  X,
} from "lucide-react";

export default function ActiveAssessmentSessionPage() {
  const router = useRouter();
  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedLineForCite, setSelectedLineForCite] = useState<number | null>(null);

  // Load or initialize session
  useEffect(() => {
    let current = getActiveAssessmentSession();
    if (!current) {
      current = {
        id: `session_${Date.now()}`,
        start_time: Date.now(),
        duration_seconds: 3000,
        remaining_seconds: 3000,
        question_ids: SEED_QUESTIONS.slice(0, 5).map((q) => q.id),
        active_question_index: 0,
        flagged_questions: [],
        submissions: {},
        is_completed: false,
      };
      saveActiveAssessmentSession(current);
    }
    setSession(current);
    setIsLoading(false);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!session || session.is_completed) return;

    const timer = setInterval(() => {
      setSession((prev) => {
        if (!prev) return null;
        if (prev.remaining_seconds <= 1) {
          clearInterval(timer);
          handleFinalSubmit(prev);
          return { ...prev, remaining_seconds: 0 };
        }
        const updated = { ...prev, remaining_seconds: prev.remaining_seconds - 1 };
        saveActiveAssessmentSession(updated);
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session?.is_completed]);

  if (isLoading || !session) {
    return <WorkspaceSkeleton />;
  }

  const activeQuestionId = session.question_ids[session.active_question_index];
  const activeQuestion = SEED_QUESTIONS.find((q) => q.id === activeQuestionId) || SEED_QUESTIONS[0];
  const activeSubmission = session.submissions[activeQuestionId];

  const handleSelectQuestion = (index: number) => {
    const updated = { ...session, active_question_index: index };
    setSession(updated);
    saveActiveAssessmentSession(updated);
  };

  const handleToggleFlag = (qId: string) => {
    const isFlagged = session.flagged_questions.includes(qId);
    const updatedFlagged = isFlagged
      ? session.flagged_questions.filter((id) => id !== qId)
      : [...session.flagged_questions, qId];

    const updated = { ...session, flagged_questions: updatedFlagged };
    setSession(updated);
    saveActiveAssessmentSession(updated);
  };

  const handleSaveFormDraft = (sub: EvaluationSubmission) => {
    const updatedSubmissions = {
      ...session.submissions,
      [activeQuestionId]: sub,
    };

    const isLastQuestion = session.active_question_index === session.question_ids.length - 1;
    const nextIndex = isLastQuestion ? session.active_question_index : session.active_question_index + 1;

    const updated = {
      ...session,
      submissions: updatedSubmissions,
      active_question_index: nextIndex,
    };

    setSession(updated);
    saveActiveAssessmentSession(updated);

    if (isLastQuestion) {
      setShowSubmitModal(true);
    }
  };

  const handleFinalSubmit = (sessToSubmit?: AssessmentSession) => {
    const s = sessToSubmit || session;
    if (!s) return;

    const results: Record<string, any> = {};
    let totalScore = 0;

    s.question_ids.forEach((qId) => {
      const q = SEED_QUESTIONS.find((item) => item.id === qId);
      const sub = s.submissions[qId];
      if (q && sub) {
        const evalRes = evaluateSubmission(sub, q);
        results[qId] = evalRes;
        totalScore += evalRes.overall_score * 10;
      }
    });

    const avgScore = s.question_ids.length > 0 ? totalScore / s.question_ids.length : 0;
    const timeSpent = s.duration_seconds - s.remaining_seconds;

    const completedSession: AssessmentSession = {
      ...s,
      is_completed: true,
      completed_at: new Date().toISOString(),
      total_score: avgScore,
      results,
    };

    saveCompletedAssessment(completedSession);
    router.push("/assessment/results");
  };

  const answeredIds = Object.keys(session.submissions);

  return (
    <div className="flex flex-col min-h-screen bg-[#121416] text-white font-['Hanken_Grotesk']">
      {/* Top Assessment Navigation Header */}
      <AssessmentHeader
        remainingSeconds={session.remaining_seconds}
        totalSeconds={session.duration_seconds}
        onTimeExpired={() => handleFinalSubmit(session)}
        onSubmitSession={() => setShowSubmitModal(true)}
        activeQuestionIndex={session.active_question_index}
        totalQuestions={session.question_ids.length}
        flaggedQuestions={session.flagged_questions}
        answeredQuestionIds={answeredIds}
        currentQuestionId={activeQuestionId}
        onSelectQuestion={handleSelectQuestion}
        onToggleFlag={handleToggleFlag}
      />

      {/* Main Split Test Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 sm:p-8 max-w-[1750px] w-full mx-auto">
        {/* Left Viewport: Problem Spec + Code Snippet */}
        <div className="flex flex-col gap-6 min-h-[500px]">
          <div className="flex-1 min-h-[300px]">
            <ProblemContextPane question={activeQuestion} />
          </div>
          <div className="flex-1 min-h-[360px]">
            <CodeViewer
              code={activeQuestion.ai_response.code}
              language={getLanguageLabel(activeQuestion.language)}
              onSelectLine={(line) => setSelectedLineForCite(line)}
            />
          </div>
        </div>

        {/* Right Viewport: Candidate Evaluation Form */}
        <div className="flex flex-col min-h-[680px]">
          <EvaluationForm
            key={activeQuestion.id}
            question={activeQuestion}
            initialValues={activeSubmission}
            onSubmit={handleSaveFormDraft}
            onLineCiteRequested={selectedLineForCite}
          />
        </div>
      </div>

      {/* Final Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white text-black border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] space-y-6 font-['Hanken_Grotesk']">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-4 right-4 p-1 hover:bg-black hover:text-white transition-none"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase">
                COMPLETE ASSESSMENT?
              </h3>
              <p className="text-xs font-mono text-zinc-700">
                You have answered <strong>{answeredIds.length}</strong> of <strong>{session.question_ids.length}</strong> questions.
              </p>
            </div>

            {answeredIds.length < session.question_ids.length && (
              <div className="p-4 border-2 border-black bg-zinc-100 flex items-start gap-3 text-xs font-mono">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  You have unanswered questions. Unanswered questions will receive a score of 0.
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-3 border-2 border-black bg-white hover:bg-zinc-100 text-xs font-black uppercase transition-none cursor-pointer"
              >
                RETURN TO TEST
              </button>
              <button
                type="button"
                onClick={() => handleFinalSubmit(session)}
                className="flex-1 py-3 bg-black text-white hover:bg-zinc-800 text-xs font-black uppercase transition-none cursor-pointer"
              >
                CONFIRM & SUBMIT ➔
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
