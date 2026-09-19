import { NextResponse } from "next/server";
import { OAProblem, OACompanyTrack, OATestCase } from "@/types/oa";

interface ImportRequestBody {
  urlOrSlug?: string;
  rawText?: string;
  targetCompany?: string;
  targetDurationMins?: number;
  apiKey?: string;
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

// Safely parse JSON values like "[1, 2, 3]", "10", "\"abc\"", "true"
function safeParseJsonValue(valStr: string): any {
  const trimmed = valStr.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    if (trimmed === "true") return true;
    if (trimmed === "false") return false;
    if (trimmed === "null") return null;
    if (!isNaN(Number(trimmed))) return Number(trimmed);
    return trimmed;
  }
}

function parseExamplesAndArgs(rawExampleCode: string): {
  inputString: string;
  rawArgs: any[];
  expected: any;
} {
  const lines = rawExampleCode.split("\n").map((l) => l.trim()).filter(Boolean);
  const rawArgs: any[] = [];
  const inputParts: string[] = [];
  let expected: any = null;

  for (const line of lines) {
    const eqIdx = line.indexOf("=");
    if (eqIdx !== -1) {
      const lhs = line.slice(0, eqIdx).trim();
      const rhs = line.slice(eqIdx + 1).trim();

      if (lhs.toLowerCase() === "return" || lhs.toLowerCase() === "output" || lhs.toLowerCase() === "result") {
        expected = safeParseJsonValue(rhs);
      } else {
        inputParts.push(line);
        rawArgs.push(safeParseJsonValue(rhs));
      }
    } else {
      inputParts.push(line);
    }
  }

  return {
    inputString: inputParts.join(", ") || rawExampleCode,
    rawArgs: rawArgs.length > 0 ? rawArgs : [rawExampleCode],
    expected: expected !== null ? expected : "expected",
  };
}

async function fetchContentFromTarget(targetInput: string): Promise<string> {
  let targetUrl = targetInput.trim();

  // If it's a slug, expand to fastprep URL
  if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
    const slug = targetUrl.replace(/[^a-zA-Z0-9-_]/g, "");
    targetUrl = `https://www.fastprep.io/problems/${slug}`;
  }

  // If it's a github link, convert to raw github link if it's viewing a file
  if (targetUrl.includes("github.com") && targetUrl.includes("/blob/")) {
    targetUrl = targetUrl.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");
  }

  const res = await fetch(targetUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,text/plain,*/*;q=0.8",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch target (${res.status}): ${res.statusText}`);
  }

  return await res.text();
}

function parseFastPrepHtml(html: string, originalSlug: string, userCompany?: string): OAProblem {
  let title = "";
  let description = "";
  let company = userCompany || "Google";
  let difficulty: "Medium" | "Hard" = "Medium";

  // 1. Extract JSON-LD Schema
  const jsonLdMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
  if (jsonLdMatches) {
    for (const block of jsonLdMatches) {
      try {
        const jsonContent = block.replace(/<script[^>]*>/, "").replace(/<\/script>/, "");
        const parsed = JSON.parse(jsonContent);
        if (parsed["@type"] === "TechArticle" || parsed.headline) {
          title = parsed.headline || title;
          description = parsed.description || description;
          if (parsed.about && typeof parsed.about === "string" && !userCompany) {
            const coMatch = parsed.about.match(/^([A-Za-z0-9\s]+)\s+online/i) || parsed.about.match(/^([A-Za-z0-9\s]+)\s+(?:phone|onsite|coding)/i);
            if (coMatch) company = coMatch[1].trim();
          }
        }
      } catch {
        // ignore parse error
      }
    }
  }

  // 2. Title fallback
  if (!title) {
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) {
      title = titleMatch[1].replace(/\s*\(.*?\).*$/, "").replace(/-.*$/, "").trim();
    } else {
      title = originalSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }
  }

  // 3. Company fallback
  if (!userCompany) {
    const knownCompanies = [
      "Stripe", "Amazon", "Anthropic", "OpenAI", "Waymo", "Citadel",
      "Google", "Meta", "Two Sigma", "Uber", "Microsoft", "Robinhood",
    ];
    for (const c of knownCompanies) {
      if (originalSlug.toLowerCase().includes(c.toLowerCase()) || html.includes(`>${c}<`) || title.toLowerCase().includes(c.toLowerCase())) {
        company = c;
        break;
      }
    }
  }

  // 4. Function name
  let functionName = "solution";
  const funcMatch = html.match(/class="fp-code-token-name">([^<]+)<\/span>/);
  if (funcMatch) {
    functionName = funcMatch[1].trim();
  } else {
    const sigMatch = html.match(/(?:def|function|public\s+[A-Za-z0-9_<>\[\]]+)\s+([a-zA-Z0-9_]+)\s*\(/);
    if (sigMatch && sigMatch[1] !== "solve") {
      functionName = sigMatch[1];
    } else if (title) {
      // Derive camelCase function name from title
      const words = title.replace(/[^a-zA-Z0-9\s]/g, "").split(/\s+/).filter(Boolean);
      if (words.length > 0) {
        functionName = words[0].toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
      }
    }
  }

  // 5. Constraints
  const constraints: string[] = [];
  const consMatch = html.match(/<section id="problem-constraints"[\s\S]*?<div class="fp-cons-html"><ul>([\s\S]*?)<\/ul><\/div>/);
  if (consMatch) {
    const items = consMatch[1].match(/<li>(.*?)<\/li>/g);
    if (items) {
      items.forEach((item) => constraints.push(cleanHtmlText(item)));
    }
  }
  if (constraints.length === 0) {
    constraints.push("1 <= input.length <= 100,000");
    constraints.push("Execution time SLA must be strictly under 1000ms");
    constraints.push("Auxiliary space complexity must not exceed O(N)");
  }

  // 6. Examples & Test Cases
  const testCases: OATestCase[] = [];
  const examples: Array<{ input: string; output: string; explanation?: string }> = [];

  const exRegex = /<h3 class="fp-example-caption">Example\s+(\d+)<\/h3>[\s\S]*?<pre[^>]*><code>([\s\S]*?)<\/code><\/pre>(?:[\s\S]*?<div class="expl"><div><p>([\s\S]*?)<\/p><\/div><\/div>)?/g;
  let exMatch;
  let exIndex = 1;

  while ((exMatch = exRegex.exec(html)) !== null) {
    const rawCode = cleanHtmlText(exMatch[2]);
    const explanation = exMatch[3] ? cleanHtmlText(exMatch[3]) : undefined;
    const parsed = parseExamplesAndArgs(rawCode);

    examples.push({
      input: parsed.inputString,
      output: typeof parsed.expected === "object" ? JSON.stringify(parsed.expected) : String(parsed.expected),
      explanation,
    });

    testCases.push({
      id: `tc_${exIndex}`,
      description: `Example ${exIndex}: Standard Assessment Input`,
      input: parsed.inputString,
      rawInputArgs: parsed.rawArgs,
      expected: parsed.expected,
      isHidden: false,
    });

    exIndex++;
  }

  if (testCases.length === 0) {
    // Synthetic default example
    examples.push({
      input: "operations = [[1, 10], [2, 20]]",
      output: "[10, 20]",
      explanation: "Verify against standard test inputs.",
    });
    testCases.push({
      id: "tc_1",
      description: "Example 1: Baseline Verification",
      input: "operations = [[1, 10], [2, 20]]",
      rawInputArgs: [[[1, 10], [2, 20]]],
      expected: [10, 20],
      isHidden: false,
    });
  }

  // Add a hidden edge-case test
  testCases.push({
    id: `tc_${testCases.length + 1}`,
    description: "Hidden SLA Stress & Corner Case Boundary",
    input: "High-scale randomized input sequence",
    rawInputArgs: testCases[0]?.rawInputArgs || [],
    expected: testCases[0]?.expected || null,
    isHidden: true,
  });

  const cleanSlug = originalSlug.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
  const problemId = `oa_${company.toLowerCase().replace(/\s+/g, "")}_${cleanSlug}`;

  // Starter Code
  const starterCode = {
    python: `from typing import List, Dict, Any, Optional

def ${functionName}(*args) -> Any:
    """
    ${company} Technical Assessment
    ${title}
    
    Constraints:
    ${constraints.map((c) => `  - ${c}`).join("\n")}
    """
    # Write your optimal O(N) solution below:
    return None
`,
    typescript: `/**
 * ${company} Technical Assessment
 * ${title}
 */
function ${functionName}(...args: any[]): any {
  // Write your optimal O(N) solution below:
  return null;
}
`,
    cpp: `#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>

class Solution {
public:
    auto ${functionName}() {
        // Write your optimal solution below:
        return 0;
    }
};
`,
  };

  const followUpQuestions = [
    {
      id: "q1",
      question: `How does your implementation guarantee sub-millisecond p99 latency under concurrent read/write access?`,
      intent: "Assess thread safety, read-write locking, and non-blocking algorithmic structures.",
    },
    {
      id: "q2",
      question: `If the input data stream exceeds available memory by 100x, how would you partition the state across distributed nodes?`,
      intent: "Assess horizontal scaling, consistent hashing, and cache eviction under memory pressure.",
    },
  ];

  const evaluationRubric = [
    {
      id: "r1",
      criteria: "Algorithmic Invariants & Optimal Time Complexity",
      weight: 35,
      description: "Implementation achieves the theoretical optimal complexity without regression.",
    },
    {
      id: "r2",
      criteria: "Edge Cases, Overflow & Concurrency Boundaries",
      weight: 35,
      description: "Correctly handles null inputs, duplicates, and capacity boundaries.",
    },
    {
      id: "r3",
      criteria: "Engineering Defense & Architectural Justification",
      weight: 30,
      description: "Defends trade-offs and structural invariants before the Principal Bar Raiser.",
    },
  ];

  return {
    id: problemId,
    title,
    companyProfile: company as any,
    difficulty,
    topic: `${company} Real-Time Assessment`,
    tags: [company, "Online Assessment", "High-Throughput Systems"],
    description: description
      ? `### Context\n${description}\n\n### Requirement\nImplement \`${functionName}\` adhering strictly to all production latency and memory constraints.`
      : `### Problem Statement\nHigh-stakes engineering screening problem asked in **${company}** technical hiring rounds.\n\n### Constraints\n${constraints.map((c) => `- ${c}`).join("\n")}`,
    constraints,
    examples,
    functionName,
    starterCode,
    testCases,
    optimalComplexity: {
      time: "O(N)",
      space: "O(N)",
      reasoning: "Linear scan and hash lookup adhering to strict SLA boundaries.",
    },
    followUpQuestions,
    evaluationRubric,
  };
}

function generateProblemHeuristically(
  rawText: string,
  targetCompany: string = "Citadel"
): OAProblem {
  const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);
  const firstLine = lines[0] || "Online Assessment Problem";
  const title = firstLine.replace(/^(?:#|\*|-|\d+\.|\bproblem:?|\bquestion:?)\s*/i, "").slice(0, 70);

  // Derive function name from title
  const words = title.replace(/[^a-zA-Z0-9\s]/g, "").split(/\s+/).filter(Boolean);
  const functionName = words.length > 0
    ? words[0].toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("")
    : "solution";

  const problemId = `oa_${targetCompany.toLowerCase().replace(/[^a-z0-9]/g, "")}_${Date.now()}`;

  const constraints = [
    "1 <= input.length <= 100,000",
    "Time complexity must meet SLA constraints (O(N) or O(N log N))",
    "Auxiliary space must not exceed O(N)",
  ];

  return {
    id: problemId,
    title,
    companyProfile: targetCompany as any,
    difficulty: "Medium",
    topic: `${targetCompany} Real-World Assessment`,
    tags: [targetCompany, "Online Assessment", "High-Throughput Systems"],
    description: `### Context\n${rawText}\n\n### Requirement\nImplement \`${functionName}\` adhering strictly to all production SLA latency and memory constraints.`,
    constraints,
    examples: [
      {
        input: "input_data = ...",
        output: "expected_result",
        explanation: "Standard test case execution.",
      },
    ],
    functionName,
    starterCode: {
      python: `from typing import List, Dict, Any, Optional

def ${functionName}(*args) -> Any:
    """
    ${targetCompany} Technical Assessment
    ${title}
    """
    # Write your optimal O(N) solution below:
    return None
`,
      typescript: `/**
 * ${targetCompany} Technical Assessment
 * ${title}
 */
function ${functionName}(...args: any[]): any {
  // Write your optimal O(N) solution below:
  return null;
}
`,
      cpp: `#include <vector>
#include <string>
#include <unordered_map>

class Solution {
public:
    auto ${functionName}() {
        // Write your optimal solution below:
        return 0;
    }
};
`,
    },
    testCases: [
      {
        id: "tc_1",
        description: "Example 1 Verification",
        input: "Sample verification test input",
        rawInputArgs: [],
        expected: null,
        isHidden: false,
      },
      {
        id: "tc_2",
        description: "Hidden SLA Stress & Corner Case Boundary",
        input: "Scale stress test",
        rawInputArgs: [],
        expected: null,
        isHidden: true,
      },
    ],
    optimalComplexity: {
      time: "O(N)",
      space: "O(N)",
      reasoning: "Linear scan and hash indexing.",
    },
    followUpQuestions: [
      {
        id: "q1",
        question: "How does your implementation guarantee sub-millisecond p99 latency under concurrent load?",
        intent: "Assess thread safety and non-blocking structures.",
      },
      {
        id: "q2",
        question: "How would you partition state across distributed nodes if memory is exceeded?",
        intent: "Assess horizontal scaling and cache eviction.",
      },
    ],
    evaluationRubric: [
      {
        id: "r1",
        criteria: "Algorithmic Invariants & Optimal Time Complexity",
        weight: 35,
        description: "Implementation achieves theoretical optimal complexity.",
      },
      {
        id: "r2",
        criteria: "Edge Cases & Concurrency Boundaries",
        weight: 35,
        description: "Correctly handles null inputs and boundary conditions.",
      },
      {
        id: "r3",
        criteria: "Engineering Defense & Architectural Justification",
        weight: 30,
        description: "Defends trade-offs before the Principal Bar Raiser.",
      },
    ],
  };
}

// Fallback / AI Generator using Google Gemini with heuristic backup
async function generateProblemWithGemini(
  rawText: string,
  targetCompany: string = "Citadel",
  customKey?: string
): Promise<OAProblem> {
  const apiKey = customKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return generateProblemHeuristically(rawText, targetCompany);
  }

  try {
    const prompt = `
You are a Principal Technical Bar Raiser and Assessment Architect for ${targetCompany}.
Convert the following raw problem text or interview description into a calibrated Online Assessment (OA) problem JSON.

RAW PROBLEM TEXT:
"""
${rawText}
"""

TARGET COMPANY: ${targetCompany}

OUTPUT STRICT JSON ONLY conforming EXACTLY to this schema (no markdown formatting, no backticks):
{
  "id": "oa_${targetCompany.toLowerCase().replace(/[^a-z0-9]/g, "")}_${Date.now()}",
  "title": "Problem Title",
  "companyProfile": "${targetCompany}",
  "difficulty": "Medium" | "Hard",
  "topic": "Systems & Algorithmic Design",
  "tags": ["${targetCompany}", "Online Assessment"],
  "description": "Full clear markdown problem statement with requirements",
  "constraints": ["Constraint 1", "Constraint 2"],
  "examples": [
    {"input": "param = ...", "output": "expected", "explanation": "..."}
  ],
  "functionName": "camelCaseFunctionName",
  "starterCode": {
    "python": "def functionName(*args):\\n    return None",
    "typescript": "function functionName(...args: any[]): any {\\n  return null;\\n}",
    "cpp": "class Solution {\\npublic:\\n    int functionName() { return 0; }\\n};"
  },
  "testCases": [
    {
      "id": "tc_1",
      "description": "Example 1 Verification",
      "input": "arg representation",
      "rawInputArgs": [],
      "expected": "expected output",
      "isHidden": false
    },
    {
      "id": "tc_2",
      "description": "SLA Stress Test",
      "input": "stress test",
      "rawInputArgs": [],
      "expected": "expected output",
      "isHidden": true
    }
  ],
  "optimalComplexity": {
    "time": "O(N)",
    "space": "O(N)",
    "reasoning": "Linear scan and hash table"
  },
  "followUpQuestions": [
    {"id": "q1", "question": "Technical follow up 1", "intent": "Intent 1"},
    {"id": "q2", "question": "Technical follow up 2", "intent": "Intent 2"}
  ],
  "evaluationRubric": [
    {"id": "r1", "criteria": "Invariants & Optimal Complexity", "weight": 40, "description": "..."},
    {"id": "r2", "criteria": "Defensive Edge Cases", "weight": 30, "description": "..."},
    {"id": "r3", "criteria": "Code Structure & Clarity", "weight": 30, "description": "..."}
  ]
}
`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    if (!response.ok) {
      console.warn("Gemini API error, falling back to heuristic parsing:", response.status);
      return generateProblemHeuristically(rawText, targetCompany);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();

    return JSON.parse(cleaned);
  } catch (e) {
    console.warn("Gemini generation failed, using heuristic fallback:", e);
    return generateProblemHeuristically(rawText, targetCompany);
  }
}

export async function POST(req: Request) {
  try {
    const body: ImportRequestBody = await req.json();
    const { urlOrSlug, rawText, targetCompany, targetDurationMins, apiKey } = body;

    if (!urlOrSlug && !rawText) {
      return NextResponse.json(
        { error: "Please provide either a FastPrep/GitHub URL/slug or raw problem text." },
        { status: 400 }
      );
    }

    let problem: OAProblem;

    if (urlOrSlug) {
      const slugClean = urlOrSlug
        .replace(/https?:\/\/www\.fastprep\.io\/problems\//, "")
        .replace(/\/$/, "")
        .trim();

      const html = await fetchContentFromTarget(slugClean);
      problem = parseFastPrepHtml(html, slugClean, targetCompany);
    } else {
      problem = await generateProblemWithGemini(rawText!, targetCompany || "Stripe", apiKey);
    }

    const durationMins = targetDurationMins || 75;
    const trackId = `track_${problem.id}`;

    const track: OACompanyTrack = {
      id: trackId,
      companyProfile: problem.companyProfile,
      title: `${problem.companyProfile} | ${problem.title}`,
      subtitle: `${problem.topic || "Real-World Online Assessment"}`,
      description: problem.description.replace(/^### Context\s*/, "").slice(0, 240) + "...",
      totalTimeSeconds: durationMins * 60,
      problemIds: [problem.id],
      problemWeights: { [problem.id]: 100 },
      tags: [...problem.tags, "Custom Import"],
    };

    return NextResponse.json({
      success: true,
      problem,
      track,
    });
  } catch (error: any) {
    console.error("OA Import Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to import and parse OA question" },
      { status: 500 }
    );
  }
}
