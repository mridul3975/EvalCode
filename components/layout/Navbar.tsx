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
    { href: "/practice", label: "Practice Studio", icon: Code2 },
    { href: "/assessment", label: "Mock Assessment", icon: Timer, highlight: true },
    { href: "/dashboard", label: "Profile & Analytics", icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-sky-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <CheckSquare className="w-4 h-4 text-zinc-950 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                EvalForge
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  RLHF Sim
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
                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                    isActive
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900",
                    item.highlight && !isActive && "text-emerald-400 hover:text-emerald-300"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side stats badge */}
        <div className="flex items-center gap-3">
          {/* Readiness Score pill */}
          {profile && (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <div className="flex items-center gap-1 text-xs">
                <span className="text-zinc-400 font-medium hidden sm:inline">Readiness:</span>
                <span className="font-bold text-emerald-400 font-mono">
                  {profile.readiness_score.toFixed(1)}%
                </span>
              </div>
            </Link>
          )}

          {/* Streak pill */}
          {profile && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{profile.current_streak_days}d</span>
            </div>
          )}

          <Link
            href="/practice"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-colors shadow-sm"
          >
            Review Code
          </Link>
        </div>
      </div>
    </header>
  );
}
