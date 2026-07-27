import { expect, test } from '@playwright/test';
import { AuthRequest } from '../src/models/AuthRequest';
import { AuthResponse, SignupResponse } from '../src/models/AuthResponse';
import { AuthService } from '../src/services/AuthService';
import { generateEmail } from '../src/utils/dataGenerator';

// Suite de pruebas para validar el flujo principal de Supabase Auth.
test.describe('Supabase Auth API', () => {
  test('debe registrar, autenticar y consultar usuario autorizado', async ({ request }) => {
    // Instancia el service y arma el body que se usara en signup y login.
    const authService = new AuthService(request);
    const authRequest: AuthRequest = {
      email: generateEmail(),
      password: process.env.TEST_USER_PASSWORD as string
    };

    // Crea un usuario nuevo con email dinamico.
    await test.step('registrar usuario con email dinamico', async () => {
      const signupResponse = await authService.signup(authRequest);
      expect(signupResponse.status()).toBe(200);

      const signupBody = (await signupResponse.json()) as SignupResponse;
      expect(signupBody.user).toBeTruthy();
      expect(signupBody.user?.id).toBeTruthy();
      expect(signupBody.user?.email).toBe(authRequest.email);
    });

    let accessToken = '';

    // Hace login, valida la respuesta y guarda el token para el siguiente paso.
    await test.step('autenticar usuario y capturar access_token', async () => {
      const loginResponse = await authService.login(authRequest);
      expect(loginResponse.status()).toBe(200);

      const loginBody = (await loginResponse.json()) as AuthResponse;
      expect(loginBody.access_token).toBeTruthy();
      expect(loginBody.token_type).toBe('bearer');
      expect(loginBody.expires_in).toBeGreaterThan(0);
      expect(loginBody.user).toBeTruthy();

      accessToken = loginBody.access_token;
    });

    // Consulta el usuario autenticado usando el token obtenido en login.
    await test.step('consultar usuario con token valido', async () => {
      const userResponse = await authService.getUser(accessToken);
      expect(userResponse.status()).toBe(200);

      const userBody = (await userResponse.json()) as AuthResponse['user'];
      expect(userBody.id).toBeTruthy();
      expect(userBody.email).toBe(authRequest.email);
      expect(userBody.role).toBe('authenticated');
    });
  });
});
