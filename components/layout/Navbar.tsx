"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getStoredProfile } from "@/lib/storage";
import { UserProfileStats } from "@/types/submission";
import { UserDropdown } from "@/components/auth/UserDropdown";
import { Menu, X, Code2, Timer, User, Home, Flame } from "lucide-react";

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

  const navItems = [
    { href: "/practice", label: "PRACTICE", icon: Code2 },
    { href: "/assessment", label: "MOCK", icon: Timer },
    { href: "/oa", label: "OA SIMULATOR", icon: Flame },
    { href: "/dashboard", label: "PROFILE", icon: User },
  ];

  return (
    <header className="w-full bg-[#121416] text-white border-b-2 border-white/15 sticky top-0 z-50 shadow-md">
      <div className="flex justify-between items-center w-full px-4 sm:px-8 py-3.5 uppercase tracking-tighter max-w-[1700px] mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-black text-sm rounded-md border border-white group-hover:bg-zinc-200 transition-colors">
              EF
            </div>
            <span className="text-xl font-black tracking-tight text-white font-['Hanken_Grotesk'] leading-none">
              EvalForge
            </span>
            <span className="px-1.5 py-0.5 bg-white text-black text-[9px] font-black tracking-widest rounded">
              SIM
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2 text-xs font-black tracking-wider font-['Hanken_Grotesk']">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-lg transition-colors border text-xs font-bold",
                  isActive
                    ? "bg-white text-black border-white shadow-sm"
                    : "border-transparent text-[#b9cbc1] hover:text-white hover:bg-[#1e2022]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Profile & Mobile Toggle */}
        <div className="flex items-center gap-3 sm:gap-4">
          {profile && (
            <div className="hidden lg:flex items-center gap-4 text-xs font-bold uppercase tracking-wider font-mono text-[#b9cbc1]">
              <span>READINESS: <strong className="text-white">{profile.readiness_score.toFixed(1)}%</strong></span>
              <span>STREAK: <strong className="text-white">{profile.current_streak_days}D</strong></span>
            </div>
          )}

          <UserDropdown />

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg obsidian-inset text-[#e2e2e5] hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#16181a] border-b border-[rgba(255,255,255,0.1)] px-4 py-4 space-y-3 font-mono text-xs animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-3 gap-2">
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
                      ? "bg-white text-[#121416] shadow-md font-black"
                      : "obsidian-inset text-[#b9cbc1] hover:text-white"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {profile && (
            <div className="flex justify-between items-center p-3 rounded-xl obsidian-inset text-[11px] font-mono text-[#b9cbc1]">
              <span>READINESS: <strong className="text-white">{profile.readiness_score.toFixed(1)}%</strong></span>
              <span>STREAK: <strong className="text-white">{profile.current_streak_days}D</strong></span>
              <span>EVALS: <strong className="text-white">{profile.total_evaluations_count}</strong></span>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
