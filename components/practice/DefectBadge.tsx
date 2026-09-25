"use client";

import React from "react";
import { getDefectMeta } from "@/lib/core/defect-pipeline";
import { cn } from "@/lib/utils";
import {
  Bug,
  ShieldAlert,
  TrendingDown,
  EyeOff,
  FileX,
  CheckCircle2,
  Cpu,
  Layers,
  Sliders,
  AlertOctagon,
  Flame,
  Copy,
  AlertCircle,
} from "lucide-react";

interface DefectBadgeProps {
  defectType?: string;
  className?: string;
  showIcon?: boolean;
}

export function DefectBadge({
  defectType,
  className,
  showIcon = true,
}: DefectBadgeProps) {
  const meta = getDefectMeta(defectType);
  const key = defectType || meta.key;

  const getBadgeIcon = () => {
    switch (key) {
      case "pointer_bug":
      case "subtle_logic_bug":
        return <Bug className="w-3 h-3 text-rose-400 shrink-0" />;
      case "edge_case":
      case "edge_case_blindness":
        return <ShieldAlert className="w-3 h-3 text-amber-400 shrink-0" />;
      case "complexity_regression":
        return <TrendingDown className="w-3 h-3 text-purple-400 shrink-0" />;
      case "deceptive_explanation":
        return <EyeOff className="w-3 h-3 text-pink-400 shrink-0" />;
      case "instruction_mismatch":
        return <FileX className="w-3 h-3 text-orange-400 shrink-0" />;
      case "completely_correct":
      case "clean":
        return <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />;
      case "concurrency_bug":
        return <Cpu className="w-3 h-3 text-indigo-400 shrink-0" />;
      case "memory_aliasing":
        return <Layers className="w-3 h-3 text-fuchsia-400 shrink-0" />;
      case "off_by_one":
        return <Sliders className="w-3 h-3 text-yellow-400 shrink-0" />;
      case "integer_overflow":
        return <AlertOctagon className="w-3 h-3 text-red-400 shrink-0" />;
      case "stack_overflow":
        return <Flame className="w-3 h-3 text-rose-400 shrink-0" />;
      case "mutable_default":
        return <Copy className="w-3 h-3 text-teal-400 shrink-0" />;
      default:
        return <AlertCircle className="w-3 h-3 text-neutral-400 shrink-0" />;
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border shadow-sm",
        meta.badgeClass,
        className
      )}
    >
      {showIcon && getBadgeIcon()}
      <span>{meta.label}</span>
    </span>
  );
}
