import { APIRequestContext, APIResponse } from "@playwright/test";
import { AuthRequest } from "../models/AuthRequest";

// Service Layer encargado de centralizar las llamadas HTTP de autenticacion.
export class AuthService {
  // Recibe el cliente HTTP de Playwright para reutilizarlo en los metodos.
  constructor(private readonly request: APIRequestContext) {}

  // Registra un usuario nuevo en Supabase Auth.
  async signup(authRequest: AuthRequest): Promise<APIResponse> {
    return this.request.post("/auth/v1/signup", {
      data: authRequest,
    });
  }

  // Autentica al usuario y permite obtener el access_token.
  async login(authRequest: AuthRequest): Promise<APIResponse> {
    return this.request.post("/auth/v1/token?grant_type=password", {
      data: authRequest,
    });
  }

  // Consulta los datos del usuario autenticado usando el token recibido en login.
  async getUser(accessToken: string): Promise<APIResponse> {
    return this.request.get("/auth/v1/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
}
