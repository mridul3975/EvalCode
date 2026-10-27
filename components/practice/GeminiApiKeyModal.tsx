"use client";
import { Dialog } from "@/components/ui/Dialog";

import React, { useState, useEffect } from "react";
import {
  getStoredGeminiKey,
  saveStoredGeminiKey,
  clearStoredGeminiKey,
  validateGeminiApiKey,
} from "@/lib/gemini";
import { cn } from "@/lib/utils";
import {
  Key,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
  EyeOff,
  Sparkles,
  Trash2,
  Loader2,
  ShieldCheck,
} from "lucide-react";

interface GeminiApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved?: (key: string) => void;
}

export function GeminiApiKeyModal({
  isOpen,
  onClose,
  onKeySaved,
}: GeminiApiKeyModalProps) {
  const [keyInput, setKeyInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [existingKey, setExistingKey] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredGeminiKey();
      setExistingKey(stored);
      setKeyInput(stored || "");
      setStatusMessage(null);
      setIsVerifying(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const maskKey = (key: string) => {
    if (!key || key.length < 8) return "••••••••";
    const start = key.slice(0, 6);
    const end = key.slice(-4);
    return `${start}••••••••${end}`;
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = keyInput.trim();

    if (!trimmed) {
      setStatusMessage({
        type: "error",
        text: "Please enter a valid Gemini API key.",
      });
      return;
    }

    setIsVerifying(true);
    setStatusMessage({
      type: "info",
      text: "Testing API key with Gemini 2.5 Flash...",
    });

    const result = await validateGeminiApiKey(trimmed);
    setIsVerifying(false);

    if (!result.valid) {
      setStatusMessage({
        type: "error",
        text: result.error || "Invalid API key or network failure.",
      });
      return;
    }

    saveStoredGeminiKey(trimmed);
    setExistingKey(trimmed);
    setStatusMessage({
      type: "success",
      text: "API key validated and saved successfully!",
    });

    if (onKeySaved) {
      onKeySaved(trimmed);
    }

    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleSaveWithoutVerify = () => {
    const trimmed = keyInput.trim();
    if (!trimmed) {
      setStatusMessage({
        type: "error",
        text: "Please enter a Gemini API key.",
      });
      return;
    }

    saveStoredGeminiKey(trimmed);
    setExistingKey(trimmed);
    setStatusMessage({
      type: "success",
      text: "API key saved in browser storage.",
    });

    if (onKeySaved) {
      onKeySaved(trimmed);
    }

    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleClear = () => {
    clearStoredGeminiKey();
    setExistingKey(null);
    setKeyInput("");
    setStatusMessage({
      type: "info",
      text: "Stored API key removed. Gemini AI features will require a key.",
    });
  };

  return (
    <Dialog label="AI assistant settings" onClose={onClose} busy={isVerifying} className="max-w-2xl">
      <div
        className="relative w-full max-w-lg neu-card p-6 sm:p-8 space-y-6 text-neutral-200 font-sans border border-neutral-700/60 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition-colors cursor-pointer"
          aria-label="Close API Key Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Key className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold  tracking-wider text-emerald-400">
              Optional AI assistant
            </span>
          </div>

          <h3
            id="gemini-api-key-modal-title"
            className="text-xl sm:text-2xl font-semibold text-white  tracking-tight font-mono"
          >
            AI assistant settings
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed font-sans">
            Connect your personal Google Gemini API key to activate the AI
            assistant in Practice Review Studio. Your key is saved in this browser. Only use a key you trust on this device.
          </p>
        </div>

        {/* Current Status Box */}
        <div className="neu-inset p-3.5 rounded-xl flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                "w-2.5 h-2.5 rounded-full shrink-0",
                existingKey ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-amber-400"
              )}
            />
            <div>
              <span className="text-xs text-neutral-500  block font-bold">
                Current Status
              </span>
              <span className="text-white font-bold">
                {existingKey ? "Custom API Key Active" : "No API Key Set"}
              </span>
            </div>
          </div>

          {existingKey && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                {maskKey(existingKey)}
              </span>
              <button
                type="button"
                onClick={handleClear}
                title="Remove API Key"
                className="p-1.5 rounded text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Status Alert Banner */}
        {statusMessage && (
          <div
            className={cn(
              "p-3 rounded-xl flex items-start gap-2.5 text-xs font-mono border",
              statusMessage.type === "success"
                ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                : statusMessage.type === "error"
                ? "bg-rose-950/40 border-rose-500/40 text-rose-300"
                : "bg-blue-950/40 border-blue-500/40 text-blue-300"
            )}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : statusMessage.type === "error" ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <Loader2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5 animate-spin" />
            )}
            <span className="leading-snug">{statusMessage.text}</span>
          </div>
        )}

        {/* Key Input Form */}
        <form onSubmit={handleSave} className="space-y-4 font-mono text-xs">
          <div className="space-y-1.5">
            <label
              htmlFor="gemini-api-key-input"
              className="text-xs font-bold text-neutral-300  tracking-wider block"
            >
              Google Gemini API Key
            </label>
            <div className="relative flex items-center">
              <input
                id="gemini-api-key-input"
                type={showKey ? "text" : "password"}
                placeholder="AIzaSy..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                disabled={isVerifying}
                className="w-full neu-inset p-3 pr-10 rounded-xl text-neutral-200 text-xs font-mono placeholder:text-neutral-600 focus:outline-none focus:border-white/20 transition-all"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title={showKey ? "Hide key" : "Show key"}
              >
                {showKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-neutral-500 font-sans">
              Usually starts with <code>AIzaSy</code> (Google AI Studio key).
            </p>
          </div>

          {/* Quick Help Link */}
          <div className="pt-1 flex items-center justify-between font-sans text-xs">
            <span className="text-neutral-400">Don&apos;t have an API key?</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 transition-colors"
            >
              <span>Open Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-3 border-t border-white/[0.06]">
            <button
              type="submit"
              disabled={isVerifying || !keyInput.trim()}
              className="w-full sm:flex-1 neu-button py-2.5 px-4 bg-emerald-500 text-black hover:bg-emerald-400 font-bold  tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Key...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Validate & Save</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSaveWithoutVerify}
              disabled={isVerifying || !keyInput.trim()}
              className="w-full sm:w-auto neu-button py-2.5 px-4 text-neutral-300 hover:text-white font-mono  tracking-tight transition-all cursor-pointer disabled:opacity-40"
            >
              <span>Save Without Test</span>
            </button>
          </div>
        </form>

        {/* Security Notice */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono pt-1">
          <Sparkles className="w-3 h-3 text-neutral-500 shrink-0" />
          <span>Stored exclusively in your local browser storage.</span>
        </div>
      </div>
    </Dialog>
  );
}
