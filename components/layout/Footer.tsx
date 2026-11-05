"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight, Code2 } from "lucide-react";
import styles from "./Footer.module.css";
export function Footer() {
  const pathname = usePathname();
  if ((/^\/(practice|oa)\//.test(pathname) && !pathname.startsWith("/oa/results")) || pathname === "/assessment/session") return null;
  if (pathname === "/") return (
    <footer className={styles.homeFooter} aria-labelledby="footer-title">
      <Image className={styles.artwork} src="/images/marketing/evalforge-study.webp" alt="" fill sizes="100vw" unoptimized />
      <div className={styles.inner}>
        <div className={styles.invitation}>
          <h2 id="footer-title">Good judgment<br />takes practice.</h2>
          <p>One careful review at a time.</p>
          <Link href="/practice/q_ll_001" className="btn-primary">Start a review<ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
        <div className={styles.bottom}>
          <Link href="/" className={styles.brand}><Code2 size={20} aria-hidden="true" />EvalForge</Link>
          <nav aria-label="Footer"><Link href="/practice">Practice</Link><Link href="/assessment">Review mock</Link><Link href="/dashboard">Your progress</Link></nav>
          <span>Practice better code reviews.</span>
        </div>
      </div>
    </footer>
  );
  return <footer className="mt-auto border-t border-neutral-800"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 px-5 py-8 text-xs text-neutral-400 sm:px-8"><span>EvalForge · Practice better code reviews.</span><nav className="flex flex-wrap gap-5" aria-label="Footer"><Link href="/practice" className="hover:text-white">Practice</Link><Link href="/assessment" className="hover:text-white">Review mock</Link><Link href="/dashboard" className="hover:text-white">Your progress</Link></nav></div></footer>;
}
