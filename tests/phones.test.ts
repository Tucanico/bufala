import { expect, test } from "vitest";
import { findPhoneNumbers, isPremium, nationalNumber, officialOwner } from "../src/lib/check/phones";
import { ORGANISATIONS, POSTE, PREMIUM } from "./fixtures/organisations";

test("finds phone numbers in the usual Italian formats", () => {
  expect(findPhoneNumbers("Chiami il +39 333 123 4567 oppure lo 02 9475 1123 o lo 899.123.456")).toEqual([
    "3331234567",
    "0294751123",
    "899123456",
  ]);
});

test("ignores amounts, dates, times, one-time codes and card numbers", () => {
  expect(
    findPhoneNumbers("Paga 1.250 € entro il 30/11 alle 10:24. Codice 482913. Carta 4111 1111 1111 1111."),
  ).toEqual([]);
});

test("a short 89x number counts only after a word about calling", () => {
  expect(findPhoneNumbers("Per sbloccare la SIM chiama il 892 424")).toEqual(["892424"]);
  expect(findPhoneNumbers("Contatta subito il numero 893.112")).toEqual(["893112"]);
  expect(findPhoneNumbers("Il tuo codice è 893412, non darlo a nessuno")).toEqual([]);
});

test("the country code is dropped", () => {
  expect(nationalNumber("+39 06 0000 1111")).toBe("0600001111");
  expect(nationalNumber("0039 333 1234567")).toBe("3331234567");
});

test("premium-rate prefixes are recognised", () => {
  expect(isPremium("899123456", PREMIUM)).toBe(true);
  expect(isPremium("800123456", PREMIUM)).toBe(false);
});

test("an official number is matched to its organisation whatever the spacing", () => {
  expect(officialOwner("0600001111", ORGANISATIONS)).toBe(POSTE);
  expect(officialOwner("0600001112", ORGANISATIONS)).toBeNull();
});
