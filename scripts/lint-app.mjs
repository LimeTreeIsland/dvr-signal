import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const roots = ["src", "tests"];
const forbidden = [
  /\blocalStorage\b/,
  /\bsessionStorage\b/,
  /\bnavigator\.sendBeacon\b/,
  /\bXMLHttpRequest\b/,
];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (/\.(astro|css|js|mjs|ts)$/.test(entry.name)) files.push(full);
  }
  return files;
}

const files = (await Promise.all(roots.map(walk))).flat();
const failures = [];

for (const file of files) {
  const content = await readFile(file, "utf8");
  if (/\t/.test(content)) failures.push(`${file}: tabs are not allowed`);
  if (/ +$/m.test(content)) failures.push(`${file}: trailing whitespace found`);
  for (const pattern of forbidden) {
    if (pattern.test(content)) failures.push(`${file}: forbidden client-storage/network primitive ${pattern}`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Application lint passed for ${files.length} files.`);
