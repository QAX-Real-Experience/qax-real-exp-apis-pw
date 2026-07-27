import type { APIRequestContext } from '@playwright/test';
import { Logger } from './logger.js';


export class ApiHelper {
  constructor(private request: APIRequestContext) { }

  async post(url: string, data: any, headers?: any) {
    return await Logger.step(`POST ${url}`, async () => {
      Logger.request('POST', url, data);

      const response = await this.request.post(url, {
        data,
        headers: {
        'Content-Type':'application/json',
        'apikey': `${process.env.apikey}`,
        ...headers
        }
      });

      const body = await response.json().catch(() => ({}));
      Logger.response(response.status(), body);

      return { status: response.status(), body };
    });
  }

}
