import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { ANSWERS, fakeAnswer } from "./fake-answer";

// Automatic accessibility checks (WCAG 2.1 A and AA: contrast, labels, names,
// headings, landmarks) on every page and every answer, in light and dark.
// They catch most mechanical problems, not all: a person with a screen reader
// should still try the site.
async function expectNoViolations(page: Page, what: string) {
  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme });
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const found = violations.map(
      (v) => `${v.id}: ${v.help}\n${v.nodes.map((n) => `  ${n.target.join(" ")} ${n.failureSummary ?? ""}`).join("\n")}`,
    );
    expect(found, `${what}, ${colorScheme}`).toEqual([]);
  }
}

for (const [path, what] of [
  ["/", "start screen"],
  ["/en", "English start screen"],
  ["/chi-siamo", "about page"],
  ["/privacy", "privacy page"],
  ["/en/disclaimer", "English disclaimer"],
  ["/pagina-che-non-esiste", "not-found page"],
] as const) {
  test(`${what} has no accessibility problems`, async ({ page }) => {
    await page.goto(path);
    await page.getByRole("heading", { level: 1 }).waitFor();
    await expectNoViolations(page, what);
  });
}

for (const verdict of ["scam", "suspicious", "no_signs"] as const) {
  test(`the ${verdict} answer has no accessibility problems`, async ({ page }) => {
    await fakeAnswer(page, ANSWERS[verdict]);
    await page.goto("/");
    await page.getByLabel("Incolla qui il messaggio che hai ricevuto").fill("Un messaggio di prova");
    await page.getByRole("button", { name: "Controlla il messaggio" }).click();
    await page.getByRole("button", { name: "Controlla un altro messaggio" }).waitFor();
    await expectNoViolations(page, `${verdict} answer`);
  });
}

test("an error message has no accessibility problems", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Controlla il messaggio" }).click();
  await page.getByText("Incolla prima il messaggio da controllare").waitFor();
  await expectNoViolations(page, "empty-message error");
});
