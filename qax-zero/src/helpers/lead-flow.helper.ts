import { APIRequestContext, expect } from '@playwright/test';
import { LeadBuilder } from '../builders/lead.builder';
import { RegisterLeadService } from '../services/register-lead.service';
import { RegisterLeadResponse } from '../types/register-lead.types';
import { getJsonBody } from './response.helper';

// Datos que devuelve el helper para poder hacer login con el mismo aprendiz.
export interface RegisteredLeadData {
    email: string;
    password: string;
    full_name: string;
    user_id: string;
    enrollment_id: string;
}

// Registra un aprendiz nuevo y deja lista la data para otros tests.
export async function registerNewLead(request: APIRequestContext): Promise<RegisteredLeadData> {
    const registerLeadService = new RegisterLeadService(request);
    const lead = LeadBuilder.buildLead();

    // Act: enviamos el registro al endpoint principal.
    const registerResponse = await registerLeadService.registerLead(lead);
    expect(registerResponse.status()).toBe(200);

    // Assert: revisamos que el registro entregue ids que luego vamos a usar.
    const registerBody = await getJsonBody<RegisterLeadResponse>(registerResponse);
    expect(registerBody.success).toBe(true);
    expect(registerBody.user_id).toEqual(expect.any(String));
    expect(registerBody.enrollment_id).toEqual(expect.any(String));

    return {
        email: lead.email,
        password: lead.password,
        full_name: lead.full_name,
        user_id: registerBody.user_id,
        enrollment_id: registerBody.enrollment_id
    };
}
