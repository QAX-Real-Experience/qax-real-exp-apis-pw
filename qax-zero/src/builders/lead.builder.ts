import { RegisterLeadRequest } from '../types/register-lead.types';

// Builder para preparar la data que necesita el registro.
export class LeadBuilder {

    // Crea un aprendiz valido con email distinto en cada ejecucion.
    static buildLead(): RegisterLeadRequest {
        const emailDomain = process.env.TEST_EMAIL_DOMAIN || 'example.com';

        // Date.now agrega la fecha/hora actual para evitar emails repetidos.
        return {
            email: `aprendiz.${Date.now()}@${emailDomain}`,
            password: 'Qwerty123!',
            full_name: 'Aprendiz QA',
            captcha_token: null
        };
    }

    // Crea un nombre con largo exacto para validar limites.
    static buildFullNameWithLength(length: number): string {
        // repeat repite la letra A la cantidad de veces que indique length.
        return 'A'.repeat(length);
    }
}
