import { describe, expect, test } from "vitest";
import { emailToCase } from "../evals/email-case";
import { MAX_MESSAGE_LENGTH } from "../src/lib/check/limits";

// A made-up phishing email to a made-up person: the converter must keep what the
// person sees and the real link addresses, and drop every detail of theirs.
const ADDRESS = "giulia.bianchi@example.org";
const ADDRESS_BASE64 = Buffer.from(ADDRESS).toString("base64").replace(/=+$/, "");

function eml(html: string): string {
  const wrapped = Buffer.from(html).toString("base64").replace(/.{76}/g, "$&\r\n");
  const subject = `=?utf-8?B?${Buffer.from("Il suo conto è sospeso").toString("base64")}?=`;
  return [
    `From: "Poste Italiane" <no-reply@poste-verifica.top>`,
    `To: "Giulia Bianchi" <${ADDRESS}>`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="b1"`,
    "",
    "--b1",
    "Content-Type: text/plain; charset=utf-8",
    "",
    "THE PLAIN TEXT PART SAYS SOMETHING ELSE",
    "--b1",
    "Content-Type: text/html; charset=utf-8",
    "Content-Transfer-Encoding: base64",
    "",
    wrapped,
    "--b1--",
    "",
  ].join("\r\n");
}

const PHISHING = `<html><body>
<p>Gentile Giulia Bianchi,</p>
<p>il suo conto è sospeso. <a href="https://poste-verifica.top/login?u=giulia.bianchi%40example.org&amp;t=${ADDRESS_BASE64}">Accedi qui</a></p>
<p>Ciao Giulia, la richiamiamo al 3331234567 (o +39 333 123 4567, 333.123.4567) o scriva a ${ADDRESS}.</p>
<p>Spedizione a: Via Garibaldi 12, Torino. Pratica 13331234567.</p>
<p>Grazie per l&#39;attenzione, &egrave; urgente: &euro;&nbsp;1,99.</p>
</body></html>`;

const PRIVATE = ["+39 333 123 4567", "Via Garibaldi 12"];

describe("emailToCase", () => {
  test("shows sender, subject and the HTML body with each link's address", async () => {
    const { case: c } = await emailToCase(eml(PHISHING), "real-poste", PRIVATE);
    expect(c.text.startsWith("Da: Poste Italiane <no-reply@poste-verifica.top>\nOggetto: Il suo conto è sospeso\n\n")).toBe(true);
    expect(c.text).toContain("il suo conto è sospeso");
    expect(c.text).toContain("https://poste-verifica.top/login");
    expect(c.text).toContain("Accedi qui (https://poste-verifica.top/login?u=");
    expect(c.text).toContain("Grazie per l'attenzione, è urgente: € 1,99.");
    expect(c.text).not.toContain("PLAIN TEXT PART");
    expect(c).toMatchObject({ id: "real-poste", verdict: ["suspicious", "scam"] });
  });

  test("replaces the recipient's name, addresses and private details", async () => {
    const { case: c } = await emailToCase(eml(PHISHING), "real-poste", PRIVATE);
    for (const personal of ["giulia", "bianchi", "%40example.org", "333 123 4567", "333.123.4567", "via garibaldi"]) {
      expect(c.text.toLowerCase()).not.toContain(personal);
    }
    expect(c.text).not.toMatch(/(?<!\d)3331234567/);
    expect(c.text).not.toContain(ADDRESS_BASE64);
    expect(c.text).toContain("Gentile Mario Rossi,");
    expect(c.text).toContain("Ciao Mario,");
    expect(c.text).toContain("mario.rossi@example.com");
    expect(c.text).toContain("[privato], Torino");
    // A longer number that only contains the phone's digits is left alone.
    expect(c.text).toContain("Pratica 13331234567");
  });

  test("cuts a long email where the app cuts a paste, and says so", async () => {
    const long = `<p>${"Testo lungo. ".repeat(500)}</p>`;
    const { case: c, notes } = await emailToCase(eml(long), "real-long");
    expect(c.text).toHaveLength(MAX_MESSAGE_LENGTH);
    expect(notes.some((note) => note.startsWith("cut from"))).toBe(true);
  });
});
