import { expect, test, type Page } from "@playwright/test";
import { ANSWERS, fakeAnswer } from "./fake-answer";

const MESSAGE = "Banca Esempio: il tuo conto è stato sospeso. Inserisci il codice su http://banca-esempio-verifica.xyz";

const TITLES = {
  scam: "Molto probabilmente è una truffa",
  suspicious: "Sospetto: non fare quello che chiede",
  no_signs: "Nessun segnale di truffa trovato",
} as const;

async function pageWidth(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth);
}

async function check(page: Page, verdict: keyof typeof ANSWERS) {
  await fakeAnswer(page, ANSWERS[verdict]);
  await page.goto("/");
  await page.getByLabel("Incolla qui il messaggio che hai ricevuto").fill(MESSAGE);
  await page.getByRole("button", { name: "Controlla il messaggio" }).click();
  return answerCard(page);
}

// The answer's coloured card (the legend's small squares share its style).
function answerCard(page: Page) {
  return page.locator(".hero", { has: page.getByRole("heading", { level: 2 }) });
}

test("the start screen fits 320 px and wider, in light and dark", async ({ page }) => {
  await page.goto("/");
  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme });
    for (const width of [1280, 390, 320]) {
      await page.setViewportSize({ width, height: 800 });
      expect(await pageWidth(page), `${colorScheme} ${width}px`).toBeLessThanOrEqual(width);
    }
  }
});

test("the three-answers legend shows before a check, beside the form on a computer and below it on a phone", async ({ page }, info) => {
  await page.goto("/");
  const legend = page.getByRole("heading", { name: "Le tre risposte possibili" });
  await expect(legend).toBeVisible();
  const form = (await page.locator("form").boundingBox())!;
  const card = (await legend.boundingBox())!;
  if (info.project.name === "computer") expect(card.x).toBeGreaterThan(form.x + form.width);
  else expect(card.y).toBeGreaterThan(form.y + form.height);
});

test("a chosen screenshot shows its preview and can be removed; a file that isn't an image says so", async ({ page }) => {
  await page.goto("/");
  await page.locator("#screenshot").setInputFiles("tests/fixtures/made-up-bank-sms-dark.png");
  await expect(page.getByAltText("Anteprima dello screenshot da controllare")).toBeVisible();
  await page.getByRole("button", { name: "Togli lo screenshot" }).click();
  await expect(page.getByAltText("Anteprima dello screenshot da controllare")).toHaveCount(0);
  await page.locator("#screenshot").setInputFiles({ name: "nota.txt", mimeType: "text/plain", buffer: Buffer.from("ciao") });
  await expect(page.getByText("Questo file non sembra uno screenshot")).toBeVisible();
});

test("Incolla pastes the clipboard into the box", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.evaluate(() => navigator.clipboard.writeText("Testo copiato"));
  await page.getByRole("button", { name: "Incolla" }).click();
  await expect(page.getByLabel("Incolla qui il messaggio che hai ricevuto")).toHaveValue("Testo copiato");
});

test("a refused paste explains the long-press way", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Incolla" }).click();
  await expect(page.getByText("Non abbiamo trovato un testo da incollare")).toBeVisible();
});

test("an empty check shows its error on screen", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Controlla il messaggio" }).click();
  await expect(page.getByText("Incolla prima il messaggio da controllare")).toBeInViewport();
});

for (const verdict of ["scam", "suspicious", "no_signs"] as const) {
  test(`the ${verdict} answer`, async ({ page }, info) => {
    const hero = await check(page, verdict);
    await expect(hero.getByRole("heading", { name: TITLES[verdict] })).toBeVisible();

    const warning = verdict !== "no_signs";
    await expect(page.getByText("Non aprire link", { exact: true })).toHaveCount(warning ? 1 : 0);
    await expect(page.getByRole("heading", { name: "Hai già cliccato, pagato o dato un codice?" })).toHaveCount(
      warning ? 1 : 0,
    );
    await expect(page.getByText("Ricorda: se ti chiedono soldi o codici")).toBeVisible();

    if (info.project.name === "phone") {
      // It arrives below the form, so the page scrolls to it.
      await expect(hero).toBeInViewport();
    } else {
      // Beside the form, not below it.
      const form = await page.locator("form").boundingBox();
      const card = await hero.boundingBox();
      expect(card!.x).toBeGreaterThan(form!.x + form!.width);
    }

    for (const colorScheme of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme });
      for (const width of [1280, 390, 320]) {
        await page.setViewportSize({ width, height: 800 });
        expect(await pageWidth(page), `${colorScheme} ${width}px`).toBeLessThanOrEqual(width);
      }
    }
  });
}

test("check another message clears the form", async ({ page }) => {
  await check(page, "scam");
  await page.getByRole("button", { name: "Controlla un altro messaggio" }).click();
  await expect(page.getByLabel("Incolla qui il messaggio che hai ricevuto")).toHaveValue("");
  await expect(answerCard(page)).toHaveCount(0);
});

test("the language switch stays on the same page", async ({ page }) => {
  await page.goto("/chi-siamo");
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/about$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("About us");
  await page.getByRole("link", { name: "Italiano" }).click();
  await expect(page).toHaveURL(/\/chi-siamo$/);
});

test("an unknown address shows the Italian not-found page", async ({ page }) => {
  await page.goto("/pagina-che-non-esiste");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Pagina non trovata");
});

test("a warning from Google credits it and links a page about the threat; ours don't", async ({ page }) => {
  await check(page, "dangerous");
  await expect(page.getByText("Secondo Google il link porta probabilmente a un sito pericoloso")).toBeVisible();
  await expect(page.getByRole("link", { name: "Advisory provided by Google" })).toHaveAttribute(
    "href",
    "https://docs.cloud.google.com/web-risk/docs/advisory",
  );
  await expect(page.getByRole("link", { name: "Cos'è il phishing" })).toHaveAttribute("href", "https://www.antiphishing.org/");

  await page.unrouteAll();
  await check(page, "scam");
  await expect(page.getByRole("link", { name: "Advisory provided by Google" })).toHaveCount(0);
});
