import { readFile } from "node:fs/promises";

export async function readJsonSubset<T>(url: URL): Promise<T> {
  const raw = await readFile(url, "utf8");
  return JSON.parse(raw) as T;
}
