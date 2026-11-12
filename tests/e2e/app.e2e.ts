import { expect, test } from "@playwright/test";
import { ANSWERS, fakeAnswer } from "./fake-answer";

test("the app manifest makes Bufala installable and a share target", async ({ request }) => {
  const response = await request.get("/manifest.webmanifest");
  expect(response.status()).toBe(200);
  const manifest = await response.json();
  expect(manifest).toMatchObject({
    name: "Bufala",
    start_url: "/",
    display: "standalone",
    share_target: { action: "/", method: "GET", params: { text: "text" } },
  });
  for (const icon of manifest.icons as { src: string }[]) {
    const image = await request.get(icon.src);
    expect(image.status(), icon.src).toBe(200);
    expect(image.headers()["content-type"], icon.src).toBe("image/png");
  }
});

test("every page links the iPhone icon and the manifest", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
  await expect(page.locator('link[rel="manifest"]')).toHaveCount(1);
});

test("a message shared from another app is filled in, checked, and left out of the address", async ({ page }) => {
  await fakeAnswer(page, ANSWERS.scam);
  const text = "Banca Esempio: conto sospeso, accedi su https://banca-esempio.xyz";
  await page.goto(`/?title=Messaggio&text=${encodeURIComponent(text)}&url=${encodeURIComponent("https://banca-esempio.xyz")}`);
  await expect(page.getByRole("heading", { name: "Molto probabilmente è una truffa" })).toBeVisible();
  await expect(page.getByLabel("Incolla qui il messaggio che hai ricevuto")).toHaveValue(`Messaggio\n${text}`);
  await expect(page).toHaveURL(/\/$/);
  // Checking another message starts empty, not with the shared one again.
  await page.getByRole("button", { name: "Controlla un altro messaggio" }).click();
  await expect(page.getByLabel("Incolla qui il messaggio che hai ricevuto")).toHaveValue("");
});

test("when the phone offers installing, our button opens its dialog once", async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("/");
  const button = page.getByRole("button", { name: "Aggiungi Bufala alla schermata Home" });
  await expect(button).toHaveCount(0);
  await page.evaluate(() => {
    const offer = Object.assign(new Event("beforeinstallprompt", { cancelable: true }), {
      prompt: async () => {
        (window as unknown as { prompted: number }).prompted = ((window as unknown as { prompted?: number }).prompted ?? 0) + 1;
      },
    });
    window.dispatchEvent(offer);
  });
  await button.click();
  await expect(button).toHaveCount(0);
  expect(await page.evaluate(() => (window as unknown as { prompted: number }).prompted)).toBe(1);
  await context.close();
});

test("on iPhone Safari, a line explains how to add Bufala", async ({ browser }) => {
  const iphone =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
  for (const standalone of [false, true]) {
    const context = await browser.newContext({ userAgent: iphone, viewport: { width: 390, height: 844 } });
    // Only real Safari has navigator.standalone: false before installing, true after.
    await context.addInitScript((value) => Object.defineProperty(navigator, "standalone", { value }), standalone);
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.getByText("premi il tasto Condividi di Safari")).toHaveCount(standalone ? 0 : 1);
    await context.close();
  }
});
