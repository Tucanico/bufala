import type { Organisation, PremiumPrefix } from "./organisations";

// A phone-looking run: an optional +39 or 0039, then 8 to 11 digits with single
// spaces, dots or dashes between them. At least 8 digits, so a 6-digit
// one-time code isn't read as a number to call; the lookarounds keep it from
// starting or ending inside a longer number, such as a card number.
const PHONE = /(?<![\w+])(?<!\d[ .-])(?:\+39|0039)?[ ]?\d(?:[ .-]?\d){7,10}(?![ .-]?\d)(?!\w)/g;

export function nationalNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (raw.trim().startsWith("+39")) return digits.slice(2);
  if (digits.startsWith("0039")) return digits.slice(4);
  return digits;
}

// Premium-rate numbers can be as short as 6 digits (892 + 3 digits), too short
// for the rule above without catching one-time codes such as "893412". So a
// short 89x number only counts within a few words after a word about calling:
// "chiama il 892 424" counts, "il codice è 893412" doesn't.
const CALL_THEN_89X =
  /(?:chiam|telefon|numer|contatt|call|phone|dial|ring)\p{L}*\P{L}{1,4}(?:\p{L}+\P{L}{1,3}){0,2}?(89\d(?:[ .-]?\d){3,6})(?![ .-]?\d)/giu;

export function findPhoneNumbers(text: string): string[] {
  const long = [...text.matchAll(PHONE)].map((match) => nationalNumber(match[0]));
  const short = [...text.matchAll(CALL_THEN_89X)].map((match) => nationalNumber(match[1]));
  return [...new Set([...long, ...short])];
}

export function isPremium(number: string, prefixes: PremiumPrefix[]): boolean {
  return prefixes.some(({ prefix }) => number.startsWith(prefix));
}

export function officialOwner(number: string, organisations: Organisation[]): Organisation | null {
  return (
    organisations.find((organisation) =>
      organisation.phones.some((phone) => nationalNumber(phone.number) === number),
    ) ?? null
  );
}
