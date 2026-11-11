import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { hasOpenPoints } from "../../src/lib/legal-markdown";
import { ANSWERS, fakeAnswer } from "./fake-answer";

const stillDraft = hasOpenPoints(readFileSync("src/content/legal/privacy.it.md", "utf8"));

test("the privacy page shows its text, and a draft banner while points are open", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Informativa sulla privacy");
  await expect(page.getByRole("heading", { name: "I tuoi diritti" })).toBeVisible();
  await expect(page.getByText("Bozza: questo testo non è ancora approvato")).toHaveCount(stillDraft ? 1 : 0);
});

test("the disclaimer has its English address", async ({ page }) => {
  await page.goto("/en/disclaimer");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Disclaimer");
  await expect(page.getByRole("heading", { name: "When in doubt" })).toBeVisible();
});

test("the footer links to both legal pages", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("contentinfo").getByRole("link", { name: "Avvertenze" }).click();
  await expect(page).toHaveURL(/\/avvertenze$/);
  await page.getByRole("contentinfo").getByRole("link", { name: "Privacy" }).click();
  await expect(page).toHaveURL(/\/privacy$/);
});

test("every answer links to the disclaimer", async ({ page }) => {
  await fakeAnswer(page, ANSWERS.no_signs);
  await page.goto("/");
  await page.getByLabel("Incolla qui il messaggio che hai ricevuto").fill("Un messaggio di prova");
  await page.getByRole("button", { name: "Controlla il messaggio" }).click();
  await expect(page.getByText("non può garantire che un messaggio sia sicuro")).toBeVisible();
  await page.getByRole("link", { name: "Leggi le avvertenze" }).click();
  await expect(page).toHaveURL(/\/avvertenze$/);
});

for (const [path, title] of [
  ["/", "Bufala"],
  ["/en", "Bufala"],
] as const) {
  test(`a shared link to ${path} gets a title and a picture`, async ({ page, request }) => {
    await page.goto(path);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", title);
    const image = await page.locator('meta[property="og:image"]').getAttribute("content");
    // An absolute address, as previews need. Locally Next.js writes it with
    // its default port; on Vercel it uses the deployment's own address.
    const url = new URL(image!);
    const response = await request.get(url.pathname + url.search, { maxRedirects: 0 });
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe("image/png");
  });
}
