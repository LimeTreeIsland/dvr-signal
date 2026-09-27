import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const read = path => readFileSync(join(root, path), 'utf8');
const parse = path => JSON.parse(read(path)); // JSON is our supported YAML 1.2 subset.
const required = [
  'AGENTS.md', 'README.md', 'LICENSE', 'CONTRIBUTING.md', 'SECURITY.md',
  ...['PROJECT','ARCHITECTURE','LEGAL-BASELINE','PROCEDURAL-RULES','DATA-DICTIONARY',
    'PRIVACY-MODEL','DESIGN-SYSTEM','TOOL-SAFETY','GITHUB-PERMISSIONS','BACKLOG']
    .map(name => `docs/${name}.md`),
  'data/washington/authorities.yaml', 'data/washington/legal-baseline.yaml',
  'data/washington/procedural-rules.yaml', 'data/washington/support-resources.yaml',
  ...['navigator','records','accommodations','decisions','challenge'].map(id => `tools/${id}.yaml`),
  'schemas/procedural-rule.schema.json', 'schemas/tool.schema.json',
  '.github/CODEOWNERS', '.github/workflows/foundation.yml',
];
for (const path of required) check(existsSync(join(root, path)), `Missing ${path}`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }

// Validate the schema keywords used by these two dependency-free contracts.
// A schema expansion requires an accompanying validator update or full validator.
const keywords = new Set(['$schema','type','required','properties','additionalProperties',
  'const','enum','minLength','pattern','items','minItems']);
function validate(value, schema, at) {
  for (const key of Object.keys(schema)) check(keywords.has(key), `${at}: unsupported schema keyword ${key}`);
  const typeOf = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
  if (schema.type) {
    const valid = [schema.type].flat().includes(typeOf);
    check(valid, `${at}: expected ${JSON.stringify(schema.type)}, got ${typeOf}`);
    if (!valid) return;
  }
  if ('const' in schema) check(value === schema.const, `${at}: incorrect constant`);
  if (schema.enum) check(schema.enum.includes(value), `${at}: value outside enum`);
  if (typeof value === 'string') {
    if (schema.minLength) check(value.length >= schema.minLength, `${at}: empty string`);
    if (schema.pattern) check(new RegExp(schema.pattern).test(value), `${at}: pattern mismatch`);
  }
  if (Array.isArray(value)) {
    if (schema.minItems) check(value.length >= schema.minItems, `${at}: insufficient items`);
    if (schema.items) value.forEach((item,i) => validate(item,schema.items,`${at}[${i}]`));
  } else if (value !== null && typeof value === 'object') {
    for (const key of schema.required ?? []) check(Object.hasOwn(value,key), `${at}: missing ${key}`);
    for (const [key,item] of Object.entries(value)) {
      if (schema.properties?.[key]) validate(item,schema.properties[key],`${at}.${key}`);
      else if (schema.additionalProperties === false) check(false,`${at}: unknown ${key}`);
    }
  }
}
function uniqueIds(items, label) {
  check(new Set(items.map(item => item.id)).size === items.length, `${label}: duplicate IDs`);
  return new Set(items.map(item => item.id));
}
try {
  const authorities = parse('data/washington/authorities.yaml').authorities;
  const authorityIds = uniqueIds(authorities,'authorities');
  const rules = parse('data/washington/procedural-rules.yaml').rules;
  const ruleIds = uniqueIds(rules,'rules');
  const ruleSchema = parse('schemas/procedural-rule.schema.json');
  for (const rule of rules) {
    validate(rule,ruleSchema,rule.id);
    check(authorityIds.has(rule.authority_id), `${rule.id}: missing authority`);
    if (rule.enabled) {
      check(rule.review_status === 'approved', `${rule.id}: enabled without approval`);
      check(rule.source_status === 'live_text_checked', `${rule.id}: enabled without live verification`);
      for (const key of ['last_reviewed','reviewer','approval_reference','source_checked_on'])
        check(typeof rule[key] === 'string' && rule[key].trim().length > 0, `${rule.id}: missing ${key}`);
      if (rule.timeframe) check(rule.timeframe.counting_rule_status === 'approved', `${rule.id}: counting rule not approved`);
    }
  }
  const baseline = parse('data/washington/legal-baseline.yaml');
  uniqueIds(baseline.stages,'stages');
  check(baseline.stages.map(s => s.id).join(',') === 'application,eligibility,assessment,ipe,services,employment,closure', 'Baseline spine changed; review required');
  for (const stage of baseline.stages) check(authorityIds.has(stage.authority_id), `${stage.id}: missing authority`);
  const toolSchema = parse('schemas/tool.schema.json');
  for (const id of ['navigator','records','accommodations','decisions','challenge']) {
    const tool = parse(`tools/${id}.yaml`);
    validate(tool,toolSchema,id);
    check(tool.id === id,`${id}: ID differs from filename`);
    for (const ruleId of tool.rule_ids) {
      check(ruleIds.has(ruleId),`${id}: unknown rule ${ruleId}`);
      if (tool.enabled) check(rules.find(r => r.id === ruleId)?.enabled,`${id}: dependency ${ruleId} disabled`);
    }
    if (tool.enabled) check(tool.status === 'active',`${id}: enabled scaffold`);
  }
  parse('data/washington/support-resources.yaml');
  const workflow = read('.github/workflows/foundation.yml');
  check(/permissions:\s*\n  contents: read/.test(workflow),'CI must use explicit read-only contents permission');
  check(!/pull_request_target|secrets\.|: write\b/.test(workflow),'Foundation CI must not use privileged triggers, secrets or write permissions');
  check(/persist-credentials: false/.test(workflow),'Checkout must not persist credentials');
  check(/actions\/checkout@[a-f0-9]{40}\b/.test(workflow),'Checkout must be pinned to a full commit SHA');
  check(/^\* @LimeTreeIsland$/m.test(read('.github/CODEOWNERS')),'Missing owner review routing');
  const ignore = read('.gitignore');
  for (const pattern of ['.env','/private/','/raw-data/','/survey-responses/','/case-records/'])
    check(ignore.split('\n').includes(pattern),`Missing ignore: ${pattern}`);
  for (const folder of ['private','raw-data','survey-responses','contact-lists','case-records','evidence','uploads','project_sources'])
    check(!existsSync(join(root,folder)),`Private-data location inside public source tree: ${folder}`);
  // Check local Markdown document links; remote links require separate source review.
  for (const path of ['README.md',...readdirSync(join(root,'docs')).filter(p => p.endsWith('.md')).map(p => `docs/${p}`)]) {
    for (const match of read(path).matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      const target = match[1].split('#')[0];
      if (target && !/^[a-z]+:/i.test(target))
        check(existsSync(resolve(root,dirname(path),target)),`${path}: broken local link ${target}`);
    }
  }
} catch (error) { errors.push(error.message); }
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('Foundation validation passed: contracts, references, review gates, local links and CI safeguards.');
console.log('This check does not certify legal correctness, anonymity or accessibility.');
