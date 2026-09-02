"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  // Hide global marketing footer on full-height IDE test session screens
  const isWorkspaceRoute =
    (pathname.startsWith("/oa/") && pathname !== "/oa" && !pathname.startsWith("/oa/results")) ||
    (pathname.startsWith("/practice/") && pathname !== "/practice") ||
    pathname === "/assessment/session";

  if (isWorkspaceRoute) {
    return null;
  }

  return (
    <footer className="w-full border-t border-neutral-900/80 bg-neutral-950/40 text-neutral-400 font-['Hanken_Grotesk'] mt-auto">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-white text-black flex items-center justify-center font-black text-xs rounded-full">
                EF
              </div>
              <span className="text-lg font-bold text-white font-mono tracking-tight">
                EvalForge
              </span>
              <span className="text-[10px] font-mono border border-neutral-800 px-2 py-0.5 rounded-full text-neutral-400">
                v1.0
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-sans max-w-sm leading-relaxed">
              High-stakes AI-Evaluation & Code-Review Assessment Simulator. Calibrating engineers for RLHF, Tier-1 FinTech, and FAANG standards.
            </p>
          </div>

          <nav className="flex flex-wrap gap-6 text-xs font-mono">
            <Link
              href="/practice"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Practice Catalog
            </Link>
            <Link
              href="/assessment"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Mock Assessment
            </Link>
            <Link
              href="/oa"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              OA Simulator
            </Link>
            <Link
              href="/dashboard"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Readiness Profile
            </Link>
          </nav>
        </div>

        <div className="mt-12 pt-6 border-t border-neutral-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-600">
          <p>&copy; {new Date().getFullYear()} EvalForge. High-Caliber Code Evaluation Engine.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-neutral-400">SYSTEM OPERATIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
