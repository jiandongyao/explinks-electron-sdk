/**
 * Electron Main Process
 */

import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { appStore } from './store/AppStore';
import { ExpLinksConfig, ApiRequest } from './types/sdk';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    title: 'ExpLinks SDK Demo'
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Initialize IPC handlers
function setupIpcHandlers() {
  // Initialize SDK
  ipcMain.handle('sdk:initialize', async (_event, config: ExpLinksConfig) => {
    await appStore.initialize(config);
    notifyStateChange();
  });

  // Execute request
  ipcMain.handle('sdk:executeRequest', async (_event, request: ApiRequest) => {
    return await appStore.executeRequest(request);
  });

  // Test connection
  ipcMain.handle('sdk:testConnection', async () => {
    return await appStore.testConnection();
  });

  // Load available APIs
  ipcMain.handle('sdk:loadAvailableApis', async () => {
    await appStore.loadAvailableApis();
    notifyStateChange();
  });

  // Get current state
  ipcMain.handle('sdk:getState', () => {
    return appStore.getState();
  });

  // Subscribe to store changes
  appStore.subscribe((state) => {
    notifyStateChange();
  });
}

function notifyStateChange() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('sdk:stateChanged', appStore.getState());
  }
}

// App lifecycle
app.whenReady().then(() => {
  setupIpcHandlers();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
