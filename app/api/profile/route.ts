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
    const profileData: UserProfileStats = await req.json();

    await db
      .insert(profiles)
      .values({
        id: "default_user",
        name: "Evaluator Candidate",
        readiness_score: profileData.readiness_score,
        verdict_accuracy: profileData.verdict_accuracy,
        total_evaluations_count: profileData.total_evaluations_count,
        total_mocks_count: profileData.total_mocks_count,
        mock_average_score: profileData.mock_average_score,
        practice_average_score: profileData.practice_average_score,
        current_streak_days: profileData.current_streak_days,
        best_streak_days: profileData.best_streak_days,
        last_active_at: new Date(),
        dimensional_mastery: profileData.dimensional_mastery,
        dimensional_deltas: profileData.dimensional_deltas,
        topic_stats: profileData.topic_stats,
        defect_stats: profileData.defect_stats,
      })
      .onConflictDoUpdate({
        target: profiles.id,
        set: {
          readiness_score: profileData.readiness_score,
          verdict_accuracy: profileData.verdict_accuracy,
          total_evaluations_count: profileData.total_evaluations_count,
          total_mocks_count: profileData.total_mocks_count,
          mock_average_score: profileData.mock_average_score,
          practice_average_score: profileData.practice_average_score,
          current_streak_days: profileData.current_streak_days,
          best_streak_days: profileData.best_streak_days,
          last_active_at: new Date(),
          dimensional_mastery: profileData.dimensional_mastery,
          dimensional_deltas: profileData.dimensional_deltas,
          topic_stats: profileData.topic_stats,
          defect_stats: profileData.defect_stats,
        },
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update profile in Neon DB:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
