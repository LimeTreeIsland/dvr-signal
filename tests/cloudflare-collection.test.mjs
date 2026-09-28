import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const surveyEndpoint = await readFile("functions/api/survey-submit.ts", "utf8");
const contactEndpoint = await readFile("functions/api/contact-submit.ts", "utf8");
const turnstile = await readFile("functions/_shared/turnstile.ts", "utf8");
const publicMetrics = await readFile("functions/api/public/metrics.ts", "utf8");
const aggregateBuilder = await readFile("functions/api/admin/build-aggregate.ts", "utf8");
const publishAggregate = await readFile("functions/api/admin/publish-aggregate.ts", "utf8");
const researchMigration = await readFile("migrations/research/0001_initial.sql", "utf8");
const contactMigration = await readFile("migrations/contact/0001_initial.sql", "utf8");
const dashboard = await readFile("src/pages/dashboard.astro", "utf8");

test("research and contact storage are physically separate by schema", () => {
  assert.match(researchMigration, /CREATE TABLE IF NOT EXISTS survey_responses/);
  assert.doesNotMatch(researchMigration, /\bemail\b/i);
  assert.doesNotMatch(researchMigration, /contact_subscriptions/);

  assert.match(contactMigration, /CREATE TABLE IF NOT EXISTS contact_subscriptions/);
  assert.match(contactMigration, /\bemail\b/i);
  assert.doesNotMatch(contactMigration, /survey_responses|answers_json|response_id/);
});

test("survey endpoint is fail-closed until collection is explicitly enabled", () => {
  assert.match(surveyEndpoint, /COLLECTION_ENABLED !== "true"/);
  assert.match(surveyEndpoint, /RESEARCH_DB/);
  assert.match(surveyEndpoint, /TURNSTILE_SECRET_KEY/);
  assert.match(surveyEndpoint, /isSameOrigin/);
});

test("contact endpoint has an independent collection gate and database", () => {
  assert.match(contactEndpoint, /CONTACT_COLLECTION_ENABLED !== "true"/);
  assert.match(contactEndpoint, /CONTACT_DB/);
  assert.doesNotMatch(contactEndpoint, /RESEARCH_DB|survey_responses|answers_json/);
});

test("Turnstile is validated server-side without forwarding the request IP", () => {
  assert.match(turnstile, /siteverify/);
  assert.match(turnstile, /secret/);
  assert.match(turnstile, /response/);
  assert.doesNotMatch(turnstile, /remoteip|CF-Connecting-IP|x-forwarded-for/i);
});

test("public metrics endpoint only reads published aggregate releases", () => {
  assert.match(publicMetrics, /published_releases/);
  assert.doesNotMatch(publicMetrics, /survey_responses|aggregate_candidates|answers_json/);
  assert.match(publicMetrics, /PUBLIC_METRICS_ENABLED !== "true"/);
});

test("private aggregation is admin-gated and disclosure-controlled", () => {
  assert.match(aggregateBuilder, /AGGREGATION_ADMIN_TOKEN/);
  assert.match(aggregateBuilder, /AGGREGATION_ENABLED !== "true"/);
  assert.match(aggregateBuilder, /suppressCategoricalCells/);
  assert.match(publishAggregate, /AGGREGATION_ADMIN_TOKEN/);
  assert.match(publishAggregate, /aggregate_candidates/);
  assert.match(publishAggregate, /published_releases/);
});

test("dashboard consumes only the public aggregate endpoint", () => {
  assert.match(dashboard, /fetch\("\/api\/public\/metrics"/);
  assert.doesNotMatch(dashboard, /survey_responses|aggregate_candidates|answers_json|RESEARCH_DB/);
  assert.match(dashboard, /DVR Signal survey respondents/);
});
