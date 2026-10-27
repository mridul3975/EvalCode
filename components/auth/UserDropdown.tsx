"use client";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User, ChevronDown } from "lucide-react";
import { AuthModal } from "./AuthModal";
export function UserDropdown() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const closeOutside = (event: MouseEvent) => { if (!ref.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", closeOutside);
    return () => document.removeEventListener("mousedown", closeOutside);
  }, []);
  if (status === "loading") return <span className="h-9 w-16 rounded-md bg-neutral-800" aria-label="Loading account" />;
  if (!session?.user) return <><button className="min-h-11 rounded-md px-3 text-sm text-neutral-300 hover:bg-white/5 hover:text-white" onClick={() => setAuthOpen(true)}>Sign in</button><AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} /></>;
  return <div ref={ref} className="relative" onKeyDown={event => { if (event.key === "Escape") setOpen(false); }}>
    <button className="flex min-h-11 items-center gap-2 rounded-md px-2 text-sm text-neutral-300 hover:bg-white/5" aria-expanded={open} aria-controls="account-links" onClick={() => setOpen(!open)}><User size={17} /><span className="hidden max-w-28 truncate sm:block">{session.user.name || "Account"}</span><ChevronDown size={13} /></button>
    {open && <div id="account-links" className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-neutral-700 bg-[#1c2129] p-2 text-sm shadow-xl"><p className="truncate border-b border-neutral-700 px-3 py-2 text-xs text-neutral-400">{session.user.email}</p><Link onClick={() => setOpen(false)} className="flex min-h-11 items-center rounded px-3 hover:bg-white/5" href="/dashboard">Your progress</Link><button className="min-h-11 w-full rounded px-3 text-left text-rose-200 hover:bg-white/5" onClick={() => signOut({ callbackUrl: "/" })}>Sign out</button></div>}
  </div>;
}
