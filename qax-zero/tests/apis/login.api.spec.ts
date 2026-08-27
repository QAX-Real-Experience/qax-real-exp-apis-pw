import { test, expect } from '@playwright/test';
import { registerNewLead } from '../../src/helpers/lead-flow.helper';
import { getBodyAsText, getJsonBody } from '../../src/helpers/response.helper';
import { AuthService } from '../../src/services/auth.service';
import { AuthenticatedUserResponse, LoginResponse } from '../../src/types/auth.types';

// Tests de la US2. Aqui validamos el login del aprendiz cero.
test.describe('US2 - Login de aprendiz cero', () => {

    test('@smoke inicia sesion y valida el token en /auth/v1/user', async ({ request }) => {
        // Arrange: registramos un aprendiz nuevo para tener credenciales validas.
        const authService = new AuthService(request);

        const lead = await registerNewLead(request);
        const credentials = {
            email: lead.email,
            password: lead.password,
            gotrue_meta_security: {}
        };

        // Act: iniciamos sesion con el aprendiz creado.
        const loginResponse = await authService.login(credentials);

        // Assert: validamos que Supabase cree la sesion.
        expect(loginResponse.status()).toBe(200);

        const loginBody = await getJsonBody<LoginResponse>(loginResponse);
        expect(loginBody.access_token).toEqual(expect.any(String));
        expect(loginBody.token_type).toBe('bearer');
        expect(loginBody.expires_in).toBe(3600);
        expect(loginBody.user.id).toBe(lead.user_id);
        expect(loginBody.user.email).toBe(lead.email);
        expect(loginBody.user.user_metadata?.full_name).toBe(lead.full_name);

        // Assert: usamos el token para confirmar que pertenece al mismo usuario.
        const userResponse = await authService.getAuthenticatedUser(loginBody.access_token);
        expect(userResponse.status()).toBe(200);

        const userBody = await getJsonBody<AuthenticatedUserResponse>(userResponse);
        expect(userBody.id).toBe(lead.user_id);
        expect(userBody.email).toBe(lead.email);
    });

    test('@regression rechaza login con password incorrecta', async ({ request }) => {
        // Arrange: registramos un aprendiz y cambiamos solo el password.
        const authService = new AuthService(request);
        const lead = await registerNewLead(request);
        const credentials = {
            email: lead.email,
            password: 'PasswordIncorrecta123!',
            gotrue_meta_security: {}
        };

        // Act: intentamos iniciar sesion con password incorrecto.
        const response = await authService.login(credentials);

        // Assert: la API debe rechazar las credenciales.
        expect(response.status()).toBe(400);

        const responseText = (await getBodyAsText(response)).toLowerCase();
        expect(responseText.length).toBeGreaterThan(2);
        expect(responseText).toMatch(/invalid|credenciales|credentials/);
    });

    test('@regression rechaza login con usuario inexistente', async ({ request }) => {
        // Arrange: preparamos un email que no fue registrado.
        const authService = new AuthService(request);
        const credentials = {
            email: `no.existe.${Date.now()}@test.test`,
            password: 'Password123!',
            gotrue_meta_security: {}
        };

        // Act: intentamos iniciar sesion con ese email.
        const response = await authService.login(credentials);

        // Assert: la API debe rechazar sin confirmar si el usuario existe.
        expect(response.status()).toBe(400);

        const responseText = (await getBodyAsText(response)).toLowerCase();
        expect(responseText.length).toBeGreaterThan(2);
        expect(responseText).toMatch(/invalid|credenciales|credentials/);
    });

    test('@regression rechaza login sin email', async ({ request }) => {
        // Arrange y Act: enviamos login sin el campo email.
        const authService = new AuthService(request);

        const response = await authService.login({
            password: 'Password123!',
            gotrue_meta_security: {}
        });

        // Assert: la API debe indicar que falta email.
        expect([400, 422]).toContain(response.status());

        const responseText = (await getBodyAsText(response)).toLowerCase();
        expect(responseText.length).toBeGreaterThan(2);
        expect(responseText).toContain('email');
    });

    test('@regression rechaza login sin password', async ({ request }) => {
        // Arrange y Act: enviamos login sin el campo password.
        const authService = new AuthService(request);

        const response = await authService.login({
            email: `sin.password.${Date.now()}@test.test`,
            gotrue_meta_security: {}
        });

        // Assert: la API debe rechazar el login.
        expect([400, 422]).toContain(response.status());

        const responseText = (await getBodyAsText(response)).toLowerCase();
        expect(responseText.length).toBeGreaterThan(2);
        expect(responseText).toMatch(/invalid|credentials|credenciales|password|contrase/);
    });

    test('@regression rechaza login con email mal formado', async ({ request }) => {
        // Arrange: preparamos un email con formato invalido.
        const authService = new AuthService(request);
        const credentials = {
            email: 'email-sin-formato',
            password: 'Password123!',
            gotrue_meta_security: {}
        };

        // Act: intentamos iniciar sesion.
        const response = await authService.login(credentials);

        // Assert: la API debe rechazar el email invalido.
        expect([400, 422]).toContain(response.status());

        const responseText = (await getBodyAsText(response)).toLowerCase();
        expect(responseText.length).toBeGreaterThan(2);
        expect(responseText).toMatch(/invalid|credentials|credenciales|email/);
    });
});
