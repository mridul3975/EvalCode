import { pgTable, text, timestamp, doublePrecision, integer, jsonb, boolean, bigint, varchar, numeric } from "drizzle-orm/pg-core";
import { UserProfileStats, EvaluationSubmission, EvaluationResult, AssessmentSession } from "@/types/submission";

export const profiles = pgTable("profiles", {
  id: text("id").primaryKey().default("default_user"),
  name: text("name").default("Evaluator Candidate"),
  email: text("email"),
  readiness_score: doublePrecision("readiness_score").default(0),
  verdict_accuracy: doublePrecision("verdict_accuracy").default(0),
  total_evaluations_count: integer("total_evaluations_count").default(0),
  total_mocks_count: integer("total_mocks_count").default(0),
  mock_average_score: doublePrecision("mock_average_score").default(0),
  practice_average_score: doublePrecision("practice_average_score").default(0),
  current_streak_days: integer("current_streak_days").default(0),
  best_streak_days: integer("best_streak_days").default(0),
  last_active_at: timestamp("last_active_at").defaultNow(),
  dimensional_mastery: jsonb("dimensional_mastery").$type<UserProfileStats["dimensional_mastery"]>().default({
    correctness: 0,
    edge_cases: 0,
    complexity: 0,
    explanation: 0,
    communication: 0,
    debugging: 0,
  }),
  dimensional_deltas: jsonb("dimensional_deltas").$type<UserProfileStats["dimensional_deltas"]>().default({
    correctness: 0,
    edge_cases: 0,
    complexity: 0,
    explanation: 0,
    communication: 0,
    debugging: 0,
  }),
  topic_stats: jsonb("topic_stats").$type<UserProfileStats["topic_stats"]>().default({}),
  defect_stats: jsonb("defect_stats").$type<UserProfileStats["defect_stats"]>().default({}),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const submissions = pgTable("submissions", {
  id: text("id").primaryKey(), // user_id:question_id
  user_id: text("user_id").default("default_user"),
  question_id: text("question_id").notNull(),
  topic: text("topic"),
  defect: text("defect"),
  submission_data: jsonb("submission_data").$type<EvaluationSubmission>().notNull(),
  result_data: jsonb("result_data").$type<EvaluationResult>().notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const assessmentSessions = pgTable("assessment_sessions", {
  id: text("id").primaryKey(),
  user_id: text("user_id").default("default_user"),
  session_data: jsonb("session_data").$type<AssessmentSession>().notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const bookmarks = pgTable("bookmarks", {
  id: text("id").primaryKey(), // user_id:question_id
  user_id: text("user_id").default("default_user").notNull(),
  question_id: text("question_id").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const oaAssessments = pgTable("oa_assessments", {
  id: text("id").primaryKey(),
  user_id: text("user_id").default("default_user"),
  company_profile: varchar("company_profile", { length: 64 }).notNull(),
  problem_id: text("problem_id").notNull(),
  submitted_code: text("submitted_code").notNull(),
  language: varchar("language", { length: 32 }).notNull(),
  tests_passed: integer("tests_passed").notNull(),
  total_tests: integer("total_tests").notNull(),
  time_spent_seconds: integer("time_spent_seconds").notNull(),
  approach_explanation: text("approach_explanation"),
  claimed_time_complexity: varchar("claimed_time_complexity", { length: 32 }),
  claimed_space_complexity: varchar("claimed_space_complexity", { length: 32 }),
  gemini_follow_ups: jsonb("gemini_follow_ups"), // [{ questionId, question, userAnswer, score, feedback }]
  overall_score: numeric("overall_score", { precision: 5, scale: 2 }).notNull(),
  correctness_score: numeric("correctness_score", { precision: 5, scale: 2 }).notNull(),
  quality_score: numeric("quality_score", { precision: 5, scale: 2 }).notNull(),
  complexity_score: numeric("complexity_score", { precision: 5, scale: 2 }).notNull(),
  communication_score: numeric("communication_score", { precision: 5, scale: 2 }).notNull(),
  hiring_bar_verdict: varchar("hiring_bar_verdict", { length: 32 }).notNull(), // 'STRONG_PASS', 'PASS', 'BORDERLINE', 'FAIL'
  created_at: timestamp("created_at").defaultNow(),
});

