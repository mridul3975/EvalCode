import { NextRequest, NextResponse } from "next/server";
import { SEED_QUESTIONS } from "@/data/seed-questions";
import { evaluateSubmission } from "@/lib/scoring-engine";
import { EvaluationSubmission } from "@/types/submission";

export async function POST(req: NextRequest) {
  try {
    const body: EvaluationSubmission = await req.json();

    if (!body.question_id) {
      return NextResponse.json({ error: "question_id is required" }, { status: 400 });
    }

    const question = SEED_QUESTIONS.find((q) => q.id === body.question_id);
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const result = evaluateSubmission(body, question);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Evaluation error:", error);
    return NextResponse.json(
      { error: "Internal evaluation error", message: error.message },
      { status: 500 }
    );
  }
}
