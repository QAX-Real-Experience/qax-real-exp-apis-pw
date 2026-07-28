/**
 * Prueba Web de ejemplo: login en la app objetivo (QAX-TERMINAL u otra).
 *
 * Es un placeholder real y ejecutable: depende de BASE_URL_WEB y de
 * los selectores definidos en LoginPage. Ajústalos al producto real.
 *
 * Si BASE_URL_WEB no está configurada, el test se omite (skip) en
 * lugar de fallar — útil para CI sin app Web desplegada.
 */
import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/web/pages/LoginPage.js";
import { env } from "../../src/config/env.js";

test.describe("Login UI @web @smoke", () => {
  test.beforeAll(() => {
    if (!env.baseUrlWeb) {
      test.skip(true, "BASE_URL_WEB no configurada en .env");
    }
  });

  test("registra credenciales inválidas y muestra error", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login("invalido@example.com", "wrong-password");
    expect(await loginPage.expectErrorVisible()).toBeTruthy();
  });
});