"use client";

import React, { useState, useEffect } from "react";
import { QuestionItem, Verdict, IssueSeverity } from "@/types/question";
import { EvaluationSubmission, ReportedBug, FailingTestCase } from "@/types/submission";
import { FormFieldWrapper, VerdictToggleGroup, ComplexityPicker } from "@/components/boneyard/FormWrappers";
import { cn } from "@/lib/utils";
import {
  Bug,
  AlertOctagon,
  Gauge,
  FileCheck,
  Plus,
  Trash2,
  Send,
  RotateCcw,
  Sparkles,
  Info,
  Check,
  Zap,
} from "lucide-react";

export interface EvaluationFormProps {
  question: QuestionItem;
  initialValues?: Partial<EvaluationSubmission>;
  onSubmit: (submission: EvaluationSubmission) => void;
  isSubmitting?: boolean;
  onLineCiteRequested?: number | null;
  readOnly?: boolean;
}

export function EvaluationForm({
  question,
  initialValues,
  onSubmit,
  isSubmitting = false,
  onLineCiteRequested,
  readOnly = false,
}: EvaluationFormProps) {
  const [activeTab, setActiveTab] = useState<"verdict" | "bugs" | "tests" | "complexity" | "remediation">("verdict");

  // Form States
  const [verdict, setVerdict] = useState<Verdict>(initialValues?.verdict || "correct");
  const [reportedBugs, setReportedBugs] = useState<ReportedBug[]>(
    initialValues?.reported_bugs || [
      { line_reference: undefined, severity: "critical", description: "" },
    ]
  );
  const [failingTests, setFailingTests] = useState<FailingTestCase[]>(
    initialValues?.failing_test_cases || [
      { input: "", expected: "", actual: "" },
    ]
  );
  const [timeComplexity, setTimeComplexity] = useState(
    initialValues?.assessed_complexity?.time || "O(n)"
  );
  const [spaceComplexity, setSpaceComplexity] = useState(
    initialValues?.assessed_complexity?.space || "O(1)"
  );
  const [complexityJustification, setComplexityJustification] = useState(
    initialValues?.assessed_complexity?.justification || ""
  );
  const [isExplanationAccurate, setIsExplanationAccurate] = useState<boolean>(
    initialValues?.explanation_audit?.is_accurate ?? true
  );
  const [explanationNotes, setExplanationNotes] = useState(
    initialValues?.explanation_audit?.notes || ""
  );
  const [isInstructionCompliant, setIsInstructionCompliant] = useState<boolean>(
    initialValues?.instruction_compliance?.is_compliant ?? true
  );
  const [instructionNotes, setInstructionNotes] = useState(
    initialValues?.instruction_compliance?.notes || ""
  );
  const [suggestedFix, setSuggestedFix] = useState(
    initialValues?.suggested_fix || ""
  );

  // When user clicks a line in code viewer, populate latest empty bug line reference
  useEffect(() => {
    if (onLineCiteRequested !== undefined && onLineCiteRequested !== null) {
      setReportedBugs((prev) => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        if (lastIdx >= 0) {
          updated[lastIdx] = { ...updated[lastIdx], line_reference: onLineCiteRequested };
        } else {
          updated.push({ line_reference: onLineCiteRequested, severity: "critical", description: "" });
        }
        return updated;
      });
      if (verdict === "correct") {
        setVerdict("major_bug");
      }
      setActiveTab("bugs");
    }
  }, [onLineCiteRequested]);

  // Handlers for dynamic bug rows
  const addBugRow = () => {
    setReportedBugs((prev) => [
      ...prev,
      { line_reference: undefined, severity: "critical", description: "" },
    ]);
  };

  const removeBugRow = (idx: number) => {
    setReportedBugs((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateBugRow = (idx: number, field: keyof ReportedBug, value: any) => {
    setReportedBugs((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  // Handlers for dynamic test rows
  const addTestRow = () => {
    setFailingTests((prev) => [...prev, { input: "", expected: "", actual: "" }]);
  };

  const removeTestRow = (idx: number) => {
    setFailingTests((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateTestRow = (idx: number, field: keyof FailingTestCase, value: string) => {
    setFailingTests((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const submission: EvaluationSubmission = {
      question_id: question.id,
      verdict,
      reported_bugs: reportedBugs.filter((b) => b.description.trim().length > 0),
      failing_test_cases: failingTests.filter((t) => t.input.trim().length > 0),
      assessed_complexity: {
        time: timeComplexity,
        space: spaceComplexity,
        justification: complexityJustification,
      },
      explanation_audit: {
        is_accurate: isExplanationAccurate,
        notes: explanationNotes,
      },
      instruction_compliance: {
        is_compliant: isInstructionCompliant,
        notes: instructionNotes,
      },
      suggested_fix: suggestedFix,
    };
    onSubmit(submission);
  };

  const handleReset = () => {
    setVerdict("correct");
    setReportedBugs([{ line_reference: undefined, severity: "critical", description: "" }]);
    setFailingTests([{ input: "", expected: "", actual: "" }]);
    setTimeComplexity("O(n)");
    setSpaceComplexity("O(1)");
    setComplexityJustification("");
    setIsExplanationAccurate(true);
    setExplanationNotes("");
    setIsInstructionCompliant(true);
    setInstructionNotes("");
    setSuggestedFix("");
  };

  const tabs = [
    { key: "verdict", label: "Verdict", icon: Bug },
    { key: "bugs", label: "Root Cause Bugs", icon: Zap },
    { key: "tests", label: "Breaking Tests", icon: AlertOctagon },
    { key: "complexity", label: "Complexity & Audit", icon: Gauge },
    { key: "remediation", label: "Suggested Fix", icon: FileCheck },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col h-full bg-zinc-950 border border-zinc-800/90 rounded-2xl overflow-hidden shadow-xl"
    >
      {/* Form Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/70 px-3 py-2 overflow-x-auto backdrop-blur-sm">
        <div className="flex items-center gap-1 min-w-max">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isCurrent = activeTab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key as any)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  isCurrent
                    ? "bg-zinc-800 text-white shadow-sm border border-zinc-700/60"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Body Viewport */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm text-zinc-300">
        {/* TAB 1: Verdict */}
        {activeTab === "verdict" && (
          <div className="space-y-6">
            <FormFieldWrapper
              label="1. Solution Verdict Selection"
              required
              description="Classify whether this AI-generated code meets all requirements or contains fatal regressions."
            >
              <VerdictToggleGroup
                value={verdict}
                onChange={(val) => {
                  setVerdict(val);
                  if (val !== "correct") {
                    setActiveTab("bugs");
                  }
                }}
              />
            </FormFieldWrapper>

            {verdict === "correct" ? (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/30 flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-300">
                    Marked as Completely Correct & Optimal
                  </span>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    You have classified this implementation as bug-free. Next, verify Big-$O$ complexity bounds in the <strong>Complexity & Audit</strong> tab before submitting.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <Bug className="w-4 h-4 text-rose-400" />
                  <span>Defects flagged. Continue to itemize specific root causes.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("bugs")}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                >
                  Itemize Bugs &rarr;
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Root Cause Bugs */}
        {activeTab === "bugs" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <Bug className="w-3.5 h-3.5 text-rose-400" />
                  Reported Bugs & Logical Flaws
                </span>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Pinpoint exact lines and describe the mechanical failure mode.
                </p>
              </div>
              <button
                type="button"
                onClick={addBugRow}
                className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Bug Row</span>
              </button>
            </div>

            <div className="space-y-3">
              {reportedBugs.map((bug, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3 relative group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-zinc-400 font-mono font-bold">Line #:</span>
                      <input
                        type="number"
                        placeholder="e.g. 10"
                        value={bug.line_reference || ""}
                        onChange={(e) =>
                          updateBugRow(
                            idx,
                            "line_reference",
                            e.target.value ? parseInt(e.target.value) : undefined
                          )
                        }
                        className="w-16 bg-zinc-950 border border-zinc-700/80 rounded-md px-2 py-1 text-xs text-zinc-200 font-mono focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-zinc-400 font-mono font-bold">Severity:</span>
                      <select
                        value={bug.severity}
                        onChange={(e) => updateBugRow(idx, "severity", e.target.value)}
                        className="bg-zinc-950 border border-zinc-700/80 rounded-md px-2.5 py-1 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none cursor-pointer"
                      >
                        <option value="critical">Critical (Crash / Fatal Regression)</option>
                        <option value="major">Major (Logic Bug / Data Corruption)</option>
                        <option value="minor">Minor (Suboptimal Performance)</option>
                        <option value="nit">Nit / Style</option>
                      </select>
                    </div>

                    {reportedBugs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBugRow(idx)}
                        className="ml-auto text-zinc-500 hover:text-rose-400 cursor-pointer p-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Describe failure mechanism: e.g. Lost pointer reference when reassigning curr.next before storing temporary next node reference..."
                    value={bug.description}
                    onChange={(e) => updateBugRow(idx, "description", e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500/50 leading-relaxed resize-y font-sans"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Breaking Tests */}
        {activeTab === "tests" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
                  Breaking Edge-Case Test Vectors
                </span>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Construct concrete inputs where this implementation crashes or returns incorrect results.
                </p>
              </div>
              <button
                type="button"
                onClick={addTestRow}
                className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Test Case</span>
              </button>
            </div>

            <div className="space-y-3">
              {failingTests.map((t, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3 relative shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-zinc-400 font-bold uppercase">
                      Test Case #{idx + 1}
                    </span>
                    {failingTests.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTestRow(idx)}
                        className="text-zinc-500 hover:text-rose-400 cursor-pointer p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase">Input Vector</span>
                      <input
                        type="text"
                        placeholder="e.g. nums = [3, 3], target = 6"
                        value={t.input}
                        onChange={(e) => updateTestRow(idx, "input", e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-2.5 py-1.5 text-xs text-zinc-200 mt-1 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase">Expected Output</span>
                      <input
                        type="text"
                        placeholder="e.g. [0, 1]"
                        value={t.expected}
                        onChange={(e) => updateTestRow(idx, "expected", e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-2.5 py-1.5 text-xs text-emerald-300 mt-1 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase">Actual Result / Error</span>
                      <input
                        type="text"
                        placeholder="e.g. [] or Infinite Loop"
                        value={t.actual}
                        onChange={(e) => updateTestRow(idx, "actual", e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-2.5 py-1.5 text-xs text-rose-300 mt-1 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Complexity & Audit */}
        {activeTab === "complexity" && (
          <div className="space-y-5">
            {/* Asymptotic Bounds */}
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-sky-400" />
                Asymptotic Complexity Auditing
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ComplexityPicker
                  label="True Time Complexity"
                  value={timeComplexity}
                  onChange={setTimeComplexity}
                />
                <ComplexityPicker
                  label="True Space Complexity"
                  value={spaceComplexity}
                  onChange={setSpaceComplexity}
                />
              </div>
              <textarea
                rows={2}
                placeholder="Brief asymptotic justification: e.g. Single pass linear scan O(N) using three pointers with O(1) auxiliary variables..."
                value={complexityJustification}
                onChange={(e) => setComplexityJustification(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 leading-relaxed focus:border-sky-500 focus:outline-none"
              />
            </div>

            {/* Explanation Hallucination Audit */}
            <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-900/40 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                    AI Commentary Audit
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsExplanationAccurate(true)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                      isExplanationAccurate
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
                        : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    Accurate
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsExplanationAccurate(false)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                      !isExplanationAccurate
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/50"
                        : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    Misleading / False
                  </button>
                </div>
              </div>

              {!isExplanationAccurate && (
                <textarea
                  rows={2}
                  placeholder="Detail false claims in explanation: e.g. AI claims BFS with FIFO queue, but code is recursive DFS..."
                  value={explanationNotes}
                  onChange={(e) => setExplanationNotes(e.target.value)}
                  className="w-full bg-zinc-950 border border-purple-900/50 rounded-lg p-2.5 text-xs text-purple-200 focus:border-purple-400 focus:outline-none"
                />
              )}
            </div>

            {/* Prompt Compliance Check */}
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Constraint Compliance
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsInstructionCompliant(true)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                      isInstructionCompliant
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
                        : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    Compliant
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsInstructionCompliant(false)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                      !isInstructionCompliant
                        ? "bg-orange-500/20 text-orange-300 border border-orange-500/50"
                        : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    Constraint Violation
                  </button>
                </div>
              </div>

              {!isInstructionCompliant && (
                <input
                  type="text"
                  placeholder="e.g. Prompt mandates in-place mutation, but AI returns a newly allocated array."
                  value={instructionNotes}
                  onChange={(e) => setInstructionNotes(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none"
                />
              )}
            </div>
          </div>
        )}

        {/* TAB 5: Suggested Fix */}
        {activeTab === "remediation" && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                Proposed Remediation Code / Advice
              </span>
              <p className="text-xs text-zinc-400 mt-0.5">
                Demonstrate the correct implementation or key refactoring modifications.
              </p>
            </div>

            <textarea
              rows={9}
              placeholder={`// Provide correct implementation or refactoring steps:\nfunction solution(...) {\n  // Invert pointers with temporary next_node reference\n}`}
              value={suggestedFix}
              onChange={(e) => setSuggestedFix(e.target.value)}
              className="w-full bg-zinc-950 font-mono border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 leading-relaxed resize-y focus:border-emerald-500/50 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Form Action Footer */}
      {!readOnly && (
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 px-3 py-2 rounded-lg hover:bg-zinc-800/60 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Grading Evaluation...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Submit Evaluation</span>
              </>
            )}
          </button>
        </div>
      )}
    </form>
  );
}
