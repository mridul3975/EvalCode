"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export function Footer() {
  const pathname = usePathname();
  if ((/^\/(practice|oa)\//.test(pathname) && !pathname.startsWith("/oa/results")) || pathname === "/assessment/session") return null;
  return <footer className="mt-auto border-t border-neutral-800"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 px-5 py-8 text-xs text-neutral-400 sm:px-8"><span>EvalForge · Practice better code reviews.</span><nav className="flex flex-wrap gap-5" aria-label="Footer"><Link href="/practice" className="hover:text-white">Practice</Link><Link href="/assessment" className="hover:text-white">Review mock</Link><Link href="/dashboard" className="hover:text-white">Your progress</Link></nav></div></footer>;
}
