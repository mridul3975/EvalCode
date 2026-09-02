"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getStoredProfile } from "@/lib/storage";
import { UserProfileStats } from "@/types/submission";
import { UserDropdown } from "@/components/auth/UserDropdown";
import { Menu, X, Code2, Timer, User, Flame } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<UserProfileStats | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setProfile(getStoredProfile());
    const interval = setInterval(() => {
      setProfile(getStoredProfile());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Hide global floating navbar on full-screen IDE workspaces
  const isWorkspaceRoute =
    (pathname.startsWith("/oa/") && pathname !== "/oa" && !pathname.startsWith("/oa/results")) ||
    (pathname.startsWith("/practice/") && pathname !== "/practice") ||
    pathname === "/assessment/session";

  if (isWorkspaceRoute) {
    return null;
  }

  const navItems = [
    { href: "/practice", label: "PRACTICE", icon: Code2 },
    { href: "/assessment", label: "MOCK", icon: Timer },
    { href: "/oa", label: "OA SIMULATOR", icon: Flame },
    { href: "/dashboard", label: "PROFILE", icon: User },
  ];

  return (
    <div className="w-full sticky top-3 z-50 px-4">
      <header className="max-w-5xl mx-auto h-14 rounded-full border border-neutral-800/80 bg-neutral-950/70 backdrop-blur-md px-5 flex items-center justify-between shadow-2xl transition-all">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 bg-white text-black flex items-center justify-center font-black text-xs rounded-full group-hover:scale-105 transition-transform">
              EF
            </div>
            <span className="text-sm font-extrabold tracking-tight text-white font-['Hanken_Grotesk'] leading-none">
              EvalForge
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium font-mono">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3.5 py-1.5 rounded-full transition-all text-xs font-mono tracking-tight",
                  isActive
                    ? "bg-white text-black font-bold shadow-sm"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Profile & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {profile && (
            <div className="hidden lg:flex items-center gap-3 text-[11px] font-mono text-neutral-400">
              <span>READINESS: <strong className="text-white font-semibold">{profile.readiness_score.toFixed(0)}%</strong></span>
            </div>
          )}

          <UserDropdown />

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden max-w-5xl mx-auto mt-2 rounded-2xl bg-neutral-950/90 border border-neutral-800/80 backdrop-blur-md p-4 space-y-3 font-mono text-xs shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-xl gap-1.5 font-bold uppercase transition-all",
                    isActive
                      ? "bg-white text-black shadow-md"
                      : "bg-neutral-900/60 text-neutral-400 hover:text-white border border-neutral-800/50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {profile && (
            <div className="flex justify-between items-center p-3 rounded-xl bg-neutral-900/50 border border-neutral-800/50 text-[11px] font-mono text-neutral-400">
              <span>READINESS: <strong className="text-white">{profile.readiness_score.toFixed(0)}%</strong></span>
              <span>STREAK: <strong className="text-white">{profile.current_streak_days}D</strong></span>
              <span>EVALS: <strong className="text-white">{profile.total_evaluations_count}</strong></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
