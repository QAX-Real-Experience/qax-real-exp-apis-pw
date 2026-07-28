/**
 * Fixture que autentica vía API e inyecta la sesión en la página Web.
 *
 * Demuestra el patrón de flujo E2E: crear sesión por API (rápido) y
 * reutilizarla en la UI sin pasar por el formulario de login.
 */
import { test as base, expect } from "@playwright/test";
import { AuthService } from "../../apis/services/AuthService.js";
import type { AuthResponse } from "../../types/auth.js";
import { env } from "../../config/env.js";
import { buildValidUser } from "../../data/builders/userBuilder.js";

type ApiSessionFixture = {
  /** Sesión obtenida vía API: token + datos del usuario. */
  apiSession: AuthResponse;
};

/**
 * Fixture que registra un usuario nuevo vía API y obtiene su sesión.
 * Usa la base URL + el service role key si está disponible. De lo
 * contrario, raisea error claro para que el aprendiz la configure.
 */
export const test = base.extend<ApiSessionFixture>({
  apiSession: async ({ request }, use) => {
    if (!env.supabaseServiceRoleKey) {
      throw new Error(
        "SUPABASE_SERVICE_ROLE_KEY es requerida para el fixture E2E apiSession. " +
          "Defínela en tu .env (ver README > Manejo de KEYS)."
      );
    }
    const authService = new AuthService(request);
    const user = buildValidUser();

    const signupRes = await authService.signup(user);
    expect(signupRes.ok()).toBeTruthy();

    const loginRes = await authService.login(user);
    expect(loginRes.ok()).toBeTruthy();

    const session = (await loginRes.json()) as AuthResponse;
    expect(session.access_token).toBeTruthy();

    await use(session);
  },
});

export { expect };