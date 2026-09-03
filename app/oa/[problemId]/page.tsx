"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { OA_PROBLEMS, OA_TRACKS } from "@/data/oa-problems";
import {
  OALanguage,
  OAPhase,
  OATestResult,
  OAFollowUpQuestion,
  OAFollowUpResponse,
  OACompanyTrack,
  OAProblem,
  OAQuestionState,
  OAMultiAssessmentSession,
} from "@/types/oa";
import { executeTestCases } from "@/lib/oa/code-executor";
import {
  saveActiveMultiSession,
  getActiveMultiSession,
  clearActiveMultiSession,
  calculateRemainingSeconds,
  saveMultiOAResult,
} from "@/lib/oa/storage";
import { OANavbar } from "@/components/oa/OANavbar";
import { MonacoCodeEditor } from "@/components/oa/MonacoCodeEditor";
import { TestCaseConsole } from "@/components/oa/TestCaseConsole";
import { QuestionDrawer } from "@/components/oa/QuestionDrawer";
import { PreSubmitModal } from "@/components/oa/PreSubmitModal";
import { MultiApproachDefense } from "@/components/oa/MultiApproachDefense";
import { FollowUpRound } from "@/components/oa/FollowUpRound";
import { BookOpen, AlertTriangle } from "lucide-react";

export default function OAWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.problemId as string) || "";

  // 1. Resolve Track and Problems
  const track: OACompanyTrack = useMemo(() => {
    // Check if slug matches an explicit track ID
    const foundTrack = OA_TRACKS.find((t) => t.id === slug);
    if (foundTrack) return foundTrack;

    // Check if slug is an individual problem ID
    const problemMatch = OA_PROBLEMS.find((p) => p.id === slug);
    if (problemMatch) {
      const parentTrack = OA_TRACKS.find((t) => t.problemIds.includes(problemMatch.id));
      if (parentTrack) return parentTrack;

      // Fallback synthetic track for single problem
      return {
        id: `track_${problemMatch.id}`,
        companyProfile: problemMatch.companyProfile,
        title: `${problemMatch.companyProfile} | ${problemMatch.title}`,
        subtitle: `${problemMatch.topic} Targeted Assessment`,
        description: problemMatch.description,
        totalTimeSeconds: 4500, // 75 mins
        problemIds: [problemMatch.id],
        problemWeights: { [problemMatch.id]: 100 },
        tags: problemMatch.tags,
      };
    }

    // Default to Citadel track
    return OA_TRACKS[0];
  }, [slug]);

  const problems: OAProblem[] = useMemo(() => {
    return track.problemIds
      .map((id) => OA_PROBLEMS.find((p) => p.id === id))
      .filter((p): p is OAProblem => Boolean(p));
  }, [track]);

  // 2. Multi-Problem State Initialization & Hydration
  const [activeProblemId, setActiveProblemId] = useState<string>(problems[0]?.id || "");
  const [currentPhase, setCurrentPhase] = useState<OAPhase>("workspace");
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isPreSubmitOpen, setIsPreSubmitOpen] = useState<boolean>(false);

  // Time remaining (in seconds)
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(track.totalTimeSeconds);

  // Per-question isolated state map: problemId -> OAQuestionState
  const [questionsState, setQuestionsState] = useState<Record<string, OAQuestionState>>(() => {
    const initial: Record<string, OAQuestionState> = {};
    for (const p of problems) {
      const visibleCases = p.testCases.filter((tc) => !tc.isHidden);
      initial[p.id] = {
        problemId: p.id,
        code: p.starterCode.python,
        language: "python",
        visibleTestsPassed: 0,
        visibleTestsTotal: visibleCases.length,
        hiddenTestsPassed: 0,
        hiddenTestsTotal: p.testCases.filter((tc) => tc.isHidden).length,
        status: "NOT_STARTED",
        testResults: [],
        approach: "",
        claimedTime: "O(N)",
        claimedSpace: "O(1)",
      };
    }
    return initial;
  });

  // Active question's execution state
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);

  // Phase 3: Gemini Dynamic Follow-Ups
  const [followUpQuestions, setFollowUpQuestions] = useState<OAFollowUpQuestion[]>([]);
  const [followUpResponses, setFollowUpResponses] = useState<Record<string, string>>({});
  const [isLoadingFollowUps, setIsLoadingFollowUps] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const sessionMetadataRef = useRef<{
    sessionId: string;
    startedAt: number;
    totalTimeAllocatedSeconds: number;
  }>({
    sessionId: `session_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    startedAt: Date.now(),
    totalTimeAllocatedSeconds: track.totalTimeSeconds,
  });

  // Active problem object
  const activeProblem = problems.find((p) => p.id === activeProblemId) || problems[0];
  const activeState = questionsState[activeProblem.id] || {
    problemId: activeProblem.id,
    code: activeProblem.starterCode.python,
    language: "python" as OALanguage,
    visibleTestsPassed: 0,
    visibleTestsTotal: activeProblem.testCases.filter((tc) => !tc.isHidden).length,
    hiddenTestsPassed: 0,
    hiddenTestsTotal: activeProblem.testCases.filter((tc) => tc.isHidden).length,
    status: "NOT_STARTED",
    testResults: [],
    approach: "",
    claimedTime: "O(N)",
    claimedSpace: "O(1)",
  };

  // 3. Hydrate session from localStorage on initial mount
  useEffect(() => {
    const existing = getActiveMultiSession();
    if (existing && existing.trackId === track.id) {
      // Calculate remaining time strictly against startedAt + totalTime
      const remaining = calculateRemainingSeconds(existing);
      if (remaining > 0 && existing.status === "IN_PROGRESS") {
        sessionMetadataRef.current = {
          sessionId: existing.sessionId,
          startedAt: existing.startedAt,
          totalTimeAllocatedSeconds: existing.totalTimeAllocatedSeconds,
        };
        setTimeRemainingSeconds(remaining);
        setQuestionsState(existing.questions);
        if (existing.activeProblemId && problems.some((p) => p.id === existing.activeProblemId)) {
          setActiveProblemId(existing.activeProblemId);
        }
        if (existing.phase) {
          setCurrentPhase(existing.phase);
        }
        if (existing.followUpQuestions) {
          setFollowUpQuestions(existing.followUpQuestions);
        }
        if (existing.followUpResponses) {
          setFollowUpResponses(existing.followUpResponses);
        }
        return;
      }
    }

    // New Session Initialization
    const newSession: OAMultiAssessmentSession = {
      sessionId: sessionMetadataRef.current.sessionId,
      trackId: track.id,
      companyProfile: track.companyProfile,
      trackTitle: track.title,
      startedAt: sessionMetadataRef.current.startedAt,
      totalTimeAllocatedSeconds: track.totalTimeSeconds,
      activeProblemId: problems[0]?.id || "",
      questions: questionsState,
      status: "IN_PROGRESS",
      phase: "workspace",
    };
    saveActiveMultiSession(newSession);
  }, [track.id]);

  // 4. Global Countdown Timer Interval
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmitOnTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 5. Periodic Auto-Save Every 10 Seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      const sessionToSave: OAMultiAssessmentSession = {
        sessionId: sessionMetadataRef.current.sessionId,
        trackId: track.id,
        companyProfile: track.companyProfile,
        trackTitle: track.title,
        startedAt: sessionMetadataRef.current.startedAt,
        totalTimeAllocatedSeconds: track.totalTimeSeconds,
        activeProblemId,
        questions: questionsState,
        status: "IN_PROGRESS",
        phase: currentPhase,
        followUpQuestions,
        followUpResponses,
      };
      saveActiveMultiSession(sessionToSave);
    }, 10000);

    return () => clearInterval(autoSaveInterval);
  }, [track, activeProblemId, questionsState, currentPhase, followUpQuestions, followUpResponses]);

  // Update active question's code
  const handleCodeChange = (newCode: string) => {
    setQuestionsState((prev) => {
      const current = prev[activeProblem.id];
      const isStarted = newCode.trim().length > 30;
      return {
        ...prev,
        [activeProblem.id]: {
          ...current,
          code: newCode,
          status: current.status === "TESTS_PASSING" ? "TESTS_PASSING" : isStarted ? "IN_PROGRESS" : current.status,
        },
      };
    });
  };

  // Update active question's language
  const handleLanguageChange = (newLang: OALanguage) => {
    setQuestionsState((prev) => {
      const current = prev[activeProblem.id];
      return {
        ...prev,
        [activeProblem.id]: {
          ...current,
          language: newLang,
          code: activeProblem.starterCode[newLang] || current.code,
        },
      };
    });
  };

  const handleResetStarterCode = () => {
    setQuestionsState((prev) => {
      const current = prev[activeProblem.id];
      return {
        ...prev,
        [activeProblem.id]: {
          ...current,
          code: activeProblem.starterCode[current.language] || "",
        },
      };
    });
  };

  // Run visible test cases for active question
  const handleRunTests = async () => {
    if (isRunningTests) return;
    setIsRunningTests(true);

    try {
      const visibleCases = activeProblem.testCases.filter((tc) => !tc.isHidden);
      const results = await executeTestCases(
        activeProblem,
        activeState.code,
        activeState.language,
        visibleCases
      );

      const passedCount = results.filter((r) => r.passed).length;
      const totalCount = results.length;
      const isAllPassing = passedCount === totalCount && totalCount > 0;

      setQuestionsState((prev) => ({
        ...prev,
        [activeProblem.id]: {
          ...prev[activeProblem.id],
          visibleTestsPassed: passedCount,
          visibleTestsTotal: totalCount,
          testResults: results,
          status: isAllPassing ? "TESTS_PASSING" : "IN_PROGRESS",
          lastRunAt: Date.now(),
        },
      }));
    } catch (err) {
      console.error("Test execution error:", err);
    } finally {
      setIsRunningTests(false);
    }
  };

  // Phase 2: Update approach & Big-O
  const handleUpdateQuestionApproach = (
    problemId: string,
    approach: string,
    time: string,
    space: string
  ) => {
    setQuestionsState((prev) => ({
      ...prev,
      [problemId]: {
        ...prev[problemId],
        approach,
        claimedTime: time,
        claimedSpace: space,
      },
    }));
  };

  // Advance from Phase 2 to Phase 3 (Generate Gemini Follow-Ups)
  const handleProceedToGeminiDefense = async () => {
    setCurrentPhase("followups");
    if (followUpQuestions.length === 0) {
      setIsLoadingFollowUps(true);
      try {
        const attemptedQuestions = problems.map((p, idx) => {
          const s = questionsState[p.id];
          return {
            order: idx + 1,
            problemId: p.id,
            title: p.title,
            code: s?.code || "",
            language: s?.language || "python",
            approach: s?.approach || "",
            claimedTime: s?.claimedTime || "O(N)",
            claimedSpace: s?.claimedSpace || "O(1)",
          };
        });

        const res = await fetch("/api/oa/generate-followups", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company: track.companyProfile,
            questions: attemptedQuestions,
          }),
        });

        const data = await res.json();
        setFollowUpQuestions(data.questions || []);
      } catch (err) {
        console.error("Error generating follow-ups:", err);
      } finally {
        setIsLoadingFollowUps(false);
      }
    }
  };

  // Final Assessment Submission & Evaluation
  const handleFinalSubmit = async (isTimeout = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // 1. Run all tests (visible + hidden) across all questions
      const evaluatedQuestionsPayload = [];

      for (let i = 0; i < problems.length; i++) {
        const prob = problems[i];
        const state = questionsState[prob.id];
        const weight = track.problemWeights[prob.id] || Math.round(100 / problems.length);

        // Execute full test suite (including hidden edge cases)
        const allResults = await executeTestCases(
          prob,
          state.code,
          state.language,
          prob.testCases
        );

        const visibleCases = prob.testCases.filter((tc) => !tc.isHidden);
        const hiddenCases = prob.testCases.filter((tc) => tc.isHidden);

        const visiblePassed = allResults.filter(
          (r) => !r.isHidden && r.passed
        ).length;
        const hiddenPassed = allResults.filter(
          (r) => r.isHidden && r.passed
        ).length;

        evaluatedQuestionsPayload.push({
          orderIndex: i + 1,
          problemId: prob.id,
          problemTitle: prob.title,
          difficulty: prob.difficulty,
          weight,
          submittedCode: state.code,
          language: state.language,
          testResults: allResults,
          visibleTestsPassed: visiblePassed,
          visibleTestsTotal: visibleCases.length,
          hiddenTestsPassed: hiddenPassed,
          hiddenTestsTotal: hiddenCases.length,
          approachSummary: state.approach,
          timeComplexity: state.claimedTime,
          spaceComplexity: state.claimedSpace,
        });
      }

      // 2. Package formatted follow-up responses
      const formattedFollowUps: OAFollowUpResponse[] = followUpQuestions.map((q) => ({
        questionId: q.id,
        category: q.category,
        question: q.question,
        userAnswer: followUpResponses[q.id] || "No response provided",
      }));

      // 3. Time spent
      const timeSpentSeconds = Math.max(0, track.totalTimeSeconds - timeRemainingSeconds);

      // 4. Call /api/oa/finalize-session
      const finalizeRes = await fetch("/api/oa/finalize-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionMetadataRef.current.sessionId,
          trackId: track.id,
          trackTitle: track.title,
          companyProfile: track.companyProfile,
          totalTimeAllocatedSeconds: track.totalTimeSeconds,
          timeSpentSeconds,
          status: isTimeout ? "EXPIRED" : "SUBMITTED",
          questions: evaluatedQuestionsPayload,
          followUpResponses: formattedFollowUps,
        }),
      });

      const multiAssessmentResult = await finalizeRes.json();

      // 5. Store in local storage and clear active session
      saveMultiOAResult(multiAssessmentResult);
      clearActiveMultiSession();

      // 6. Navigate to Benchmark Report
      router.push(`/oa/results/${multiAssessmentResult.id}`);
    } catch (err) {
      console.error("Submission finalization error:", err);
      setIsSubmitting(false);
    }
  };

  // Auto-submit guard triggered at 00:00:00
  const handleAutoSubmitOnTimeout = () => {
    setIsPreSubmitOpen(false);
    handleFinalSubmit(true);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0d0e11] text-neutral-200 font-['Hanken_Grotesk'] overflow-hidden select-none">
      {/* 1. Global Session Top Navigation Bar */}
      <OANavbar
        companyProfile={track.companyProfile}
        trackTitle={track.title}
        problems={problems}
        weights={track.problemWeights}
        questionsState={questionsState}
        activeProblemId={activeProblemId}
        onSelectProblem={(id) => {
          setActiveProblemId(id);
          if (currentPhase !== "workspace") setCurrentPhase("workspace");
        }}
        timeRemainingSeconds={timeRemainingSeconds}
        currentPhase={currentPhase}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenSubmitModal={() => setIsPreSubmitOpen(true)}
        onRunTests={handleRunTests}
        isRunningTests={isRunningTests}
        isSubmitting={isSubmitting}
      />

      {/* 2. Side Drawer (Collapsible Overview Matrix) */}
      <QuestionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        problems={problems}
        weights={track.problemWeights}
        questionsState={questionsState}
        activeProblemId={activeProblemId}
        onSelectProblem={(id) => {
          setActiveProblemId(id);
          if (currentPhase !== "workspace") setCurrentPhase("workspace");
        }}
      />

      {/* 3. Pre-Submission Review Matrix Modal */}
      <PreSubmitModal
        isOpen={isPreSubmitOpen}
        onClose={() => setIsPreSubmitOpen(false)}
        onConfirmSubmit={() => {
          setIsPreSubmitOpen(false);
          setCurrentPhase("explanation");
        }}
        problems={problems}
        weights={track.problemWeights}
        questionsState={questionsState}
        timeRemainingSeconds={timeRemainingSeconds}
        isSubmitting={isSubmitting}
      />

      {/* 4. Phase Conditionals */}

      {/* PHASE 1: Multi-Question Workspace */}
      {currentPhase === "workspace" && (
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0 p-3 sm:p-4 gap-4 sm:gap-5 bg-[#0c0d10]">
          {/* Left Pane: Active Problem Specification (40% Width) wrapped in .neu-card */}
          <div className="w-full lg:w-[40%] h-full flex flex-col neu-card overflow-hidden">
            {/* Header */}
            <div className="h-11 px-5 bg-[#101114] border-b border-white/[0.04] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-bold text-neutral-200 font-mono tracking-wide">
                  Problem Specification
                </span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">
                {activeProblem.topic}
              </span>
            </div>

            {/* Scrollable Specification Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 text-sm text-neutral-300 font-sans leading-relaxed select-text">
              {/* Title & Tags */}
              <div className="space-y-2 border-b border-white/[0.06] pb-4">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="neu-button px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase text-neutral-300">
                    {activeProblem.difficulty}
                  </span>
                  <span className="neu-active-pill px-2.5 py-0.5 text-emerald-400 font-bold text-[10px]">
                    {track.problemWeights[activeProblem.id] || 0} Points
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight font-mono">
                  {activeProblem.title}
                </h2>
                <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                  {activeProblem.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-xs bg-black/40 border border-white/5 text-neutral-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description Markdown */}
              <div className="prose prose-invert max-w-none text-sm text-neutral-300 leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {activeProblem.description}
                </ReactMarkdown>
              </div>

              {/* Examples in Inset Recessed Wells */}
              <div className="space-y-3 pt-2 font-mono">
                <span className="text-xs font-bold text-neutral-200 uppercase tracking-wider block">
                  Examples
                </span>
                {activeProblem.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="neu-inset p-4 space-y-2.5 text-xs"
                  >
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                      Example {idx + 1}
                    </span>
                    <div className="space-y-1">
                      <span className="text-neutral-500 block text-[11px]">Input:</span>
                      <pre className="p-2.5 rounded-lg bg-black/50 text-neutral-200 text-[11px] overflow-x-auto whitespace-pre-wrap border border-white/[0.03]">
                        {ex.input}
                      </pre>
                    </div>
                    <div className="space-y-1">
                      <span className="text-neutral-500 block text-[11px]">Output:</span>
                      <pre className="p-2.5 rounded-lg bg-black/50 text-emerald-400 text-[11px] overflow-x-auto whitespace-pre-wrap border border-white/[0.03]">
                        {ex.output}
                      </pre>
                    </div>
                    {ex.explanation && (
                      <p className="text-[11px] font-sans text-neutral-400 pt-1 italic">
                        Note: {ex.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Constraints */}
              <div className="space-y-2 pt-2 font-mono">
                <span className="text-xs font-bold text-neutral-200 uppercase tracking-wider block">
                  Constraints
                </span>
                <ul className="space-y-1.5 list-disc pl-4 text-xs text-neutral-400">
                  {activeProblem.constraints.map((c, idx) => (
                    <li key={idx} className="font-mono text-[11px]">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column Container (60% Width) wrapped in .neu-card */}
          <div className="w-full lg:w-[60%] h-full flex flex-col neu-card overflow-hidden p-4 gap-4">
            {/* Top 65%: Monaco Editor */}
            <div className="h-[60%] lg:h-[65%] min-h-[220px] overflow-hidden rounded-xl">
              <MonacoCodeEditor
                key={`${activeProblem.id}_${activeState.language}`}
                code={activeState.code}
                onChange={handleCodeChange}
                language={activeState.language}
                onLanguageChange={handleLanguageChange}
                onResetStarterCode={handleResetStarterCode}
                onRunTests={handleRunTests}
                isRunningTests={isRunningTests}
              />
            </div>

            {/* Bottom 35%: Dynamic Test Case Console */}
            <div className="h-[40%] lg:h-[35%] min-h-[180px] overflow-hidden rounded-xl">
              <TestCaseConsole
                testCases={activeProblem.testCases}
                testResults={activeState.testResults}
                isRunning={isRunningTests}
              />
            </div>
          </div>
        </main>
      )}

      {/* PHASE 2: Technical Approach & Defense */}
      {currentPhase === "explanation" && (
        <MultiApproachDefense
          problems={problems}
          weights={track.problemWeights}
          questionsState={questionsState}
          onUpdateQuestionApproach={handleUpdateQuestionApproach}
          onProceedToGeminiDefense={handleProceedToGeminiDefense}
          isLoadingFollowUps={isLoadingFollowUps}
        />
      )}

      {/* PHASE 3: Gemini Targeted Follow-Up Round */}
      {currentPhase === "followups" && (
        <FollowUpRound
          questions={followUpQuestions}
          responses={followUpResponses}
          onResponseChange={(qId, ans) =>
            setFollowUpResponses((prev) => ({ ...prev, [qId]: ans }))
          }
          onSubmitAssessment={() => handleFinalSubmit(false)}
          isLoadingQuestions={isLoadingFollowUps}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
