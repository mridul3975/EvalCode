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
import {
  AlertTriangle,
  CheckCircle2,
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
      // Create fallback session if none exists
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
    const updated = { ...session, submissions: updatedSubmissions };
    setSession(updated);
    saveActiveAssessmentSession(updated);
  };

  const handleFinalSubmit = (sessionToSubmit = session) => {
    // Run scoring engine on all 5 questions
    const results: Record<string, any> = {};
    let totalScoreSum = 0;

    sessionToSubmit.question_ids.forEach((qId) => {
      const q = SEED_QUESTIONS.find((item) => item.id === qId) || SEED_QUESTIONS[0];
      const userSub = sessionToSubmit.submissions[qId] || {
        question_id: qId,
        verdict: "correct",
        reported_bugs: [],
        failing_test_cases: [],
        assessed_complexity: { time: "O(1)", space: "O(1)" },
        explanation_audit: { is_accurate: true },
      };

      const res = evaluateSubmission(userSub, q);
      results[qId] = res;
      totalScoreSum += res.overall_score * 10;
    });

    const averageTotal = Number((totalScoreSum / sessionToSubmit.question_ids.length).toFixed(1));

    const completedSession: AssessmentSession = {
      ...sessionToSubmit,
      is_completed: true,
      completed_at: new Date().toISOString(),
      results,
      total_score: averageTotal,
    };

    saveCompletedAssessment(completedSession);
    router.push("/assessment/results");
  };

  const answeredQuestionIds = Object.keys(session.submissions);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100">
      {/* Assessment Header with persistent timer & Q1-Q5 pills */}
      <AssessmentHeader
        remainingSeconds={session.remaining_seconds}
        totalSeconds={session.duration_seconds}
        onTimeExpired={() => handleFinalSubmit()}
        onSubmitSession={() => setShowSubmitModal(true)}
        activeQuestionIndex={session.active_question_index}
        totalQuestions={session.question_ids.length}
        flaggedQuestions={session.flagged_questions}
        answeredQuestionIds={answeredQuestionIds}
        currentQuestionId={activeQuestionId}
        onSelectQuestion={handleSelectQuestion}
        onToggleFlag={handleToggleFlag}
      />

      {/* 2-Column Split Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 max-w-[1750px] w-full mx-auto">
        {/* Left: Problem Context + Code Viewer */}
        <div className="flex flex-col gap-4 min-h-[500px]">
          <div className="flex-1 min-h-[300px]">
            <ProblemContextPane question={activeQuestion} />
          </div>
          <div className="flex-1 min-h-[360px]">
            <CodeViewer
              code={activeQuestion.ai_response.code}
              language={activeQuestion.language}
              onSelectLine={(line) => setSelectedLineForCite(line)}
            />
          </div>
        </div>

        {/* Right: Evaluation Form (Auto-Saving) */}
        <div className="flex flex-col min-h-[680px]">
          <EvaluationForm
            key={activeQuestion.id}
            question={activeQuestion}
            initialValues={activeSubmission || undefined}
            onSubmit={(sub) => {
              handleSaveFormDraft(sub);
              if (session.active_question_index < session.question_ids.length - 1) {
                handleSelectQuestion(session.active_question_index + 1);
              } else {
                setShowSubmitModal(true);
              }
            }}
            onLineCiteRequested={selectedLineForCite}
          />
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Submit Mock Assessment?</h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              You have completed <strong>{answeredQuestionIds.length}</strong> of{" "}
              <strong>{session.question_ids.length}</strong> evaluation questions.
              Once submitted, all answers are final and your Readiness Index $R$ and Disagreement Report will be generated.
            </p>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400">Time Remaining:</span>
              <span className="font-bold text-emerald-400">
                {Math.floor(session.remaining_seconds / 60)}m {session.remaining_seconds % 60}s
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition-colors cursor-pointer"
              >
                Continue Reviewing
              </button>
              <button
                onClick={() => handleFinalSubmit()}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
