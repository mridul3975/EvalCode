"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Plus, Trash2 } from "lucide-react";
import { OA_TRACKS, OA_PROBLEMS } from "@/data/oa-problems";
import type { OACompanyTrack } from "@/types/oa";
import { getCustomOATracks, getCustomOAProblems, deleteCustomOATrack } from "@/lib/oa/storage";
import { ImportOAModal } from "@/components/oa/ImportOAModal";
import { Dialog } from "@/components/ui/Dialog";
export default function OALobbyPage() {
  const [company, setCompany] = useState("all");
  const [importOpen, setImportOpen] = useState(false);
  const [custom, setCustom] = useState<OACompanyTrack[]>([]);
  const [problems, setProblems] = useState(OA_PROBLEMS);
  const [deleteTrack, setDeleteTrack] = useState<string | null>(null);
  function refresh() { setCustom(getCustomOATracks()); setProblems([...getCustomOAProblems(), ...OA_PROBLEMS]); }
  useEffect(refresh, []);
  const tracks = [...custom, ...OA_TRACKS.filter(track => !custom.some(value => value.id === track.id))];
  const visible = tracks.filter(track => company === "all" || company === track.companyProfile);
  return <div className="page-shell">
    <div className="flex flex-wrap items-start justify-between gap-5"><div><h1 className="page-heading">Coding assessments</h1><p className="page-description">Solve a set of problems, manage your time, and explain the decisions behind your code.</p></div><button className="btn-secondary" onClick={() => setImportOpen(true)}><Plus size={16} />Import assessment</button></div>
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-neutral-800 py-4"><label className="flex items-center gap-3 text-sm text-neutral-400">Scenario<select className="field !w-auto" value={company} onChange={event => setCompany(event.target.value)}><option value="all">All scenarios</option>{[...new Set(tracks.map(track => track.companyProfile))].sort().map(value => <option key={value} value={value}>{value}-inspired</option>)}</select></label><p className="text-xs text-neutral-400">{visible.length} assessments · Independent practice exercises</p></div>
    <div className="divide-y divide-neutral-800">{visible.map(track => <article key={track.id} className="grid gap-5 py-7 lg:grid-cols-[1fr_auto] lg:items-center">
      <div className="min-w-0"><div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-neutral-400"><span>{track.companyProfile}-inspired</span><span>{track.problemIds.length} problems</span><span className="inline-flex items-center gap-1"><Clock size={12} />{Math.round(track.totalTimeSeconds / 60)} minutes</span>{custom.some(value => value.id === track.id) && <span>Imported</span>}</div>
        <h2 className="text-xl font-semibold">{track.title}</h2>
        <ul className="mt-3 space-y-1.5 text-sm text-neutral-400">{track.problemIds.map((id, index) => { const problem = problems.find(value => value.id === id); return problem ? <li key={id}><span className="mr-2 font-mono text-xs text-neutral-500">{index + 1}.</span>{problem.title}<span className="ml-2 text-xs text-neutral-500">{problem.difficulty}</span></li> : null; })}</ul>
      </div>
      <div className="flex items-center gap-2">{custom.some(value => value.id === track.id) && <button className="icon-button" aria-label={`Delete ${track.title}`} onClick={() => setDeleteTrack(track.id)}><Trash2 size={16} /></button>}<Link className="btn-primary" href={`/oa/${track.id}`}>Start assessment<ArrowRight size={16} /></Link></div>
    </article>)}</div>
    <p className="mt-6 border-t border-neutral-800 pt-5 text-xs leading-6 text-neutral-400">Company names describe scenario inspiration. These exercises are independent and do not reproduce or certify any employer’s hiring process. AI follow-up stages may require a configured service.</p>
    <ImportOAModal isOpen={importOpen} onClose={() => setImportOpen(false)} onTrackImported={refresh} />
    {deleteTrack && <Dialog label="Delete imported assessment" onClose={() => setDeleteTrack(null)}><div className="space-y-5 p-6"><h2 className="text-xl">Delete this imported assessment?</h2><p className="text-sm text-neutral-400">It will be removed from this browser’s catalog.</p><div className="flex justify-end gap-3"><button className="btn-secondary" onClick={() => setDeleteTrack(null)}>Keep it</button><button className="btn-primary" onClick={() => { deleteCustomOATrack(deleteTrack); refresh(); setDeleteTrack(null); }}>Delete assessment</button></div></div></Dialog>}
  </div>;
}
