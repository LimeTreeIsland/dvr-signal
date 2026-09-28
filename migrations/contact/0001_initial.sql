PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS contact_subscriptions (
  subscription_id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  email TEXT NOT NULL,
  consent_version TEXT NOT NULL,
  purpose TEXT NOT NULL,
  unsubscribed_at TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_contact_subscriptions_email_purpose
  ON contact_subscriptions(email, purpose);
