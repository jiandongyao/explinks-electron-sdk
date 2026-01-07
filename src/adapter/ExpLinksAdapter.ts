/**
 * ExpLinks Adapter Layer
 * Handles communication with ExpLinks Gateway
 */

import axios, { AxiosInstance } from 'axios';
import { ExpLinksConfig, ApiRequest, ApiResponse, ApiInfo } from '../types/sdk';

export class ExpLinksAdapter {
  private client: AxiosInstance;
  private config: ExpLinksConfig;

  constructor(config: ExpLinksConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.gatewayUrl,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` })
      }
    });
  }

  /**
   * Execute an API request through ExpLinks Gateway
   */
  async executeRequest<T = any>(request: ApiRequest): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.request({
        method: request.method,
        url: request.endpoint,
        data: request.data,
        headers: request.headers
      });

      return {
        success: true,
        data: response.data,
        statusCode: response.status
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Request failed',
        statusCode: error.response?.status
      };
    }
  }

  /**
   * Get available APIs information
   */
  async getAvailableApis(): Promise<ApiResponse<ApiInfo[]>> {
    return this.executeRequest<ApiInfo[]>({
      method: 'GET',
      endpoint: '/api/list'
    });
  }

  /**
   * Test connection to ExpLinks Gateway
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return response.status === 200;
    } catch {
      return false;
    }
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<ExpLinksConfig>): void {
    this.config = { ...this.config, ...config };
    this.client.defaults.baseURL = this.config.gatewayUrl;
    if (this.config.apiKey) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${this.config.apiKey}`;
    }
  }
}
