import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookmarks } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET() {
  try {
    const rows = await db
      .select({ question_id: bookmarks.question_id })
      .from(bookmarks)
      .where(eq(bookmarks.user_id, "default_user"));

    return NextResponse.json(rows.map((r) => r.question_id));
  } catch (error) {
    console.error("Failed to fetch bookmarks from Neon DB:", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const { questionId }: { questionId: string } = await req.json();
    const id = `default_user:${questionId}`;

    const existing = await db
      .select()
      .from(bookmarks)
      .where(and(eq(bookmarks.user_id, "default_user"), eq(bookmarks.question_id, questionId)))
      .limit(1);

    if (existing.length > 0) {
      await db.delete(bookmarks).where(eq(bookmarks.id, id));
    } else {
      await db.insert(bookmarks).values({
        id,
        user_id: "default_user",
        question_id: questionId,
      });
    }

    const all = await db
      .select({ question_id: bookmarks.question_id })
      .from(bookmarks)
      .where(eq(bookmarks.user_id, "default_user"));

    return NextResponse.json(all.map((r) => r.question_id));
  } catch (error) {
    console.error("Failed to toggle bookmark in Neon DB:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await db.delete(bookmarks).where(eq(bookmarks.user_id, "default_user"));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete bookmarks from Neon DB:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
