"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { QuestionItem } from "@/types/question";
import { askGeminiFollowUp } from "@/lib/gemini";
import { cn } from "@/lib/utils";
import { Sparkles, Send, User, Bot, Loader2, Lightbulb, Copy, Check, RotateCcw, X, PanelRightClose } from "lucide-react";

function ChatMarkdown({ content, isUser }: { content: string; isUser: boolean }) {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const handleCopyCode = (codeText: string, index: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  return (
    <div className={cn("text-xs leading-relaxed font-sans space-y-2", isUser ? "text-white" : "text-gray-900 font-medium")}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Code Block & Inline Code Rendering
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");
            const lang = match ? match[1].toUpperCase() : "CODE";

            if (!inline && (match || codeString.includes("\n"))) {
              const codeIdx = Math.random();
              return (
                <div className="my-2.5 rounded-xl overflow-hidden border border-black/30 font-mono text-xs shadow-xl">
                  {/* Code Header Bar */}
                  <div className="bg-[#121416] text-[#b9cbc1] px-3 py-1.5 flex justify-between items-center text-[10px] uppercase font-bold border-b border-[#282a2c]">
                    <span className="text-white font-mono tracking-wider">{lang}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(codeString, codeIdx)}
                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCodeIndex === codeIdx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>COPY</span>
                        </>
                      )}
                    </button>
                  </div>
                  {/* Code Body */}
                  <div className="bg-[#0c0e10] text-[#e2e2e5] p-3 overflow-x-auto leading-relaxed font-mono text-xs">
                    <pre className="text-zinc-200">
                      <code>{codeString}</code>
                    </pre>
                  </div>
                </div>
              );
            }

            return (
              <code
                className={cn(
                  "px-1.5 py-0.5 rounded font-mono text-[11px] font-bold mx-0.5 border",
                  isUser
                    ? "bg-[#121416] text-[#e2e2e5] border-white/20"
                    : "bg-gray-200 text-gray-900 border-gray-300"
                )}
                {...props}
              >
                {children}
              </code>
            );
          },

          // Headings
          h1: ({ children }) => <h1 className="text-sm font-black uppercase tracking-tight my-2 border-b pb-1">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xs font-extrabold uppercase tracking-tight my-1.5">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xs font-bold uppercase tracking-wider my-1">{children}</h3>,

          // Paragraphs & Text
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          strong: ({ children }) => (
            <strong className={cn("font-extrabold", isUser ? "text-white" : "text-black")}>
              {children}
            </strong>
          ),
          em: ({ children }) => <em className="italic opacity-90">{children}</em>,

          // Lists
          ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 my-1.5">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 my-1.5">{children}</ol>,
          li: ({ children }) => <li className="leading-normal">{children}</li>,

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-black/40 pl-3 italic opacity-90 my-2">
              {children}
            </blockquote>
          ),

          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto my-2 border border-black/20 rounded-lg">
              <table className="min-w-full text-xs text-left border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-[#121416] text-white uppercase text-[10px] font-mono">{children}</thead>,
          th: ({ children }) => <th className="px-2.5 py-1.5 border-b border-black/20 font-bold">{children}</th>,
          td: ({ children }) => <td className="px-2.5 py-1.5 border-b border-black/10 font-mono text-[11px]">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export function AIChatAssistant({
  question,
  candidateVerdict,
  onClose,
  isSidebar = false,
  className,
}: {
  question: QuestionItem;
  candidateVerdict?: string;
  onClose?: () => void;
  isSidebar?: boolean;
  className?: string;
}) {
  const initialGreeting = `Hello! I am your Gemini AI Code Audit Assistant for **${question.title}**. Ask me any follow-up questions about the defect, edge cases, pointer mutations, or refactoring!`;

  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([
    {
      role: "assistant",
      text: initialGreeting,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Reset conversation if question changes
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        text: `Hello! I am your Gemini AI Code Audit Assistant for **${question.title}**. Ask me any follow-up questions about the defect, edge cases, pointer mutations, or refactoring!`,
      },
    ]);
  }, [question.id, question.title]);

  const suggestionChips = [
    `Explain why line ${question.ground_truth.expected_issues[0]?.line_numbers[0] || 5} is a bug`,
    "How would an Alignerr reviewer grade this?",
    `Give me an optimal O(1) space ${question.language} solution`,
    "What edge cases would break the AI snippet?",
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        text: initialGreeting,
      },
    ]);
    setInput("");
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || isLoading) return;

    const userMsg = { role: "user" as const, text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsLoading(true);

    try {
      const responseText = await askGeminiFollowUp(query, question, candidateVerdict);
      setMessages((prev) => [...prev, { role: "assistant", text: responseText }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `⚠️ Error: ${err?.message || "Failed to reach Gemini AI API. Please check your API key."}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "bg-[#141618] text-[#e2e2e5] font-['Hanken_Grotesk'] border border-white/10 shadow-2xl flex flex-col",
        isSidebar
          ? "h-full w-full rounded-2xl overflow-hidden"
          : "obsidian-card p-5 sm:p-6 space-y-4 rounded-2xl",
        className
      )}
    >
      {/* Assistant Header */}
      <div className="p-4 sm:p-5 border-b border-[rgba(255,255,255,0.08)] bg-[#181a1d]/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <h4 className="text-xs sm:text-sm font-black uppercase text-white font-mono tracking-wider truncate">
                GEMINI AI ASSISTANT
              </h4>
            </div>
            <span className="text-[10px] text-[#83958c] font-mono block truncate">
              {candidateVerdict ? `Verdict: ${candidateVerdict.toUpperCase()}` : "Practice Copilot & Defect Audit"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="obsidian-chip-optimal text-[9px] px-2 py-0.5">
            2.5 FLASH
          </span>
          <button
            type="button"
            onClick={handleReset}
            title="Restart conversation"
            className="p-1.5 rounded-lg text-[#83958c] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              title="Close sidebar"
              className="p-1.5 rounded-lg text-[#83958c] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Suggestion Chips */}
      <div className="p-3 sm:px-4 bg-[#121416]/40 border-b border-white/5 space-y-1.5 font-mono shrink-0">
        <span className="text-[10px] text-[#83958c] font-bold uppercase tracking-wider flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-emerald-400" />
          <span>SUGGESTED AUDIT PROMPTS</span>
        </span>
        <div className="flex flex-wrap gap-1.5">
          {suggestionChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-md text-[11px] text-[#b9cbc1] bg-[#1e2022]/70 hover:bg-[#282a2c] hover:text-white transition-all cursor-pointer text-left border border-white/10 active:scale-95 disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Trajectory */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 font-mono text-xs scrollbar-thin scrollbar-thumb-white/10">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={cn(
              "flex gap-2.5 p-3 rounded-xl transition-all",
              msg.role === "user"
                ? "bg-[#1e2022] ml-4 border border-white/10 text-white"
                : "contrast-card text-[#121416] mr-2 shadow-lg"
            )}
          >
            {msg.role === "user" ? (
              <User className="w-4 h-4 text-white shrink-0 mt-0.5" />
            ) : (
              <Bot className="w-4 h-4 text-[#121416] shrink-0 mt-0.5" />
            )}
            <div className="space-y-1 overflow-hidden flex-1">
              <span
                className={cn(
                  "text-[9px] font-bold uppercase block tracking-wider font-mono",
                  msg.role === "user" ? "text-gray-400" : "text-gray-600"
                )}
              >
                {msg.role === "user" ? "YOU (EVALUATOR)" : "GEMINI AI ASSISTANT"}
              </span>
              <ChatMarkdown content={msg.text} isUser={msg.role === "user"} />
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="contrast-card p-3 rounded-xl mr-2 flex items-center gap-2.5 text-xs text-[#121416] font-bold font-mono shadow-md">
            <Loader2 className="w-4 h-4 animate-spin text-[#121416]" />
            <span className="text-[11px]">GEMINI AI IS THINKING & ANALYZING...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Chat Input Box */}
      <div className="p-3 sm:p-4 border-t border-[rgba(255,255,255,0.08)] bg-[#181a1d]/60 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2 font-mono text-xs"
        >
          <input
            type="text"
            placeholder="Ask Gemini about logic, edge cases, diffs..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-3 py-2.5 rounded-xl bg-[#0c0e10] border border-[#282a2c] text-white text-xs font-mono placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="obsidian-btn-primary px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-40 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ASK</span>
          </button>
        </form>
      </div>
    </div>
  );
}
