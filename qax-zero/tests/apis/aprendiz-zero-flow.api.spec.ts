import { test, expect } from '@playwright/test';
import { registerNewLead } from '../../src/helpers/lead-flow.helper';
import { getJsonBody } from '../../src/helpers/response.helper';
import { AuthService } from '../../src/services/auth.service';
import { AuthenticatedUserResponse, LoginResponse } from '../../src/types/auth.types';

// Test e2e de servicios. Aqui unimos registro, login y usuario autenticado.
test.describe.serial('Flujo E2E de servicios - Aprendiz cero', () => {

    test('@e2e registra aprendiz, inicia sesion y valida usuario autenticado', async ({ request }) => {
        // Arrange: creamos el service de auth para usarlo despues del registro.
        const authService = new AuthService(request);

        const lead = await test.step('Registrar aprendiz cero', async () => {
            return await registerNewLead(request);
        });

        const loginBody = await test.step('Iniciar sesion con el aprendiz creado', async () => {
            // Act: usamos el mismo email y password que se registraron.
            const credentials = {
                email: lead.email,
                password: lead.password,
                gotrue_meta_security: {}
            };

            const loginResponse = await authService.login(credentials);
            expect(loginResponse.status()).toBe(200);

            // Devolvemos el body para validar el token en el siguiente paso.
            return await getJsonBody<LoginResponse>(loginResponse);
        });

        await test.step('Validar que el token pertenece al mismo aprendiz', async () => {
            // Assert: el token y /auth/v1/user deben apuntar al mismo aprendiz.
            expect(loginBody.access_token).toEqual(expect.any(String));
            expect(loginBody.user.id).toBe(lead.user_id);
            expect(loginBody.user.email).toBe(lead.email);

            const userResponse = await authService.getAuthenticatedUser(loginBody.access_token);
            expect(userResponse.status()).toBe(200);

            const userBody = await getJsonBody<AuthenticatedUserResponse>(userResponse);
            expect(userBody.id).toBe(lead.user_id);
            expect(userBody.email).toBe(lead.email);
        });
    });

    test.fixme('@e2e BUG-002 validar email de bienvenida', async () => {
        // Se descarta la automatizacion porque la prueba manual confirmo que el email no llega.
    });

    test.fixme('@e2e validar redireccion web a onboarding', async () => {
        // Este escenario queda manual porque el sprint actual esta enfocado en servicios.
    });
});
