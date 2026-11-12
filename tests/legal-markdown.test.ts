import { readdirSync, readFileSync } from "node:fs";
import { expect, test } from "vitest";
import { parseInline, parseMarkdown } from "../src/lib/legal-markdown";

test("headings, paragraphs and both kinds of list", () => {
  const blocks = parseMarkdown("## Title\n\nOne line\nsame paragraph.\n\n- a\n- b\n\n1. first\n2. second\n");
  expect(blocks.map((b) => b.kind)).toEqual(["heading", "paragraph", "list", "list"]);
  expect(blocks[0]).toEqual({ kind: "heading", text: "Title" });
  expect(blocks[1]).toEqual({ kind: "paragraph", inlines: [{ kind: "text", text: "One line same paragraph." }] });
  expect(blocks[2]).toMatchObject({ kind: "list", ordered: false });
  expect(blocks[3]).toMatchObject({ kind: "list", ordered: true });
});

test("bold, italics, code and open points", () => {
  expect(parseInline("a **b** *c* `d` **[DA CONFERMARE: x]** e [DATE] f")).toEqual([
    { kind: "text", text: "a " },
    { kind: "bold", text: "b" },
    { kind: "text", text: " " },
    { kind: "italic", text: "c" },
    { kind: "text", text: " " },
    { kind: "code", text: "d" },
    { kind: "text", text: " " },
    { kind: "open", text: "[DA CONFERMARE: x]" },
    { kind: "text", text: " e " },
    { kind: "open", text: "[DATE]" },
    { kind: "text", text: " f" },
  ]);
});

test("ordinary brackets are not open points", () => {
  expect(parseInline("a [note] in brackets")).toEqual([{ kind: "text", text: "a [note] in brackets" }]);
});

// Each legal page exists in every language, with the same sections in order.
test("every legal text exists in Italian and English with matching sections", () => {
  const files = readdirSync("src/content/legal");
  for (const page of ["privacy", "disclaimer"]) {
    const headings = (locale: string) =>
      parseMarkdown(readFileSync(`src/content/legal/${page}.${locale}.md`, "utf8")).filter((b) => b.kind === "heading")
        .length;
    expect(files).toContain(`${page}.it.md`);
    expect(files).toContain(`${page}.en.md`);
    expect(headings("en")).toBe(headings("it"));
  }
});
