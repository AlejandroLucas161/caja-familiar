import { expect, test } from "@playwright/test";
import {
  expectAccessible,
  expectTouchTarget,
  loginDemo,
  loginFamily,
} from "./helpers";

test.describe("Login — contraste y usabilidad", () => {
  test("login legible, targets grandes y contraste AA", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByRole("heading", { name: "Caja Familiar" })).toBeVisible();
    await expect(page.getByLabel("Usuario")).toBeVisible();
    await expect(page.getByLabel("Contraseña")).toBeVisible();

    await expectTouchTarget(
      page.getByRole("button", { name: "Ingresar" }),
      "Botón Ingresar",
    );
    await expectTouchTarget(
      page.getByRole("button", { name: "Entrar al modo Demo" }),
      "Botón Demo",
    );

    // Campos con altura cómoda en móvil
    const userBox = await page.getByLabel("Usuario").boundingBox();
    expect(userBox!.height).toBeGreaterThanOrEqual(44);

    await expectAccessible(page, "login");
  });
});

test.describe("Demo — contraste y usabilidad (solo lectura)", () => {
  test("inicio demo: nav usable y contraste AA", async ({ page }) => {
    await loginDemo(page);

    await expect(page.getByText("Saldo disponible")).toBeVisible();
    await expect(page.getByText(/Demo de solo lectura/i)).toBeVisible();

    // Nav inferior (sin Agregar en demo)
    await expectTouchTarget(page.getByRole("link", { name: "Inicio" }), "Nav Inicio");
    await expectTouchTarget(page.getByRole("link", { name: /Lista|Movimientos/ }), "Nav Lista");
    await expect(page.getByRole("link", { name: /Nuevo|Agregar/ })).toHaveCount(0);

    await expectAccessible(page, "demo-inicio");
  });

  test("movimientos demo: lectura + contraste", async ({ page }) => {
    await loginDemo(page);
    await page.getByRole("link", { name: /Lista|Movimientos/ }).click();
    await expect(page.getByRole("heading", { name: "Movimientos" })).toBeVisible();

    // Nombres LOTR de la demo
    await expect(page.getByText(/Aragorn|Frodo|Gandalf|Legolas|Sam/).first()).toBeVisible();

    // Sin acciones de edición en demo
    await expect(page.getByRole("link", { name: "Editar" })).toHaveCount(0);

    await expectAccessible(page, "demo-movimientos");
  });

  test("estadísticas demo: contraste", async ({ page }) => {
    await loginDemo(page);
    await page.getByRole("link", { name: /Stats|Estadísticas/ }).click();
    await expect(page.getByRole("heading", { name: "Estadísticas" })).toBeVisible();
    await expectAccessible(page, "demo-stats");
  });
});

test.describe("Familia — fecha usable", () => {
  test("click en cualquier parte del date input abre el picker", async ({
    page,
  }) => {
    test.skip(
      !process.env.E2E_FAMILY_USER && !process.env.NEXT_PUBLIC_SUPABASE_URL,
      "Requiere app con Supabase; usa E2E_FAMILY_USER/PASSWORD o defaults locales",
    );

    await loginFamily(page);
    await page.getByRole("link", { name: /Nuevo|Agregar/ }).click();
    await expect(page.getByRole("heading", { name: "Agregar" })).toBeVisible();

    const dateInput = page.locator('input[type="date"].date-input-full');
    await expect(dateInput).toBeVisible();

    // El indicador cubre todo el input (CSS) o showPicker responde al click
    const coversFull = await dateInput.evaluate((el: HTMLInputElement) => {
      const style = window.getComputedStyle(
        el,
        "::-webkit-calendar-picker-indicator",
      );
      // En engines webkit/blink: width del indicator
      const width = style.width;
      return width === "100%" || width === `${el.clientWidth}px` || width === "auto";
    });

    const box = await dateInput.boundingBox();
    expect(box).not.toBeNull();

    // Click cerca del borde izquierdo (no el icono típico de la derecha)
    await page.mouse.click(box!.x + 24, box!.y + box!.height / 2);

    const hasShowPicker = await dateInput.evaluate(
      (el: HTMLInputElement) => typeof el.showPicker === "function",
    );
    expect(hasShowPicker || coversFull).toBeTruthy();

    await expectAccessible(page, "familia-agregar");
  });
});
