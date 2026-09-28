PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS survey_responses (
  response_id TEXT PRIMARY KEY,
  submitted_at TEXT NOT NULL,
  survey_version TEXT NOT NULL,
  consent_version TEXT NOT NULL,
  respondent_cohort TEXT NOT NULL,
  answers_json TEXT NOT NULL CHECK (json_valid(answers_json))
);

CREATE INDEX IF NOT EXISTS idx_survey_responses_submitted_at
  ON survey_responses(submitted_at);

CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_version
  ON survey_responses(survey_version);

CREATE TABLE IF NOT EXISTS aggregate_candidates (
  release_id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  data_through TEXT NOT NULL,
  survey_version TEXT NOT NULL,
  metric_version TEXT NOT NULL,
  source_row_count INTEGER NOT NULL CHECK (source_row_count >= 0),
  aggregate_json TEXT NOT NULL CHECK (json_valid(aggregate_json))
);

CREATE TABLE IF NOT EXISTS published_releases (
  release_id TEXT PRIMARY KEY,
  published_at TEXT NOT NULL,
  data_through TEXT NOT NULL,
  survey_version TEXT NOT NULL,
  metric_version TEXT NOT NULL,
  aggregate_json TEXT NOT NULL CHECK (json_valid(aggregate_json))
);

CREATE INDEX IF NOT EXISTS idx_published_releases_published_at
  ON published_releases(published_at);
