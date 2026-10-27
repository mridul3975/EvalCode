"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight, BookOpen, Check, Trash2 } from "lucide-react";
import { getStoredProfile, getAssessmentHistory, getStoredSubmissions, syncFromDatabase, clearAllProgress } from "@/lib/storage";
import type { UserProfileStats, AssessmentSession } from "@/types/submission";
import { SEED_QUESTIONS } from "@/data/seed-questions";
import { reviewTitle } from "@/lib/review-presentation";
import { Dialog } from "@/components/ui/Dialog";

export default function DashboardPage() {
  const { data: auth } = useSession();
  const [profile, setProfile] = useState<UserProfileStats | null>(null);
  const [history, setHistory] = useState<AssessmentSession[]>([]);
  const [reviews, setReviews] = useState<ReturnType<typeof getStoredSubmissions>>({});
  const [reset, setReset] = useState(false);
  function reload() { setProfile(getStoredProfile()); setHistory(getAssessmentHistory()); setReviews(getStoredSubmissions()); }
  useEffect(reload, []);
  useEffect(() => { if (auth?.user) syncFromDatabase().then(setProfile); }, [auth]);
  if (!profile) return <div className="page-shell" role="status">Loading your progress…</div>;
  const hasActivity = profile.total_evaluations_count > 0;
  const dimensions = [["correctness", "Correctness"], ["edge_cases", "Edge cases"], ["complexity", "Complexity"], ["explanation", "Explanation"], ["communication", "Communication"], ["debugging", "Suggested fixes"]] as const;
  const recent = Object.entries(reviews).sort((a, b) => b[1].result.created_at.localeCompare(a[1].result.created_at)).slice(0, 6);
  return <div className="page-shell">
    <div className="flex flex-wrap items-start justify-between gap-5"><div><h1 className="page-heading">Your progress</h1><p className="page-description">See what you’re learning and decide what to practice next.</p></div>{hasActivity && <Link className="btn-primary" href="/practice">Continue practice<ArrowRight size={16} /></Link>}</div>
    {!hasActivity ? <section className="mt-12 grid gap-10 border-y border-neutral-800 py-10 lg:grid-cols-2">
      <div><BookOpen className="mb-5 text-emerald-200" size={28} /><h2 className="text-2xl font-semibold">Your first review is the starting point.</h2><p className="mt-4 max-w-lg leading-7 text-neutral-400">You haven’t been assessed yet. Review one implementation to start building a picture of your strengths and the details you tend to miss.</p><Link className="btn-primary mt-7" href="/practice/q_ll_001">Start a short review<ArrowRight size={16} /></Link></div>
      <div className="space-y-5 lg:pl-10"><h3 className="text-base font-medium">What you’ll see after practicing</h3>{["Feedback on findings you caught or missed", "Progress across code-review skills", "Your recent reviews and mock results"].map(text => <p key={text} className="flex items-start gap-3 text-sm text-neutral-400"><Check size={16} className="mt-0.5 shrink-0 text-emerald-300" />{text}</p>)}<p className="border-t border-neutral-800 pt-4 text-xs text-neutral-400">Guest progress is saved in this browser. Sign in to sync supported progress across devices.</p></div>
    </section> : <>
      <dl className="my-8 grid grid-cols-2 gap-6 border-y border-neutral-800 py-6 sm:grid-cols-4">{[
        ["Review score", `${profile.readiness_score.toFixed(0)}%`], ["Verdict agreement", `${profile.verdict_accuracy.toFixed(0)}%`],
        ["Reviews completed", String(profile.total_evaluations_count)], ["Review mocks", String(profile.total_mocks_count)],
      ].map(([label, value]) => <div key={label}><dt className="text-sm text-neutral-400">{label}</dt><dd className="stat-number mt-2 text-2xl font-medium">{value}</dd></div>)}</dl>
      <div className="grid gap-10 lg:grid-cols-2">
        <section><h2 className="text-xl font-semibold">Skills over time</h2><p className="mt-2 text-sm text-neutral-400">Smoothed scores from your reviews. Early scores will change as you practice.</p><div className="mt-6 space-y-5">{dimensions.map(([key, label]) => <div key={key}><div className="mb-2 flex justify-between text-sm"><span className="text-neutral-300">{label}</span><span className="font-mono text-neutral-400">{profile.dimensional_mastery[key].toFixed(0)}%</span></div><progress aria-label={label} max="100" value={profile.dimensional_mastery[key]} className="h-1.5 w-full accent-emerald-200" /></div>)}</div></section>
        <section><h2 className="text-xl font-semibold">Recent reviews</h2><div className="mt-4 divide-y divide-neutral-800">{recent.map(([id, item]) => {
          const question = SEED_QUESTIONS.find(value => value.id === id);
          return <Link key={id} href={`/practice/${id}`} className="flex items-center justify-between gap-4 py-4"><span className="min-w-0"><span className="block text-sm text-neutral-200">{question ? reviewTitle(question) : "Custom review"}</span><span className="mt-1 block text-xs text-neutral-400">{new Date(item.result.created_at).toLocaleDateString()}</span></span><span className="font-mono text-sm text-emerald-200">{(item.result.overall_score * 10).toFixed(0)}%</span></Link>;
        })}{!recent.length && <p className="py-5 text-sm text-neutral-400">Practice reviews will appear here.</p>}</div></section>
      </div>
      <details className="mt-10 border-t border-neutral-800 pt-5"><summary className="cursor-pointer text-sm text-neutral-300">How these scores work</summary><p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-400">Reviews compare your judgments with reference findings. The review score uses practice results until mock results are available, then combines 60% mock average with 40% practice average. Skill scores use a moving average, with each new result contributing 20%. These describe your activity here, rather than a percentile or a hiring prediction.</p></details>
    </>}
    <section className="mt-12 border-t border-neutral-800 pt-7"><div className="flex items-center justify-between gap-4"><h2 className="text-xl font-semibold">Review mocks</h2><Link href="/assessment" className="inline-flex min-h-11 items-center gap-2 text-sm text-emerald-200">Take a mock<ArrowRight size={15} /></Link></div>
      {history.length ? <div className="mt-3 divide-y divide-neutral-800">{history.map(session => <Link key={session.id} href={`/assessment/results?session=${encodeURIComponent(session.id)}`} className="flex items-center justify-between gap-4 py-4 text-sm"><span>{new Date(session.start_time).toLocaleDateString()}<span className="ml-3 text-neutral-400">{session.question_ids.length} reviews</span></span><span className="font-mono">{(session.total_score || 0).toFixed(0)}%</span></Link>)}</div> : <p className="mt-3 text-sm text-neutral-400">No completed mocks yet. Start whenever you’re comfortable with the review workflow.</p>}
    </section>
    {hasActivity && <button className="mt-10 inline-flex min-h-11 items-center gap-2 text-xs text-neutral-400 hover:text-rose-200" onClick={() => setReset(true)}><Trash2 size={13} />Reset saved progress</button>}
    {reset && <Dialog label="Reset progress" onClose={() => setReset(false)}><div className="space-y-5 p-6"><h2 className="text-xl">Reset your progress?</h2><p className="text-sm leading-7 text-neutral-400">This clears saved reviews, attempts, mocks, and bookmarks, including synced submissions. Your custom questions and AI settings remain.</p><div className="flex flex-wrap justify-end gap-3"><button className="btn-secondary" onClick={() => setReset(false)}>Keep my progress</button><button className="btn-primary" onClick={() => { clearAllProgress(); reload(); setReset(false); }}>Reset progress</button></div></div></Dialog>}
  </div>;
}
