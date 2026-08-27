import { test, expect } from '@playwright/test';
import { LeadBuilder } from '../../src/builders/lead.builder';
import { RegisterLeadService } from '../../src/services/register-lead.service';
import { RegisterLeadResponse } from '../../src/types/register-lead.types';
import { getBodyAsText, getJsonBody } from '../../src/helpers/response.helper';

// Tests de la US1. Aqui validamos el registro del aprendiz cero.
test.describe('US1 - Registro de aprendiz cero', () => {

    test('@smoke registra un aprendiz cero correctamente', async ({ request }) => {
        // Arrange: creamos el service que llama al endpoint de registro.
        const registerLeadService = new RegisterLeadService(request);

        const lead = await test.step('Arrange: preparar aprendiz nuevo', async () => {
            return LeadBuilder.buildLead();
        });

        const response = await test.step('Act: enviar registro al endpoint register-lead', async () => {
            return await registerLeadService.registerLead(lead);
        });

        await test.step('Assert: validar usuario y acceso free creado', async () => {
            expect(response.status()).toBe(200);

            const body = await getJsonBody<RegisterLeadResponse>(response);

            expect(body.success).toBe(true);
            expect(body.user_id).toEqual(expect.any(String));
            expect(body.enrollment_id).toEqual(expect.any(String));
            expect(body.enrollment_framework_id).toEqual(expect.any(String));
            expect(body.id_status).toEqual(expect.any(String));
            expect(body.payment_status).toBe('free');
        });
    });

    test('@regression rechaza registro sin email', async ({ request }) => {
        // Arrange: armamos un body sin email para validar campo obligatorio.
        const registerLeadService = new RegisterLeadService(request);
        const lead = LeadBuilder.buildLead();

        // Act: enviamos el registro incompleto.
        const response = await registerLeadService.registerLead({
            password: lead.password,
            full_name: lead.full_name,
            captcha_token: lead.captcha_token
        });

        // Assert: la API debe rechazar el request y mencionar email.
        expect([400, 409, 422]).toContain(response.status());

        const responseText = (await getBodyAsText(response)).toLowerCase();
        expect(responseText.length).toBeGreaterThan(2);
        expect(responseText).toContain('email');
    });

    test('@regression rechaza registro con password menor a 8 caracteres', async ({ request }) => {
        // Arrange: preparamos un aprendiz con password menor al minimo.
        const registerLeadService = new RegisterLeadService(request);
        const lead = LeadBuilder.buildLead();
        lead.password = '1234567';

        // Act: intentamos registrar el aprendiz.
        const response = await registerLeadService.registerLead(lead);

        // Assert: la API debe rechazar el password corto.
        expect([400, 422]).toContain(response.status());

        const responseText = (await getBodyAsText(response)).toLowerCase();
        expect(responseText.length).toBeGreaterThan(2);
        expect(responseText).toMatch(/password|contrase/);
    });

    test('@regression permite registro con password de exactamente 8 caracteres', async ({ request }) => {
        // Arrange: preparamos un password justo en el limite permitido.
        const registerLeadService = new RegisterLeadService(request);
        const lead = LeadBuilder.buildLead();
        lead.password = 'Tests123';

        // Act: registramos el aprendiz.
        const response = await registerLeadService.registerLead(lead);

        // Assert: el registro debe ser exitoso porque cumple el minimo.
        expect(response.status()).toBe(200);

        const body = await getJsonBody<RegisterLeadResponse>(response);
        expect(body.success).toBe(true);
        expect(body.user_id).toEqual(expect.any(String));
        expect(body.payment_status).toBe('free');
    });

    test('@regression rechaza registro con email mal formado', async ({ request }) => {
        // Arrange: preparamos un email sin formato valido.
        const registerLeadService = new RegisterLeadService(request);
        const lead = LeadBuilder.buildLead();
        lead.email = 'email-sin-formato';

        // Act: intentamos registrar con email invalido.
        const response = await registerLeadService.registerLead(lead);

        // Assert: la API debe rechazar el email invalido.
        expect([400, 409, 422]).toContain(response.status());

        const responseText = (await getBodyAsText(response)).toLowerCase();
        expect(responseText.length).toBeGreaterThan(2);
        expect(responseText).toMatch(/email|correo|invalid|formato|registr|already|exists/);
    });

    test('@regression permite registro con nombre de exactamente 100 caracteres', async ({ request }) => {
        // Arrange: preparamos un nombre justo en el limite permitido.
        const registerLeadService = new RegisterLeadService(request);
        const lead = LeadBuilder.buildLead();
        lead.full_name = LeadBuilder.buildFullNameWithLength(100);

        // Act: registramos el aprendiz.
        const response = await registerLeadService.registerLead(lead);

        // Assert: el registro debe ser exitoso porque el nombre cumple el limite.
        expect(response.status()).toBe(200);

        const body = await getJsonBody<RegisterLeadResponse>(response);
        expect(body.success).toBe(true);
        expect(body.user_id).toEqual(expect.any(String));
        expect(body.payment_status).toBe('free');
    });

    test('@regression BUG-001 rechaza registro con nombre mayor a 100 caracteres', async ({ request }) => {
        test.fail(true, 'BUG-001: el backend esta aceptando full_name con mas de 100 caracteres.');

        // Arrange: preparamos un nombre que supera el limite de la HU.
        const registerLeadService = new RegisterLeadService(request);
        const lead = LeadBuilder.buildLead();
        lead.full_name = LeadBuilder.buildFullNameWithLength(101);

        // Act: intentamos registrar el aprendiz.
        const response = await registerLeadService.registerLead(lead);

        // Assert: este es el resultado esperado segun la HU.
        expect([400, 422]).toContain(response.status());

        const responseText = (await getBodyAsText(response)).toLowerCase();
        expect(responseText.length).toBeGreaterThan(2);
        expect(responseText).toMatch(/name|nombre|full_name/);
    });

    test('@regression rechaza email duplicado', async ({ request }) => {
        // Arrange: preparamos un aprendiz y lo registramos una primera vez.
        const registerLeadService = new RegisterLeadService(request);
        const lead = LeadBuilder.buildLead();

        const firstResponse = await registerLeadService.registerLead(lead);
        expect(firstResponse.status()).toBe(200);

        // Act: intentamos registrar el mismo email otra vez.
        const secondResponse = await registerLeadService.registerLead(lead);

        // Assert: la API debe rechazar el duplicado.
        expect([400, 409, 422]).toContain(secondResponse.status());

        const responseText = (await getBodyAsText(secondResponse)).toLowerCase();
        expect(responseText.length).toBeGreaterThan(2);
        expect(responseText).toMatch(/email|correo|registr|already|exists/);
    });
});
