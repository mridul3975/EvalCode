"use client";

import React, { useState, useEffect, useMemo } from "react";
import { CodeEditor as Editor } from "@/components/ui/CodeEditor";
import { QuestionItem, QuestionLanguage } from "@/types/question";
import { PracticeAttempt, PracticeTestResult } from "@/types/submission";
import {
  buildTestCasesForQuestion,
  generateStarterCode,
  executePracticeTests,
  PracticeTestCase,
} from "@/lib/practice/attempt-engine";
import { saveStoredAttempt, getStoredAttempt } from "@/lib/storage";
import { CodeDiffViewer } from "@/components/review-studio/CodeDiffViewer";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  Play,
  Send,
  RotateCcw,
  Copy,
  Check,
  Code2,
  Terminal,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  FileCode,
} from "lucide-react";

// Dynamically import Monaco Editor to prevent SSR hydration mismatches


interface PracticeAttemptWorkspaceProps {
  question: QuestionItem;
  initialLanguage?: QuestionLanguage;
  onSwitchToAuditMode?: () => void;
}

export function PracticeAttemptWorkspace({
  question,
  initialLanguage = "python",
  onSwitchToAuditMode,
}: PracticeAttemptWorkspaceProps) {
  const [language, setLanguage] = useState<QuestionLanguage>(initialLanguage);
  const [code, setCode] = useState<string>(() => generateStarterCode(question, initialLanguage));
  const [copied, setCopied] = useState(false);

  // Test cases & execution state
  const testCases = useMemo(() => buildTestCasesForQuestion(question), [question]);
  const [selectedCaseIdx, setSelectedCaseIdx] = useState<number>(0);
  const [testResults, setTestResults] = useState<PracticeTestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Submission & post-eval state
  const [submittedAttempt, setSubmittedAttempt] = useState<PracticeAttempt | null>(null);
  const [showSolutionDiff, setShowSolutionDiff] = useState(false);

  // Load previous attempt if exists
  useEffect(() => {
    const saved = getStoredAttempt(question.id);
    if (saved) {
      setSubmittedAttempt(saved);
      setCode(saved.code);
      setLanguage(saved.language);
      setTestResults(saved.testResults);
    } else {
      setCode(generateStarterCode(question, language));
    }
  }, [question.id]);

  // Handle language switch
  const handleLanguageChange = (newLang: QuestionLanguage) => {
    setLanguage(newLang);
    // If code is still the starter stub or empty, regenerate for the new language
    const currentStarter = generateStarterCode(question, language);
    if (code.trim() === currentStarter.trim() || code.trim().length === 0) {
      setCode(generateStarterCode(question, newLang));
    }
  };

  // Reset to starter template
  const handleResetStarter = () => {
    const freshStarter = generateStarterCode(question, language);
    setCode(freshStarter);
  };

  // Copy code to clipboard
  const handleCopyCode = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Run visible test cases
  const handleRunTests = async () => {
    setIsRunningTests(true);
    try {
      const visibleCases = testCases.filter((tc) => !tc.isEdgeCase);
      const results = await executePracticeTests(question, code, language, visibleCases);
      setTestResults(results);
    } catch (e) {
      console.error("Test execution failed", e);
    } finally {
      setIsRunningTests(false);
    }
  };

  // Submit solution (runs all tests including edge cases)
  const handleSubmitSolution = async () => {
    setIsSubmitting(true);
    try {
      const results = await executePracticeTests(question, code, language, testCases);
      setTestResults(results);

      const passedCount = results.filter((r) => r.passed).length;
      const totalCount = results.length;
      const isAllPassed = passedCount === totalCount && totalCount > 0;

      const attempt: PracticeAttempt = {
        questionId: question.id,
        code,
        language,
        passedCount,
        totalCount,
        isAllPassed,
        submittedAt: new Date().toISOString(),
        testResults: results,
      };

      saveStoredAttempt(question.id, attempt);
      setSubmittedAttempt(attempt);

      if (isAllPassed) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (e) {
      console.error("Submission failed", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Active test case in tab
  const activeCase = testCases[selectedCaseIdx] || testCases[0];
  const activeResult = testResults.find((r) => r.testCaseId === activeCase?.id);

  const passedCount = testResults.filter((r) => r.passed).length;
  const totalRun = testResults.length;

  const monacoLang = language === "cpp" ? "cpp" : language === "javascript" ? "javascript" : "python";

  return (
    <div className="flex flex-col gap-6 font-mono text-neutral-200">
      {/* 1. Code Editor Card */}
      <div className="neu-card p-0 overflow-hidden flex flex-col border border-white/[0.06]">
        {/* Editor Toolbar */}
        <div className="min-h-12 flex-wrap py-1 px-4 bg-[#101114] border-b border-white/[0.04] flex items-center justify-between gap-3 shrink-0">
          {/* Language Selector */}
          <div className="flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-emerald-400 mr-1 shrink-0" />
            {(["python", "javascript", "cpp"] as QuestionLanguage[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => handleLanguageChange(lang)}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer",
                  language === lang
                    ? "neu-inset text-emerald-300 font-bold border border-emerald-500/30"
                    : "neu-button text-neutral-400 hover:text-white"
                )}
              >
                {lang === "cpp" ? "C++" : lang === "javascript" ? "JavaScript" : "Python 3"}
              </button>
            ))}
          </div>

          {/* Actions: Reset & Copy */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetStarter}
              title="Reset to Starter Stub" aria-label="Reset to starter code"
              className="neu-button px-2.5 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Reset</span>
            </button>

            <button
              type="button"
              onClick={handleCopyCode}
              title="Copy Code" aria-label="Copy code"
              className="neu-button px-2.5 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px] text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Monaco Editor Canvas */}
        <div className="h-[420px] w-full bg-[#0c0d10] p-2">
          <div className="w-full h-full overflow-hidden rounded-md">
            <Editor
              height="100%"
              language={monacoLang}
              theme="vs-dark"
              value={code}
              onChange={(newVal) => setCode(newVal || "")}
              options={{
                fontSize: 14,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                minimap: { enabled: false },
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                bracketPairColorization: { enabled: true },
                formatOnPaste: true,
                padding: { top: 8 },
              }}
            />
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="p-4 bg-[#101114] border-t border-white/[0.04] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {submittedAttempt && (
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold font-mono border flex items-center gap-1.5",
                  submittedAttempt.isAllPassed
                    ? "neu-active-pill text-emerald-400 border-emerald-500/30"
                    : "neu-active-pill text-amber-400 border-amber-500/30"
                )}
              >
                {submittedAttempt.isAllPassed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>
                  {submittedAttempt.passedCount}/{submittedAttempt.totalCount} Passed
                </span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRunTests}
              disabled={isRunningTests || isSubmitting}
              className="neu-button px-5 py-2.5 text-xs font-mono font-bold uppercase rounded-xl flex items-center gap-2 text-neutral-200 hover:text-emerald-400 disabled:opacity-40 cursor-pointer"
            >
              {isRunningTests ? (
                <Clock className="w-4 h-4 animate-spin text-emerald-400" />
              ) : (
                <Play className="w-4 h-4 text-emerald-400" />
              )}
              <span>{isRunningTests ? "Running..." : "Run Tests"}</span>
            </button>

            <button
              type="button"
              onClick={handleSubmitSolution}
              disabled={isSubmitting || isRunningTests}
              className="neu-button-primary px-6 py-2.5 text-xs font-mono font-bold uppercase rounded-xl flex items-center gap-2 text-emerald-300 border border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-950/60 disabled:opacity-40 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.15)]"
            >
              {isSubmitting ? (
                <Clock className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{isSubmitting ? "Submitting..." : "Submit Solution"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Test Cases Console */}
      <div className="neu-card p-0 overflow-hidden flex flex-col border border-white/[0.06]">
        {/* Test Console Header Tabs */}
        <div className="min-h-12 flex-wrap py-1 px-4 bg-[#101114] border-b border-white/[0.04] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none h-full py-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-300 mr-2 shrink-0">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Test Cases</span>
            </div>

            {testCases.map((tc, idx) => {
              const res = testResults.find((r) => r.testCaseId === tc.id);
              const isSelected = selectedCaseIdx === idx;
              return (
                <button
                  key={tc.id}
                  type="button"
                  onClick={() => setSelectedCaseIdx(idx)}
                  className={cn(
                    "text-xs font-mono transition-all flex items-center gap-1.5 px-3 py-1 cursor-pointer shrink-0 rounded-lg",
                    isSelected
                      ? "neu-inset text-white font-bold border border-white/10"
                      : "neu-button text-neutral-400 hover:text-white"
                  )}
                >
                  {res ? (
                    res.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    )
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                  )}
                  <span>{tc.description}</span>
                </button>
              );
            })}
          </div>

          {totalRun > 0 && (
            <div className="flex items-center gap-2 text-xs shrink-0">
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border",
                  passedCount === totalRun
                    ? "neu-active-pill text-emerald-400 border-emerald-500/30"
                    : "neu-active-pill text-amber-400 border-amber-500/30"
                )}
              >
                {passedCount}/{totalRun} Passed
              </span>
            </div>
          )}
        </div>

        {/* Selected Test Case View */}
        <div className="p-5 space-y-4 bg-[#0c0d10] text-xs">
          {activeCase && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white uppercase">{activeCase.description}</span>
                  {activeCase.isEdgeCase && (
                    <span className="neu-active-pill text-[9px] text-amber-400 border-amber-500/30 px-2 py-0.5">
                      Edge Case
                    </span>
                  )}
                </div>

                {activeResult && (
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "font-bold uppercase text-[11px] flex items-center gap-1",
                        activeResult.passed ? "text-emerald-400" : "text-rose-400"
                      )}
                    >
                      {activeResult.passed ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Passed</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Failed</span>
                        </>
                      )}
                    </span>
                    <span className="text-neutral-500 text-[10px]">
                      {activeResult.executionTimeMs}ms
                    </span>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="space-y-1.5">
                <span className="text-neutral-400 text-[11px] font-semibold uppercase">Input:</span>
                <div className="neu-inset p-3 rounded-lg text-neutral-200 overflow-x-auto">
                  <code>{activeCase.input}</code>
                </div>
              </div>

              {/* Expected Output */}
              <div className="space-y-1.5">
                <span className="text-neutral-400 text-[11px] font-semibold uppercase">Expected Output:</span>
                <div className="neu-inset p-3 rounded-lg text-emerald-400 overflow-x-auto">
                  <code>{activeCase.expected}</code>
                </div>
              </div>

              {/* Actual Output (if executed) */}
              {activeResult && (
                <div className="space-y-1.5">
                  <span className="text-neutral-400 text-[11px] font-semibold uppercase">Your Output:</span>
                  <div
                    className={cn(
                      "neu-inset p-3 rounded-lg overflow-x-auto",
                      activeResult.passed ? "text-emerald-400" : "text-rose-400"
                    )}
                  >
                    <code>
                      {typeof activeResult.actual === "object"
                        ? JSON.stringify(activeResult.actual)
                        : String(activeResult.actual)}
                    </code>
                  </div>
                  {activeResult.error && (
                    <div className="neu-inset p-3 rounded-lg border-l-2 border-rose-500 text-rose-300 font-mono text-[11px]">
                      {activeResult.error}
                    </div>
                  )}
                </div>
              )}

              {/* Stdout if any */}
              {activeResult?.stdout && (
                <div className="space-y-1.5">
                  <span className="text-neutral-400 text-[11px] font-semibold uppercase">Console Log:</span>
                  <pre className="neu-inset p-3 rounded-lg text-neutral-300 text-[11px] overflow-x-auto whitespace-pre-wrap">
                    {activeResult.stdout}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. Post-Submission Review / Solution Breakdown */}
      {submittedAttempt && (
        <div className="neu-card p-6 space-y-6 border border-white/[0.08] bg-[#0d0e12]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="text-lg font-bold text-white uppercase">ATTEMPT EVALUATION SUMMARY</h3>
              </div>
              <p className="text-xs text-neutral-400 font-sans">
                {submittedAttempt.isAllPassed
                  ? "Flawless attempt! Your implementation satisfied all test conditions."
                  : "Good attempt! Review the failing edge cases or compare with the canonical solution."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold font-mono border flex items-center gap-2",
                  submittedAttempt.isAllPassed
                    ? "neu-active-pill text-emerald-400 border-emerald-500/30"
                    : "neu-active-pill text-amber-400 border-amber-500/30"
                )}
              >
                <span>
                  {submittedAttempt.passedCount} / {submittedAttempt.totalCount} Cases Passing (
                  {Math.round((submittedAttempt.passedCount / submittedAttempt.totalCount) * 100)}%)
                </span>
              </span>
            </div>
          </div>

          {/* Optimal Complexity Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="neu-inset p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Target Big-O Complexity</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <div>
                  <span className="text-neutral-500 block text-[10px]">TIME:</span>
                  <span className="text-emerald-400 font-bold">
                    {question.ground_truth.optimal_complexity.time}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">SPACE:</span>
                  <span className="text-emerald-400 font-bold">
                    {question.ground_truth.optimal_complexity.space}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                {question.ground_truth.optimal_complexity.reasoning}
              </p>
            </div>

            {/* Bridge to Audit Mode Card */}
            <div className="neu-inset p-4 rounded-xl space-y-3 flex flex-col justify-between border-l-2 border-emerald-500">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Audit The Buggy AI Solution</span>
                </div>
                <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                  Candidate AI models frequently make subtle pointer/regression bugs on this exact benchmark.
                  Switch to Audit Mode to test your code review skills!
                </p>
              </div>

              {onSwitchToAuditMode && (
                <button
                  type="button"
                  onClick={onSwitchToAuditMode}
                  className="neu-button px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase text-white hover:text-emerald-400 flex items-center justify-between cursor-pointer"
                >
                  <span>SWITCH TO AUDIT MODE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Toggle Ground Truth Solution Diff */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => setShowSolutionDiff(!showSolutionDiff)}
              className="neu-button w-full p-3 rounded-xl flex items-center justify-between text-xs font-mono font-bold uppercase text-neutral-300 hover:text-white cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <span>
                  {showSolutionDiff
                    ? "Hide Canonical Solution Comparison"
                    : "Compare Your Code with Canonical Ground-Truth Solution"}
                </span>
              </div>
              {showSolutionDiff ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {showSolutionDiff && (
              <div className="animate-in fade-in duration-200">
                <CodeDiffViewer
                  buggyCode={code}
                  correctedCode={question.ground_truth.corrected_code}
                  language={language.toUpperCase()}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
