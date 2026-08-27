// Define los datos que enviamos al endpoint de login.
export interface LoginRequest {
    email: string;
    password: string;
    gotrue_meta_security?: object;
}

// Define los datos basicos que Supabase devuelve para un usuario.
export interface SupabaseUser {
    id: string;
    aud?: string;
    role?: string;
    email?: string;
    email_confirmed_at?: string;
    confirmed_at?: string;
    user_metadata?: {
        email_verified?: boolean;
        full_name?: string;
    };
}

// Define los datos principales que esperamos cuando Supabase crea una sesion.
export interface LoginResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    expires_at: number;
    refresh_token: string;
    user: SupabaseUser;
    weak_password: null | object;
}

// Define los datos principales que esperamos al consultar el usuario autenticado.
export interface AuthenticatedUserResponse extends SupabaseUser {
}

// Define posibles campos de error cuando el login falla, con el signo ? en la propiedad, se indica que el valor es opcional, es decir, puede o no estar presente en la respuesta.
export interface LoginErrorResponse {
    error?: string;
    error_code?: string;
    msg?: string;
    message?: string;
}
