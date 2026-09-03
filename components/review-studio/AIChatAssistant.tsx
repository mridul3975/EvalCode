"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { QuestionItem } from "@/types/question";
import { askGeminiFollowUp } from "@/lib/gemini";
import { cn } from "@/lib/utils";
import { Sparkles, Send, User, Bot, Loader2, Lightbulb, Copy, Check, RotateCcw, X } from "lucide-react";

function ChatMarkdown({ content, isUser }: { content: string; isUser: boolean }) {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const handleCopyCode = (codeText: string, index: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  return (
    <div className={cn("text-xs leading-relaxed font-sans space-y-2", isUser ? "text-white" : "text-neutral-200")}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");
            const lang = match ? match[1].toUpperCase() : "CODE";

            if (!inline && (match || codeString.includes("\n"))) {
              const codeIdx = Math.random();
              return (
                <div className="my-2.5 rounded-lg overflow-hidden border border-neutral-800 font-mono text-xs shadow-md">
                  <div className="bg-neutral-900 text-neutral-400 px-3 py-1.5 flex justify-between items-center text-[10px] uppercase font-bold border-b border-neutral-800">
                    <span className="text-white font-mono">{lang}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(codeString, codeIdx)}
                      className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
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
                  <div className="bg-neutral-950 p-3 overflow-x-auto leading-relaxed font-mono text-xs">
                    <pre className="text-neutral-200">
                      <code>{codeString}</code>
                    </pre>
                  </div>
                </div>
              );
            }

            return (
              <code
                className="bg-neutral-800/80 px-1.5 py-0.5 rounded text-neutral-200 font-mono text-[11px]"
                {...props}
              >
                {children}
              </code>
            );
          },
          ul({ children }) {
            return <ul className="list-disc pl-4 space-y-1 text-xs">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal pl-4 space-y-1 text-xs">{children}</ol>;
          },
          p({ children }) {
            return <p className="leading-relaxed">{children}</p>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export function AIChatAssistant({
  question,
  candidateCode,
  candidateVerdict,
  className,
  isSidebar = false,
  onClose,
}: {
  question: QuestionItem;
  candidateCode?: string;
  candidateVerdict?: string;
  className?: string;
  isSidebar?: boolean;
  onClose?: () => void;
}) {
  const initialBotMessage = {
    role: "model",
    text: `Hello! I am your **Gemini 2.5 Flash** evaluation copilot.

I've loaded the problem **"${question.title}"** along with its ground truth rubric and calibrated error taxonomy.

You can ask me to:
- Explain subtle invariant or pointer bugs in the snippet.
- Audit the claimed Big-O complexity vs. theoretical lower bounds.
- Provide edge cases that break this implementation.
- Grade your findings against the ground truth rubric.`,
  };

  const [messages, setMessages] = useState<Array<{ role: string; text: string }>>([
    initialBotMessage,
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleReset = () => {
    setMessages([initialBotMessage]);
    setInput("");
  };

  const suggestionChips = [
    "Explain why line 5 is a fatal bug",
    "What edge cases break this code?",
    "Analyze time and space complexity",
    "Compare against optimal Big-O bounds",
  ];

  const handleSendMessage = async (customPrompt?: string) => {
    const promptToSend = customPrompt || input;
    if (!promptToSend.trim() || isLoading) return;

    const userMessage = { role: "user", text: promptToSend };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    if (!customPrompt) setInput("");
    setIsLoading(true);

    try {
      const chatHistory = updatedMessages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const responseText = await askGeminiFollowUp(
        promptToSend,
        question,
        candidateVerdict
      );

      setMessages((prev) => [...prev, { role: "model", text: responseText }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: `⚠️ **AI Service Error**: Could not complete query. Please check your Gemini API key configuration.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "bg-neutral-950/90 text-neutral-200 font-['Hanken_Grotesk'] border border-neutral-800/80 shadow-2xl flex flex-col backdrop-blur-md",
        isSidebar
          ? "h-full w-full rounded-2xl overflow-hidden"
          : "p-5 space-y-4 rounded-2xl",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 bg-neutral-900/40 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <h4 className="text-xs font-bold text-white font-mono tracking-tight truncate">
                GEMINI AI COPILOT
              </h4>
            </div>
            <span className="text-[10px] text-neutral-500 font-mono block truncate">
              {candidateVerdict ? `Verdict: ${candidateVerdict.toUpperCase()}` : "Practice Copilot & Defect Audit"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-emerald-400">
            2.5 FLASH
          </span>
          <button
            type="button"
            onClick={handleReset}
            title="Restart conversation"
            className="p-1 rounded text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              title="Close sidebar"
              className="p-1 rounded text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Horizontally Scrollable Suggestion Chips with tactile pill styling */}
      <div className="px-4 py-3 bg-black/20 border-b border-white/[0.04] overflow-x-auto scrollbar-none flex items-center gap-2 shrink-0">
        <Lightbulb className="w-3.5 h-3.5 text-emerald-400 shrink-0 mr-1" />
        {suggestionChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip)}
            disabled={isLoading}
            className="neu-button text-xs py-2 px-3.5 text-neutral-300 hover:text-white whitespace-nowrap cursor-pointer disabled:opacity-50 font-mono text-[11px]"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Messages Trajectory */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 font-mono text-xs">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={cn(
              "flex gap-3 p-4 rounded-xl transition-all",
              msg.role === "user"
                ? "neu-card ml-4 border-white/10 text-white"
                : "neu-inset mr-2 text-neutral-200"
            )}
          >
            {msg.role === "user" ? (
              <User className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
            ) : (
              <Bot className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1 overflow-hidden flex-1">
              <span className="text-[10px] font-bold uppercase block tracking-wider font-mono text-neutral-500">
                {msg.role === "user" ? "YOU (EVALUATOR)" : "GEMINI 2.5 FLASH"}
              </span>
              <ChatMarkdown content={msg.text} isUser={msg.role === "user"} />
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="p-3.5 rounded-xl neu-inset mr-2 flex items-center gap-2 text-xs text-neutral-400 font-mono">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            <span>Analyzing problem invariants...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Floating Chat Input Box */}
      <div className="p-3 border-t border-white/[0.04] bg-[#101114] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            placeholder="Ask Gemini about logic, edge cases, diffs..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="neu-inset w-full pl-4 pr-11 py-3 text-neutral-200 text-xs font-mono placeholder:text-neutral-500 focus:outline-none focus:border-white/20 transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 rounded-lg bg-white text-black hover:bg-neutral-200 transition-all disabled:opacity-30 cursor-pointer shadow-md hover:scale-105 active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
