import { expect, test } from "vitest";
import { applyFacts, findFacts } from "../src/lib/check/facts";
import { AMAZON, ORGANISATIONS, POSTE, PREMIUM, TIM } from "./fixtures/organisations";
// PARCELS (ParcelCo) says on its site that it asks for customs duties by message.

const facts = (text: string) => findFacts(text, ORGANISATIONS, PREMIUM);

test("a look-alike site adds a high-risk sign and names what it imitates", () => {
  const found = facts("Il tuo pacco è in giacenza: poste-consegne.info/pacco");
  expect(found.addSigns).toEqual(["lookalike_link"]);
  expect(found.imitated).toBe(POSTE);
  expect(found.organisation).toBe(POSTE);
});

test("a look-alike email address counts too", () => {
  expect(facts("Scrivi a assistenza@amazon-rimborsi.com").addSigns).toEqual(["lookalike_link"]);
});

test("shortened links and premium-rate numbers add their signs", () => {
  expect(facts("Clicca bit.ly/abc oppure chiama il 899 123 456").addSigns).toEqual([
    "shortened_link",
    "premium_number",
  ]);
});

test("a reviewed organisation's own links and numbers remove the matching model signs", () => {
  const found = facts("Poste Italiane: segui la spedizione su https://www.poste.it/cerca o chiama lo 06 0000 1111");
  expect(found.removeSigns).toEqual(["link_to_act", "call_this_number"]);
  expect(applyFacts(["link_to_act", "call_this_number", "urgency"], found)).toEqual(["urgency"]);
});

test("an unreviewed organisation's links and numbers never remove a sign", () => {
  const found = facts("TIM: offerta su https://www.tim.it/offerte, info al 187 000 0000");
  expect(TIM.reviewed).toBeNull();
  expect(found.removeSigns).toEqual([]);
  expect(found.organisation).toBe(TIM);
});

test("one unknown link among official ones keeps the link sign", () => {
  expect(facts("Vai su www.poste.it e poi su poste-verifica.top").removeSigns).toEqual([]);
});

test("the organisation named first in the message is the claimed sender", () => {
  expect(facts("Amazon: il tuo ordine, pagato con PostePay, è in arrivo").organisation).toBe(AMAZON);
  expect(facts("Ciao, ci vediamo domani").organisation).toBeNull();
});

test("names match whole words only", () => {
  expect(facts("Ho visto Timothy ieri").organisation).toBeNull();
});

test("a payment may be genuine only from a reviewed organisation that says it asks, linking only to its own site", () => {
  expect(facts("ParcelCo: paga i dazi su https://www.parcelco.test/dazi").paymentMayBeGenuine).toBe(true);
  expect(facts("ParcelCo: paga i dazi su parcelco-dazi.top/pay").paymentMayBeGenuine).toBe(false);
  expect(facts("ParcelCo: paga i dazi entro oggi").paymentMayBeGenuine).toBe(false);
  expect(facts("ParcelCo: paga su https://www.parcelco.test e su altro-sito.top/x").paymentMayBeGenuine).toBe(false);
  // Poste is reviewed but doesn't say it asks for payment by message.
  expect(facts("Poste Italiane: paga su https://www.poste.it/paga").paymentMayBeGenuine).toBe(false);
});

test("signs added by the facts take their place in the display order", () => {
  const found = facts("Paga qui: poste-consegne.info/pacco");
  expect(applyFacts(["urgency", "asks_for_payment"], found)).toEqual([
    "lookalike_link",
    "asks_for_payment",
    "urgency",
  ]);
});

test("only sites we know nothing about are left for the age check", () => {
  const found = facts("Vai su poste.it, bit.ly/abc, poste-consegne.info e offerta-nuova.xyz");
  expect(found.unknownHosts).toEqual(["offerta-nuova.xyz"]);
});
