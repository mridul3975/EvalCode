"use client";

import React, { useState } from "react";
import { Copy, Check, Sparkles } from "lucide-react";
import { QuestionLanguage } from "@/types/question";
import { getLanguageLabel } from "@/lib/language-utils";
import { cn } from "@/lib/utils";

export interface CodeViewerProps {
  code: string;
  language: string;
  highlightLines?: number[];
  onSelectLine?: (line: number) => void;
  title?: string;
  availableLanguages?: QuestionLanguage[];
  selectedLanguage?: QuestionLanguage;
  onLanguageChange?: (lang: QuestionLanguage) => void;
}

export function CodeViewer({
  code,
  language,
  highlightLines = [],
  onSelectLine,
  title = "AI-GENERATED CODE SNIPPET (UNDER REVIEW)",
  availableLanguages = [],
  selectedLanguage,
  onLanguageChange,
}: CodeViewerProps) {
  const [copied, setCopied] = useState(false);
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const [lastCitedLine, setLastCitedLine] = useState<number | null>(null);
  const [fontSize, setFontSize] = useState<"sm" | "base">("sm");

  const lines = code.split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLineClick = (lineNum: number) => {
    setLastCitedLine(lineNum);
    onSelectLine?.(lineNum);
    setTimeout(() => setLastCitedLine(null), 2500);
  };

  const renderSyntaxLine = (text: string) => {
    if (!text.trim()) return " ";
    if (text.trim().startsWith("#") || text.trim().startsWith("//")) {
      return <span className="text-zinc-500 italic">{text}</span>;
    }
    return text;
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0b0d] border-4 border-white text-white font-mono">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b-4 border-white bg-[#121416]">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-white" />
          <span className="text-xs font-black uppercase text-white font-['Hanken_Grotesk']">{title}</span>
          <span className="text-[10px] font-bold text-black bg-white px-2 py-0.5 uppercase">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {lastCitedLine && (
            <span className="text-xs text-white font-bold animate-pulse flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Cited Line {lastCitedLine}!
            </span>
          )}

          <button
            onClick={() => setFontSize(fontSize === "sm" ? "base" : "sm")}
            title="Toggle Font Size"
            className="text-zinc-400 hover:text-white p-1 text-xs font-bold cursor-pointer"
          >
            {fontSize === "sm" ? "A+" : "A-"}
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-black bg-white hover:bg-black hover:text-white px-3 py-1 font-bold uppercase border-2 border-white transition-none cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
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
      </div>

      {/* Language Selector Bar */}
      {availableLanguages.length > 1 && onLanguageChange && (
        <div className="flex items-center gap-2 px-4 py-2 border-b-2 border-white bg-[#121416]">
          <span className="text-[10px] uppercase font-bold text-zinc-400 mr-1">LANG:</span>
          {availableLanguages.map((lang) => {
            const isActive = lang === selectedLanguage;
            return (
              <button
                key={lang}
                type="button"
                onClick={() => onLanguageChange(lang)}
                className={cn(
                  "px-3 py-0.5 text-xs font-bold uppercase transition-none cursor-pointer border-2",
                  isActive
                    ? "bg-white text-black border-white"
                    : "border-transparent text-zinc-400 hover:bg-white hover:text-black hover:border-white"
                )}
              >
                {getLanguageLabel(lang)}
              </button>
            );
          })}
        </div>
      )}

      {/* Code Content with Line Numbers */}
      <div
        className={cn(
          "flex-1 overflow-auto p-4 leading-relaxed",
          fontSize === "sm" ? "text-xs" : "text-sm"
        )}
      >
        <div className="min-w-full inline-block">
          {lines.map((line, idx) => {
            const lineNum = idx + 1;
            const isHighlighted = highlightLines.includes(lineNum);
            const isHovered = hoveredLine === lineNum;
            const isJustCited = lastCitedLine === lineNum;

            return (
              <div
                key={lineNum}
                onMouseEnter={() => setHoveredLine(lineNum)}
                onMouseLeave={() => setHoveredLine(null)}
                onClick={() => handleLineClick(lineNum)}
                className={cn(
                  "flex items-center gap-4 py-0.5 px-2 transition-none cursor-pointer",
                  isJustCited
                    ? "bg-white text-black font-bold"
                    : isHighlighted
                    ? "bg-rose-950 text-rose-200 border-l-4 border-rose-500"
                    : isHovered
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-300"
                )}
              >
                {/* Line Number Gutter */}
                <span
                  className={cn(
                    "w-7 text-right select-none text-[11px] shrink-0 font-bold",
                    isJustCited
                      ? "text-black"
                      : isHovered
                      ? "text-white"
                      : "text-zinc-600"
                  )}
                >
                  {lineNum}
                </span>

                {/* Line Text */}
                <span className="whitespace-pre flex-1 font-mono">
                  {renderSyntaxLine(line)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Code Footer Hint */}
      <div className="px-4 py-2 bg-[#121416] border-t-2 border-white flex items-center justify-between text-[10px] text-zinc-400 font-bold uppercase">
        <span>CLICK ANY LINE ABOVE TO CITE IN AUDIT</span>
        <span>{lines.length} LINES</span>
      </div>
    </div>
  );
}
