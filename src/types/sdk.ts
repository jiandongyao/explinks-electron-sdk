/**
 * ExpLinks SDK Types
 */

export interface ExpLinksConfig {
  gatewayUrl: string;
  apiKey?: string;
  timeout?: number;
}

export interface ApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  data?: any;
  headers?: Record<string, string>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export interface ApiInfo {
  name: string;
  description: string;
  baseUrl: string;
  version: string;
}
