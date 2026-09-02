import { NextResponse } from "next/server";
import { OAFollowUpQuestion } from "@/types/oa";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { problemTitle, problemDescription, constraints, submittedCode, language, claimedTimeComplexity, claimedSpaceComplexity, approachExplanation } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    const systemPrompt = `You are a Principal Software Engineer conducting a high-stakes competitive coding technical screening for Google, Citadel, and Tier-1 FinTech firms.
Analyze the candidate's code and technical explanation.
Generate 2 to 3 targeted, high-impact follow-up technical questions probing:
1. Scale and extreme constraints (e.g. what if N=10^9 or data doesn't fit in RAM)
2. Edge-case fragility and concurrency/stability
3. Asymptotic trade-offs or memory optimization

PROBLEM:
Title: ${problemTitle}
Description: ${problemDescription}
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
Return ONLY valid raw JSON conforming strictly to this format (no markdown fences, no extra text):
{
  "questions": [
    {
      "id": "q1",
      "category": "scale_and_constraints",
      "question": "..."
    },
    {
      "id": "q2",
      "category": "edge_case_and_stability",
      "question": "..."
    },
    {
      "id": "q3",
      "category": "complexity_reduction",
      "question": "..."
    }
  ]
}`;

    if (!apiKey) {
      // Fallback tailored follow-up generator when API key is missing
      return NextResponse.json({
        questions: [
          {
            id: "q1",
            category: "scale_and_constraints",
            question: `Your solution uses ${claimedSpaceComplexity || "O(N)"} space. If the input stream is 100 GB and total memory is capped at 512 MB, how would you re-architect this pipeline without sacrificing latency?`,
          },
          {
            id: "q2",
            category: "edge_case_and_stability",
            question: `What specific failure mode occurs in your implementation if duplicate entries or zero-value volumes arrive simultaneously in the stream?`,
          },
          {
            id: "q3",
            category: "architecture_tradeoffs",
            question: `How would you adapt this single-threaded data structure for a lock-free, concurrent multi-producer execution environment?`,
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
      questions: parsed.questions || [
        {
          id: "q1",
          category: "scale_and_constraints",
          question: "How does your algorithm behave if input volume scales 1000x beyond available RAM?",
        },
        {
          id: "q2",
          category: "edge_case_and_stability",
          question: "Can integer overflow or precision loss occur on extreme numeric bounds?",
        },
      ],
    });
  } catch (error: any) {
    console.error("Error generating follow-ups:", error);
    return NextResponse.json({
      questions: [
        {
          id: "q1",
          category: "scale_and_constraints",
          question: "If this service is distributed across multiple regions, how would you maintain consistent ordering?",
        },
        {
          id: "q2",
          category: "complexity_reduction",
          question: "Could this time complexity be optimized further under sparse data assumptions?",
        },
      ],
    });
  }
}
