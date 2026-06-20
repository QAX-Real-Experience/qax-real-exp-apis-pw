// Datos principales del usuario devuelto por Supabase Auth.
export interface AuthUser {
  id: string;
  email?: string;
  role?: string;
}

// Estructura esperada para la respuesta del endpoint de login/token.
export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: AuthUser;
}

// Estructura esperada para la respuesta del endpoint de signup.
export interface SignupResponse {
  user: AuthUser | null;
}
