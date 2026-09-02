import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  console.log("Applying tables to Neon PostgreSQL...");

  await sql`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY DEFAULT 'default_user',
      name TEXT DEFAULT 'Evaluator Candidate',
      email TEXT,
      readiness_score DOUBLE PRECISION DEFAULT 0,
      verdict_accuracy DOUBLE PRECISION DEFAULT 0,
      total_evaluations_count INTEGER DEFAULT 0,
      total_mocks_count INTEGER DEFAULT 0,
      mock_average_score DOUBLE PRECISION DEFAULT 0,
      practice_average_score DOUBLE PRECISION DEFAULT 0,
      current_streak_days INTEGER DEFAULT 0,
      best_streak_days INTEGER DEFAULT 0,
      last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      dimensional_mastery JSONB DEFAULT '{"correctness":0,"edge_cases":0,"complexity":0,"explanation":0,"communication":0,"debugging":0}'::jsonb,
      dimensional_deltas JSONB DEFAULT '{"correctness":0,"edge_cases":0,"complexity":0,"explanation":0,"communication":0,"debugging":0}'::jsonb,
      topic_stats JSONB DEFAULT '{}'::jsonb,
      defect_stats JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      user_id TEXT DEFAULT 'default_user',
      question_id TEXT NOT NULL,
      topic TEXT,
      defect TEXT,
      submission_data JSONB NOT NULL,
      result_data JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`DROP TABLE IF EXISTS assessment_sessions`;

  await sql`
    CREATE TABLE assessment_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT DEFAULT 'default_user',
      session_data JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS bookmarks (
      id TEXT PRIMARY KEY,
      user_id TEXT DEFAULT 'default_user' NOT NULL,
      question_id TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS oa_assessments (
      id TEXT PRIMARY KEY,
      user_id TEXT DEFAULT 'default_user',
      company_profile VARCHAR(64) NOT NULL,
      problem_id TEXT NOT NULL,
      submitted_code TEXT NOT NULL,
      language VARCHAR(32) NOT NULL,
      tests_passed INTEGER NOT NULL,
      total_tests INTEGER NOT NULL,
      time_spent_seconds INTEGER NOT NULL,
      approach_explanation TEXT,
      claimed_time_complexity VARCHAR(32),
      claimed_space_complexity VARCHAR(32),
      gemini_follow_ups JSONB,
      overall_score NUMERIC(5, 2) NOT NULL,
      correctness_score NUMERIC(5, 2) NOT NULL,
      quality_score NUMERIC(5, 2) NOT NULL,
      complexity_score NUMERIC(5, 2) NOT NULL,
      communication_score NUMERIC(5, 2) NOT NULL,
      hiring_bar_verdict VARCHAR(32) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  console.log("All tables successfully synced to Neon PostgreSQL!");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
