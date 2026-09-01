"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { X, ShieldCheck, UserCheck, ArrowRight, Check } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueGuest?: () => void;
}

export function AuthModal({ isOpen, onClose, onContinueGuest }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  async function handleGoogleSignIn() {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err) {
      console.error("Google sign in error:", err);
      setIsLoading(false);
    }
  }

  function handleGuest() {
    if (onContinueGuest) {
      onContinueGuest();
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-white tracking-tight">
            Choose Your Evaluator Mode
          </h3>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            Train on 75+ AI code review benchmarks or track your persistent readiness certificate.
          </p>
        </div>

        {/* Option 1: Real Google Authentication */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-sm shadow-lg transition-all cursor-pointer group"
          >
            {/* Google SVG Icon */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>{isLoading ? "Redirecting to Google..." : "Sign In with Google"}</span>
          </button>

          <div className="flex items-center gap-1.5 justify-center text-[11px] text-zinc-500">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>Syncs scorecards & streak across all your devices</span>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 text-zinc-600">
          <div className="h-px bg-zinc-800 flex-1" />
          <span className="text-[11px] uppercase tracking-wider font-semibold">Or</span>
          <div className="h-px bg-zinc-800 flex-1" />
        </div>

        {/* Option 2: Test as Guest Mode */}
        <div className="space-y-3">
          <button
            onClick={handleGuest}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-200 hover:text-white font-semibold text-xs border border-zinc-700/60 shadow-sm transition-all cursor-pointer group"
          >
            <UserCheck className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
            <span>Test as Guest (No Login Required)</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <p className="text-[10px] text-center text-zinc-500 leading-tight">
            Instant evaluation access. Saves evaluations locally in this browser.
          </p>
        </div>
      </div>
    </div>
  );
}
