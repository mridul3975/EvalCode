import { QuestionItem, DefectCategory, Verdict, IssueSeverity } from "@/types/question";

export interface GeminiKeyConfig {
  apiKey?: string;
}

export function getStoredGeminiKey(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("evalforge_gemini_api_key") || null;
}

export function saveStoredGeminiKey(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("evalforge_gemini_api_key", key);
}

export function clearStoredGeminiKey(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("evalforge_gemini_api_key");
}

export async function callGeminiApi(prompt: string, customApiKey?: string): Promise<string> {
  const userKey = customApiKey || getStoredGeminiKey();

  // Call Next.js API route which uses server environment variable or client key
  const response = await fetch("/api/ai/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, apiKey: userKey }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to communicate with Gemini AI API");
  }

  const data = await response.json();
  return data.text;
}

export async function generateQuestionFromRawText(
  rawText: string,
  preferredLanguage: string = "python",
  customApiKey?: string
): Promise<QuestionItem> {
  const prompt = `
You are an expert AI Benchmark Engineer for EvalForge.
Convert the following raw problem text or code into a calibrated EvalForge Question JSON object.

RAW TEXT:
"""
${rawText}
"""

TARGET LANGUAGE: ${preferredLanguage}

INSTRUCTIONS:
1. Extract or write a clean problem statement description, constraints (array of strings), and example test cases (array of {input, output, explanation}).
2. Generate an AI code snippet in ${preferredLanguage} that contains ONE SUBTLE, CALIBRATED BUG (e.g., pointer overwrite, off-by-one, improper edge-case check, or quadratic complexity regression).
3. Generate the corrected, optimal code solution.
4. Output STRICT JSON conforming EXACTLY to this schema (no markdown fences, no explanatory text):

{
  "title": "Short Uppercase Problem Title",
  "topic": "arrays" | "strings" | "linked_lists" | "trees" | "graphs" | "dp" | "stacks_queues" | "heaps" | "intervals" | "greedy" | "backtracking",
  "difficulty": "easy" | "medium" | "hard",
  "language": "${preferredLanguage}",
  "problem_statement": {
    "description": "Full clear problem statement",
    "constraints": ["Constraint 1", "Constraint 2"],
    "examples": [{"input": "...", "output": "...", "explanation": "..."}]
  },
  "ai_response": {
    "code": "Defective code snippet here...",
    "stated_explanation": "AI's description of how its code works",
    "stated_time_complexity": "O(N)",
    "stated_space_complexity": "O(1)"
  },
  "ground_truth": {
    "verdict": "major_bug" | "minor_issue" | "correct",
    "defect_type": "subtle_logic_bug" | "edge_case_blindness" | "complexity_regression" | "deceptive_explanation",
    "error_categories": ["subtle_logic_bug"],
    "expected_issues": [
      {
        "id": "issue_1",
        "severity": "major",
        "dimension": "correctness",
        "line_numbers": [5],
        "description": "Detailed explanation of the bug",
        "failing_input_example": "...",
        "why_it_matters": "..."
      }
    ],
    "optimal_complexity": {
      "time": "O(N)",
      "space": "O(1)",
      "reasoning": "Optimal approach explanation"
    },
    "corrected_code": "Clean, bug-free solution code here...",
    "model_critique_summary": "Summary of what the AI model got wrong"
  }
}
`;

  const text = await callGeminiApi(prompt, customApiKey);
  
  // Clean JSON response
  let jsonStr = text.trim();
  if (jsonStr.startsWith("```json")) {
    jsonStr = jsonStr.slice(7);
  }
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.slice(3);
  }
  if (jsonStr.endsWith("```")) {
    jsonStr = jsonStr.slice(0, -3);
  }
  jsonStr = jsonStr.trim();

  const parsed = JSON.parse(jsonStr);

  const customId = `custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  
  const questionItem: QuestionItem = {
    id: customId,
    title: parsed.title || "CUSTOM AI BENCHMARK",
    topic: parsed.topic || "arrays",
    difficulty: parsed.difficulty || "medium",
    language: parsed.language || preferredLanguage,
    problem_statement: {
      description: parsed.problem_statement?.description || rawText,
      constraints: parsed.problem_statement?.constraints || [],
      examples: parsed.problem_statement?.examples || [],
    },
    ai_response: {
      code: parsed.ai_response?.code || "# No code generated",
      stated_explanation: parsed.ai_response?.stated_explanation || "",
      stated_time_complexity: parsed.ai_response?.stated_time_complexity || "O(N)",
      stated_space_complexity: parsed.ai_response?.stated_space_complexity || "O(1)",
    },
    ground_truth: {
      verdict: parsed.ground_truth?.verdict || "major_bug",
      defect_type: parsed.ground_truth?.defect_type || "subtle_logic_bug",
      error_categories: parsed.ground_truth?.error_categories || ["subtle_logic_bug"],
      expected_issues: parsed.ground_truth?.expected_issues || [],
      optimal_complexity: parsed.ground_truth?.optimal_complexity || { time: "O(N)", space: "O(1)", reasoning: "" },
      corrected_code: parsed.ground_truth?.corrected_code || "",
      model_critique_summary: parsed.ground_truth?.model_critique_summary || "",
    },
  };

  return questionItem;
}

export async function askGeminiFollowUp(
  userPrompt: string,
  question: QuestionItem,
  candidateVerdict?: string,
  customApiKey?: string
): Promise<string> {
  const prompt = `
You are EvalForge AI, a senior AI Trainer and Code Audit Expert.
Answer the user's follow-up question regarding the benchmark problem below.

PROBLEM TITLE: ${question.title}
PROBLEM DESCRIPTION: ${question.problem_statement.description}
AI CODE SNIPPET UNDER REVIEW:
\`\`\`${question.language}
${question.ai_response.code}
\`\`\`

GROUND TRUTH CORRECTED CODE:
\`\`\`${question.language}
${question.ground_truth.corrected_code}
\`\`\`

EXPECTED DEFECT: ${question.ground_truth.defect_type || "subtle_logic_bug"}
CANDIDATE VERDICT SUBMITTED: ${candidateVerdict || "Not submitted yet"}

USER FOLLOW-UP QUESTION:
"${userPrompt}"

INSTRUCTIONS:
Provide a clear, technical, high-impact answer. Highlight line numbers, explain edge cases, and give practical advice as an AI evaluator. Keep formatting clean and markdown readable.
`;

  return await callGeminiApi(prompt, customApiKey);
}
