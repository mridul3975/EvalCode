import React from "react";
import { cn } from "@/lib/utils";
import { Verdict } from "@/types/question";
import { CheckCircle2, AlertTriangle, XCircle, Info, Sparkles } from "lucide-react";

export interface FormFieldWrapperProps {
  label: string;
  description?: string;
  required?: boolean;
  tooltip?: string;
  className?: string;
  children: React.ReactNode;
}

export function FormFieldWrapper({
  label,
  description,
  required,
  tooltip,
  className,
  children,
}: FormFieldWrapperProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
          {label}
          {required && <span className="text-rose-400 font-bold">*</span>}
          {tooltip && (
            <span title={tooltip} className="cursor-help text-zinc-500 hover:text-zinc-300">
              <Info className="w-3.5 h-3.5" />
            </span>
          )}
        </label>
      </div>
      {description && <p className="text-xs text-zinc-400 leading-normal">{description}</p>}
      {children}
    </div>
  );
}

export function VerdictToggleGroup({
  value,
  onChange,
}: {
  value: Verdict;
  onChange: (val: Verdict) => void;
}) {
  const options: Array<{
    verdict: Verdict;
    label: string;
    sublabel: string;
    icon: React.ElementType;
    color: string;
    activeBorder: string;
    activeBg: string;
    glow: string;
  }> = [
    {
      verdict: "correct",
      label: "Completely Correct",
      sublabel: "Optimal & Bug-Free",
      icon: CheckCircle2,
      color: "text-emerald-400",
      activeBorder: "border-emerald-500/80 ring-1 ring-emerald-500/40",
      activeBg: "bg-emerald-950/40 text-emerald-200 shadow-[inset_0_1px_0_rgba(16,185,129,0.2)]",
      glow: "hover:border-emerald-500/40",
    },
    {
      verdict: "minor_issue",
      label: "Minor / Suboptimal",
      sublabel: "Complexity or Style",
      icon: AlertTriangle,
      color: "text-amber-400",
      activeBorder: "border-amber-500/80 ring-1 ring-amber-500/40",
      activeBg: "bg-amber-950/40 text-amber-200 shadow-[inset_0_1px_0_rgba(245,158,11,0.2)]",
      glow: "hover:border-amber-500/40",
    },
    {
      verdict: "major_bug",
      label: "Critical Bug / Fail",
      sublabel: "Logic Crash / Flawed",
      icon: XCircle,
      color: "text-rose-400",
      activeBorder: "border-rose-500/80 ring-1 ring-rose-500/40",
      activeBg: "bg-rose-950/40 text-rose-200 shadow-[inset_0_1px_0_rgba(239,68,68,0.2)]",
      glow: "hover:border-rose-500/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {options.map((opt) => {
        const isSelected = value === opt.verdict;
        const Icon = opt.icon;
        return (
          <button
            key={opt.verdict}
            type="button"
            onClick={() => onChange(opt.verdict)}
            className={cn(
              "flex flex-col items-start p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer active:scale-[0.98]",
              isSelected
                ? cn(opt.activeBorder, opt.activeBg)
                : cn("border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/60 text-zinc-300", opt.glow)
            )}
          >
            <div className="flex items-center gap-2 mb-1 w-full">
              <Icon className={cn("w-4 h-4 shrink-0", opt.color)} />
              <span className="text-xs font-bold tracking-tight">{opt.label}</span>
            </div>
            <span className="text-[11px] text-zinc-400 pl-6">{opt.sublabel}</span>
          </button>
        );
      })}
    </div>
  );
}

export function ComplexityPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  const commonComplexities = ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n^2)"];

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">{label}</span>
      
      {/* Quick Click Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {commonComplexities.map((c) => {
          const isSelected = value === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => onChange(c)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-all cursor-pointer active:scale-95",
                isSelected
                  ? "bg-sky-500/20 text-sky-300 border-sky-500/60 shadow-[inset_0_1px_0_rgba(56,189,248,0.2)]"
                  : "bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
              )}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Manual Input / Custom Bound */}
      <input
        type="text"
        placeholder="Or type custom Big-O: e.g. O(m*n)..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-sky-500/50"
      />
    </div>
  );
}
