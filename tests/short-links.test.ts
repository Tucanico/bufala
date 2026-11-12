import { expect, test } from "vitest";
import type { Fetcher } from "../src/lib/check/domain-age";
import { expandShortLinks, findShortLinks } from "../src/lib/check/short-links";

// The part of bit.ly's info page that names the destination, as read on 2026-11-12.
const BITLY_PAGE = `<div class="bitlink--destination-text"> <span class="bitlink-item-label">Destinations</span> <ul> <li>
  <a class="item-detail--url" href="https://poste-consegne.info/p?a=1&amp;b=2" title="x" target="_blank">x</a> </li> </ul> </div>`;

const NOTHING = { destinations: [], disabled: false };

function shorteners(pages: Record<string, Response | (() => Response)>) {
  const asked: string[] = [];
  const fetcher: Fetcher = async (url) => {
    asked.push(url);
    const page = pages[url];
    if (!page) return new Response("not found", { status: 404 });
    return typeof page === "function" ? page() : page.clone();
  };
  return { fetcher, asked };
}

test("finds bit.ly and is.gd links, once each, at most three", () => {
  expect(findShortLinks("bit.ly/aaa https://bit.ly/aaa www.is.gd/bbb tinyurl.com/ccc bit.ly/d1 bit.ly/d2")).toEqual([
    { service: "bit.ly", code: "aaa" },
    { service: "is.gd", code: "bbb" },
    { service: "bit.ly", code: "d1" },
  ]);
});

test("reads the destination from bit.ly's info page and is.gd's lookup", async () => {
  const { fetcher, asked } = shorteners({
    "https://bit.ly/abc+": new Response(BITLY_PAGE, { status: 200 }),
    "https://is.gd/forward.php?format=json&shorturl=xyz": Response.json({ url: "https://esempio.xyz/" }),
  });
  expect(await expandShortLinks("Vedi bit.ly/abc e is.gd/xyz", fetcher)).toEqual({
    destinations: ["https://poste-consegne.info/p?a=1&b=2", "https://esempio.xyz/"],
    disabled: false,
  });
  // Only the shorteners were asked: never the destination site.
  expect(asked).toEqual(["https://bit.ly/abc+", "https://is.gd/forward.php?format=json&shorturl=xyz"]);
});

test("a shortener that doesn't answer, redirects, changes its page or gives an odd address adds nothing", async () => {
  const { fetcher } = shorteners({
    "https://bit.ly/moved+": new Response(null, { status: 301, headers: { location: "https://bitly.com/x" } }),
    "https://bit.ly/changed+": new Response("<html>new design</html>", { status: 200 }),
    "https://is.gd/forward.php?format=json&shorturl=odd": Response.json({ url: "javascript:alert(1)" }),
  });
  expect(await expandShortLinks("bit.ly/moved bit.ly/changed is.gd/odd", fetcher)).toEqual(NOTHING);
  const down: Fetcher = async () => {
    throw new Error("network down");
  };
  expect(await expandShortLinks("bit.ly/abc", down)).toEqual(NOTHING);
});

// is.gd's answers as seen live on 2026-11-12, both with status 200.
const ISGD_DISABLED = {
  errorcode: 2,
  errormessage: "The requested shortened URL has been disabled. It may have been used abusively or in violation of our terms.",
};
const ISGD_MISSING = { errorcode: 1, errormessage: "Sorry, the link you accessed doesn't exist on our service." };

test("a link is.gd switched off is reported, a link that doesn't exist is not", async () => {
  const lookup = "https://is.gd/forward.php?format=json&shorturl=";
  const { fetcher } = shorteners({
    [`${lookup}off`]: Response.json(ISGD_DISABLED),
    [`${lookup}gone`]: Response.json(ISGD_MISSING),
    // Another meaning for error 2 one day must not become a warning.
    [`${lookup}other`]: Response.json({ errorcode: 2, errormessage: "Please try again later." }),
  });
  expect(await expandShortLinks("is.gd/off", fetcher)).toEqual({ destinations: [], disabled: true });
  expect(await expandShortLinks("is.gd/gone is.gd/other", fetcher)).toEqual(NOTHING);
});

test("other shorteners are never asked", async () => {
  const { fetcher, asked } = shorteners({});
  expect(await expandShortLinks("tinyurl.com/abc cutt.ly/def", fetcher)).toEqual(NOTHING);
  expect(asked).toEqual([]);
});
