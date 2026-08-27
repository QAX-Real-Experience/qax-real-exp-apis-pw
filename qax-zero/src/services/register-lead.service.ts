import { APIRequestContext, APIResponse } from '@playwright/test';
import { ApiHelper } from '../helpers/api.helper';
import { RegisterLeadRequest } from '../types/register-lead.types';

// Service para llamar el endpoint de registro del aprendiz cero.

export class RegisterLeadService {
    private apiHelper: ApiHelper;

    constructor(request: APIRequestContext) {
        this.apiHelper = new ApiHelper(request);
    }

    // Registro: envia los datos del aprendiz al endpoint register-lead.
    async registerLead(leadData: Partial<RegisterLeadRequest>): Promise<APIResponse> {
        return await this.apiHelper.post('/functions/v1/register-lead', leadData);
    }
}
