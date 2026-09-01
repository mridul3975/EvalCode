"use client";

import React, { useState } from "react";
import { QuestionLanguage } from "@/types/question";
import { getLanguageLabel } from "@/lib/language-utils";
import { cn } from "@/lib/utils";
import { Copy, Check, Code2, Terminal } from "lucide-react";

export function CodeViewer({
  code,
  language = "PYTHON",
  onSelectLine,
  availableLanguages = [],
  selectedLanguage,
  onLanguageChange,
}: {
  code: string;
  language?: string;
  onSelectLine?: (line: number) => void;
  availableLanguages?: QuestionLanguage[];
  selectedLanguage?: QuestionLanguage;
  onLanguageChange?: (lang: QuestionLanguage) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);

  const lines = code.trim().split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="neu-extruded bg-[#121416] rounded-xl p-6 flex flex-col gap-4 font-mono text-white h-full border border-white/5 shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.08)] pb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 bg-white rounded-sm inline-block shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
          <h3 className="text-xs font-bold uppercase text-white font-mono tracking-wider">
            AI-GENERATED CODE SNIPPET (UNDER REVIEW)
          </h3>
          <span className="bg-[#282a2c] px-2 py-0.5 rounded text-[10px] font-mono text-[#b9cbc1] uppercase font-bold">
            {language}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="neu-extruded bg-[#1e2022] p-1.5 px-3 flex items-center gap-1.5 rounded-lg text-xs font-mono font-bold uppercase text-[#b9cbc1] hover:text-white transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-white" />
              <span>COPIED</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>COPY</span>
            </>
          )}
        </button>
      </div>

      {/* Language Switcher Bar if multiple available */}
      {availableLanguages.length > 1 && onLanguageChange && selectedLanguage && (
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-gray-500 uppercase text-[10px]">SELECT LANGUAGE:</span>
          {availableLanguages.map((lang) => {
            const isSelected = selectedLanguage === lang;
            return (
              <button
                key={lang}
                type="button"
                onClick={() => onLanguageChange(lang)}
                className={cn(
                  "px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer",
                  isSelected
                    ? "bg-white text-black font-black"
                    : "bg-[#1e2022] text-gray-400 hover:text-white"
                )}
              >
                {getLanguageLabel(lang)}
              </button>
            );
          })}
        </div>
      )}

      {/* Inset Code Editor Block */}
      <div className="code-inset rounded-lg p-4 overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed border border-black/50">
        <pre className="text-zinc-200">
          <code>
            {lines.map((lineText, index) => {
              const lineNum = index + 1;
              const isHovered = hoveredLine === lineNum;
              return (
                <div
                  key={lineNum}
                  onClick={() => onSelectLine && onSelectLine(lineNum)}
                  onMouseEnter={() => setHoveredLine(lineNum)}
                  onMouseLeave={() => setHoveredLine(null)}
                  className={cn(
                    "flex items-center group py-0.5 px-2 rounded transition-colors cursor-pointer select-none",
                    isHovered ? "bg-[#282a2c] text-white" : "hover:bg-[#1e2022]"
                  )}
                  title="Click to cite this line number in evaluation form"
                >
                  <span className="text-zinc-500 select-none w-8 text-right pr-4 shrink-0 font-mono text-xs">
                    {lineNum}
                  </span>
                  <span className="flex-1 font-mono tracking-wide">{lineText || " "}</span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>

      <div className="flex justify-between items-center text-[10px] font-mono text-[#83958c] pt-1">
        <span>CLICK ANY LINE ABOVE TO CITE IN AUDIT FORM</span>
        <span>{lines.length} LINES</span>
      </div>
    </div>
  );
}
