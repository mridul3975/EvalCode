"use client";
import { useEffect, useId, useRef, useState } from "react";
import type { QuestionItem, Verdict, IssueSeverity } from "@/types/question";
import type { EvaluationSubmission, ReportedBug, FailingTestCase } from "@/types/submission";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, Plus, Trash2 } from "lucide-react";

type Section = "verdict" | "bugs" | "tests" | "complexity" | "fix";
interface Draft {
  verdict: Verdict | ""; bugs: ReportedBug[]; tests: FailingTestCase[];
  time: string; space: string; justification: string;
  accurate: "" | "yes" | "no"; notes: string; fix: string;
}
function blank(initial?: EvaluationSubmission): Draft {
  return { verdict: initial?.verdict || "", bugs: initial?.reported_bugs || [], tests: initial?.failing_test_cases || [],
    time: initial?.assessed_complexity.time || "", space: initial?.assessed_complexity.space || "",
    justification: initial?.assessed_complexity.justification || "", accurate: initial ? (initial.explanation_audit.is_accurate ? "yes" : "no") : "",
    notes: initial?.explanation_audit.notes || "", fix: initial?.suggested_fix || "" };
}
export function EvaluationForm({ question, initialValues, onSubmit, isSubmitting = false, onLineCiteRequested,
  draftStorageKey, submitLabel = "Submit review" }: {
  question: QuestionItem; initialValues?: EvaluationSubmission; onSubmit: (submission: EvaluationSubmission) => void;
  isSubmitting?: boolean; onLineCiteRequested?: number | null; draftStorageKey?: string; submitLabel?: string;
}) {
  const id = useId();
  const [section, setSection] = useState<Section>("verdict");
  const [draft, setDraft] = useState<Draft>(() => blank(initialValues));
  const [loaded, setLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [error, setError] = useState("");
  const lastCite = useRef<number | null>(null);
  const storageKey = draftStorageKey || `evalforge_review_draft_${question.id}`;
  useEffect(() => {
    if (!initialValues) { try { const saved = localStorage.getItem(storageKey); if (saved) setDraft({ ...blank(), ...JSON.parse(saved) }); } catch {} }
    setLoaded(true);
  }, [storageKey]);
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(storageKey, JSON.stringify(draft)); setSaveStatus("Draft saved in this browser"); }
    catch { setSaveStatus("Draft could not be saved. Keep this page open."); }
  }, [draft, loaded, storageKey]);
  useEffect(() => {
    if (!onLineCiteRequested || !loaded || lastCite.current === onLineCiteRequested) return;
    lastCite.current = onLineCiteRequested; setSection("bugs");
    setDraft(value => ({ ...value, bugs: [...value.bugs, { line_reference: onLineCiteRequested, severity: "major", description: "" }] }));
  }, [onLineCiteRequested, loaded]);
  const update = (values: Partial<Draft>) => setDraft(value => ({ ...value, ...values }));
  const updateBug = (index: number, values: Partial<ReportedBug>) => update({ bugs: draft.bugs.map((bug, i) => i === index ? { ...bug, ...values } : bug) });
  const updateTest = (index: number, values: Partial<FailingTestCase>) => update({ tests: draft.tests.map((test, i) => i === index ? { ...test, ...values } : test) });
  const sections: { key: Section; label: string; done: boolean }[] = [
    { key: "verdict", label: "Verdict", done: !!draft.verdict },
    { key: "bugs", label: "Findings", done: draft.verdict === "correct" || draft.bugs.some(bug => !!bug.description.trim()) },
    { key: "tests", label: "Evidence", done: draft.tests.some(test => !!test.input.trim()) },
    { key: "complexity", label: "Complexity", done: !!draft.time.trim() && !!draft.space.trim() && !!draft.accurate },
    { key: "fix", label: "Suggested fix", done: !!draft.fix.trim() },
  ];
  return <form className="surface flex w-full min-w-0 flex-col self-start overflow-hidden" noValidate onSubmit={event => {
    event.preventDefault();
    if (!draft.verdict) { setError("Choose a verdict before submitting your review."); setSection("verdict"); return; }
    if (draft.verdict !== "correct" && !draft.bugs.some(bug => bug.description.trim())) { setError("Describe at least one finding to support your verdict."); setSection("bugs"); return; }
    if (!draft.time.trim() || !draft.space.trim() || !draft.accurate) { setError("Assess time, space, and the explanation before submitting."); setSection("complexity"); return; }
    setError("");
    onSubmit({ question_id: question.id, verdict: draft.verdict, reported_bugs: draft.bugs.filter(bug => !!bug.description.trim()),
      failing_test_cases: draft.tests.filter(test => !!test.input.trim()), assessed_complexity: { time: draft.time, space: draft.space, justification: draft.justification },
      explanation_audit: { is_accurate: draft.accurate === "yes", notes: draft.notes }, suggested_fix: draft.fix });
  }}>
    <div className="border-b border-neutral-800 px-5 pt-5">
      <h2 className="text-lg font-semibold">Your review</h2><p className="mt-1 text-sm text-neutral-400">Make your judgment, then support it with evidence.</p>
      <div className="mt-4 flex gap-1 overflow-x-auto pb-3" aria-label="Review sections">
        {sections.map(item => <button key={item.key} type="button" aria-pressed={section === item.key} onClick={() => setSection(item.key)}
          className={cn("inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-md px-3 text-sm", section === item.key ? "bg-neutral-700/60 text-white" : "text-neutral-400 hover:text-white")}>
          {item.done && <Check size={13} className="text-emerald-300" />}{item.label}</button>)}
      </div>
    </div>
    <div className="space-y-5 p-5 sm:p-6">
      {error && <p role="alert" className="rounded-lg bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p>}
      {section === "verdict" && <fieldset className="space-y-3"><legend className="mb-3 font-medium">How would you assess this implementation?</legend>
        {([
          ["correct", "Correct", "Meets the specification and handles the required cases."],
          ["minor_issue", "Minor issue", "Mostly works, with a limited quality or correctness issue."],
          ["major_bug", "Major issue", "Fails required cases, returns wrong results, or violates constraints."],
        ] as const).map(([value, title, detail]) => <label key={value} className={cn("flex cursor-pointer items-start gap-3 rounded-lg border p-4", draft.verdict === value ? "border-emerald-400/60 bg-emerald-400/5" : "border-neutral-700 hover:border-neutral-500")}>
          <input type="radio" name={`${id}-verdict`} value={value} checked={draft.verdict === value} onChange={() => update({ verdict: value })} className="mt-1 h-4 w-4 shrink-0" />
          <span><span className="block text-sm font-medium text-neutral-100">{title}</span><span className="mt-1 block text-sm text-neutral-400">{detail}</span></span></label>)}
        <p className="pt-1 text-xs text-neutral-400">Some examples are correct. Review the code without assuming a defect.</p>
      </fieldset>}
      {section === "bugs" && <div className="space-y-4">
        <div className="flex items-center justify-between gap-3"><h3 className="font-medium">Findings</h3><button type="button" className="btn-secondary" onClick={() => update({ bugs: [...draft.bugs, { severity: "major", description: "" }] })}><Plus size={15} />Add finding</button></div>
        {draft.bugs.length === 0 && <p className="text-sm text-neutral-400">No findings yet. Add an issue or cite a line from the code. A correct implementation may have none.</p>}
        {draft.bugs.map((bug, index) => <div key={index} className="space-y-3 border-t border-neutral-800 pt-4"><div className="flex items-end gap-3">
          <label className="w-24"><span className="field-label">Line</span><input aria-label={`Finding ${index + 1} line`} className="field" type="number" min="1" value={bug.line_reference || ""} onChange={event => updateBug(index, { line_reference: Number(event.target.value) || undefined })} /></label>
          <label className="flex-1"><span className="field-label">Severity</span><select className="field" value={bug.severity} onChange={event => updateBug(index, { severity: event.target.value as IssueSeverity })}>{(["critical", "major", "minor", "nit"] as const).map(value => <option key={value} value={value}>{value[0].toUpperCase() + value.slice(1)}</option>)}</select></label>
          <button type="button" aria-label={`Remove finding ${index + 1}`} className="icon-button" onClick={() => update({ bugs: draft.bugs.filter((_, i) => i !== index) })}><Trash2 size={16} /></button></div>
          <label className="block"><span className="field-label">What happens, and why?</span><textarea className="field min-h-28" rows={3} value={bug.description} onChange={event => updateBug(index, { description: event.target.value })} placeholder="Describe the cause and its effect on the output." /></label></div>)}
      </div>}
      {section === "tests" && <div className="space-y-4"><div className="flex items-center justify-between gap-3"><h3 className="font-medium">Test evidence</h3><button type="button" className="btn-secondary" onClick={() => update({ tests: [...draft.tests, { input: "", expected: "", actual: "" }] })}><Plus size={15} />Add test</button></div>
        <p className="text-sm text-neutral-400">Use a concrete input to demonstrate a finding. This section is optional.</p>
        {draft.tests.map((test, index) => <div key={index} className="space-y-3 border-t border-neutral-800 pt-3"><div className="flex items-center justify-between"><h4 className="text-sm">Test {index + 1}</h4><button type="button" className="icon-button" aria-label={`Remove test ${index + 1}`} onClick={() => update({ tests: draft.tests.filter((_, i) => i !== index) })}><Trash2 size={16} /></button></div>
          {(["input", "expected", "actual"] as const).map(field => <label key={field} className="block"><span className="field-label">{field === "input" ? "Input" : field === "expected" ? "Expected output" : "Actual output"}</span><input className="field font-mono" value={test[field]} onChange={event => updateTest(index, { [field]: event.target.value })} /></label>)}</div>)}
      </div>}
      {section === "complexity" && <div className="space-y-5"><h3 className="font-medium">Complexity and explanation</h3><p className="text-sm text-neutral-400">Assess the implementation, then check whether its explanation agrees.</p>
        <div className="grid gap-4 sm:grid-cols-2"><label><span className="field-label">Time complexity</span><input className="field font-mono" value={draft.time} placeholder="e.g. O(n)" onChange={event => update({ time: event.target.value })} /></label><label><span className="field-label">Space complexity</span><input className="field font-mono" value={draft.space} placeholder="e.g. O(1)" onChange={event => update({ space: event.target.value })} /></label></div>
        <label className="block"><span className="field-label">Reasoning</span><textarea className="field" rows={3} value={draft.justification} onChange={event => update({ justification: event.target.value })} placeholder="Consider loop bounds, allocations, and the call stack." /></label>
        <label className="block"><span className="field-label">Is the supplied explanation accurate?</span><select className="field" value={draft.accurate} onChange={event => update({ accurate: event.target.value as Draft["accurate"] })}><option value="">Choose an assessment</option><option value="yes">Yes, it matches the code</option><option value="no">No, it makes inaccurate claims</option></select></label>
        <label className="block"><span className="field-label">Explanation notes (optional)</span><textarea className="field" rows={2} value={draft.notes} onChange={event => update({ notes: event.target.value })} /></label></div>}
      {section === "fix" && <label className="block"><span className="field-label">Suggested fix (optional)</span><span className="mb-3 block text-sm text-neutral-400">Describe a repair or provide a corrected implementation.</span><textarea className="field min-h-60 font-mono" rows={10} spellCheck={false} value={draft.fix} onChange={event => update({ fix: event.target.value })} /></label>}
    </div>
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-800 px-5 py-4"><p className="text-xs text-neutral-400" role="status">{saveStatus || "Your judgment is not submitted yet"}</p><button type="submit" className="btn-primary" disabled={isSubmitting || !loaded}>{isSubmitting ? "Comparing your review…" : submitLabel}<ArrowRight size={16} /></button></div>
  </form>;
}
