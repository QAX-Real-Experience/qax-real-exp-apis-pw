/**
 * Modelos de dominio para autenticación (Supabase Auth).
 * Aplicables a pruebas APIs, Web y E2E.
 */

// Body enviado a los endpoints de signup y login.
export interface AuthRequest {
  email: string;
  password: string;
}

// Datos del usuario devueltos por Supabase Auth.
export interface AuthUser {
  id: string;
  email?: string;
  role?: string;
}

// Respuesta del endpoint de login/token.
export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: AuthUser;
}

// Respuesta del endpoint de signup.
export interface SignupResponse {
  user: AuthUser | null;
}