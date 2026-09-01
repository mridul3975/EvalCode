"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Code2,
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
      <div className="w-8 h-8 bg-zinc-800 border-2 border-white animate-pulse" />
    );
  }

  // If authenticated with Google
  if (session?.user) {
    const user = session.user;
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-3 py-1 bg-[#121416] hover:bg-white hover:text-black text-white border-2 border-white transition-none cursor-pointer font-bold text-xs uppercase tracking-wider"
        >
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || "User"}
              className="w-6 h-6 object-cover grayscale border border-white"
            />
          ) : (
            <div className="w-6 h-6 bg-white text-black flex items-center justify-center text-xs font-black">
              {user.name ? user.name[0].toUpperCase() : "U"}
            </div>
          )}
          <span className="max-w-[100px] truncate hidden sm:inline">
            {user.name || "Evaluator"}
          </span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-60 bg-[#121416] text-white border-4 border-white p-3 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] space-y-2 z-50">
            <div className="border-b-2 border-white pb-2 mb-2 space-y-0.5 font-mono">
              <div className="text-xs font-black uppercase text-white truncate">
                {user.name || "Evaluator"}
              </div>
              <div className="text-[10px] text-zinc-400 truncate">{user.email}</div>
            </div>

            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black border-2 border-transparent hover:border-white transition-none"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>DASHBOARD</span>
            </Link>

            <Link
              href="/practice"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black border-2 border-transparent hover:border-white transition-none"
            >
              <Code2 className="w-4 h-4" />
              <span>PRACTICE</span>
            </Link>

            <button
              onClick={() => {
                setIsOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-rose-400 hover:bg-rose-600 hover:text-white border-2 border-transparent hover:border-rose-500 transition-none cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>SIGN OUT</span>
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
        <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 bg-black text-zinc-300 border-2 border-white text-[11px] font-black uppercase tracking-wider">
          <span className="w-2 h-2 bg-amber-400" />
          <span>GUEST</span>
        </span>

        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1 bg-white hover:bg-black hover:text-white text-black border-2 border-white font-black text-xs uppercase tracking-wider transition-none cursor-pointer"
        >
          <span>SIGN IN</span>
        </button>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
