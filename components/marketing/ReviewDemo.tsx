"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, CircleAlert, FileCode2, RotateCcw } from "lucide-react";
import styles from "./ReviewDemo.module.css";

type Verdict = "correct" | "issue";

const sample = [
  "def reverse_list(head):",
  "    prev, current = None, head",
  "    while current:",
  "        current.next = prev",
  "        prev = current",
  "        current = current.next",
  "    return prev",
];

function highlightSyntax(line: string) {
  return line.split(/(\b(?:def|while|return|None|reverse_list)\b)/g).map((part, index) => {
    if (/^(def|while|return|None)$/.test(part)) {
      return <span className={styles.keyword} key={index}>{part}</span>;
    }
    if (part === "reverse_list") {
      return <span className={styles.functionName} key={index}>{part}</span>;
    }
    return part;
  });
}

export function ReviewDemo() {
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const firstVerdict = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  const questionId = useId();
  const feedbackId = useId();

  useEffect(() => {
    if (verdict === null && restoreFocus.current) {
      firstVerdict.current?.focus();
      restoreFocus.current = false;
    }
  }, [verdict]);

  function resetReview() {
    restoreFocus.current = true;
    setVerdict(null);
  }

  return (
    <section className={styles.panel} aria-labelledby={questionId} data-review-demo>
      <div className={styles.fileHeader}>
        <div className={styles.fileName}>
          <FileCode2 size={17} strokeWidth={1.65} aria-hidden="true" />
          <span>reverse_list.py</span>
        </div>
        <span className={styles.language}>Python</span>
      </div>

      <div
        className={styles.codeViewport}
        role="region"
        aria-label="Python implementation to review"
        tabIndex={0}
      >
        <pre className={styles.code}>
          <code>
            {sample.map((line, index) => (
              <span
                className={`${styles.codeLine} ${verdict !== null && index === 3 ? styles.highlightedLine : ""}`}
                data-highlighted={verdict !== null && index === 3 ? "true" : undefined}
                key={index}
              >
                <span className={styles.lineNumber} aria-hidden="true">{index + 1}</span>
                <span>{highlightSyntax(line)}</span>
                {index < sample.length - 1 ? "\n" : null}
              </span>
            ))}
          </code>
        </pre>
      </div>

      <div className={styles.review}>
        <h2 className={styles.question} id={questionId}>Does this correctly reverse the list?</h2>
        <p className={styles.prompt}>Make a call. Then see the reasoning.</p>
        <div className={styles.verdicts} role="group" aria-labelledby={questionId}>
          <button
            className={styles.verdict}
            type="button"
            ref={firstVerdict}
            aria-pressed={verdict === "correct"}
            aria-controls={feedbackId}
            onClick={() => setVerdict("correct")}
          >
            Looks correct
          </button>
          <button
            className={styles.verdict}
            type="button"
            aria-pressed={verdict === "issue"}
            aria-controls={feedbackId}
            onClick={() => setVerdict("issue")}
          >
            There’s an issue
          </button>
        </div>
      </div>

      <div id={feedbackId} role="status" aria-live="polite" aria-atomic="true">
        {verdict !== null && (
          <div className={styles.feedback}>
            <p className={`${styles.feedbackTitle} ${verdict === "issue" ? styles.correctFinding : styles.reconsider}`}>
              {verdict === "issue" ? <Check size={18} aria-hidden="true" /> : <CircleAlert size={18} aria-hidden="true" />}
              {verdict === "issue" ? "Good catch. The next node is lost." : "Look again at line 4."}
            </p>
            <p className={styles.explanation}>
              Overwriting <code>current.next</code> loses the rest of the list. Save the next node before changing the pointer.
            </p>
            <dl className={styles.trace} aria-label="Example showing the incorrect output">
              <div><dt>Input</dt><dd><code>[1, 2, 3]</code></dd></div>
              <div><dt>Returned</dt><dd className={styles.actual}><code>[1]</code></dd></div>
              <div><dt>Expected</dt><dd><code>[3, 2, 1]</code></dd></div>
            </dl>
            <button className={styles.reset} type="button" onClick={resetReview}>
              <RotateCcw size={14} aria-hidden="true" />
              Try again
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
