"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getAssessmentHistory, getActiveAssessmentSession } from "@/lib/storage";
import { AssessmentSession } from "@/types/submission";
import { AssessmentSummary } from "@/components/assessment/AssessmentSummary";
import { WorkspaceSkeleton } from "@/components/boneyard/WorkspaceSkeleton";
import { Timer, ArrowLeft, ShieldAlert } from "lucide-react";

export default function AssessmentResultsPage() {
  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const history = getAssessmentHistory();
    const requestedId = new URLSearchParams(window.location.search).get("session");
    if (requestedId) {
      setSession(history.find(item => item.id === requestedId) || null);
    } else if (history.length > 0) {
      setSession(history[0]);
    } else {
      const active = getActiveAssessmentSession();
      if (active && active.is_completed) {
        setSession(active);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <WorkspaceSkeleton />;
  }

  if (!session) {
    return (
      <div className="max-w-[700px] mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto text-zinc-400">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-white">No mock result to show</h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
          Complete a review mock to see your saved judgments and feedback here.
        </p>
        <Link
          href="/assessment"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-lg transition-colors"
        >
          <Timer className="w-4 h-4" />
          <span>Explore review mocks</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-8">
      <AssessmentSummary session={session} />
    </div>
  );
}
