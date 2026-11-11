// A deliberately small Markdown reader for the legal pages: headings,
// paragraphs, bullet and numbered lists, bold, italics and code. Enough for
// texts a person or a lawyer edits by hand, without a dependency.

export type Inline = { kind: "text" | "bold" | "italic" | "code" | "open"; text: string };
export type Block =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; inlines: Inline[] }
  | { kind: "list"; ordered: boolean; items: Inline[][] };

// A point still to settle before publishing, written "[DA CONFERMARE ...]",
// "[TO CONFIRM ...]", "[DATA]" or "[DATE]". The page highlights it and shows
// a draft banner while any is left.
const OPEN_POINT = /\[(?:DA CONFERMARE|TO CONFIRM|DATA|DATE)\b[^\]]*\]/;

export function hasOpenPoints(source: string): boolean {
  return OPEN_POINT.test(source);
}

function plain(text: string): Inline[] {
  const splitter = new RegExp(`(${OPEN_POINT.source})`);
  return text
    .split(splitter)
    .filter(Boolean)
    .map((piece) => ({ kind: OPEN_POINT.test(piece) ? "open" : "text", text: piece }));
}

export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  for (const part of text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/)) {
    if (!part) continue;
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      const inner = part.slice(2, -2);
      out.push({ kind: OPEN_POINT.test(inner) ? "open" : "bold", text: inner });
    } else if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      out.push({ kind: "italic", text: part.slice(1, -1) });
    } else if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      out.push({ kind: "code", text: part.slice(1, -1) });
    } else {
      out.push(...plain(part));
    }
  }
  return out;
}

const BULLET = /^[-*]\s+/;
const NUMBER = /^\d+\.\s+/;

export function parseMarkdown(source: string): Block[] {
  const blocks: Block[] = [];
  for (const chunk of source.trim().split(/\n\s*\n/)) {
    const lines = chunk.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.length === 0) continue;
    if (lines.length === 1 && lines[0].startsWith("#")) {
      blocks.push({ kind: "heading", text: lines[0].replace(/^#+\s*/, "") });
    } else if (lines.every((line) => BULLET.test(line)) || lines.every((line) => NUMBER.test(line))) {
      const ordered = NUMBER.test(lines[0]);
      const marker = ordered ? NUMBER : BULLET;
      blocks.push({ kind: "list", ordered, items: lines.map((line) => parseInline(line.replace(marker, ""))) });
    } else {
      blocks.push({ kind: "paragraph", inlines: parseInline(lines.join(" ")) });
    }
  }
  return blocks;
}
