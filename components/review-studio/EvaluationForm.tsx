"use client";

import React, { useState, useEffect } from "react";
import { QuestionItem, Verdict, IssueSeverity } from "@/types/question";
import { EvaluationSubmission, ReportedBug, FailingTestCase } from "@/types/submission";
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
    setActiveTab("verdict");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submission: EvaluationSubmission = {
      question_id: question.id,
      created_at: new Date().toISOString(),
      verdict,
      reported_bugs: verdict === "correct" ? [] : reportedBugs.filter((b) => b.description.trim()),
      failing_test_cases: failingTests.filter((t) => t.input.trim()),
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

  const tabs = [
    { key: "verdict", label: "1. VERDICT", icon: AlertOctagon },
    { key: "bugs", label: `2. BUGS (${reportedBugs.length})`, icon: Bug },
    { key: "tests", label: "3. TESTS", icon: FileCheck },
    { key: "complexity", label: "4. BIG-O", icon: Gauge },
    { key: "remediation", label: "5. FIX", icon: FileCheck },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col h-full bg-[#121416] border-4 border-white text-white font-['Hanken_Grotesk']"
    >
      {/* Top Tab Bar */}
      <div className="flex items-center gap-1 border-b-4 border-white bg-[#121416] p-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase transition-none cursor-pointer border-2 whitespace-nowrap",
                isActive
                  ? "bg-white text-black border-white"
                  : "border-transparent text-zinc-300 hover:bg-white hover:text-black hover:border-white"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
        {/* TAB 1: Verdict */}
        {activeTab === "verdict" && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-white block mb-1">
                EVALUATION VERDICT
              </span>
              <p className="text-xs text-zinc-400 font-sans">
                Classify whether this AI-generated code meets all requirements or contains defects.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
              {[
                { key: "correct", label: "COMPLETELY CORRECT", desc: "No bugs, optimal complexity, and handles all constraints." },
                { key: "minor_issue", label: "MINOR DEFECT / EDGE CASE", desc: "Violates edge cases or minor boundary invariants." },
                { key: "major_bug", label: "FATAL LOGIC ERROR", desc: "Infinite loops, invalid pointer mutations, wrong output." },
                { key: "critical_vulnerability", label: "CRITICAL FAILURE", desc: "Completely wrong algorithmic approach or syntax crash." },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setVerdict(item.key as Verdict)}
                  className={cn(
                    "p-4 border-2 text-left transition-none cursor-pointer flex flex-col justify-between space-y-2",
                    verdict === item.key
                      ? "bg-white text-black border-white"
                      : "bg-[#0a0b0d] text-zinc-300 border-white hover:bg-white hover:text-black"
                  )}
                >
                  <span className="text-sm font-black uppercase">{item.label}</span>
                  <span className="text-xs font-sans opacity-80">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Bugs */}
        {activeTab === "bugs" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b-2 border-white pb-3">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-white">
                  ROOT CAUSE BUG REPORTS
                </span>
                <p className="text-xs text-zinc-400 font-sans">
                  Cite the exact line reference and explain why the logic breaks.
                </p>
              </div>
              <button
                type="button"
                onClick={addBugRow}
                className="flex items-center gap-1 px-3 py-1 bg-white text-black font-black text-xs uppercase border-2 border-white hover:bg-black hover:text-white cursor-pointer transition-none"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD BUG</span>
              </button>
            </div>

            {reportedBugs.map((bug, idx) => (
              <div key={idx} className="p-4 border-2 border-white bg-[#0a0b0d] space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black uppercase">BUG #{idx + 1}</span>
                    <input
                      type="number"
                      placeholder="LINE #"
                      value={bug.line_reference || ""}
                      onChange={(e) => updateBugRow(idx, "line_reference", parseInt(e.target.value) || undefined)}
                      className="w-24 bg-[#121416] border border-white px-2 py-1 text-xs text-white uppercase focus:outline-none"
                    />
                  </div>

                  {reportedBugs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBugRow(idx)}
                      className="text-rose-400 hover:text-white p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <textarea
                  rows={3}
                  placeholder="EXPLAIN ROOT CAUSE (e.g. 'Line 5 overwrites curr.next before saving next_node reference...')"
                  value={bug.description}
                  onChange={(e) => updateBugRow(idx, "description", e.target.value)}
                  className="w-full bg-[#121416] border border-white p-3 text-xs text-white focus:outline-none placeholder:text-zinc-500 font-sans"
                />
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: Tests */}
        {activeTab === "tests" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b-2 border-white pb-3">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-white">
                  FAILING TEST CASES
                </span>
                <p className="text-xs text-zinc-400 font-sans">
                  Provide inputs that break the AI solution with Expected vs Actual outputs.
                </p>
              </div>
              <button
                type="button"
                onClick={addTestRow}
                className="flex items-center gap-1 px-3 py-1 bg-white text-black font-black text-xs uppercase border-2 border-white hover:bg-black hover:text-white cursor-pointer transition-none"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD TEST</span>
              </button>
            </div>

            {failingTests.map((t, idx) => (
              <div key={idx} className="p-4 border-2 border-white bg-[#0a0b0d] space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase">CASE #{idx + 1}</span>
                  {failingTests.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTestRow(idx)}
                      className="text-rose-400 hover:text-white p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 block mb-1">INPUT</span>
                    <input
                      type="text"
                      placeholder="e.g. [1]"
                      value={t.input}
                      onChange={(e) => updateTestRow(idx, "input", e.target.value)}
                      className="w-full bg-[#121416] border border-white p-2 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 block mb-1">EXPECTED</span>
                    <input
                      type="text"
                      placeholder="e.g. [1]"
                      value={t.expected}
                      onChange={(e) => updateTestRow(idx, "expected", e.target.value)}
                      className="w-full bg-[#121416] border border-white p-2 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 block mb-1">AI ACTUAL</span>
                    <input
                      type="text"
                      placeholder="e.g. Infinite Loop"
                      value={t.actual}
                      onChange={(e) => updateTestRow(idx, "actual", e.target.value)}
                      className="w-full bg-[#121416] border border-white p-2 text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: Complexity & Explanation */}
        {activeTab === "complexity" && (
          <div className="space-y-6 font-mono">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-white block mb-1">
                COMPLEXITY & COMMENTARY AUDITING
              </span>
              <p className="text-xs text-zinc-400 font-sans">
                Audit actual runtime Big-O and flag any hallucinated commentary in the AI explanation.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-bold uppercase text-zinc-400 block mb-1">ACTUAL TIME</span>
                <input
                  type="text"
                  value={timeComplexity}
                  onChange={(e) => setTimeComplexity(e.target.value)}
                  className="w-full bg-[#0a0b0d] border-2 border-white p-2.5 text-white font-bold focus:outline-none"
                />
              </div>
              <div>
                <span className="text-xs font-bold uppercase text-zinc-400 block mb-1">ACTUAL SPACE</span>
                <input
                  type="text"
                  value={spaceComplexity}
                  onChange={(e) => setSpaceComplexity(e.target.value)}
                  className="w-full bg-[#0a0b0d] border-2 border-white p-2.5 text-white font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 border-2 border-white bg-[#0a0b0d] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase">AI EXPLANATION ACCURACY</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsExplanationAccurate(true)}
                    className={cn(
                      "px-3 py-1 text-xs font-black uppercase border-2 transition-none",
                      isExplanationAccurate ? "bg-white text-black border-white" : "border-transparent text-zinc-400"
                    )}
                  >
                    ACCURATE
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsExplanationAccurate(false)}
                    className={cn(
                      "px-3 py-1 text-xs font-black uppercase border-2 transition-none",
                      !isExplanationAccurate ? "bg-rose-500 text-white border-rose-500" : "border-transparent text-zinc-400"
                    )}
                  >
                    HALLUCINATED
                  </button>
                </div>
              </div>

              {!isExplanationAccurate && (
                <textarea
                  rows={2}
                  placeholder="EXPLAIN FALSE CLAIMS: e.g. AI claims BFS with FIFO queue, but code is recursive DFS..."
                  value={explanationNotes}
                  onChange={(e) => setExplanationNotes(e.target.value)}
                  className="w-full bg-[#121416] border border-white p-2.5 text-xs text-white focus:outline-none font-sans"
                />
              )}
            </div>
          </div>
        )}

        {/* TAB 5: Remediation */}
        {activeTab === "remediation" && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-white block mb-1">
                PROPOSED REMEDIATION / CORRECTED CODE
              </span>
              <p className="text-xs text-zinc-400 font-sans">
                Demonstrate the correct implementation or key refactoring steps.
              </p>
            </div>

            <textarea
              rows={9}
              placeholder={`// Provide correct implementation or refactoring steps:\ndef reverseList(head):\n    prev, curr = None, head\n    while curr:\n        next_node = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_node\n    return prev`}
              value={suggestedFix}
              onChange={(e) => setSuggestedFix(e.target.value)}
              className="w-full bg-[#0a0b0d] font-mono border-2 border-white p-4 text-xs text-white focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Form Action Footer */}
      {!readOnly && (
        <div className="p-4 border-t-4 border-white bg-[#121416] flex items-center justify-between font-['Hanken_Grotesk']">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-bold uppercase text-zinc-400 hover:text-white px-3 py-2 border-2 border-transparent hover:border-white transition-none cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-3 bg-white text-black font-black text-sm uppercase hover:bg-black hover:text-white border-2 border-white transition-none cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>EVALUATING AUDIT...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>SUBMIT EVALUATION ➔</span>
              </>
            )}
          </button>
        </div>
      )}
    </form>
  );
}
