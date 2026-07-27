import { APIRequestContext } from '@playwright/test';
import { sign } from '../types/log';
import { ApiHelper } from '../helpers/apiHelper';
import * as dotenv from 'dotenv';

dotenv.config();

export class signupService {
  private baseURL: string;
  private api: ApiHelper;

  constructor(request: APIRequestContext, baseURL?: string) {
    this.baseURL = baseURL || process.env.BASE_URL || 'https://hpnydexjkrhwetxllbfs.supabase.co';
    this.api = new ApiHelper(request);
  }

  async postSignup(data: sign) {
    const endpoint = `${this.baseURL}/auth/v1/signup`;
    return await this.api.post(endpoint, data);
  }

}
