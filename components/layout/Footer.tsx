import React from "react";
import Link from "next/link";
import { CheckSquare, Shield, Terminal, BookOpen, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800/80 bg-zinc-950 py-10 mt-auto">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center">
              <CheckSquare className="w-3.5 h-3.5 text-zinc-950 stroke-[3]" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">EvalForge</span>
            <span className="text-[11px] text-zinc-500 font-mono">v1.0.0</span>
          </div>
          <p className="text-xs text-zinc-400 max-w-sm text-center md:text-left">
            AI-Evaluation & Code-Review Assessment Simulator. Calibrating developers for RLHF code-auditing roles.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
          <Link href="/practice" className="hover:text-zinc-200 transition-colors flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" />
            <span>Practice Catalog</span>
          </Link>
          <Link href="/assessment" className="hover:text-zinc-200 transition-colors flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Mock Assessment</span>
          </Link>
          <Link href="/dashboard" className="hover:text-zinc-200 transition-colors flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Readiness Profile</span>
          </Link>
        </div>

        <div className="text-xs text-zinc-500 font-mono">
          &copy; {new Date().getFullYear()} EvalForge. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
