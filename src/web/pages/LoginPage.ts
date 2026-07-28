/**
 * Page Object para el login de la aplicación Web.
 *
 * Los selectores son ejemplos editables: ajústalos a la UI real de
 * QAX-TERMINAL (u otra app目标). Es un punto de partida para que los
 * aprendices evolucionen el patrón POM.
 */
import type { Page, Locator } from "@playwright/test";
import { UiHelper } from "../helpers/uiHelper.js";

export class LoginPage {
  readonly page: Page;
  readonly ui: UiHelper;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.ui = new UiHelper(page);
    this.emailInput = page.locator('[data-testid="email"]');
    this.passwordInput = page.locator('[data-testid="password"]');
    this.submitButton = page.locator('[data-testid="login-submit"]');
    this.errorMessage = page.locator('[data-testid="login-error"]');
  }

  async navigate(path = "/login"): Promise<void> {
    await this.ui.goto(path);
  }

  async login(email: string, password: string): Promise<void> {
    await this.ui.fill(this.emailInput, email, "email");
    await this.ui.fill(this.passwordInput, password, "password");
    await this.ui.click(this.submitButton, "botón login");
  }

  async expectErrorVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }
}