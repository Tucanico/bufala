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
    const { case: c } = await emailToCase(eml(PHISHING), "real-poste", { replace: PRIVATE });
    expect(c.text.startsWith("Da: Poste Italiane <no-reply@poste-verifica.top>\nOggetto: Il suo conto è sospeso\n\n")).toBe(true);
    expect(c.text).toContain("il suo conto è sospeso");
    expect(c.text).toContain("https://poste-verifica.top/login");
    expect(c.text).toContain("Accedi qui (https://poste-verifica.top/login?u=");
    expect(c.text).toContain("Grazie per l'attenzione, è urgente: € 1,99.");
    expect(c.text).not.toContain("PLAIN TEXT PART");
    expect(c).toMatchObject({ id: "real-poste", verdict: ["suspicious", "scam"] });
  });

  test("replaces the recipient's name, addresses and private details", async () => {
    const { case: c } = await emailToCase(eml(PHISHING), "real-poste", { replace: PRIVATE });
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

  test("only the visible text counts towards the cut; long link addresses don't", async () => {
    const longLink = `https://track.example.top/${"x".repeat(2000)}`;
    const html = `<p>${"Testo. ".repeat(500)}</p><p><a href="${longLink}">Clicca qui</a></p>`;
    const { case: c, notes } = await emailToCase(eml(html), "real-long-link");
    expect(c.text).toContain(`Clicca qui (${longLink})`);
    expect(notes.some((note) => note.startsWith("cut from"))).toBe(false);
  });

  test("leaves out text hidden from the reader, and says so", async () => {
    const html =
      `<div style="display:none;max-height:0;overflow:hidden">PREVIEW FILLER <div>nested</div></div>` +
      `<p>Testo visibile.</p><span style="opacity:0">zero</span><img style="display: none" src="x.png">` +
      `<div style="font-size:0;line-height:0"><span style="font-size:14px">Profilo visibile</span></div>`;
    const { case: c, notes } = await emailToCase(eml(html), "real-hidden");
    expect(c.text).toContain("Testo visibile.");
    // font-size:0 is a layout trick: what's inside sets its own size.
    expect(c.text).toContain("Profilo visibile");
    expect(c.text).not.toMatch(/PREVIEW|nested|zero/);
    expect(notes).toContain("3 hidden block(s) left out");
  });

  test("shows what a phone shows: the phone layout, not the computer one, and blocks hidden only in Outlook", async () => {
    const html =
      `<style>.desk { display: block; } @media screen and (min-width:601px) { .m-hd { display: none; } }` +
      ` @media screen and (max-width:600px) { .m-h { display: none !important; } .m-hd { display: block !important; } }</style>` +
      `<a class="m-hd" style="display:none;max-height:0;overflow:hidden" href="https://dating.example.top/r">Rispondi al suo messaggio</a>` +
      `<div style="mso-hide:all">Solo fuori da Outlook</div><p class="m-h desk">Copia per computer</p>`;
    const { case: c, notes } = await emailToCase(eml(html), "real-phone-only");
    expect(c.text).toContain("Rispondi al suo messaggio (https://dating.example.top/r)");
    expect(c.text).toContain("Solo fuori da Outlook");
    expect(c.text).not.toContain("Copia per computer");
    expect(notes).toContain("1 hidden block(s) left out");
  });

  test("with your own addresses given, a decoy recipient and sender stay as they are", async () => {
    const decoy = eml(PHISHING)
      .replace(`From: "Poste Italiane" <no-reply@poste-verifica.top>`, `From: "Chloe Neri" <chloe.neri@example.net>`)
      .replace(`To: "Giulia Bianchi" <${ADDRESS}>`, `To: "Chloe Neri" <chloe.neri@example.net>`);
    const { case: c } = await emailToCase(decoy, "real-decoy", { me: [ADDRESS] });
    expect(c.text.startsWith("Da: Chloe Neri <chloe.neri@example.net>\n")).toBe(true);
    // Your address in the body and the links is still replaced.
    expect(c.text.toLowerCase()).not.toContain("giulia.bianchi");
    expect(c.text).toContain("mario.rossi@example.com");
  });
});
