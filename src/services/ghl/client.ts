import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { config } from '../../config/environment.js';

export class GhlClient {
  private client: AxiosInstance;
  private accessToken: string | undefined;

  constructor() {
    this.accessToken = config.ghl.accessToken;
    this.client = axios.create({
      baseURL: config.ghl.apiBase,
      headers: {
        'Content-Type': 'application/json',
        Version: config.ghl.apiVersion,
      },
    });

    this.client.interceptors.request.use(async (req) => {
      const token = await this.getValidToken();
      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      } else if (config.ghl.apiToken) {
        req.headers.Authorization = `Bearer ${config.ghl.apiToken}`;
      }
      return req;
    });

    this.client.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        if (error.response?.status === 401 && !originalRequest._retry && config.ghl.refreshToken) {
          originalRequest._retry = true;
          await this.refreshAccessToken();
          const token = this.accessToken;
          if (token && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return this.client(originalRequest);
        }
        return Promise.reject(error);
      }
    );
  }

  private async getValidToken(): Promise<string | undefined> {
    if (this.accessToken) return this.accessToken;
    if (config.ghl.refreshToken) {
      await this.refreshAccessToken();
      return this.accessToken;
    }
    return undefined;
  }

  private async refreshAccessToken(): Promise<void> {
    if (!config.ghl.clientId || !config.ghl.clientSecret || !config.ghl.refreshToken) {
      throw new Error('OAuth credentials incomplete: cannot refresh token');
    }

    const params = new URLSearchParams();
    params.append('client_id', config.ghl.clientId);
    params.append('client_secret', config.ghl.clientSecret);
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', config.ghl.refreshToken);

    const res = await axios.post('https://api.gohighlevel.com/oauth/token', params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    this.accessToken = res.data.access_token;
    // Note: In production, persist the new refresh_token if rotated
  }

  async request<T = unknown>(
    method: string,
    path: string,
    options?: AxiosRequestConfig
  ): Promise<T> {
    const res = await this.client.request<T>({ method, url: path, ...options });
    return res.data;
  }

  async get<T = unknown>(path: string, params?: Record<string, unknown>): Promise<T> {
    return this.request<T>('GET', path, { params });
  }

  async post<T = unknown>(path: string, data?: unknown): Promise<T> {
    return this.request<T>('POST', path, { data });
  }

  async put<T = unknown>(path: string, data?: unknown): Promise<T> {
    return this.request<T>('PUT', path, { data });
  }

  async patch<T = unknown>(path: string, data?: unknown): Promise<T> {
    return this.request<T>('PATCH', path, { data });
  }

  async delete<T = unknown>(path: string): Promise<T> {
    return this.request<T>('DELETE', path);
  }
}
