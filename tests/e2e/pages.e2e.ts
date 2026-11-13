import { expect, test } from "@playwright/test";
import { ANSWERS, fakeAnswer } from "./fake-answer";

test("the privacy page shows its text", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Informativa sulla privacy");
  await expect(page.getByRole("heading", { name: "I tuoi diritti" })).toBeVisible();
});

test("the disclaimer has its English address", async ({ page }) => {
  await page.goto("/en/disclaimer");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Disclaimer");
  await expect(page.getByRole("heading", { name: "When in doubt" })).toBeVisible();
});

test("the how-it-works page explains checking, the three answers and installing", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("contentinfo").getByRole("link", { name: "Come funziona" }).click();
  await expect(page).toHaveURL(/\/come-funziona$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Come funziona");
  for (const name of ["Come controllare un messaggio", "Le tre risposte possibili", "Metti Bufala sul telefono"]) {
    await expect(page.getByRole("heading", { name })).toBeVisible();
  }
  await page.getByRole("main").getByRole("link", { name: "Controlla un messaggio" }).click();
  await expect(page.getByLabel("Incolla qui il messaggio che hai ricevuto")).toBeVisible();
});

test("the how-it-works page has its English address, and the language switch keeps the page", async ({ page }) => {
  await page.goto("/en/how-it-works");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("How it works");
  await expect(page.getByRole("heading", { name: "Put Bufala on your phone" })).toBeVisible();
  await page.getByRole("link", { name: "Italiano" }).click();
  await expect(page).toHaveURL(/\/come-funziona$/);
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

test("search engines get a sitemap with every page in both languages", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("/sitemap.xml");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const path of ["/come-funziona<", "/en/how-it-works<", "/chi-siamo<", "/en/about<", "/avvertenze<", "/en/disclaimer<", "/en/privacy<", "/en<"]) {
    expect(sitemap, path).toContain(path);
  }
  expect(sitemap).toContain('hreflang="en"');
});
