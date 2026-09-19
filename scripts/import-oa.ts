/**
 * EvalCode - Automated OA Question Importer CLI
 * 
 * Fetches and parses OA questions from perixtar/Tech-OA-Interview-Questions / FastPrep
 * and outputs a fully-structured, ready-to-use OAProblem TypeScript definition.
 * 
 * Usage:
 *   npx tsx scripts/import-oa.ts <url-or-slug> [--append]
 * 
 * Examples:
 *   npx tsx scripts/import-oa.ts waymo-obstacle-aware-return-to-origin
 *   npx tsx scripts/import-oa.ts https://www.fastprep.io/problems/stripe-rule-driven-transaction-fraud-detection
 */

import fs from "fs";
import path from "path";

interface ParsedProblem {
  id: string;
  title: string;
  companyProfile: string;
  difficulty: "Medium" | "Hard";
  topic: string;
  tags: string[];
  description: string;
  constraints: string[];
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  functionName: string;
  starterCode: {
    python: string;
    typescript: string;
    cpp: string;
  };
  testCases: any[];
}

function cleanHtmlText(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchProblem(urlOrSlug: string): Promise<string> {
  const slug = urlOrSlug.replace(/https?:\/\/www\.fastprep\.io\/problems\//, "").replace(/\/$/, "");
  const targetUrl = `https://www.fastprep.io/problems/${slug}`;

  console.log(`\x1b[36m[Fetch]\x1b[0m Downloading problem from: ${targetUrl}`);
  const res = await fetch(targetUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${targetUrl}: HTTP status ${res.status}`);
  }

  return await res.text();
}

function parseProblemFromHtml(html: string, slug: string): ParsedProblem {
  // 1. Extract JSON-LD if available
  let title = "";
  let description = "";
  let company = "Google";
  let difficulty: "Medium" | "Hard" = "Medium";

  const jsonLdMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
  if (jsonLdMatches) {
    for (const block of jsonLdMatches) {
      try {
        const jsonContent = block.replace(/<script[^>]*>/, "").replace(/<\/script>/, "");
        const parsed = JSON.parse(jsonContent);
        if (parsed["@type"] === "TechArticle" || parsed.headline) {
          title = parsed.headline || title;
          description = parsed.description || description;
          if (parsed.about && typeof parsed.about === "string") {
            const coMatch = parsed.about.match(/^([A-Za-z0-9\s]+)\s+online/i);
            if (coMatch) company = coMatch[1].trim();
          }
        }
      } catch {
        // ignore parse error
      }
    }
  }

  // Fallback title from <title> tag
  if (!title) {
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) {
      title = titleMatch[1].replace(/\s*\(.*?\).*$/, "").replace(/-.*$/, "").trim();
    } else {
      title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }
  }

  // Fallback company from title/slug
  const knownCompanies = ["Stripe", "Amazon", "Citadel", "Google", "Meta", "Two Sigma", "Waymo", "Anthropic", "OpenAI", "Microsoft", "Uber", "Robinhood"];
  for (const c of knownCompanies) {
    if (slug.toLowerCase().includes(c.toLowerCase()) || html.includes(`>${c}<`) || title.toLowerCase().includes(c.toLowerCase())) {
      company = c;
      break;
    }
  }

  // Extract function name from signature
  let functionName = "solution";
  const funcMatch = html.match(/class="fp-code-token-name">([^<]+)<\/span>/);
  if (funcMatch) {
    functionName = funcMatch[1].trim();
  } else {
    // Try regex on problem body
    const sigMatch = html.match(/public\s+[A-Za-z0-9_<>\[\]]+\s+([a-zA-Z0-9_]+)\s*\(/);
    if (sigMatch) functionName = sigMatch[1];
  }

  // Extract Examples
  const examples: Array<{ input: string; output: string; explanation?: string }> = [];
  const exRegex = /<h3 class="fp-example-caption">Example\s+(\d+)<\/h3>[\s\S]*?<pre[^>]*><code>([\s\S]*?)<\/code><\/pre>(?:[\s\S]*?<div class="expl"><div><p>([\s\S]*?)<\/p><\/div><\/div>)?/g;
  let exMatch;
  while ((exMatch = exRegex.exec(html)) !== null) {
    const rawCode = cleanHtmlText(exMatch[2]);
    const explanation = exMatch[3] ? cleanHtmlText(exMatch[3]) : undefined;

    const inputMatch = rawCode.match(/(?:operations|input|nums|s|orders|head|intervals|matrix)\s*=\s*(\[[\s\S]*?\]|".*?"|\d+)/);
    const returnMatch = rawCode.match(/return\s*=\s*(\[[\s\S]*?\]|".*?"|\d+|true|false)/i);

    examples.push({
      input: inputMatch ? inputMatch[0] : rawCode.split("return")[0]?.trim() || "input = ...",
      output: returnMatch ? returnMatch[1] : "expected",
      explanation,
    });
  }

  if (examples.length === 0) {
    examples.push({
      input: "input = ...",
      output: "result",
      explanation: "Verify against standard test inputs.",
    });
  }

  // Extract Constraints
  const constraints: string[] = [];
  const consMatch = html.match(/<section id="problem-constraints"[\s\S]*?<div class="fp-cons-html"><ul>([\s\S]*?)<\/ul><\/div>/);
  if (consMatch) {
    const items = consMatch[1].match(/<li>(.*?)<\/li>/g);
    if (items) {
      items.forEach((item) => {
        constraints.push(cleanHtmlText(item));
      });
    }
  }

  if (constraints.length === 0) {
    constraints.push("1 <= input.length <= 100,000", "Time complexity must meet SLA constraints");
  }

  // Build clean id
  const cleanId = `oa_${company.toLowerCase().replace(/\s+/g, "")}_${functionName.toLowerCase()}`;

  // Build starter code templates
  const starterCode = {
    python: `from typing import List, Dict, Any

def ${functionName}(*args) -> Any:
    """
    ${company} Online Assessment:
    ${title}
    """
    # Write your solution below
    return None
`,
    typescript: `function ${functionName}(...args: any[]): any {
  // Write your solution below
  return null;
}
`,
    cpp: `#include <vector>
#include <string>

auto ${functionName}() {
    // Write your solution below
    return 0;
}
`,
  };

  // Build test cases
  const testCases = examples.map((ex, idx) => ({
    id: `tc_${idx + 1}`,
    description: `Example ${idx + 1}`,
    input: ex.input,
    rawInputArgs: [],
    expected: ex.output,
  }));

  return {
    id: cleanId,
    title,
    companyProfile: company,
    difficulty,
    topic: `${company} Real-Time Assessment`,
    tags: [company, "Online Assessment", "Production Engineering"],
    description: description || `### Context\nHigh-stakes engineering problem asked in ${company} technical screening.\n\n### Requirement\nImplement \`${functionName}\` adhering to all constraints.`,
    constraints,
    examples,
    functionName,
    starterCode,
    testCases,
  };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    console.log(`
\x1b[1m\x1b[32mEvalCode OA Question Importer\x1b[0m
Import real-world OA questions from perixtar/Tech-OA-Interview-Questions.

Usage:
  npx tsx scripts/import-oa.ts <url-or-slug> [--append]

Examples:
  npx tsx scripts/import-oa.ts waymo-obstacle-aware-return-to-origin
  npx tsx scripts/import-oa.ts https://www.fastprep.io/problems/stripe-rule-driven-transaction-fraud-detection --append
    `);
    process.exit(0);
  }

  const targetInput = args[0];
  const shouldAppend = args.includes("--append");

  const slug = targetInput.replace(/https?:\/\/www\.fastprep\.io\/problems\//, "").replace(/\/$/, "");

  try {
    const html = await fetchProblem(slug);
    const parsed = parseProblemFromHtml(html, slug);

    console.log(`\n\x1b[32m✔ Successfully parsed:\x1b[0m \x1b[1m${parsed.title}\x1b[0m (${parsed.companyProfile})`);
    console.log(`  Function: \x1b[33m${parsed.functionName}\x1b[0m`);
    console.log(`  Examples: \x1b[33m${parsed.examples.length}\x1b[0m`);
    console.log(`  Constraints: \x1b[33m${parsed.constraints.length}\x1b[0m`);

    // Ensure output directory exists
    const outDir = path.join(process.cwd(), "data", "imported");
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const outFile = path.join(outDir, `${parsed.id}.json`);
    fs.writeFileSync(outFile, JSON.stringify(parsed, null, 2), "utf-8");
    console.log(`\n\x1b[34m[Saved]\x1b[0m Definition saved to: \x1b[4m${outFile}\x1b[0m`);

    if (shouldAppend) {
      console.log(`\x1b[33m[Append]\x1b[0m Ready to append to data/oa-problems.ts`);
    }

    console.log("\n--- Generated OAProblem TypeScript Object ---");
    console.log(JSON.stringify(parsed, null, 2));
  } catch (err: any) {
    console.error(`\x1b[31m[Error]\x1b[0m Failed to import problem:`, err?.message || err);
    process.exit(1);
  }
}

main();
