"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { OALanguage } from "@/types/oa";
import { cn } from "@/lib/utils";
import {
  Play,
  RotateCcw,
  Code2,
  Copy,
  Check,
  Maximize2,
  CheckCircle2,
} from "lucide-react";

// Dynamically import Monaco Editor to ensure SSR safety
const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface MonacoCodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  language: OALanguage;
  onLanguageChange: (lang: OALanguage) => void;
  onResetStarterCode: () => void;
  onRunTests: () => void;
  isRunningTests?: boolean;
}

export function MonacoCodeEditor({
  code,
  onChange,
  language,
  onLanguageChange,
  onResetStarterCode,
  onRunTests,
  isRunningTests = false,
}: MonacoCodeEditorProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const monacoLang = language === "typescript" ? "typescript" : language === "cpp" ? "cpp" : "python";

  return (
    <div className="flex flex-col h-full bg-[#141618] border border-white/10 rounded-xl overflow-hidden shadow-2xl font-mono">
      {/* Editor Header Bar */}
      <div className="p-3 bg-[#181a1d] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <Code2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold uppercase text-white tracking-wider">
            SOLUTION WORKSPACE
          </span>

          {/* Language Selector */}
          <div className="flex items-center bg-[#0c0e10] p-0.5 rounded-lg border border-white/10 text-xs">
            {(["python", "typescript", "cpp"] as OALanguage[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => onLanguageChange(lang)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-[11px] font-bold uppercase transition-all cursor-pointer",
                  language === lang
                    ? "bg-white text-black font-black"
                    : "text-[#b9cbc1] hover:text-white"
                )}
              >
                {lang === "cpp" ? "C++" : lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Reset Code */}
          <button
            type="button"
            onClick={onResetStarterCode}
            title="Reset to Starter Code"
            className="neu-extruded bg-[#1e2022] hover:bg-white hover:text-black p-1.5 px-2.5 rounded-lg text-xs text-[#b9cbc1] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">RESET</span>
          </button>

          {/* Copy Code */}
          <button
            type="button"
            onClick={handleCopy}
            className="neu-extruded bg-[#1e2022] hover:bg-white hover:text-black p-1.5 px-2.5 rounded-lg text-xs text-[#b9cbc1] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">COPY</span>
              </>
            )}
          </button>

          {/* Run Visible Tests CTA */}
          <button
            type="button"
            onClick={onRunTests}
            disabled={isRunningTests}
            className="neu-extruded bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunningTests ? "RUNNING..." : "RUN TESTS"}</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 min-h-[300px] w-full bg-[#0c0e10]">
        <Editor
          height="100%"
          language={monacoLang}
          theme="vs-dark"
          value={code}
          onChange={(val) => onChange(val || "")}
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            lineNumbersMinChars: 3,
            roundedSelection: true,
            tabSize: 4,
            insertSpaces: true,
            automaticLayout: true,
            padding: { top: 12, bottom: 12 },
          }}
          loading={
            <div className="h-full flex items-center justify-center text-xs text-[#83958c] font-mono">
              INITIALIZING MONACO RUNTIME...
            </div>
          }
        />
      </div>
    </div>
  );
}
