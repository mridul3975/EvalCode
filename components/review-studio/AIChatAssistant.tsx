"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { QuestionItem } from "@/types/question";
import { askGeminiFollowUp } from "@/lib/gemini";
import { cn } from "@/lib/utils";
import { Sparkles, Send, User, Bot, Loader2, Lightbulb, Copy, Check } from "lucide-react";

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
                <div className="my-3 rounded-xl overflow-hidden border border-black/30 font-mono text-xs shadow-xl">
                  {/* Code Header Bar */}
                  <div className="bg-[#121416] text-[#b9cbc1] px-4 py-2 flex justify-between items-center text-[10px] uppercase font-bold border-b border-[#282a2c]">
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
                          <span>COPY CODE</span>
                        </>
                      )}
                    </button>
                  </div>
                  {/* Code Body */}
                  <div className="bg-[#0c0e10] text-[#e2e2e5] p-4 overflow-x-auto leading-relaxed font-mono text-xs">
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
          h1: ({ children }) => <h1 className="text-base font-black uppercase tracking-tight my-2 border-b pb-1">{children}</h1>,
          h2: ({ children }) => <h2 className="text-sm font-extrabold uppercase tracking-tight my-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xs font-bold uppercase tracking-wider my-1.5">{children}</h3>,

          // Paragraphs & Text
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          strong: ({ children }) => (
            <strong className={cn("font-extrabold", isUser ? "text-white" : "text-black")}>
              {children}
            </strong>
          ),
          em: ({ children }) => <em className="italic opacity-90">{children}</em>,

          // Lists
          ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 my-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 my-2">{children}</ol>,
          li: ({ children }) => <li className="leading-normal">{children}</li>,

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-black/40 pl-3 italic opacity-90 my-2">
              {children}
            </blockquote>
          ),

          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto my-3 border border-black/20 rounded-lg">
              <table className="min-w-full text-xs text-left border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-[#121416] text-white uppercase text-[10px] font-mono">{children}</thead>,
          th: ({ children }) => <th className="px-3 py-2 border-b border-black/20 font-bold">{children}</th>,
          td: ({ children }) => <td className="px-3 py-2 border-b border-black/10 font-mono text-[11px]">{children}</td>,
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
}: {
  question: QuestionItem;
  candidateVerdict?: string;
}) {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([
    {
      role: "assistant",
      text: `Hello! I am your Gemini AI Code Audit Assistant for **${question.title}**. Ask me any follow-up questions about the defect, edge cases, pointer mutations, or refactoring!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const suggestionChips = [
    `Explain why line ${question.ground_truth.expected_issues[0]?.line_numbers[0] || 5} is a bug in detail`,
    "How would a senior Alignerr reviewer grade my audit?",
    `Give me an optimal O(1) space ${question.language} solution`,
    "What edge cases would break the AI snippet?",
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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
    <div className="obsidian-card p-6 sm:p-8 space-y-5 font-['Hanken_Grotesk'] text-[#e2e2e5] border border-white/10 shadow-2xl">
      {/* Assistant Header */}
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
          <h4 className="text-sm font-black uppercase text-white font-mono tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-white" />
            <span>INTERACTIVE GEMINI AI CHAT STUDIO</span>
          </h4>
        </div>
        <span className="obsidian-chip-optimal text-[10px]">GEMINI 2.5 FLASH</span>
      </div>

      {/* Suggestion Chips */}
      <div className="space-y-2 font-mono text-xs">
        <span className="text-[10px] text-[#83958c] font-bold uppercase tracking-wider flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-white" />
          <span>RECOMMENDED FOLLOW-UP QUESTIONS:</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestionChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              disabled={isLoading}
              className="obsidian-inset px-3 py-1.5 rounded-lg text-xs text-[#b9cbc1] hover:text-white hover:border-white transition-all cursor-pointer text-left border border-[#282a2c] active:scale-95 disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Trajectory */}
      <div className="code-inset rounded-xl p-4 sm:p-5 max-h-[440px] overflow-y-auto space-y-4 font-mono text-xs border border-white/5">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={cn(
              "flex gap-3 p-3.5 sm:p-4 rounded-xl transition-all",
              msg.role === "user"
                ? "bg-[#1e2022] ml-4 sm:ml-8 border border-white/10 text-white"
                : "contrast-card text-[#121416] mr-4 sm:mr-8 shadow-lg"
            )}
          >
            {msg.role === "user" ? (
              <User className="w-4 h-4 text-white shrink-0 mt-0.5" />
            ) : (
              <Bot className="w-4 h-4 text-[#121416] shrink-0 mt-0.5" />
            )}
            <div className="space-y-1.5 overflow-hidden flex-1">
              <span className={cn("text-[10px] font-bold uppercase block tracking-wider font-mono", msg.role === "user" ? "text-gray-400" : "text-gray-600")}>
                {msg.role === "user" ? "YOU (EVALUATOR)" : "GEMINI AI ASSISTANT"}
              </span>
              <ChatMarkdown content={msg.text} isUser={msg.role === "user"} />
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="contrast-card p-3.5 rounded-xl mr-6 flex items-center gap-3 text-xs text-[#121416] font-bold font-mono">
            <Loader2 className="w-4 h-4 animate-spin text-[#121416]" />
            <span>GEMINI AI IS THINKING & ANALYZING...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Chat Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex gap-2 font-mono text-xs"
      >
        <input
          type="text"
          placeholder="Ask a follow-up question to Gemini AI..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className="flex-1 p-3.5 rounded-xl bg-[#0c0e10] border border-[#282a2c] text-white text-xs font-mono focus:outline-none focus:border-white"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="obsidian-btn-primary px-6 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-40 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        >
          <Send className="w-4 h-4" />
          <span>ASK</span>
        </button>
      </form>
    </div>
  );
}
