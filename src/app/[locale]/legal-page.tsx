import { readFileSync } from "node:fs";
import path from "node:path";
import { parseMarkdown, type Inline } from "@/lib/legal-markdown";

// The texts live in src/content/legal as plain Markdown, one file per page and
// language, so they can be edited (and checked by a lawyer) without code.
export function readLegalText(page: "privacy" | "disclaimer", locale: string) {
  return readFileSync(path.join(process.cwd(), "src/content/legal", `${page}.${locale}.md`), "utf8");
}

function Inlines({ inlines }: { inlines: Inline[] }) {
  return inlines.map((inline, i) => {
    switch (inline.kind) {
      case "bold":
        return <strong key={i}>{inline.text}</strong>;
      case "italic":
        return <em key={i}>{inline.text}</em>;
      case "code":
        return (
          <code key={i} className="rounded bg-field px-1 text-[0.9em]">
            {inline.text}
          </code>
        );
      case "open":
        return (
          <mark key={i} className="rounded bg-suspicious-soft px-1 font-bold text-suspicious">
            {inline.text}
          </mark>
        );
      default:
        return inline.text;
    }
  });
}

export function LegalPage({ title, source }: { title: string; source: string }) {
  return (
    <main className="mx-auto max-w-2xl px-5 pb-12 pt-2">
      <h1 className="mt-5 font-display text-[2rem] font-extrabold leading-[1.08] tracking-[-0.03em]">{title}</h1>
      <article className="card mt-5 p-5 text-[0.95rem] leading-[1.55] [overflow-wrap:anywhere] sm:p-7">
        {parseMarkdown(source).map((block, i) => {
          if (block.kind === "heading") {
            return (
              <h2 key={i} className="mt-7 font-display text-[1.2rem] font-bold tracking-[-0.01em] first:mt-0">
                {block.text}
              </h2>
            );
          }
          if (block.kind === "list") {
            const List = block.ordered ? "ol" : "ul";
            return (
              <List key={i} className={`mt-3 grid gap-2 pl-6 ${block.ordered ? "list-decimal" : "list-disc"}`}>
                {block.items.map((item, j) => (
                  <li key={j}>
                    <Inlines inlines={item} />
                  </li>
                ))}
              </List>
            );
          }
          return (
            <p key={i} className="mt-3 first:mt-0">
              <Inlines inlines={block.inlines} />
            </p>
          );
        })}
      </article>
    </main>
  );
}
