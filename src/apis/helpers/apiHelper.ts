/**
 * Helper HTTP reutilizable para pruebas de APIs.
 *
 * Envuelve `APIRequestContext` de Playwright, inyectando headers
 * comunes (apikey, Content-Type) y delegando el logging a `Logger`.
 */
import type { APIRequestContext } from "@playwright/test";
import { Logger } from "../../shared/helpers/logger.js";
import { env } from "../../config/env.js";
import type { ApiResponse } from "../../types/api.js";

export class ApiHelper {
  constructor(private request: APIRequestContext) {}

  /**
   * Realiza un POST con headers por defecto y optionals extras.
   * Usa BASE_URL_API + endpoint (relativo) normalmente.
   */
  async post<T = unknown>(
    url: string,
    data: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return await Logger.step(`POST ${url}`, async () => {
      Logger.request("POST", url, data);
      const response = await this.request.post(url, {
        data,
        headers: {
          "Content-Type": "application/json",
          apikey: env.supabaseAnonKey,
          ...headers,
        },
      });
      const body = (await response.json().catch(() => ({}))) as T;
      Logger.response(response.status(), body);
      return { status: response.status(), body };
    });
  }

  /**
   * Realiza un GET con headers opcionales (por ejemplo, Authorization).
   */
  async get<T = unknown>(
    url: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return await Logger.step(`GET ${url}`, async () => {
      Logger.request("GET", url);
      const response = await this.request.get(url, {
        headers: {
          "Content-Type": "application/json",
          apikey: env.supabaseAnonKey,
          ...headers,
        },
      });
      const body = (await response.json().catch(() => ({}))) as T;
      Logger.response(response.status(), body);
      return { status: response.status(), body };
    });
  }
}