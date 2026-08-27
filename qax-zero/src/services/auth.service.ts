import { APIRequestContext, APIResponse } from '@playwright/test';
import { ApiHelper } from '../helpers/api.helper';
import { LoginRequest } from '../types/auth.types';

// Service para llamar endpoints de auth de Supabase.

export class AuthService {
    private apiHelper: ApiHelper;

    constructor(request: APIRequestContext) {
        this.apiHelper = new ApiHelper(request);
    }

    // Login: envia email y password para obtener access_token.
    async login(credentials: Partial<LoginRequest>): Promise<APIResponse> {
        return await this.apiHelper.post('/auth/v1/token?grant_type=password', credentials);
    }

    // Usuario autenticado: usa el token del login para consultar /auth/v1/user.
    async getAuthenticatedUser(accessToken: string): Promise<APIResponse> {
        return await this.apiHelper.get('/auth/v1/user', {
            Authorization: `Bearer ${accessToken}`
        });
    }
}
