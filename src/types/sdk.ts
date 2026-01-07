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
  data?: unknown;
  headers?: Record<string, string>;
}

export interface ApiResponse<T = unknown> {
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
