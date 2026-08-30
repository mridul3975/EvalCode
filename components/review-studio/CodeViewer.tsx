"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal, Code2, Sparkles, ZoomIn, ZoomOut } from "lucide-react";
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
  title = "AI-Generated Code Snippet (Under Review)",
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

  // Lightweight syntax highlighting token renderer
  const renderSyntaxLine = (text: string) => {
    if (!text.trim()) return " ";

    // Python / JS / C++ keyword detection
    const keywords = ["def ", "function ", "class ", "return ", "while ", "for ", "if ", "elif ", "else ", "const ", "let ", "var ", "int ", "bool ", "public:", "private:", "import ", "from ", "new ", "true", "false", "None", "null"];
    
    // Check if line is a comment
    if (text.trim().startsWith("#") || text.trim().startsWith("//")) {
      return <span className="text-zinc-500 italic">{text}</span>;
    }

    return text;
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-800/90 rounded-2xl overflow-hidden shadow-xl">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800/80 bg-zinc-900/70 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-xs font-bold text-zinc-200">{title}</span>
          <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-md border border-zinc-700 uppercase font-semibold">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {lastCitedLine && (
            <span className="text-[11px] text-emerald-400 font-mono font-medium animate-pulse flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Cited Line {lastCitedLine} in Bug Report!
            </span>
          )}

          <div className="flex items-center gap-1 border-r border-zinc-800 pr-2">
            <button
              onClick={() => setFontSize(fontSize === "sm" ? "base" : "sm")}
              title="Toggle Font Size"
              className="text-zinc-400 hover:text-zinc-200 p-1 text-[11px] font-mono font-bold cursor-pointer"
            >
              {fontSize === "sm" ? "A+" : "A-"}
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-700/60 transition-all cursor-pointer active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Language Selector Bar */}
      {availableLanguages.length > 1 && onLanguageChange && (
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-zinc-800/60 bg-zinc-900/40">
          <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold mr-1.5">Lang:</span>
          {availableLanguages.map((lang) => {
            const isActive = lang === selectedLanguage;
            return (
              <button
                key={lang}
                type="button"
                onClick={() => onLanguageChange(lang)}
                className={cn(
                  "px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer",
                  isActive
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-transparent"
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
          "flex-1 overflow-auto p-4 font-mono leading-relaxed selection:bg-emerald-500/20 selection:text-emerald-200",
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
                  "flex items-center gap-4 py-0.5 px-2 rounded-md transition-colors cursor-pointer group",
                  isJustCited
                    ? "bg-emerald-950/60 text-emerald-200 border-l-2 border-emerald-400"
                    : isHighlighted
                    ? "bg-rose-950/40 text-rose-200 border-l-2 border-rose-500"
                    : isHovered
                    ? "bg-zinc-900 text-zinc-100"
                    : "text-zinc-300"
                )}
              >
                {/* Line Number Gutter */}
                <span
                  className={cn(
                    "w-7 text-right select-none font-mono text-[11px] shrink-0 transition-colors",
                    isJustCited
                      ? "text-emerald-400 font-bold"
                      : isHighlighted
                      ? "text-rose-400 font-bold"
                      : isHovered
                      ? "text-emerald-400 font-medium"
                      : "text-zinc-600 group-hover:text-zinc-400"
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
      <div className="px-4 py-1.5 bg-zinc-950/90 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
        <span>Click any line above to auto-fill its line # in your audit</span>
        <span>{lines.length} lines</span>
      </div>
    </div>
  );
}
