import AxeBuilder from "@axe-core/playwright";
import { expect, type Locator, type Page } from "@playwright/test";

/** Fallos de contraste / a11y graves (WCAG AA). */
export async function expectAccessible(page: Page, context?: string) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .disableRules(["region"])
    .analyze();

  const blockers = results.violations.filter((v) =>
    ["critical", "serious"].includes(v.impact ?? ""),
  );

  expect(
    blockers,
    [
      context ? `[${context}]` : "",
      "Violaciones a11y graves:",
      ...blockers.map(
        (v) =>
          `- ${v.id} (${v.impact}): ${v.help} [${v.nodes.length} nodos]`,
      ),
    ]
      .filter(Boolean)
      .join("\n"),
  ).toEqual([]);
}

/** Controles táctiles / botones: al menos ~44px de alto. */
export async function expectTouchTarget(locator: Locator, label: string) {
  const box = await locator.boundingBox();
  expect(box, `${label} debe ser visible`).not.toBeNull();
  expect(
    box!.height,
    `${label} alto insuficiente (${box!.height}px)`,
  ).toBeGreaterThanOrEqual(40);
  expect(
    box!.width,
    `${label} ancho insuficiente (${box!.width}px)`,
  ).toBeGreaterThanOrEqual(40);
}

async function waitForAuthSuccess(page: Page, label: string) {
  const home = page.getByRole("heading", { name: "Inicio" });

  try {
    await home.waitFor({ state: "visible", timeout: 25_000 });
  } catch {
    const alertText = (
      await page
        .locator('[role="alert"]')
        .allTextContents()
        .catch(() => [])
    )
      .map((t) => t.trim())
      .filter(Boolean)
      .join(" | ");

    throw new Error(
      `${label} no llegó a Inicio. URL=${page.url()}${
        alertText ? ` Alert=${alertText}` : ""
      }`,
    );
  }

  await expect(home).toBeVisible();
}

export async function loginDemo(page: Page) {
  await page.goto("/login");

  const demoBtn = page.getByRole("button", { name: "Entrar al modo Demo" });
  await expect(demoBtn).toBeEnabled();

  await Promise.all([
    page
      .waitForResponse(
        (res) =>
          res.url().includes("/auth/v1/token") && res.request().method() === "POST",
        { timeout: 20_000 },
      )
      .catch(() => null),
    demoBtn.click(),
  ]);

  await waitForAuthSuccess(page, "Demo login");
}

export async function loginFamily(page: Page) {
  const user = process.env.E2E_FAMILY_USER ?? "vacavzla";
  const pass = process.env.E2E_FAMILY_PASSWORD ?? "vacavzla";

  await page.goto("/login");
  await page.getByLabel("Usuario").fill(user);
  await page.getByLabel("Contraseña").fill(pass);

  await Promise.all([
    page
      .waitForResponse(
        (res) =>
          res.url().includes("/auth/v1/token") && res.request().method() === "POST",
        { timeout: 20_000 },
      )
      .catch(() => null),
    page.getByRole("button", { name: "Ingresar" }).click(),
  ]);

  await waitForAuthSuccess(page, "Family login");
}
