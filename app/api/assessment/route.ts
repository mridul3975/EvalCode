import { NextResponse } from "next/server";
import { db } from "@/db";
import { assessmentSessions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { AssessmentSession } from "@/types/submission";

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(assessmentSessions)
      .where(eq(assessmentSessions.user_id, "default_user"))
      .orderBy(desc(assessmentSessions.created_at));

    const history: AssessmentSession[] = rows.map((r) => r.session_data);
    return NextResponse.json(history);
  } catch (error) {
    console.error("Failed to fetch assessment history from Neon DB:", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const session: AssessmentSession = await req.json();

    await db
      .insert(assessmentSessions)
      .values({
        id: session.id,
        user_id: "default_user",
        session_data: session,
        created_at: new Date(session.start_time),
      })
      .onConflictDoUpdate({
        target: assessmentSessions.id,
        set: {
          session_data: session,
        },
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save assessment session to Neon DB:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await db.delete(assessmentSessions).where(eq(assessmentSessions.user_id, "default_user"));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete assessment history from Neon DB:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
