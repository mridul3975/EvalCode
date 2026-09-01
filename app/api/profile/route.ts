import { NextResponse } from "next/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DEFAULT_PROFILE_STATS } from "@/lib/core/profile-analytics";
import { UserProfileStats } from "@/types/submission";

export async function GET() {
  try {
    const existing = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, "default_user"))
      .limit(1);

    if (existing.length > 0) {
      const row = existing[0];
      const profileData: UserProfileStats = {
        readiness_score: row.readiness_score ?? 0,
        verdict_accuracy: row.verdict_accuracy ?? 0,
        total_evaluations_count: row.total_evaluations_count ?? 0,
        total_mocks_count: row.total_mocks_count ?? 0,
        mock_average_score: row.mock_average_score ?? 0,
        practice_average_score: row.practice_average_score ?? 0,
        current_streak_days: row.current_streak_days ?? 0,
        best_streak_days: row.best_streak_days ?? 0,
        last_active_at: row.last_active_at ? row.last_active_at.toISOString() : new Date().toISOString(),
        dimensional_mastery: row.dimensional_mastery ?? DEFAULT_PROFILE_STATS.dimensional_mastery,
        dimensional_deltas: row.dimensional_deltas ?? DEFAULT_PROFILE_STATS.dimensional_deltas,
        topic_stats: row.topic_stats ?? {},
        defect_stats: row.defect_stats ?? {},
      };
      return NextResponse.json(profileData);
    }

    // Insert default profile on first load
    await db.insert(profiles).values({
      id: "default_user",
      name: "Evaluator Candidate",
      readiness_score: 0,
      verdict_accuracy: 0,
      total_evaluations_count: 0,
      total_mocks_count: 0,
      mock_average_score: 0,
      practice_average_score: 0,
      current_streak_days: 0,
      best_streak_days: 0,
      dimensional_mastery: DEFAULT_PROFILE_STATS.dimensional_mastery,
      dimensional_deltas: DEFAULT_PROFILE_STATS.dimensional_deltas,
      topic_stats: {},
      defect_stats: {},
    });

    return NextResponse.json(DEFAULT_PROFILE_STATS);
  } catch (error) {
    console.error("Failed to fetch profile from Neon DB:", error);
    return NextResponse.json(DEFAULT_PROFILE_STATS);
  }
}

export async function POST(req: Request) {
  try {
    const body: UserProfileStats = await req.json();

    await db
      .insert(profiles)
      .values({
        id: "default_user",
        readiness_score: body.readiness_score,
        verdict_accuracy: body.verdict_accuracy,
        total_evaluations_count: body.total_evaluations_count,
        total_mocks_count: body.total_mocks_count,
        mock_average_score: body.mock_average_score,
        practice_average_score: body.practice_average_score,
        current_streak_days: body.current_streak_days,
        best_streak_days: body.best_streak_days,
        last_active_at: new Date(body.last_active_at),
        dimensional_mastery: body.dimensional_mastery,
        dimensional_deltas: body.dimensional_deltas,
        topic_stats: body.topic_stats,
        defect_stats: body.defect_stats,
        updated_at: new Date(),
      })
      .onConflictDoUpdate({
        target: profiles.id,
        set: {
          readiness_score: body.readiness_score,
          verdict_accuracy: body.verdict_accuracy,
          total_evaluations_count: body.total_evaluations_count,
          total_mocks_count: body.total_mocks_count,
          mock_average_score: body.mock_average_score,
          practice_average_score: body.practice_average_score,
          current_streak_days: body.current_streak_days,
          best_streak_days: body.best_streak_days,
          last_active_at: new Date(body.last_active_at),
          dimensional_mastery: body.dimensional_mastery,
          dimensional_deltas: body.dimensional_deltas,
          topic_stats: body.topic_stats,
          defect_stats: body.defect_stats,
          updated_at: new Date(),
        },
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save profile to Neon DB:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await db
      .insert(profiles)
      .values({
        id: "default_user",
        readiness_score: 0,
        verdict_accuracy: 0,
        total_evaluations_count: 0,
        total_mocks_count: 0,
        mock_average_score: 0,
        practice_average_score: 0,
        current_streak_days: 0,
        best_streak_days: 0,
        dimensional_mastery: DEFAULT_PROFILE_STATS.dimensional_mastery,
        dimensional_deltas: DEFAULT_PROFILE_STATS.dimensional_deltas,
        topic_stats: {},
        defect_stats: {},
      })
      .onConflictDoUpdate({
        target: profiles.id,
        set: {
          readiness_score: 0,
          verdict_accuracy: 0,
          total_evaluations_count: 0,
          total_mocks_count: 0,
          mock_average_score: 0,
          practice_average_score: 0,
          current_streak_days: 0,
          best_streak_days: 0,
          dimensional_mastery: DEFAULT_PROFILE_STATS.dimensional_mastery,
          dimensional_deltas: DEFAULT_PROFILE_STATS.dimensional_deltas,
          topic_stats: {},
          defect_stats: {},
          updated_at: new Date(),
        },
      });

    return NextResponse.json({ success: true, profile: DEFAULT_PROFILE_STATS });
  } catch (error) {
    console.error("Failed to reset profile in Neon DB:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
