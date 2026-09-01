"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getStoredProfile } from "@/lib/storage";
import { UserProfileStats } from "@/types/submission";
import {
  Code2,
  CheckSquare,
  Timer,
  BarChart3,
  Flame,
  ShieldCheck,
} from "lucide-react";
import { UserDropdown } from "@/components/auth/UserDropdown";

export function Navbar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<UserProfileStats | null>(null);

  useEffect(() => {
    setProfile(getStoredProfile());
    const interval = setInterval(() => {
      setProfile(getStoredProfile());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { href: "/practice", label: "PRACTICE STUDIO", icon: Code2 },
    { href: "/assessment", label: "MOCK ASSESSMENT", icon: Timer, highlight: true },
    { href: "/dashboard", label: "PROFILE & ANALYTICS", icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#242830] bg-[#0a0b0d]/95 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-none bg-[#00ffc2] text-[#0a0b0d] flex items-center justify-center font-mono font-black text-sm border border-[#00ffc2] shadow-[0_0_12px_rgba(0,255,194,0.25)] group-hover:bg-white transition-colors">
              EF
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-wider text-white flex items-center gap-1.5 font-mono">
                EVALFORGE
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-none bg-[#00ffc2]/10 text-[#00ffc2] border border-[#00ffc2]/30">
                  BRUTALIST
                </span>
              </span>
            </div>
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-none text-xs font-mono font-bold tracking-wider transition-colors border",
                    isActive
                      ? "bg-[#16181c] text-[#00ffc2] border-[#00ffc2]/40"
                      : "text-zinc-400 hover:text-white hover:bg-[#121417] border-transparent",
                    item.highlight && !isActive && "text-[#00ffc2] hover:text-white"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side stats badge & Auth */}
        <div className="flex items-center gap-3">
          {/* Readiness Score pill */}
          {profile && (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-1 rounded-none bg-[#121417] border border-[#242830] hover:border-[#00ffc2]/50 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#00ffc2]" />
              <div className="flex items-center gap-1 text-xs font-mono">
                <span className="text-zinc-400 font-medium hidden sm:inline">READINESS:</span>
                <span className="font-bold text-[#00ffc2]">
                  {profile.readiness_score.toFixed(1)}%
                </span>
              </div>
            </Link>
          )}

          {/* Streak pill */}
          {profile && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{profile.current_streak_days}D</span>
            </div>
          )}

          {/* User Auth Dropdown */}
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
