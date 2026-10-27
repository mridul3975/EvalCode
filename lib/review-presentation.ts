import type { QuestionItem } from "@/types/question";

/** Presentation only: preserve source line numbers and reference scoring data. */
export function blindCode(code: string): string {
  return code.split("\n").map(line => {
    let quote = "";
    let escaped = false;
    let comment = -1;
    for (let index = 0; index < line.length; index++) {
      const char = line[index];
      if (escaped) { escaped = false; continue; }
      if (quote && char === "\\") { escaped = true; continue; }
      if (quote) { if (char === quote) quote = ""; continue; }
      if (char === '"' || char === "'" || char === "`") { quote = char; continue; }
      if (char === "#" || (char === "/" && line[index + 1] === "/")) { comment = index; break; }
    }
    if (comment < 0) return line;
    const hint = line.slice(comment);
    if (/\b(bug|buggy|defect|incorrect|wrong|broken|fails?|flaw|should be|fix:|error:|off.by.one|race condition)\b/i.test(hint)) {
      return line.slice(0, comment).trimEnd();
    }
    return line;
  }).join("\n");
}

export function reviewTitle(question: QuestionItem): string {
  // Some seed titles name their intended defect. The task itself remains intact.
  return question.title
    .replace(/\s*\([^)]*(?:bug|defect|race condition|aliasing|off.by.one|incorrect|deceptive|overflow|blindness|failure|heuristic|gotcha|trap|mutable default)[^)]*\)/gi, "")
    .replace(/\s*[-–—:]\s*.*(?:bug|defect|deceptive|incorrect|off.by.one|blindness).*$/i, "")
    .replace(/\b(?:Subtle |Fatal |Deceptive )?(?:Buggy|Bug|Defect|Deceptive Explanation|Completely Correct)\b/gi, "")
    .replace(/\s{2,}/g, " ").replace(/\s*[-–—:]\s*$/, "").trim() || "Code review exercise";
}
