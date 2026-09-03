import { NextResponse } from "next/server";
import { OAFollowUpQuestion } from "@/types/oa";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      company,
      companyProfile,
      questions, // Multi-problem array: [{ order, title, code, language, approach, claimedTime, claimedSpace }]
      problemTitle, // Single problem fallback
      problemDescription,
      constraints,
      submittedCode,
      language,
      claimedTimeComplexity,
      claimedSpaceComplexity,
      approachExplanation,
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    const targetCompany = company || companyProfile || "Citadel / Google";

    let systemPrompt = "";

    if (Array.isArray(questions) && questions.length > 0) {
      // Multi-Problem Follow-Up Generation Prompt
      const questionsContext = questions
        .map(
          (q: any, i: number) => `--- PROBLEM ${q.order || i + 1}: ${q.title} ---
Language: ${q.language || "python"}
Claimed Time: ${q.claimedTime || "O(N)"}, Space: ${q.claimedSpace || "O(1)"}
Approach: ${q.approach || "None provided"}
Code:
\`\`\`${q.language || "python"}
${q.code || "// No code"}
\`\`\``
        )
        .join("\n\n");

      systemPrompt = `You are a Principal Engineering Director grading a multi-problem technical assessment for ${targetCompany}.
You will evaluate the candidate across all problems attempted:
${questionsContext}

INSTRUCTIONS:
Generate 2 to 3 targeted, high-impact follow-up technical questions focused on their hardest or most fragile implementation (e.g. scale limits, race conditions, edge-case failure modes, or asymptotic trade-offs).
Mention the target problem title if applicable.

Return ONLY valid JSON matching this schema:
{
  "questions": [
    {
      "id": "q1",
      "category": "scale_and_constraints",
      "question": "Question text...",
      "targetProblemTitle": "Problem title this applies to"
    },
    {
      "id": "q2",
      "category": "edge_case_and_stability",
      "question": "Question text...",
      "targetProblemTitle": "Problem title this applies to"
    }
  ]
}`;
    } else {
      // Single Problem Follow-Up Generation Prompt
      systemPrompt = `You are a Principal Software Engineer conducting a high-stakes competitive coding technical screening for ${targetCompany}.
Analyze the candidate's code and technical explanation.
Generate 2 to 3 targeted, high-impact follow-up technical questions probing:
1. Scale and extreme constraints
2. Edge-case fragility and concurrency/stability
3. Asymptotic trade-offs or memory optimization

PROBLEM:
Title: ${problemTitle}
Description: ${problemDescription || ""}
Constraints: ${(constraints || []).join("; ")}

CANDIDATE SUBMISSION:
Language: ${language}
Submitted Code:
\`\`\`${language}
${submittedCode}
\`\`\`

CANDIDATE EXPLANATION:
Approach: ${approachExplanation || "No approach provided"}
Claimed Time Complexity: ${claimedTimeComplexity || "O(N)"}
Claimed Space Complexity: ${claimedSpaceComplexity || "O(1)"}

INSTRUCTIONS:
Return ONLY valid raw JSON conforming strictly to this format:
{
  "questions": [
    {
      "id": "q1",
      "category": "scale_and_constraints",
      "question": "...",
      "targetProblemTitle": "${problemTitle || "Active Problem"}"
    },
    {
      "id": "q2",
      "category": "edge_case_and_stability",
      "question": "...",
      "targetProblemTitle": "${problemTitle || "Active Problem"}"
    }
  ]
}`;
    }

    if (!apiKey) {
      // High-quality calibrated fallback when API key is not present
      const firstProblemTitle = Array.isArray(questions) && questions.length > 0 ? questions[0].title : (problemTitle || "Core Algorithm");
      const secondProblemTitle = Array.isArray(questions) && questions.length > 1 ? questions[1].title : firstProblemTitle;

      return NextResponse.json({
        questions: [
          {
            id: "q1",
            category: "scale_and_constraints",
            question: `In your implementation for "${firstProblemTitle}", how would memory footprint and cache locality behave if the input size scaled to 10^8 elements streaming at 50,000 ops/second?`,
            targetProblemTitle: firstProblemTitle,
          },
          {
            id: "q2",
            category: "edge_case_and_stability",
            question: `For "${secondProblemTitle}", what race conditions or failure modes would manifest under a concurrent multi-producer scenario, and what lock-free primitives would you employ?`,
            targetProblemTitle: secondProblemTitle,
          },
        ] as OAFollowUpQuestion[],
      });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Gemini API returned status ${res.status}`);
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json({
      questions: parsed.questions || [],
    });
  } catch (error: any) {
    console.error("Follow-up generation error:", error);
    return NextResponse.json(
      {
        questions: [
          {
            id: "q1",
            category: "scale_and_constraints",
            question: "How would you re-architect your data structures if memory was constrained to 128MB and input throughput exceeded 1M events per second?",
          },
          {
            id: "q2",
            category: "edge_case_and_stability",
            question: "What specific invariant would break if concurrent workers attempted simultaneous writes and boundary removals?",
          },
        ],
      },
      { status: 200 }
    );
  }
}
