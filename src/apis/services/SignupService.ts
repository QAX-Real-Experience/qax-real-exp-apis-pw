/**
 * Servicio de registro (signup) basado en `ApiHelper`.
 * Mantiene el wrapper original de aprendices anteriores.
 */
import type { APIRequestContext } from "@playwright/test";
import type { AuthRequest } from "../../types/auth.js";
import { ApiHelper } from "../helpers/apiHelper.js";
import type { ApiResponse } from "../../types/api.js";
import { env } from "../../config/env.js";

export class SignupService {
  private baseUrl: string;
  private api: ApiHelper;

  constructor(request: APIRequestContext, baseUrl?: string) {
    this.baseUrl = baseUrl || env.baseUrlApi;
    this.api = new ApiHelper(request);
  }

  async postSignup(data: AuthRequest): Promise<ApiResponse> {
    const endpoint = `${this.baseUrl}/auth/v1/signup`;
    return await this.api.post(endpoint, data);
  }
}