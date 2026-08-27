import { LoginRequest } from '../types/auth.types';

// Helper para validar que la configuracion local este completa antes de ejecutar tests.

export interface EnvConfig {
    apiBaseUrl: string;
    supabaseAnonKey: string;
    testEmailDomain: string;
    environment: string;
}

export class EnvHelper {

    // Valida las variables base que usan los requests.
    static getConfig(): EnvConfig {
        const apiBaseUrl = process.env.API_BASE_URL;
        const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
        const testEmailDomain = process.env.TEST_EMAIL_DOMAIN || 'example.com'; // Valor por defecto si no se configura en el archivo .env.stg
        const environment = process.env.ENV || 'stg'; // Valor por defecto si no se configura en el archivo .env.stg

        if (!apiBaseUrl) {
            throw new Error('API_BASE_URL no esta configurada en el archivo .env.stg');
        }

        if (!supabaseAnonKey) {
            throw new Error('SUPABASE_ANON_KEY no esta configurada en el archivo .env.stg');
        }

        return {
            apiBaseUrl,
            supabaseAnonKey,
            testEmailDomain,
            environment
        };
    }

    // Valida credenciales si se quiere probar con un usuario ya creado.
    static getExistingUserCredentials(): LoginRequest {
        const email = process.env.EXISTING_USER_EMAIL;
        const password = process.env.EXISTING_USER_PASSWORD;

        // Validamos que las variables existan, si no, lanzamos un error para que estas sean configuradas.
        if (!email) {
            throw new Error('EXISTING_USER_EMAIL no esta configurado en el archivo .env.stg');
        }

        if (!password) {
            throw new Error('EXISTING_USER_PASSWORD no esta configurado en el archivo .env.stg');
        }

        return {
            email,
            password
        };
    }
}
