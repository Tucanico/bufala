import { expect, test } from "vitest";
import { classifyHost, foldConfusables } from "../src/lib/check/links";
import { findHosts } from "../src/lib/check/redact";
import { ORGANISATIONS } from "./fixtures/organisations";

const kindOf = (host: string) => classifyHost(host, ORGANISATIONS).kind;

test("finds link hosts and email domains like the redaction does", () => {
  expect(
    findHosts("Vai su https://www.Poste.it/x, poi su poste-consegne.info/p e scrivi a a.b@poste-help.com. ok.grazie"),
  ).toEqual({ links: ["www.poste.it", "poste-consegne.info"], emailDomains: ["poste-help.com"] });
});

test("an organisation's own domain and its subdomains are official", () => {
  expect(kindOf("poste.it")).toBe("official");
  expect(kindOf("www.poste.it")).toBe("official");
  expect(kindOf("areariservata.posteitaliane.it")).toBe("official");
});

test("a site borrowing a brand name is a look-alike", () => {
  expect(kindOf("poste-consegne.info")).toBe("lookalike");
  expect(kindOf("poste.it.verifica-account.com")).toBe("lookalike");
  expect(kindOf("amaz0n-premi.top")).toBe("lookalike");
  expect(kindOf("amazon-premi.top")).toBe("lookalike");
  expect(kindOf("tim-premi.xyz")).toBe("lookalike");
});

test("look-alike letters from other alphabets are caught through punycode", () => {
  const cyrillic = new URL("https://pоste-sicura.com").hostname; // "о" is Cyrillic
  expect(cyrillic.startsWith("xn--")).toBe(true);
  expect(kindOf(cyrillic)).toBe("lookalike");
});

test("short brand words only match a whole part of the name", () => {
  expect(kindOf("ultimate.com")).toBe("unknown");
  expect(kindOf("timeshare.it")).toBe("unknown");
});

test("link shorteners are recognised", () => {
  expect(kindOf("bit.ly")).toBe("shortened");
  expect(kindOf("www.tinyurl.com")).toBe("shortened");
});

test("folding treats swapped letters and digits as the same", () => {
  expect(foldConfusables("AMAZ0N")).toBe("amazon");
  expect(foldConfusables("paypa1")).toBe("paypal");
  expect(foldConfusables("rnicrosoft")).toBe("microsoft");
});
