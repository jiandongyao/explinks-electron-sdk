/**
 * Application Store
 * Manages application state and SDK instance
 */

import { ExpLinksAdapter } from '../adapter/ExpLinksAdapter';
import { ExpLinksConfig, ApiRequest, ApiResponse, ApiInfo } from '../types/sdk';

export interface AppState {
  connected: boolean;
  gatewayUrl: string;
  apiKey: string;
  availableApis: ApiInfo[];
  lastError: string | null;
}

export class AppStore {
  private adapter: ExpLinksAdapter | null = null;
  private state: AppState = {
    connected: false,
    gatewayUrl: 'https://api.explinks.com',
    apiKey: '',
    availableApis: [],
    lastError: null
  };

  private listeners: Set<(state: AppState) => void> = new Set();

  /**
   * Initialize SDK with configuration
   */
  async initialize(config: ExpLinksConfig): Promise<void> {
    try {
      this.adapter = new ExpLinksAdapter(config);
      this.state.gatewayUrl = config.gatewayUrl;
      this.state.apiKey = config.apiKey || '';
      
      const connected = await this.adapter.testConnection();
      this.updateState({ connected, lastError: null });
      
      if (connected) {
        await this.loadAvailableApis();
      }
    } catch (error: any) {
      this.updateState({ 
        connected: false, 
        lastError: error.message || 'Initialization failed' 
      });
    }
  }

  /**
   * Execute API request
   */
  async executeRequest<T = any>(request: ApiRequest): Promise<ApiResponse<T>> {
    if (!this.adapter) {
      return {
        success: false,
        error: 'SDK not initialized'
      };
    }

    const response = await this.adapter.executeRequest<T>(request);
    if (!response.success) {
      this.updateState({ lastError: response.error || 'Request failed' });
    }
    return response;
  }

  /**
   * Load available APIs from gateway
   */
  async loadAvailableApis(): Promise<void> {
    if (!this.adapter) return;

    const response = await this.adapter.getAvailableApis();
    if (response.success && response.data) {
      this.updateState({ availableApis: response.data });
    }
  }

  /**
   * Test connection to gateway
   */
  async testConnection(): Promise<boolean> {
    if (!this.adapter) return false;
    
    const connected = await this.adapter.testConnection();
    this.updateState({ connected });
    return connected;
  }

  /**
   * Get current state
   */
  getState(): AppState {
    return { ...this.state };
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: AppState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Update state and notify listeners
   */
  private updateState(updates: Partial<AppState>): void {
    this.state = { ...this.state, ...updates };
    this.listeners.forEach(listener => listener(this.state));
  }
}

export const appStore = new AppStore();
