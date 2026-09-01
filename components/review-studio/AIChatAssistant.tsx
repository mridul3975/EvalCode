"use client";

import React, { useState, useRef, useEffect } from "react";
import { QuestionItem } from "@/types/question";
import { askGeminiFollowUp } from "@/lib/gemini";
import { cn } from "@/lib/utils";
import { Sparkles, Send, User, Bot, Loader2, Lightbulb, Copy, Check } from "lucide-react";

function FormattedMarkdown({ text, isUser }: { text: string; isUser: boolean }) {
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2">
      {parts.map((part, idx) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const rawBlock = part.slice(3, -3).trim();
          const firstLineEnd = rawBlock.indexOf("\n");
          let lang = "CODE";
          let codeText = rawBlock;

          if (firstLineEnd !== -1) {
            const possibleLang = rawBlock.substring(0, firstLineEnd).trim();
            if (possibleLang && !possibleLang.includes(" ") && possibleLang.length < 15) {
              lang = possibleLang.toUpperCase();
              codeText = rawBlock.substring(firstLineEnd + 1);
            }
          }

          return (
            <div key={idx} className="my-3 rounded-lg overflow-hidden border border-black/30 font-mono text-xs shadow-lg">
              <div className="bg-[#121416] text-[#b9cbc1] px-3.5 py-1.5 flex justify-between items-center text-[10px] uppercase font-bold border-b border-[#282a2c]">
                <span className="text-white">{lang}</span>
                <span className="text-gray-500">AI CODE SNIPPET</span>
              </div>
              <div className="bg-[#0c0e10] text-[#e2e2e5] p-3.5 overflow-x-auto leading-relaxed font-mono">
                <pre><code>{codeText}</code></pre>
              </div>
            </div>
          );
        }

        const inlineParts = part.split(/(\*\*.*?\*\*|`.*?`)/g);

        return (
          <div key={idx} className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
            {inlineParts.map((sub, sIdx) => {
              if (sub.startsWith("**") && sub.endsWith("**")) {
                return (
                  <strong key={sIdx} className={cn("font-extrabold", isUser ? "text-white" : "text-black")}>
                    {sub.slice(2, -2)}
                  </strong>
                );
              }
              if (sub.startsWith("`") && sub.endsWith("`")) {
                return (
                  <code
                    key={sIdx}
                    className={cn(
                      "px-1.5 py-0.5 rounded font-mono text-[11px] font-bold mx-0.5 border",
                      isUser
                        ? "bg-[#121416] text-[#e2e2e5] border-white/20"
                        : "bg-gray-200 text-black border-gray-300"
                    )}
                  >
                    {sub.slice(1, -1)}
                  </code>
                );
              }
              return sub;
            })}
          </div>
        );
      })}
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
      <div className="code-inset rounded-xl p-4 sm:p-5 max-h-[420px] overflow-y-auto space-y-4 font-mono text-xs border border-white/5">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={cn(
              "flex gap-3 p-3.5 rounded-xl transition-all",
              msg.role === "user"
                ? "bg-[#1e2022] ml-6 border border-white/10 text-white"
                : "contrast-card text-[#121416] mr-6 shadow-md"
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
              <FormattedMarkdown text={msg.text} isUser={msg.role === "user"} />
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
