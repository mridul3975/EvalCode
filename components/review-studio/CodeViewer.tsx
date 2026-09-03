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
    <div className="neu-card p-6 flex flex-col gap-3 font-mono text-neutral-200">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-white tracking-wide uppercase font-mono">
            AI Code Snippet Under Review
          </h3>
          <span className="neu-active-pill px-2.5 py-0.5 text-[10px] text-neutral-300 uppercase font-mono">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher Tabs if multiple */}
          {availableLanguages.length > 1 && onLanguageChange && (
            <div className="flex gap-1 bg-[#0a0b0d] rounded-lg p-1 border border-white/[0.04] text-[10px]">
              {availableLanguages.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => onLanguageChange(lang)}
                  className={cn(
                    "px-2.5 py-0.5 rounded-md transition-all cursor-pointer",
                    selectedLanguage === lang
                      ? "neu-inset text-white font-bold border border-white/10"
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
            className="neu-button p-1.5 px-3 rounded-lg text-xs text-neutral-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
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

      {/* Code Body with Inset Recessed Well */}
      <div className="neu-inset p-3.5 overflow-x-auto text-xs font-mono leading-relaxed max-h-[420px] overflow-y-auto">
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
                    isHovered ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
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
