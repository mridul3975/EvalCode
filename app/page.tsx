import Link from "next/link";
import { ArrowDown, ArrowRight, Clock3, GitCompareArrows, ScanLine } from "lucide-react";
import { SEED_QUESTIONS } from "@/data/seed-questions";
import { ReviewDemo } from "@/components/marketing/ReviewDemo";
import { ReviewWorkflow } from "@/components/marketing/ReviewWorkflow";
import styles from "./home.module.css";

export default function LandingPage() {
  return (
    <div className={styles.home}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <h1 id="home-title">Read the code.<br /><span>Trust your judgment.</span></h1>
            <p className={styles.introduction}>Practice the part of engineering that starts after code is written. Find subtle issues in AI-generated implementations and explain why they matter.</p>
            <div className={styles.heroActions}>
              <Link href="/practice/q_ll_001" className={`btn-primary ${styles.primaryAction}`}>Try your first review<ArrowRight size={17} aria-hidden="true" /></Link>
              <Link href="#how-it-works" className={styles.quietAction}>See how it works<ArrowDown size={16} aria-hidden="true" /></Link>
            </div>
            <p className={styles.reassurance}>No account or API key required.</p>
          </div>
          <div className={styles.demo}><ReviewDemo /></div>
        </div>
        <div className={styles.heroFoot}>
          <p>A quick review. An independent judgment.</p>
          <span>Python · Interactive example</span>
        </div>
      </section>

      <section className={styles.catalogBridge} aria-label="Practice catalog">
        <Link href="/practice">Explore {SEED_QUESTIONS.length} practice questions<ArrowRight size={17} aria-hidden="true" /></Link>
        <p><span>Edge cases</span><span>State &amp; mutation</span><span>Complexity</span><span>Specifications</span></p>
      </section>

      <section id="how-it-works" className={styles.method} aria-labelledby="method-title">
        <div className={styles.sectionIntro}>
          <h2 id="method-title">A useful review goes beyond<br className={styles.desktopBreak} /> “works for me.”</h2>
          <p>Read independently. Back your findings with evidence.<br className={styles.desktopBreak} /> Then compare your reasoning with a reference review.</p>
        </div>
        <ReviewWorkflow />
      </section>

      <section className={styles.practiceModes} aria-labelledby="practice-modes-title">
        <div className={styles.modesCopy}>
          <h2 id="practice-modes-title">Build the habit.<br /><span>Then test it.</span></h2>
          <p>Start with a single implementation. When you’re ready, bring the same careful thinking to a timed review or coding assessment.</p>
          <Link href="/practice" className={styles.textLink}>Find your next review<ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
        <div className={styles.modeList}>
          <Link href="/practice" className={styles.mode}>
            <ScanLine size={23} strokeWidth={1.5} aria-hidden="true" />
            <div><h3>Practice at your pace</h3><p>Read, trace, and make a case. Take the time to understand the implementation.</p></div>
            <ArrowRight size={19} aria-hidden="true" />
          </Link>
          <Link href="/assessment" className={styles.mode}>
            <Clock3 size={23} strokeWidth={1.5} aria-hidden="true" />
            <div><h3>Review under pressure</h3><p>A 50-minute mock to practice making clear judgments against the clock.</p></div>
            <ArrowRight size={19} aria-hidden="true" />
          </Link>
          <Link href="/oa" className={styles.mode}>
            <GitCompareArrows size={23} strokeWidth={1.5} aria-hidden="true" />
            <div><h3>Put your code to the test</h3><p>Solve a multi-problem coding assessment and explain the choices you make.</p></div>
            <ArrowRight size={19} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
