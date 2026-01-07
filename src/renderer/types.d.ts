/**
 * Global type declarations for renderer process
 */

import { ExpLinksConfig, ApiRequest, ApiResponse, ApiInfo } from '../types/sdk';

export interface ExpLinksAPI {
  initialize: (config: ExpLinksConfig) => Promise<void>;
  executeRequest: (request: ApiRequest) => Promise<ApiResponse>;
  testConnection: () => Promise<boolean>;
  loadAvailableApis: () => Promise<void>;
  getState: () => Promise<any>;
  onStateChange: (callback: (state: any) => void) => void;
}

declare global {
  interface Window {
    expLinksAPI: ExpLinksAPI;
  }
}
