import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#121416] text-white border-t-8 border-white mt-auto font-['Hanken_Grotesk']">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 sm:p-12 lg:p-16 gap-8 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 text-3xl sm:text-4xl font-black uppercase tracking-tight">
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-black text-base border-2 border-white">
              EF
            </div>
            <span>
              EvalForge <span className="text-sm border-2 border-white px-2 py-0.5 ml-2 font-mono">V1.0</span>
            </span>
          </div>
          <p className="font-bold max-w-md uppercase text-xs sm:text-sm border-l-4 border-white pl-4 font-mono text-zinc-300">
            AI-Evaluation & Code-Review Assessment Simulator. Calibrating developers for RLHF roles.
          </p>
        </div>

        <nav className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm sm:text-base font-black uppercase tracking-wider">
          <Link
            href="/practice"
            className="hover:bg-white hover:text-black px-3 py-1.5 transition-none inline-block border-2 border-transparent hover:border-white"
          >
            Practice Catalog
          </Link>
          <Link
            href="/assessment"
            className="hover:bg-white hover:text-black px-3 py-1.5 transition-none inline-block border-2 border-transparent hover:border-white"
          >
            Mock Assessment
          </Link>
          <Link
            href="/dashboard"
            className="bg-white text-black px-3 py-1.5 transition-none inline-block border-2 border-white"
          >
            Readiness Profile
          </Link>
        </nav>
      </div>

      <div className="bg-white text-black text-center py-4 font-bold uppercase tracking-widest text-xs border-t-4 border-white font-mono">
        &copy; {new Date().getFullYear()} EvalForge. Minimalist Brutalist 70/30 Edition.
      </div>
    </footer>
  );
}
