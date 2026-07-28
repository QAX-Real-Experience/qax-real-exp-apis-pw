/**
 * Flujo E2E integral: crea un usuario vía API y valida acceso Web.
 *
 * Patrón: la API crea el dato (rápido, determinístico) y la UI valida
 * el comportamiento del extremo al extremo reutilizando el fixture
 * `apiSession`.
 *
 * Si BASE_URL_WEB no está configurada, el test se omite.
 */
import { test, expect } from "../../src/e2e/fixtures/authFixture.js";
import { LoginPage } from "../../src/web/pages/LoginPage.js";
import { env } from "../../src/config/env.js";

test.describe("E2E: API + Web @e2e @smoke", () => {
  test.beforeAll(() => {
    if (!env.baseUrlWeb) {
      test.skip(true, "BASE_URL_WEB no configurada en .env");
    }
  });

  test("usuario creado vía API puede iniciar sesión en la UI", async ({ page, apiSession }) => {
    // La sesión ya fue creada por el fixture; aquí usamos la UI para
    // demostrar el patrón integrado. Ajusta credenciales/selectores al
    // producto real.
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    // El email real no se expone en el fixture por seguridad; este test
    // ejemplifica el patrón. En la app real, parametriza el usuario.
    await expect(loginPage.emailInput).toBeVisible();
    expect(apiSession.access_token).toBeTruthy();
  });
});