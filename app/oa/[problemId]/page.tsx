"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { OA_PROBLEMS } from "@/data/oa-problems";
import {
  OAProblem,
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
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Code2,
  ListChecks,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Terminal,
} from "lucide-react";

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
    <div className="min-h-screen bg-[#121416] text-[#e2e2e5] font-['Hanken_Grotesk'] flex flex-col antialiased">
      {/* Pinned Assessment Navigation Bar */}
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
        isSubmitting={isSubmitting}
      />

      {/* 3-Pane LeetCode Desktop Workspace */}
      <main className="flex-1 w-full max-w-[1920px] mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 overflow-hidden">
        {/* Left Pane: Problem Spec, Constraints, Examples (5 Cols on Desktop) */}
        <div className="lg:col-span-5 h-[calc(100vh-6rem)] bg-[#141618] border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col font-mono">
          {/* Left Header */}
          <div className="p-3.5 bg-[#181a1d] border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase text-white tracking-wider">
                PROBLEM SPECIFICATION
              </span>
            </div>
            <span className="text-[10px] text-[#83958c] font-bold">
              {problem.topic}
            </span>
          </div>

          {/* Left Body Scrollable Spec */}
          <div className="flex-1 p-5 overflow-y-auto space-y-6 text-xs text-[#b9cbc1] font-sans">
            {/* Title & Tags */}
            <div className="space-y-2 border-b border-white/5 pb-4">
              <h2 className="text-xl sm:text-2xl font-black text-white font-mono uppercase tracking-tight">
                {problem.title}
              </h2>
              <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                {problem.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-[#1e2022] text-[#83958c] border border-white/5"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Description with Markdown */}
            <div className="space-y-3 prose prose-invert max-w-none text-xs leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {problem.description}
              </ReactMarkdown>
            </div>

            {/* Examples */}
            <div className="space-y-3 pt-2 font-mono">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                SAMPLE EXAMPLES:
              </span>
              {problem.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-[#0c0e10] border border-white/5 space-y-2 text-xs"
                >
                  <span className="text-[10px] font-bold text-[#83958c] uppercase block">
                    EXAMPLE {idx + 1}
                  </span>
                  <div className="space-y-1">
                    <span className="text-gray-400 block text-[11px]">Input:</span>
                    <pre className="p-2 rounded bg-[#141618] text-white text-[11px] overflow-x-auto whitespace-pre-wrap">
                      {ex.input}
                    </pre>
                  </div>
                  <div className="space-y-1">
                    <span className="text-gray-400 block text-[11px]">Output:</span>
                    <pre className="p-2 rounded bg-[#141618] text-emerald-400 text-[11px] overflow-x-auto whitespace-pre-wrap">
                      {ex.output}
                    </pre>
                  </div>
                  {ex.explanation && (
                    <p className="text-[11px] font-sans text-gray-400 pt-1 italic">
                      Note: {ex.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div className="space-y-2 pt-2 font-mono">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                SYSTEM CONSTRAINTS:
              </span>
              <ul className="space-y-1.5 list-disc pl-4 text-xs text-[#b9cbc1]">
                {problem.constraints.map((c, idx) => (
                  <li key={idx} className="font-mono text-[11px]">{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Pane: Split into Top (Monaco) and Bottom (Console / Form / Follow-ups) (7 Cols) */}
        <div className="lg:col-span-7 h-[calc(100vh-6rem)] flex flex-col gap-4 overflow-hidden">
          {/* Top-Right: Monaco Code Editor */}
          <div className="flex-1 min-h-[45%]">
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

          {/* Bottom-Right: Dynamic Phase Container */}
          <div className="flex-1 min-h-[45%]">
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
