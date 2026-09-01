"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  User,
  LogOut,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  LayoutDashboard,
  Code2,
  CheckCircle2,
} from "lucide-react";
import { AuthModal } from "./AuthModal";

export function UserDropdown() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return (
      <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse border border-zinc-700" />
    );
  }

  // If authenticated with Google
  if (session?.user) {
    const user = session.user;
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 transition-colors cursor-pointer"
        >
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || "User Avatar"}
              className="w-7 h-7 rounded-full object-cover border border-emerald-500/40"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-400">
              {user.name ? user.name[0].toUpperCase() : "U"}
            </div>
          )}
          <span className="text-xs font-medium text-zinc-200 hidden sm:inline max-w-[100px] truncate">
            {user.name || "Evaluator"}
          </span>
          <ChevronDown className="w-3 h-3 text-zinc-400" />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-2xl p-2 shadow-2xl space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
            {/* User Info Header */}
            <div className="px-3 py-2 border-b border-zinc-800/80 mb-1 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate">
                  {user.name || "Evaluator"}
                </span>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                  Google
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 truncate">{user.email}</p>
            </div>

            {/* Menu Links */}
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Readiness Dashboard</span>
            </Link>

            <Link
              href="/practice"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <Code2 className="w-4 h-4 text-sky-400" />
              <span>Practice Questions</span>
            </Link>

            <div className="h-px bg-zinc-800/80 my-1" />

            {/* Sign Out Button */}
            <button
              onClick={() => {
                setIsOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // If Guest Mode
  return (
    <>
      <div className="flex items-center gap-2.5">
        <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800/80 border border-zinc-700 text-[10px] font-medium text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>Guest Mode</span>
        </span>

        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          {/* Google Icon */}
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
          <span>Sign In</span>
        </button>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
