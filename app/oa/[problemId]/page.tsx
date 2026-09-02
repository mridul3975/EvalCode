"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { OA_PROBLEMS } from "@/data/oa-problems";
import {
  OALanguage,
  OAPhase,
  OATestResult,
  OAFollowUpQuestion,
  OAFollowUpResponse,
} from "@/types/oa";
import { executeTestCases } from "@/lib/oa/code-executor";
import { saveOAResult } from "@/lib/oa/storage";
import { OANavbar } from "@/components/oa/OANavbar";
import { MonacoCodeEditor } from "@/components/oa/MonacoCodeEditor";
import { TestCaseConsole } from "@/components/oa/TestCaseConsole";
import { ExplanationForm } from "@/components/oa/ExplanationForm";
import { FollowUpRound } from "@/components/oa/FollowUpRound";
import { BookOpen } from "lucide-react";

export default function OAWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const problemId = (params?.problemId as string) || "";

  const problem = OA_PROBLEMS.find((p) => p.id === problemId) || OA_PROBLEMS[0];

  const [language, setLanguage] = useState<OALanguage>("python");
  const [code, setCode] = useState<string>(problem.starterCode.python);
  const [currentPhase, setCurrentPhase] = useState<OAPhase>("code");

  // 40-Minute Countdown Clock (2400 seconds)
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(2400);

  // Test Results
  const [testResults, setTestResults] = useState<OATestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);

  // Phase 2: Written Explanation
  const [approach, setApproach] = useState<string>("");
  const [claimedTime, setClaimedTime] = useState<string>("O(N)");
  const [claimedSpace, setClaimedSpace] = useState<string>("O(1)");

  // Phase 3: Gemini Dynamic Follow-Ups
  const [followUpQuestions, setFollowUpQuestions] = useState<OAFollowUpQuestion[]>([]);
  const [followUpResponses, setFollowUpResponses] = useState<Record<string, string>>({});
  const [isLoadingFollowUps, setIsLoadingFollowUps] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Auto countdown interval
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

  // Update starter code when language changes
  const handleLanguageChange = (newLang: OALanguage) => {
    setLanguage(newLang);
    setCode(problem.starterCode[newLang] || "");
  };

  const handleResetStarterCode = () => {
    setCode(problem.starterCode[language] || "");
  };

  // Phase 1: Run Visible Tests
  const handleRunTests = async () => {
    setIsRunningTests(true);
    try {
      const visibleCases = problem.testCases.filter((tc) => !tc.isHidden);
      const results = await executeTestCases(problem, code, language, visibleCases);
      setTestResults(results);
    } catch (err) {
      console.error("Test execution error:", err);
    } finally {
      setIsRunningTests(false);
    }
  };

  // Transition to Phase 3: Generate Gemini Follow-Ups
  const handleProceedToDefense = async () => {
    setCurrentPhase("followups");
    if (followUpQuestions.length === 0) {
      setIsLoadingFollowUps(true);
      try {
        const res = await fetch("/api/oa/generate-followups", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            problemTitle: problem.title,
            problemDescription: problem.description,
            constraints: problem.constraints,
            submittedCode: code,
            language,
            claimedTimeComplexity: claimedTime,
            claimedSpaceComplexity: claimedSpace,
            approachExplanation: approach,
          }),
        });

        const data = await res.json();
        setFollowUpQuestions(data.questions || []);
      } catch (err) {
        console.error("Error fetching Gemini follow-ups:", err);
      } finally {
        setIsLoadingFollowUps(false);
      }
    }
  };

  // Final Assessment Submission
  const handleSubmitAssessment = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // 1. Run all test cases (visible + hidden)
      const allResults = await executeTestCases(problem, code, language, problem.testCases);
      const passedCount = allResults.filter((r) => r.passed).length;
      const totalCount = allResults.length;

      // 2. Package formatted follow-up responses
      const formattedFollowUps: OAFollowUpResponse[] = followUpQuestions.map((q) => ({
        questionId: q.id,
        category: q.category,
        question: q.question,
        userAnswer: followUpResponses[q.id] || "No response provided",
      }));

      // 3. Call Evaluation API
      const timeSpent = 2400 - timeRemainingSeconds;
      const evalRes = await fetch("/api/oa/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: problem.id,
          companyProfile: problem.companyProfile,
          problemTitle: problem.title,
          submittedCode: code,
          language,
          timeSpentSeconds: timeSpent,
          testResults: allResults,
          testsPassed: passedCount,
          totalTests: totalCount,
          approachExplanation: approach,
          claimedTimeComplexity: claimedTime,
          claimedSpaceComplexity: claimedSpace,
          followUpResponses: formattedFollowUps,
          optimalComplexity: problem.optimalComplexity,
        }),
      });

      const assessmentResult = await evalRes.json();
      saveOAResult(assessmentResult);

      // Redirect to Diagnostic Report
      router.push(`/oa/results/${assessmentResult.id}`);
    } catch (err) {
      console.error("Assessment submission error:", err);
      setIsSubmitting(false);
    }
  };

  const handleAutoSubmitOnTimeout = () => {
    handleSubmitAssessment();
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0d0e11] text-neutral-200 font-['Hanken_Grotesk'] overflow-hidden select-none">
      {/* Streamlined 52px Top Bar */}
      <OANavbar
        companyProfile={problem.companyProfile}
        problemTitle={problem.title}
        timeRemainingSeconds={timeRemainingSeconds}
        currentPhase={currentPhase}
        onPhaseChange={(phase) => {
          if (phase === "followups" && followUpQuestions.length === 0) {
            handleProceedToDefense();
          } else {
            setCurrentPhase(phase);
          }
        }}
        onSubmit={handleSubmitAssessment}
        onRunTests={handleRunTests}
        isRunningTests={isRunningTests}
        isSubmitting={isSubmitting}
      />

      {/* Two-Pane Split Layout with 1px Divider */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Left Pane: Problem Statement (40% Width) */}
        <div className="w-full lg:w-[40%] h-full flex flex-col border-r border-neutral-800/80 bg-[#0d0e11] overflow-hidden">
          {/* Header */}
          <div className="h-9 px-4 bg-[#121418] border-b border-neutral-800/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-semibold text-neutral-300 font-mono">
                Problem Description
              </span>
            </div>
            <span className="text-[10px] font-mono text-neutral-500">
              {problem.topic}
            </span>
          </div>

          {/* Body Scrollable Spec */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 text-sm text-neutral-300 font-sans leading-relaxed select-text">
            {/* Title & Tags */}
            <div className="space-y-2 border-b border-neutral-800/60 pb-4">
              <h2 className="text-xl font-semibold text-white tracking-tight">
                {problem.title}
              </h2>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                {problem.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-xs bg-neutral-900 border border-neutral-800 text-neutral-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Description with Markdown */}
            <div className="prose prose-invert max-w-none text-sm text-neutral-300 leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {problem.description}
              </ReactMarkdown>
            </div>

            {/* Examples */}
            <div className="space-y-3 pt-2 font-mono">
              <span className="text-xs font-semibold text-neutral-200 uppercase tracking-wider block">
                Examples
              </span>
              {problem.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-neutral-950/60 border border-neutral-800/60 space-y-2 text-xs"
                >
                  <span className="text-[10px] font-semibold text-neutral-500 uppercase block">
                    Example {idx + 1}
                  </span>
                  <div className="space-y-1">
                    <span className="text-neutral-500 block text-[11px]">Input:</span>
                    <pre className="p-2 rounded bg-neutral-900 text-neutral-200 text-[11px] overflow-x-auto whitespace-pre-wrap">
                      {ex.input}
                    </pre>
                  </div>
                  <div className="space-y-1">
                    <span className="text-neutral-500 block text-[11px]">Output:</span>
                    <pre className="p-2 rounded bg-neutral-900 text-emerald-400 text-[11px] overflow-x-auto whitespace-pre-wrap">
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
              <span className="text-xs font-semibold text-neutral-200 uppercase tracking-wider block">
                Constraints
              </span>
              <ul className="space-y-1.5 list-disc pl-4 text-xs text-neutral-400">
                {problem.constraints.map((c, idx) => (
                  <li key={idx} className="font-mono text-[11px]">{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Pane: Split Vertically (60% Width, 65% Editor / 35% Console) */}
        <div className="w-full lg:w-[60%] h-full flex flex-col overflow-hidden bg-[#0d0e11]">
          {/* Top 65%: Monaco Editor */}
          <div className="h-[60%] lg:h-[65%] min-h-[220px]">
            <MonacoCodeEditor
              code={code}
              onChange={setCode}
              language={language}
              onLanguageChange={handleLanguageChange}
              onResetStarterCode={handleResetStarterCode}
              onRunTests={handleRunTests}
              isRunningTests={isRunningTests}
            />
          </div>

          {/* Bottom 35%: Dynamic Console / Form / Defense Round */}
          <div className="h-[40%] lg:h-[35%] min-h-[180px] overflow-hidden">
            {currentPhase === "code" && (
              <TestCaseConsole
                testCases={problem.testCases}
                testResults={testResults}
                isRunning={isRunningTests}
              />
            )}

            {currentPhase === "explanation" && (
              <ExplanationForm
                approach={approach}
                onApproachChange={setApproach}
                claimedTime={claimedTime}
                onClaimedTimeChange={setClaimedTime}
                claimedSpace={claimedSpace}
                onClaimedSpaceChange={setClaimedSpace}
                onProceedToDefense={handleProceedToDefense}
                onBackToCode={() => setCurrentPhase("code")}
                isLoading={isLoadingFollowUps}
              />
            )}

            {currentPhase === "followups" && (
              <FollowUpRound
                questions={followUpQuestions}
                responses={followUpResponses}
                onResponseChange={(qId, ans) =>
                  setFollowUpResponses((prev) => ({ ...prev, [qId]: ans }))
                }
                onSubmitAssessment={handleSubmitAssessment}
                isLoadingQuestions={isLoadingFollowUps}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
