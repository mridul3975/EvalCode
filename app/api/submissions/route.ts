import { NextResponse } from "next/server";
import { db } from "@/db";
import { submissions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { EvaluationSubmission, EvaluationResult } from "@/types/submission";

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(submissions)
      .where(eq(submissions.user_id, "default_user"));

    const result: Record<string, { submission: EvaluationSubmission; result: EvaluationResult }> = {};
    for (const r of rows) {
      result[r.question_id] = {
        submission: r.submission_data,
        result: r.result_data,
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch submissions from Neon DB:", error);
    return NextResponse.json({});
  }
}

export async function POST(req: Request) {
  try {
    const body: {
      questionId: string;
      submission: EvaluationSubmission;
      result: EvaluationResult;
      topic?: string;
      defect?: string;
    } = await req.json();

    const id = `default_user:${body.questionId}`;

    await db
      .insert(submissions)
      .values({
        id,
        user_id: "default_user",
        question_id: body.questionId,
        topic: body.topic,
        defect: body.defect,
        submission_data: body.submission,
        result_data: body.result,
        created_at: new Date(),
      })
      .onConflictDoUpdate({
        target: submissions.id,
        set: {
          topic: body.topic,
          defect: body.defect,
          submission_data: body.submission,
          result_data: body.result,
          created_at: new Date(),
        },
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save submission to Neon DB:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await db.delete(submissions).where(eq(submissions.user_id, "default_user"));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete submissions from Neon DB:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
