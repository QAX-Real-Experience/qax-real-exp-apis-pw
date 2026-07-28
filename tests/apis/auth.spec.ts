/**
 * Suite migrada: flujo principal de Supabase Auth (APIs).
 *
 * Cubre: signup → login → getUser con token válido.
 */
import { expect, test } from "@playwright/test";
import type { AuthRequest } from "../../src/types/auth.js";
import type { AuthResponse, SignupResponse } from "../../src/types/auth.js";
import { AuthService } from "../../src/apis/services/AuthService.js";
import { generateEmail } from "../../src/shared/utils/dataGenerator.js";
import { env } from "../../src/config/env.js";

test.describe("Supabase Auth API @smoke", () => {
  test("debe registrar, autenticar y consultar usuario autorizado", async ({ request }) => {
    const authService = new AuthService(request);
    const authRequest: AuthRequest = {
      email: generateEmail(),
      password: env.testUserPassword,
    };

    // Crea un usuario nuevo con email dinámico.
    await test.step("registrar usuario con email dinámico", async () => {
      const signupResponse = await authService.signup(authRequest);
      expect(signupResponse.status()).toBe(200);

      const signupBody = (await signupResponse.json()) as SignupResponse;
      expect(signupBody.user).toBeTruthy();
      expect(signupBody.user?.id).toBeTruthy();
      expect(signupBody.user?.email).toBe(authRequest.email);
    });

    let accessToken = "";

    // Hace login, valida la respuesta y guarda el token.
    await test.step("autenticar usuario y capturar access_token", async () => {
      const loginResponse = await authService.login(authRequest);
      expect(loginResponse.status()).toBe(200);

      const loginBody = (await loginResponse.json()) as AuthResponse;
      expect(loginBody.access_token).toBeTruthy();
      expect(loginBody.token_type).toBe("bearer");
      expect(loginBody.expires_in).toBeGreaterThan(0);
      expect(loginBody.user).toBeTruthy();

      accessToken = loginBody.access_token;
    });

    // Consulta el usuario autenticado usando el token obtenido en login.
    await test.step("consultar usuario con token válido", async () => {
      const userResponse = await authService.getUser(accessToken);
      expect(userResponse.status()).toBe(200);

      const userBody = (await userResponse.json()) as AuthResponse["user"];
      expect(userBody.id).toBeTruthy();
      expect(userBody.email).toBe(authRequest.email);
      expect(userBody.role).toBe("authenticated");
    });
  });
});