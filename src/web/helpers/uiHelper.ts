/**
 * Helper UI reutilizable para pruebas Web.
 *
 * Envuelve acciones comunes de `Page` (Playwright) para reducir
 * boilerplate en los Page Objects y centralizar esperas/interacciones.
 */
import type { Page, Locator } from "@playwright/test";
import { Logger } from "../../helpers/logger.js";

export class UiHelper {
  constructor(private page: Page) {}

  /** Navega a una URL (relativa a baseURL del project) y registra el paso. */
  async goto(path: string): Promise<void> {
    await Logger.step(`Navegar a ${path}`, async () => {
      await this.page.goto(path);
    });
  }

  /** Llena un locator con texto y registra el paso. */
  async fill(locator: Locator, text: string, label: string): Promise<void> {
    await Logger.step(`Completar ${label}`, async () => {
      await locator.fill(text);
    });
  }

  /** Clica un locator y registra el paso. */
  async click(locator: Locator, label: string): Promise<void> {
    await Logger.step(`Clic en ${label}`, async () => {
      await locator.click();
    });
  }

  /** Captura de pantalla helpers (reporte). */
  async screenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/${name}.png`, fullPage: true });
  }
}