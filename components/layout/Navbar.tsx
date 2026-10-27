"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Code2 } from "lucide-react";
import { UserDropdown } from "@/components/auth/UserDropdown";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  const workspace = /^\/(practice|oa)\//.test(pathname) && !pathname.startsWith("/oa/results") || pathname === "/assessment/session";
  if (workspace) return null;
  const links = [["/practice", "Practice"], ["/assessment", "Review mock"], ["/oa", "Coding tests"], ["/dashboard", "Progress"]];
  return <header className="sticky top-0 z-40 border-b border-neutral-800 bg-[#0c0e12]">
    <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
      <Link href="/" className="flex items-center gap-2.5 text-base font-semibold tracking-tight"><Code2 size={22} className="text-emerald-200" />EvalForge</Link>
      <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">{links.map(([href, label]) => <Link key={href} href={href} aria-current={pathname.startsWith(href) ? "page" : undefined} className={`rounded-md px-3 py-2 text-sm ${pathname.startsWith(href) ? "bg-white/5 text-white" : "text-neutral-400 hover:text-white"}`}>{label}</Link>)}</nav>
      <div className="flex items-center gap-1"><UserDropdown /><button className="icon-button md:hidden" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <Menu size={20} />}</button></div>
    </div>
    {open && <nav id="mobile-navigation" className="grid grid-cols-2 gap-2 border-t border-neutral-800 px-5 py-4 md:hidden" aria-label="Mobile navigation">{links.map(([href, label]) => <Link key={href} href={href} aria-current={pathname.startsWith(href) ? "page" : undefined} className="rounded-lg px-3 py-3 text-sm text-neutral-300 hover:bg-white/5">{label}</Link>)}</nav>}
  </header>;
}
