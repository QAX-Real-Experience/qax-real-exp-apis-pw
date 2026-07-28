/**
 * Service Layer encargado de centralizar las llamadas HTTP de
 * autenticación contra Supabase Auth.
 */
import type { APIRequestContext, APIResponse } from "@playwright/test";
import type { AuthRequest } from "../types/auth.js";

export class AuthService {
  // Recibe el cliente HTTP de Playwright para reutilizarlo en los métodos.
  constructor(private readonly request: APIRequestContext) {}

  // Registra un usuario nuevo en Supabase Auth.
  async signup(authRequest: AuthRequest): Promise<APIResponse> {
    const baseUrl = process.env.BASE_URL_API ?? "";
    return this.request.post(`${baseUrl}/auth/v1/signup`, {
      data: authRequest,
    });
  }

  // Autentica al usuario y permite obtener el access_token.
  async login(authRequest: AuthRequest): Promise<APIResponse> {
    const baseUrl = process.env.BASE_URL_API ?? "";
    return this.request.post(
      `${baseUrl}/auth/v1/token?grant_type=password`,
      { data: authRequest }
    );
  }

  // Consulta los datos del usuario autenticado usando el token de login.
  async getUser(accessToken: string): Promise<APIResponse> {
    const baseUrl = process.env.BASE_URL_API ?? "";
    return this.request.get(`${baseUrl}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }
}