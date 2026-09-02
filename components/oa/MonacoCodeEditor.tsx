"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { OALanguage } from "@/types/oa";
import { cn } from "@/lib/utils";
import {
  RotateCcw,
  Copy,
  Check,
  Code2,
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
}: MonacoCodeEditorProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const monacoLang = language === "typescript" ? "typescript" : language === "cpp" ? "cpp" : "python";

  return (
    <div className="flex flex-col h-full bg-[#0d0e11] font-mono border-b border-neutral-800/80">
      {/* Clean 36px Header Bar */}
      <div className="h-9 px-3 bg-[#121418] border-b border-neutral-800/80 flex items-center justify-between gap-3 shrink-0 select-none">
        {/* Language Selector as Subtle Text Tabs */}
        <div className="flex items-center gap-1">
          <Code2 className="w-3.5 h-3.5 text-neutral-500 mr-1.5" />
          {(["python", "typescript", "cpp"] as OALanguage[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => onLanguageChange(lang)}
              className={cn(
                "px-2.5 py-1 rounded text-[11px] font-mono transition-all cursor-pointer",
                language === lang
                  ? "bg-neutral-800 text-white font-semibold"
                  : "text-neutral-400 hover:text-neutral-200"
              )}
            >
              {lang === "cpp" ? "C++" : lang === "python" ? "Python 3" : "TypeScript"}
            </button>
          ))}
        </div>

        {/* Minimal Actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onResetStarterCode}
            title="Reset to Starter Code"
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleCopy}
            title="Copy Code"
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Editor Viewport */}
      <div className="flex-1 w-full bg-[#0d0e11] min-h-0">
        <Editor
          height="100%"
          language={monacoLang}
          theme="vs-dark"
          value={code}
          onChange={(val) => onChange(val || "")}
          options={{
            fontSize: 13,
            lineHeight: 24,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            lineNumbersMinChars: 3,
            roundedSelection: true,
            tabSize: 4,
            insertSpaces: true,
            automaticLayout: true,
            padding: { top: 10, bottom: 10 },
          }}
          loading={
            <div className="h-full flex items-center justify-center text-xs text-neutral-500 font-mono">
              Loading editor environment...
            </div>
          }
        />
      </div>
    </div>
  );
}
