"use client";

import Editor, { loader, type EditorProps } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";

loader.config({ paths: { vs: "/vendor/monaco/vs" } });

export function CodeEditor({ onReady, ...props }: EditorProps & { onReady?: () => void }) {
  const [ready, setReady] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const timer = window.setTimeout(() => { if (!ready) setFallback(true); }, 10000);
    return () => window.clearTimeout(timer);
  }, [ready, attempt]);
  useEffect(() => { if (ready || fallback) onReady?.(); }, [ready, fallback, onReady]);
  if (fallback) return <div className="flex h-full min-h-[260px] flex-col">
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 px-3 py-2 text-xs text-neutral-300" role="status">
      <span>Using the basic editor. Your code is preserved.</span>
      <button type="button" className="inline-flex items-center gap-1 text-emerald-300" onClick={() => {
        setFallback(false); setReady(false); setAttempt(value => value + 1);
      }}><RotateCcw size={13} />Retry enhanced editor</button>
    </div>
    <textarea aria-label="Code editor" spellCheck={false} className="code-fallback flex-1"
      value={props.value || ""} onChange={event => props.onChange?.(event.target.value, undefined as never)} />
  </div>;
  return <Editor {...props} key={attempt} loading={<div role="status" className="p-5 text-sm text-neutral-400">Opening editor…</div>}
    onMount={(editor, monaco) => { setReady(true); props.onMount?.(editor, monaco); }} />;
}
