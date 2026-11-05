"use client";

import { useId, useState } from "react";
import { ArrowRight, Check, FileCode2, Minus, Plus } from "lucide-react";
import styles from "./ReviewWorkflow.module.css";

const steps = [
  { title: "Read independently", description: "Understand the specification and implementation before you see the reference findings." },
  { title: "Make your case", description: "Trace a concrete input. Explain what happens, what should happen, and why the difference matters." },
  { title: "Compare and improve", description: "See what matched, what you missed, and how to make your next review more precise." },
];

const code = [
  "def find_index(values, target):",
  "    left, right = 0, len(values) - 1",
  "    while left < right:",
  "        mid = (left + right) // 2",
  "        if values[mid] == target:",
  "            return mid",
  "        if values[mid] < target:",
  "            left = mid + 1",
  "        else:",
  "            right = mid - 1",
  "    return -1",
];

export function ReviewWorkflow() {
  const [step, setStep] = useState(0);
  const panelId = useId();

  return (
    <div className={styles.workflow}>
      <ol className={styles.steps} aria-label="Explore the review process">
        {steps.map((item, index) => (
          <li key={item.title}>
            <button type="button" className={styles.step} aria-pressed={step === index} aria-controls={panelId} onClick={() => setStep(index)}>
              <span className={styles.stepNumber} aria-hidden="true">{index + 1}</span>
              <span className={styles.stepCopy}><span className={styles.stepTitle}>{item.title}</span><span className={styles.stepDescription}>{item.description}</span></span>
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ol>
      <div className={styles.example} id={panelId} aria-label={`${steps[step].title}: worked example`}>
        <div className={styles.exampleHeader}><span><FileCode2 size={16} aria-hidden="true" />find_index.py</span><span>Worked example</span></div>
        <div className={styles.exampleBody}>
          {step === 0 && <>
            <h3>Start with the promise.</h3>
            <p>Return the target’s index in a sorted list, or <code>-1</code> if it isn’t there.</p>
            <div className={styles.codeViewport} role="region" tabIndex={0} aria-label="Binary search implementation">
              <pre><code>{code.map((line, index) => <span className={styles.codeLine} key={line}><span aria-hidden="true">{index + 1}</span>{line}{index < code.length - 1 ? "\n" : null}</span>)}</code></pre>
            </div>
            <p className={styles.note}>The reference findings stay hidden while you form your own judgment.</p>
          </>}
          {step === 1 && <>
            <h3>One input can make the case.</h3>
            <p>What happens when the target is the last value in the list?</p>
            <div className={styles.input}><code>values = [2, 4, 6]</code><code>target = 6</code></div>
            <table className={styles.trace}><caption>Trace the loop</caption><thead><tr><th scope="col">Left</th><th scope="col">Right</th><th scope="col">What happens</th></tr></thead><tbody><tr><td>0</td><td>2</td><td>Middle is 4. Move left to 2.</td></tr><tr><td>2</td><td>2</td><td>The loop stops before checking 6.</td></tr></tbody></table>
            <dl className={styles.outputs}><div><dt>Expected index</dt><dd>2</dd></div><div><dt>Returned index</dt><dd className={styles.incorrect}>-1</dd></div></dl>
            <p className={styles.note}>A concrete counterexample is stronger than “the loop looks wrong.”</p>
          </>}
          {step === 2 && <>
            <h3>The last candidate is never checked.</h3>
            <p>The search interval includes both ends. When <code>left</code> meets <code>right</code>, one possible match still remains.</p>
            <div className={styles.diff} aria-label="Suggested loop condition correction"><div className={styles.removed}><Minus size={15} aria-hidden="true" /><span className="sr-only">Replace: </span><code>while left &lt; right:</code></div><div className={styles.added}><Plus size={15} aria-hidden="true" /><span className="sr-only">With: </span><code>while left &lt;= right:</code></div></div>
            <ul className={styles.findings}><li><Check size={16} aria-hidden="true" /><span><strong>Specific finding</strong>The loop skips a one-element interval.</span></li><li><Check size={16} aria-hidden="true" /><span><strong>Supporting evidence</strong>Searching [2, 4, 6] for 6 returns -1.</span></li><li><Check size={16} aria-hidden="true" /><span><strong>A precise correction</strong>Include the final candidate in the loop.</span></li></ul>
            <p className={styles.note}>Reference feedback helps you strengthen the reasoning behind your verdict.</p>
          </>}
        </div>
      </div>
    </div>
  );
}
