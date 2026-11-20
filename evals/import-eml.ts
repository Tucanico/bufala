import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import type { EvalCase } from "./cases.ts";
import { emailToCase } from "./email-case.ts";

// `npm run eval:import`: every .eml file in evals/real/ (gitignored) becomes a
// test case in evals/real/cases.json, for `npm run eval:real`. The recipient's
// name and addresses come from the email itself; anything else to hide (a phone
// number, a street) goes in evals/real/private.json as { "replace": [...] }.
// Running it again keeps the verdict, signs and sender already edited in
// cases.json.

const DIR = new URL("./real/", import.meta.url);
const OUT = new URL("cases.json", DIR);
const PRIVATE = new URL("private.json", DIR);

function slug(fileName: string): string {
  const base = fileName
    .replace(/\.eml$/i, "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
  return `real-${base || "email"}`;
}

function readJson<T>(file: URL, fallback: T): T {
  return existsSync(file) ? (JSON.parse(readFileSync(file, "utf8")) as T) : fallback;
}

mkdirSync(DIR, { recursive: true });
const files = readdirSync(DIR).filter((name) => name.toLowerCase().endsWith(".eml")).sort();
if (files.length === 0) {
  console.log("No .eml files in evals/real/. Save the emails there (Gmail: ⋮ > Download message; Outlook: … > Save as) and run this again.");
  process.exit(0);
}

const privateStrings = readJson<{ replace?: string[] }>(PRIVATE, {}).replace ?? [];
const edited = new Map(readJson<EvalCase[]>(OUT, []).map((c) => [c.id, c]));
const cases: EvalCase[] = [];
const taken = new Set<string>();

for (const file of files) {
  let id = slug(file);
  for (let n = 2; taken.has(id); n++) id = `${slug(file)}-${n}`;
  taken.add(id);

  const { case: fresh, notes } = await emailToCase(readFileSync(new URL(file, DIR)), id, privateStrings);
  const before = edited.get(id);
  cases.push(before ? { ...fresh, verdict: before.verdict, signs: before.signs, sender: before.sender } : fresh);

  const [from, subject] = fresh.text.split("\n");
  console.log(`${id}\n  ${from}\n  ${subject}\n  ${fresh.text.length} characters${notes.map((note) => `\n  ${note}`).join("")}`);
}

writeFileSync(OUT, `${JSON.stringify(cases, null, 2)}\n`);
console.log(`\n${cases.length} case(s) in evals/real/cases.json. Read them before \`npm run eval:real\`, which is paid.`);
