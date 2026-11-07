import { expect, test } from "vitest";
import { redact } from "../src/lib/check/redact";

test("full links keep only the site name", () => {
  expect(redact("Verifica qui: https://intesa-verifica.com/login?id=88231 subito")).toBe(
    "Verifica qui: [link: intesa-verifica.com] subito",
  );
  expect(redact("vai su www.poste-sicura.it/abc")).toBe("vai su [link: www.poste-sicura.it]");
});

test("bare domains count as links with a path or a known TLD", () => {
  expect(redact("Paga su poste-consegne.cyou/pacco")).toBe("Paga su [link: poste-consegne.cyou]");
  expect(redact("vai su bit.ly/3xYz")).toBe("vai su [link: bit.ly]");
  expect(redact("controlla poste-it.info")).toBe("controlla [link: poste-it.info]");
});

test("typing slips and abbreviations are left alone", () => {
  expect(redact("ok.grazie a domani")).toBe("ok.grazie a domani");
  expect(redact("Gentile Sig.ra Rossi, ore 10.30")).toBe("Gentile Sig.ra Rossi, ore 10.30");
});

test("email addresses keep only their domain, and are not matched twice", () => {
  expect(redact("Scrivi a Mario.Rossi@Gmail.com")).toBe("Scrivi a [email @gmail.com]");
});

test("look-alike characters in a link show up as punycode", () => {
  // The "о" below is Cyrillic.
  expect(redact("https://pоste.it/x")).toMatch(/^\[link: xn--/);
});

test("IBANs are hidden, without swallowing the next words", () => {
  expect(redact("Bonifico su IT60 X054 2811 1010 0000 0123 456 entro oggi")).toBe(
    "Bonifico su [IBAN] entro oggi",
  );
});

test("card numbers are hidden only when they pass the Luhn check", () => {
  expect(redact("carta 4111 1111 1111 1111 scade")).toBe("carta [card number] scade");
  expect(redact("codice 1234 5678 9012 3456")).toBe("codice 1234 5678 9012 3456");
});

test("phone numbers stay, so the model can spot 'call this number'", () => {
  expect(redact("Chiami il +39 333 123 4567 o lo 899 123 456")).toBe(
    "Chiami il +39 333 123 4567 o lo 899 123 456",
  );
});
