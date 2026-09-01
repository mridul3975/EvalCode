"use client";

import React, { useState, useEffect } from "react";
import { QuestionItem, Verdict, IssueSeverity } from "@/types/question";
import { EvaluationSubmission, ReportedBug, FailingTestCase } from "@/types/submission";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Bug,
  TestTube,
  Clock,
  Wrench,
  Send,
  RotateCcw,
  Plus,
  Trash2,
} from "lucide-react";

export function EvaluationForm({
  question,
  initialValues,
  onSubmit,
  isSubmitting = false,
  onLineCiteRequested,
}: {
  question: QuestionItem;
  initialValues?: EvaluationSubmission;
  onSubmit: (sub: EvaluationSubmission) => void;
  isSubmitting?: boolean;
  onLineCiteRequested?: number | null;
}) {
  const [activeTab, setActiveTab] = useState<"verdict" | "bugs" | "tests" | "bigo" | "fix">("verdict");
  const [verdict, setVerdict] = useState<Verdict>(
    initialValues?.verdict || "major_bug"
  );
  const [reportedBugs, setReportedBugs] = useState<ReportedBug[]>(
    initialValues?.reported_bugs || [
      {
        line_reference: question.ground_truth.expected_issues[0]?.line_numbers[0] || 1,
        severity: "major",
        description: "",
      },
    ]
  );
  const [testCases, setTestCases] = useState<FailingTestCase[]>(
    initialValues?.failing_test_cases || [{ input: "", expected: "", actual: "" }]
  );
  const [assessedComplexity, setAssessedComplexity] = useState(
    initialValues?.assessed_complexity || {
      time: question.ground_truth.optimal_complexity.time || "O(N)",
      space: question.ground_truth.optimal_complexity.space || "O(1)",
      justification: "",
    }
  );
  const [explanationAudit, setExplanationAudit] = useState(
    initialValues?.explanation_audit || {
      is_accurate: true,
      notes: "",
    }
  );
  const [suggestedFix, setSuggestedFix] = useState(initialValues?.suggested_fix || "");

  // Auto-populate cited line number into bug row if requested
  useEffect(() => {
    if (onLineCiteRequested !== null && onLineCiteRequested !== undefined) {
      setActiveTab("bugs");
      setReportedBugs((prev) => {
        const copy = [...prev];
        if (copy.length > 0) {
          copy[0] = { ...copy[0], line_reference: onLineCiteRequested };
        } else {
          copy.push({ line_reference: onLineCiteRequested, severity: "major", description: "" });
        }
        return copy;
      });
    }
  }, [onLineCiteRequested]);

  const handleAddBugRow = () => {
    setReportedBugs([...reportedBugs, { line_reference: 1, severity: "major", description: "" }]);
  };

  const handleRemoveBugRow = (index: number) => {
    setReportedBugs(reportedBugs.filter((_, i) => i !== index));
  };

  const handleAddTestRow = () => {
    setTestCases([...testCases, { input: "", expected: "", actual: "" }]);
  };

  const handleRemoveTestRow = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData: EvaluationSubmission = {
      question_id: question.id,
      verdict,
      reported_bugs: reportedBugs.filter((b) => b.description.trim() !== "" || b.line_reference !== undefined),
      failing_test_cases: testCases.filter((t) => t.input.trim() !== ""),
      assessed_complexity: assessedComplexity,
      explanation_audit: explanationAudit,
      suggested_fix: suggestedFix,
    };
    onSubmit(submissionData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="neu-extruded bg-[#121416] rounded-xl p-6 sm:p-8 flex flex-col h-full font-['Hanken_Grotesk'] text-[#e2e2e5] border border-white/5 shadow-2xl"
    >
      {/* 70/30 Neumorphic Verdict Step Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[rgba(255,255,255,0.08)] pb-3 mb-6 font-mono text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("verdict")}
          className={cn(
            "flex items-center gap-1.5 pb-2 transition-colors cursor-pointer border-b-2 px-2.5 font-bold uppercase",
            activeTab === "verdict"
              ? "border-white text-white font-black"
              : "border-transparent text-[#b9cbc1] hover:text-white"
          )}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>1. VERDICT</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("bugs")}
          className={cn(
            "flex items-center gap-1.5 pb-2 transition-colors cursor-pointer border-b-2 px-2.5 font-bold uppercase",
            activeTab === "bugs"
              ? "border-white text-white font-black"
              : "border-transparent text-[#b9cbc1] hover:text-white"
          )}
        >
          <Bug className="w-3.5 h-3.5" />
          <span>2. BUGS ({reportedBugs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("tests")}
          className={cn(
            "flex items-center gap-1.5 pb-2 transition-colors cursor-pointer border-b-2 px-2.5 font-bold uppercase",
            activeTab === "tests"
              ? "border-white text-white font-black"
              : "border-transparent text-[#b9cbc1] hover:text-white"
          )}
        >
          <TestTube className="w-3.5 h-3.5" />
          <span>3. TESTS</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("bigo")}
          className={cn(
            "flex items-center gap-1.5 pb-2 transition-colors cursor-pointer border-b-2 px-2.5 font-bold uppercase",
            activeTab === "bigo"
              ? "border-white text-white font-black"
              : "border-transparent text-[#b9cbc1] hover:text-white"
          )}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>4. BIG-O</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("fix")}
          className={cn(
            "flex items-center gap-1.5 pb-2 transition-colors cursor-pointer border-b-2 px-2.5 font-bold uppercase",
            activeTab === "fix"
              ? "border-white text-white font-black"
              : "border-transparent text-[#b9cbc1] hover:text-white"
          )}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>5. FIX</span>
        </button>
      </div>

      {/* Tab 1: Verdict Options Grid */}
      {activeTab === "verdict" && (
        <div className="flex flex-col flex-grow space-y-6">
          <div>
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-1">
              EVALUATION VERDICT
            </h3>
            <p className="text-xs text-[#b9cbc1] font-sans">
              Classify whether this AI-generated code meets all requirements or contains defects.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-grow">
            {/* Option 1: Completely Correct */}
            <button
              type="button"
              onClick={() => setVerdict("correct")}
              className={cn(
                "p-4 rounded-xl text-left transition-all cursor-pointer font-['Hanken_Grotesk']",
                verdict === "correct"
                  ? "contrast-card border-2 border-black relative overflow-hidden"
                  : "neu-inset bg-[#121416] border border-[#282a2c] text-[#e2e2e5] hover:border-white"
              )}
            >
              {verdict === "correct" && <div className="absolute top-0 left-0 w-1.5 h-full bg-[#121416]" />}
              <h4 className={cn("text-sm font-bold uppercase tracking-tight mb-1", verdict === "correct" ? "text-[#121416]" : "text-white")}>
                COMPLETELY CORRECT
              </h4>
              <p className={cn("text-xs leading-relaxed font-sans", verdict === "correct" ? "text-gray-700" : "text-[#b9cbc1]")}>
                No bugs, optimal complexity, and handles all constraints.
              </p>
            </button>

            {/* Option 2: Minor Issue */}
            <button
              type="button"
              onClick={() => setVerdict("minor_issue")}
              className={cn(
                "p-4 rounded-xl text-left transition-all cursor-pointer font-['Hanken_Grotesk']",
                verdict === "minor_issue"
                  ? "contrast-card border-2 border-black relative overflow-hidden"
                  : "neu-inset bg-[#121416] border border-[#282a2c] text-[#e2e2e5] hover:border-white"
              )}
            >
              {verdict === "minor_issue" && <div className="absolute top-0 left-0 w-1.5 h-full bg-[#121416]" />}
              <h4 className={cn("text-sm font-bold uppercase tracking-tight mb-1", verdict === "minor_issue" ? "text-[#121416]" : "text-white")}>
                MINOR ISSUE
              </h4>
              <p className={cn("text-xs leading-relaxed font-sans", verdict === "minor_issue" ? "text-gray-700" : "text-[#b9cbc1]")}>
                Violates minor boundary invariants or code style conventions.
              </p>
            </button>

            {/* Option 3: Major Bug */}
            <button
              type="button"
              onClick={() => setVerdict("major_bug")}
              className={cn(
                "p-4 rounded-xl text-left transition-all cursor-pointer font-['Hanken_Grotesk']",
                verdict === "major_bug"
                  ? "contrast-card border-2 border-black relative overflow-hidden"
                  : "neu-inset bg-[#121416] border border-[#282a2c] text-[#e2e2e5] hover:border-rose-400"
              )}
            >
              {verdict === "major_bug" && <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-600" />}
              <h4 className={cn("text-sm font-bold uppercase tracking-tight mb-1", verdict === "major_bug" ? "text-rose-950 font-black" : "text-rose-400")}>
                FATAL / MAJOR BUG
              </h4>
              <p className={cn("text-xs leading-relaxed font-sans", verdict === "major_bug" ? "text-gray-700" : "text-[#b9cbc1]")}>
                Infinite loops, invalid pointer mutations, or wrong output.
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Reported Bugs */}
      {activeTab === "bugs" && (
        <div className="flex flex-col flex-grow space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase">REPORTED BUGS ({reportedBugs.length})</span>
            <button
              type="button"
              onClick={handleAddBugRow}
              className="neu-inset px-2.5 py-1 rounded text-[11px] font-bold text-white hover:bg-[#1e2022] flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" /> ADD BUG ROW
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[360px] pr-1">
            {reportedBugs.map((bug, idx) => (
              <div key={idx} className="neu-inset p-4 rounded-lg space-y-3 border border-[#282a2c]">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-bold">LINE #:</span>
                    <input
                      type="number"
                      value={bug.line_reference || ""}
                      onChange={(e) => {
                        const copy = [...reportedBugs];
                        copy[idx].line_reference = parseInt(e.target.value) || undefined;
                        setReportedBugs(copy);
                      }}
                      className="w-16 p-1 rounded bg-[#0c0e10] border border-[#282a2c] text-white text-center font-bold"
                    />
                  </div>

                  <select
                    value={bug.severity}
                    onChange={(e) => {
                      const copy = [...reportedBugs];
                      copy[idx].severity = e.target.value as IssueSeverity;
                      setReportedBugs(copy);
                    }}
                    className="p-1.5 rounded bg-[#0c0e10] border border-[#282a2c] text-white text-xs uppercase cursor-pointer"
                  >
                    <option value="critical">CRITICAL</option>
                    <option value="major">MAJOR</option>
                    <option value="minor">MINOR</option>
                    <option value="nit">NIT</option>
                  </select>

                  {reportedBugs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveBugRow(idx)}
                      className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <textarea
                  placeholder="EXPLAIN THE EXACT BUG CAUSE OR POINTER OVERWRITE..."
                  value={bug.description}
                  onChange={(e) => {
                    const copy = [...reportedBugs];
                    copy[idx].description = e.target.value;
                    setReportedBugs(copy);
                  }}
                  rows={2}
                  className="w-full p-2.5 rounded bg-[#0c0e10] border border-[#282a2c] text-white text-xs font-sans focus:outline-none focus:border-white"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Test Cases */}
      {activeTab === "tests" && (
        <div className="flex flex-col flex-grow space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase">FAILING TEST CASES ({testCases.length})</span>
            <button
              type="button"
              onClick={handleAddTestRow}
              className="neu-inset px-2.5 py-1 rounded text-[11px] font-bold text-white hover:bg-[#1e2022] flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" /> ADD TEST CASE
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[360px] pr-1">
            {testCases.map((test, idx) => (
              <div key={idx} className="neu-inset p-4 rounded-lg space-y-2.5 border border-[#282a2c]">
                <div className="flex items-center justify-between text-gray-500 font-bold">
                  <span>TEST CASE #{idx + 1}</span>
                  {testCases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTestRow(idx)}
                      className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    placeholder="Input e.g. [1,2,3]"
                    value={test.input}
                    onChange={(e) => {
                      const copy = [...testCases];
                      copy[idx].input = e.target.value;
                      setTestCases(copy);
                    }}
                    className="p-2 rounded bg-[#0c0e10] border border-[#282a2c] text-white text-xs font-mono"
                  />
                  <input
                    placeholder="Expected Output"
                    value={test.expected}
                    onChange={(e) => {
                      const copy = [...testCases];
                      copy[idx].expected = e.target.value;
                      setTestCases(copy);
                    }}
                    className="p-2 rounded bg-[#0c0e10] border border-[#282a2c] text-white text-xs font-mono"
                  />
                  <input
                    placeholder="Actual AI Output"
                    value={test.actual}
                    onChange={(e) => {
                      const copy = [...testCases];
                      copy[idx].actual = e.target.value;
                      setTestCases(copy);
                    }}
                    className="p-2 rounded bg-[#0c0e10] border border-[#282a2c] text-white text-xs font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Big-O Complexity */}
      {activeTab === "bigo" && (
        <div className="flex flex-col flex-grow space-y-4 font-mono text-xs">
          <span className="text-xs font-bold text-white uppercase">BIG-O COMPLEXITY ANALYSIS</span>

          <div className="neu-inset p-4 rounded-lg space-y-4 border border-[#282a2c]">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-500 font-bold block mb-1">TIME COMPLEXITY:</label>
                <input
                  type="text"
                  value={assessedComplexity.time}
                  onChange={(e) => setAssessedComplexity({ ...assessedComplexity, time: e.target.value })}
                  className="w-full p-2.5 rounded bg-[#0c0e10] border border-[#282a2c] text-white font-bold text-xs"
                />
              </div>

              <div>
                <label className="text-gray-500 font-bold block mb-1">SPACE COMPLEXITY:</label>
                <input
                  type="text"
                  value={assessedComplexity.space}
                  onChange={(e) => setAssessedComplexity({ ...assessedComplexity, space: e.target.value })}
                  className="w-full p-2.5 rounded bg-[#0c0e10] border border-[#282a2c] text-white font-bold text-xs"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-[rgba(255,255,255,0.06)] flex items-center gap-3">
              <input
                type="checkbox"
                id="explanation_accurate"
                checked={explanationAudit.is_accurate}
                onChange={(e) => setExplanationAudit({ ...explanationAudit, is_accurate: e.target.checked })}
                className="w-4 h-4 rounded bg-[#0c0e10] border-[#282a2c] accent-white cursor-pointer"
              />
              <label htmlFor="explanation_accurate" className="text-white font-bold cursor-pointer">
                AI CLAIMED EXPLANATION & COMPLEXITY ARE ACCURATE
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Suggested Fix */}
      {activeTab === "fix" && (
        <div className="flex flex-col flex-grow space-y-4 font-mono text-xs">
          <span className="text-xs font-bold text-white uppercase">CORRECTED REMEDIATION CODE</span>

          <textarea
            placeholder="PASTE OR WRITE CORRECTED IMPLEMENTATION HERE..."
            value={suggestedFix}
            onChange={(e) => setSuggestedFix(e.target.value)}
            rows={8}
            className="w-full p-3 rounded-lg bg-[#0c0e10] border border-[#282a2c] text-white font-mono text-xs focus:outline-none focus:border-white leading-relaxed"
          />
        </div>
      )}

      {/* Form Action Controls */}
      <div className="border-t border-[rgba(255,255,255,0.08)] pt-4 flex items-center justify-between mt-auto">
        <button
          type="button"
          onClick={() => {
            setVerdict("major_bug");
            setReportedBugs([]);
            setTestCases([]);
          }}
          className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#b9cbc1] hover:text-white transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="neu-extruded bg-white text-[#121416] px-6 py-3 rounded-lg font-mono font-bold text-xs uppercase hover:bg-[#e2e2e5] transition-colors active:scale-95 flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.3)] cursor-pointer disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isSubmitting ? "AUDITING..." : "SUBMIT EVALUATION"}</span>
        </button>
      </div>
    </form>
  );
}
