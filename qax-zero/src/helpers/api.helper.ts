import { APIRequestContext, APIResponse } from '@playwright/test';
import { Logger } from './logger.helper';

// Helper para no repetir la forma de enviar requests en cada service.

type RequestHeaders = Record<string, string>;

export class ApiHelper {
    private request: APIRequestContext;

    // Recibe el request de Playwright que llega a cada test.
    constructor(request: APIRequestContext) {
        this.request = request;
    }

    // GET se usa cuando el test solo consulta informacion.
    async get(endpoint: string, headers?: RequestHeaders): Promise<APIResponse> {
        Logger.request('GET', endpoint);

        const response = await this.request.get(endpoint, {
            headers
        });

        Logger.response(response.status());

        return response;
    }

    // POST se usa cuando el test crea datos o inicia sesion.
    async post(endpoint: string, data?: unknown, headers?: RequestHeaders): Promise<APIResponse> {
        Logger.request('POST', endpoint, data);

        const response = await this.request.post(endpoint, {
            data,
            headers
        });

        Logger.response(response.status());

        return response;
    }

    // PATCH queda listo por si luego se necesita actualizar datos.
    async patch(endpoint: string, data?: unknown, headers?: RequestHeaders): Promise<APIResponse> {
        Logger.request('PATCH', endpoint, data);

        const response = await this.request.patch(endpoint, {
            data,
            headers
        });

        Logger.response(response.status());

        return response;
    }
}
