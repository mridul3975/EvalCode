"use client";

import React, { useState } from "react";
import { QuestionLanguage } from "@/types/question";
import { getLanguageLabel } from "@/lib/language-utils";
import { cn } from "@/lib/utils";
import { Copy, Check, Code2 } from "lucide-react";

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
    <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-5 flex flex-col gap-3 font-mono text-neutral-200 shadow-xl backdrop-blur-sm">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-semibold text-white tracking-wide">
            AI Code Snippet Under Review
          </h3>
          <span className="bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded text-[10px] text-neutral-400 uppercase font-mono">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher Tabs if multiple */}
          {availableLanguages.length > 1 && onLanguageChange && (
            <div className="flex bg-neutral-950/80 rounded border border-neutral-800 p-0.5 text-[10px]">
              {availableLanguages.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => onLanguageChange(lang)}
                  className={cn(
                    "px-2 py-0.5 rounded transition-colors cursor-pointer",
                    selectedLanguage === lang
                      ? "bg-white text-black font-bold"
                      : "text-neutral-400 hover:text-white"
                  )}
                >
                  {getLanguageLabel(lang)}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="p-1 px-2.5 rounded text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Body with Line Selection */}
      <div className="rounded-lg bg-neutral-950/70 border border-neutral-800/80 p-3 overflow-x-auto text-xs font-mono leading-relaxed max-h-[420px] overflow-y-auto">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((lineText, idx) => {
              const lineNum = idx + 1;
              const isHovered = hoveredLine === lineNum;

              return (
                <tr
                  key={lineNum}
                  onMouseEnter={() => setHoveredLine(lineNum)}
                  onMouseLeave={() => setHoveredLine(null)}
                  onClick={() => onSelectLine && onSelectLine(lineNum)}
                  className={cn(
                    "transition-colors group cursor-pointer",
                    isHovered ? "bg-neutral-800/40" : "hover:bg-neutral-900/40"
                  )}
                >
                  {/* Line Number Gutter */}
                  <td className="w-10 pr-3 text-right select-none text-neutral-600 group-hover:text-neutral-400 text-[11px] align-top py-0.5">
                    {lineNum}
                  </td>
                  {/* Code Content */}
                  <td className="text-neutral-200 py-0.5 whitespace-pre font-mono">
                    {lineText || " "}
                  </td>
                  {/* Cite Prompt Tooltip on Hover */}
                  {onSelectLine && (
                    <td className="w-16 pl-2 text-right opacity-0 group-hover:opacity-100 transition-opacity select-none">
                      <span className="text-[10px] text-emerald-400 font-mono">
                        Cite L{lineNum}
                      </span>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
