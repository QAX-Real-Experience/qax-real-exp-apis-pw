/**
 * Helper HTTP reutilizable para pruebas de APIs.
 *
 * Envuelve `APIRequestContext` de Playwright, inyectando headers
 * comunes (`Authorization: Bearer`, `Content-Type`) y delegando el
 * logging a `Logger`.
 *
 * Auth por defecto: `Authorization: Bearer ${API_TOKEN}` (genérica).
 * Si el SUT requiere otro esquema (apikey, basic, custom), ajustá
 * `defaultHeaders()` o pasá headers extra en cada llamada.
 */
import type { APIRequestContext } from "@playwright/test";
import { Logger } from "../../helpers/logger.js";
import type { ApiResponse } from "../types/api.js";

export class ApiHelper {
  constructor(private request: APIRequestContext) {}

  /** Headers comunes para todas las requests. Overrideable vía param. */
  private defaultHeaders(): Record<string, string> {
    const token = process.env.API_TOKEN ?? "";
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

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
        headers: { ...this.defaultHeaders(), ...headers },
      });
      const body = (await response.json().catch(() => ({}))) as T;
      Logger.response(response.status(), body);
      return { status: response.status(), body };
    });
  }

  /**
   * Realiza un GET con headers opcionales.
   */
  async get<T = unknown>(
    url: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return await Logger.step(`GET ${url}`, async () => {
      Logger.request("GET", url);
      const response = await this.request.get(url, {
        headers: { ...this.defaultHeaders(), ...headers },
      });
      const body = (await response.json().catch(() => ({}))) as T;
      Logger.response(response.status(), body);
      return { status: response.status(), body };
    });
  }
}