import { expect, test } from "vitest";
import enMessages from "../messages/en.json";
import itMessages from "../messages/it.json";
import { SENDER_TYPES, VERDICTS, WARNING_SIGNS } from "../src/lib/check/schema";

const locales = { it: itMessages, en: enMessages };

function flatten(tree: object, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") out[path] = value;
    else Object.assign(out, flatten(value, path));
  }
  return out;
}

test("every locale has exactly the Italian keys", () => {
  const italianKeys = Object.keys(flatten(itMessages)).sort();
  for (const messages of Object.values(locales)) {
    expect(Object.keys(flatten(messages)).sort()).toEqual(italianKeys);
  }
});

// The model only returns codes, so every code needs our own wording.
test("every code the model can return has a translation", () => {
  const keys = Object.keys(flatten(itMessages));
  for (const sign of WARNING_SIGNS) expect(keys).toContain(`result.signs.${sign}`);
  for (const sender of SENDER_TYPES) expect(keys).toContain(`result.safeStep.${sender}`);
  for (const verdict of VERDICTS) expect(keys).toContain(`result.verdict.${verdict}.title`);
});

test.each(Object.entries(locales))("%s strings are not empty", (_, messages) => {
  for (const [key, value] of Object.entries(flatten(messages))) {
    expect(value.trim(), key).not.toBe("");
  }
});

// House style for anything users read: no em dash inside a sentence.
test.each(Object.entries(locales))("%s strings have no em dash", (_, messages) => {
  for (const [key, value] of Object.entries(flatten(messages))) {
    expect(value, key).not.toContain("—");
  }
});
