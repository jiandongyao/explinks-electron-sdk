/**
 * Preload Script
 * Exposes secure API to renderer process
 */

import { contextBridge, ipcRenderer } from 'electron';
import { ExpLinksConfig, ApiRequest, ApiResponse, ApiInfo } from './types/sdk';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('expLinksAPI', {
  initialize: (config: ExpLinksConfig) => 
    ipcRenderer.invoke('sdk:initialize', config),
  
  executeRequest: (request: ApiRequest) => 
    ipcRenderer.invoke('sdk:executeRequest', request),
  
  testConnection: () => 
    ipcRenderer.invoke('sdk:testConnection'),
  
  loadAvailableApis: () => 
    ipcRenderer.invoke('sdk:loadAvailableApis'),
  
  getState: () => 
    ipcRenderer.invoke('sdk:getState'),
  
  onStateChange: (callback: (state: any) => void) => {
    ipcRenderer.on('sdk:stateChanged', (_event, state) => callback(state));
  }
});
