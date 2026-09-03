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
  AlertTriangle,
  XCircle,
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
      className="neu-card p-6 sm:p-8 flex flex-col h-full font-['Hanken_Grotesk'] text-[#e2e2e5]"
    >
      {/* Neumorphic Verdict Step Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/[0.06] pb-4 mb-6 font-mono text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("verdict")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold uppercase",
            activeTab === "verdict"
              ? "neu-inset text-white font-black border border-white/20"
              : "neu-button text-neutral-400 hover:text-white"
          )}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>1. VERDICT</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("bugs")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold uppercase",
            activeTab === "bugs"
              ? "neu-inset text-white font-black border border-white/20"
              : "neu-button text-neutral-400 hover:text-white"
          )}
        >
          <Bug className="w-3.5 h-3.5 text-rose-400" />
          <span>2. BUGS ({reportedBugs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("tests")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold uppercase",
            activeTab === "tests"
              ? "neu-inset text-white font-black border border-white/20"
              : "neu-button text-neutral-400 hover:text-white"
          )}
        >
          <TestTube className="w-3.5 h-3.5 text-sky-400" />
          <span>3. TESTS</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("bigo")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold uppercase",
            activeTab === "bigo"
              ? "neu-inset text-white font-black border border-white/20"
              : "neu-button text-neutral-400 hover:text-white"
          )}
        >
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>4. BIG-O</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("fix")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold uppercase",
            activeTab === "fix"
              ? "neu-inset text-white font-black border border-white/20"
              : "neu-button text-neutral-400 hover:text-white"
          )}
        >
          <Wrench className="w-3.5 h-3.5 text-purple-400" />
          <span>5. FIX</span>
        </button>
      </div>

      {/* Tab 1: Tactile 3D Verdict Tiles Grid */}
      {activeTab === "verdict" && (
        <div className="flex flex-col flex-grow space-y-4">
          <div>
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-1">
              EVALUATION VERDICT
            </h3>
            <p className="text-xs text-neutral-400 font-sans">
              Select the classification for this AI code snippet.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Square Option 1: Completely Correct */}
            <button
              type="button"
              onClick={() => setVerdict("correct")}
              className={cn(
                "aspect-square p-5 rounded-2xl text-left transition-all cursor-pointer font-['Hanken_Grotesk'] flex flex-col justify-between relative overflow-hidden",
                verdict === "correct"
                  ? "neu-card border-2 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                  : "neu-inset opacity-80 hover:opacity-100 hover:border-white/10"
              )}
            >
              <div className="flex justify-between items-start w-full">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                  01 / ACCURATE
                </span>
                <CheckCircle2 className={cn("w-5 h-5", verdict === "correct" ? "text-emerald-400" : "text-neutral-500")} />
              </div>

              <div>
                <h4 className="text-base font-black uppercase tracking-tight mb-1 leading-snug text-white font-mono">
                  COMPLETELY<br />CORRECT
                </h4>
                <p className="text-xs leading-relaxed font-sans text-neutral-300">
                  No bugs, optimal complexity, and handles all constraints.
                </p>
              </div>
            </button>

            {/* Square Option 2: Minor Issue */}
            <button
              type="button"
              onClick={() => setVerdict("minor_issue")}
              className={cn(
                "aspect-square p-5 rounded-2xl text-left transition-all cursor-pointer font-['Hanken_Grotesk'] flex flex-col justify-between relative overflow-hidden",
                verdict === "minor_issue"
                  ? "neu-card border-2 border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                  : "neu-inset opacity-80 hover:opacity-100 hover:border-white/10"
              )}
            >
              <div className="flex justify-between items-start w-full">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                  02 / MINOR
                </span>
                <AlertTriangle className={cn("w-5 h-5", verdict === "minor_issue" ? "text-amber-400" : "text-neutral-500")} />
              </div>

              <div>
                <h4 className="text-base font-black uppercase tracking-tight mb-1 leading-snug text-white font-mono">
                  MINOR<br />DEFECT
                </h4>
                <p className="text-xs leading-relaxed font-sans text-neutral-300">
                  Violates minor boundary invariants or style conventions.
                </p>
              </div>
            </button>

            {/* Square Option 3: Major Bug */}
            <button
              type="button"
              onClick={() => setVerdict("major_bug")}
              className={cn(
                "aspect-square p-5 rounded-2xl text-left transition-all cursor-pointer font-['Hanken_Grotesk'] flex flex-col justify-between relative overflow-hidden",
                verdict === "major_bug"
                  ? "neu-card border-2 border-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.2)]"
                  : "neu-inset opacity-80 hover:opacity-100 hover:border-white/10"
              )}
            >
              <div className="flex justify-between items-start w-full">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400">
                  03 / FATAL
                </span>
                <Bug className={cn("w-5 h-5", verdict === "major_bug" ? "text-rose-400" : "text-neutral-500")} />
              </div>

              <div>
                <h4 className="text-base font-black uppercase tracking-tight mb-1 leading-snug text-white font-mono">
                  FATAL<br />LOGIC BUG
                </h4>
                <p className="text-xs leading-relaxed font-sans text-neutral-300">
                  Infinite loops, invalid pointer mutations, wrong output.
                </p>
              </div>
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
              className="neu-button px-3 py-1.5 rounded-lg text-[11px] font-bold text-white flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" /> ADD BUG ROW
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[360px] pr-1">
            {reportedBugs.map((bug, idx) => (
              <div key={idx} className="neu-inset p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400 font-bold">LINE #:</span>
                    <input
                      type="number"
                      value={bug.line_reference || ""}
                      onChange={(e) => {
                        const copy = [...reportedBugs];
                        copy[idx].line_reference = parseInt(e.target.value) || undefined;
                        setReportedBugs(copy);
                      }}
                      className="w-16 py-1 px-2 rounded-lg neu-inset text-white text-center font-bold"
                    />
                  </div>

                  <select
                    value={bug.severity}
                    onChange={(e) => {
                      const copy = [...reportedBugs];
                      copy[idx].severity = e.target.value as IssueSeverity;
                      setReportedBugs(copy);
                    }}
                    className="neu-button py-1.5 px-3 rounded-lg text-white text-xs uppercase cursor-pointer"
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
                  className="w-full p-3 rounded-lg neu-inset text-white text-xs font-sans focus:outline-none"
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
              className="neu-button px-3 py-1.5 rounded-lg text-[11px] font-bold text-white flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" /> ADD TEST CASE
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[360px] pr-1">
            {testCases.map((test, idx) => (
              <div key={idx} className="neu-inset p-4 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between text-neutral-400 font-bold">
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    placeholder="Input e.g. [1,2,3]"
                    value={test.input}
                    onChange={(e) => {
                      const copy = [...testCases];
                      copy[idx].input = e.target.value;
                      setTestCases(copy);
                    }}
                    className="p-2.5 rounded-lg neu-inset text-white text-xs font-mono"
                  />
                  <input
                    placeholder="Expected Output"
                    value={test.expected}
                    onChange={(e) => {
                      const copy = [...testCases];
                      copy[idx].expected = e.target.value;
                      setTestCases(copy);
                    }}
                    className="p-2.5 rounded-lg neu-inset text-white text-xs font-mono"
                  />
                  <input
                    placeholder="Actual AI Output"
                    value={test.actual}
                    onChange={(e) => {
                      const copy = [...testCases];
                      copy[idx].actual = e.target.value;
                      setTestCases(copy);
                    }}
                    className="p-2.5 rounded-lg neu-inset text-white text-xs font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Big-O Complexity */}
      {activeTab === "bigo" && (
        <div className="flex flex-col flex-grow space-y-5 font-mono text-xs">
          <div>
            <span className="text-xs font-bold text-white uppercase block mb-1">ASYMPTOTIC ANALYSIS</span>
            <p className="text-xs text-neutral-400 font-sans">
              Audit the AI's claimed Time & Space complexities against the actual implementation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-neutral-400 font-bold block text-[11px]">ASSESSED TIME COMPLEXITY</label>
              <input
                value={assessedComplexity.time}
                onChange={(e) => setAssessedComplexity({ ...assessedComplexity, time: e.target.value })}
                placeholder="e.g. O(N), O(N log N)"
                className="w-full p-3 rounded-lg neu-inset text-white font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-neutral-400 font-bold block text-[11px]">ASSESSED SPACE COMPLEXITY</label>
              <input
                value={assessedComplexity.space}
                onChange={(e) => setAssessedComplexity({ ...assessedComplexity, space: e.target.value })}
                placeholder="e.g. O(1), O(N)"
                className="w-full p-3 rounded-lg neu-inset text-white font-mono text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-neutral-400 font-bold block text-[11px]">JUSTIFICATION & INVARIANTS</label>
            <textarea
              value={assessedComplexity.justification}
              onChange={(e) => setAssessedComplexity({ ...assessedComplexity, justification: e.target.value })}
              placeholder="Explain auxiliary memory allocations, call stack frames, or inner loop bounds..."
              rows={3}
              className="w-full p-3 rounded-lg neu-inset text-white font-sans text-xs"
            />
          </div>

          <div className="neu-inset p-4 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                id="explanation_accurate"
                checked={explanationAudit.is_accurate}
                onChange={(e) => setExplanationAudit({ ...explanationAudit, is_accurate: e.target.checked })}
                className="w-4 h-4 rounded neu-inset accent-emerald-500 cursor-pointer"
              />
              <label htmlFor="explanation_accurate" className="text-white font-bold cursor-pointer text-xs">
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
            className="w-full p-3.5 rounded-xl neu-inset text-white font-mono text-xs leading-relaxed"
          />
        </div>
      )}

      {/* Form Action Controls */}
      <div className="border-t border-white/[0.06] pt-4 flex items-center justify-between mt-auto">
        <button
          type="button"
          onClick={() => {
            setVerdict("major_bug");
            setReportedBugs([]);
            setTestCases([]);
          }}
          className="neu-button px-4 py-2 flex items-center gap-1.5 text-xs font-mono font-bold text-neutral-400 hover:text-white transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="neu-button bg-white text-black hover:bg-neutral-200 px-6 py-3 rounded-xl font-mono font-black text-xs uppercase transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isSubmitting ? "AUDITING..." : "SUBMIT EVALUATION"}</span>
        </button>
      </div>
    </form>
  );
}
