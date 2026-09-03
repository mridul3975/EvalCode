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
    <div className="flex flex-col h-full bg-[#0c0d10] font-mono select-none">
      {/* 40px Tactile Header Bar */}
      <div className="h-10 px-3 bg-[#101114] border-b border-white/[0.04] flex items-center justify-between gap-3 shrink-0">
        {/* Language Selector as Neomorphic Buttons */}
        <div className="flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5 text-neutral-500 mr-1" />
          {(["python", "typescript", "cpp"] as OALanguage[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => onLanguageChange(lang)}
              className={cn(
                "px-3 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer",
                language === lang
                  ? "neu-inset text-white font-bold border border-white/10"
                  : "neu-button text-neutral-400 hover:text-white"
              )}
            >
              {lang === "cpp" ? "C++" : lang === "python" ? "Python 3" : "TypeScript"}
            </button>
          ))}
        </div>

        {/* Minimal Actions with .neu-button */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onResetStarterCode}
            title="Reset to Starter Code"
            className="neu-button p-1.5 rounded-lg text-neutral-400 hover:text-white cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleCopy}
            title="Copy Code"
            className="neu-button p-1.5 rounded-lg text-neutral-400 hover:text-white cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Editor Viewport Nested in .neu-inset Well */}
      <div className="flex-1 w-full p-2.5 min-h-0">
        <div className="neu-inset w-full h-full p-2 overflow-hidden">
          <Editor
            height="100%"
            language={monacoLang}
            theme="vs-dark"
            value={code}
            onChange={(val) => onChange(val || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontLigatures: true,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 4,
              wordWrap: "on",
              lineNumbers: "on",
              renderLineHighlight: "all",
              lineHeight: 21,
              padding: { top: 8, bottom: 8 },
              scrollbar: {
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
