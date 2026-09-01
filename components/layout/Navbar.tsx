"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getStoredProfile } from "@/lib/storage";
import { UserProfileStats } from "@/types/submission";
import { UserDropdown } from "@/components/auth/UserDropdown";
import { CheckSquare } from "lucide-react";

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
    { href: "/practice", label: "PRACTICE" },
    { href: "/assessment", label: "MOCK" },
    { href: "/dashboard", label: "PROFILE" },
  ];

  return (
    <header className="w-full bg-[#121416] text-white border-b-4 border-white sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-4 sm:px-8 py-3.5 uppercase tracking-tighter">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-black text-base border-2 border-white group-hover:bg-black group-hover:text-white transition-none">
              EF
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tighter text-white font-['Hanken_Grotesk'] leading-none">
              EvalForge
            </span>
            <span className="px-2 py-0.5 bg-white text-black text-[10px] font-black tracking-widest border-2 border-white">
              SIM
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-4 text-xs font-black tracking-widest font-['Hanken_Grotesk']">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-1.5 transition-none border-2 tracking-wider",
                  isActive
                    ? "bg-white text-black border-white"
                    : "border-transparent text-zinc-300 hover:bg-white hover:text-black hover:border-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Profile & Live Readiness Info */}
        <div className="flex items-center gap-4 sm:gap-6">
          {profile && (
            <div className="hidden xl:flex items-center gap-6 text-xs font-bold uppercase tracking-wider font-mono">
              <span>READINESS: <strong className="text-base text-white">{profile.readiness_score.toFixed(1)}%</strong></span>
              <span>STREAK: <strong className="text-base text-white">{profile.current_streak_days}D</strong></span>
            </div>
          )}

          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
