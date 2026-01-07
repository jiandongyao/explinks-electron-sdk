/**
 * Renderer Process
 * UI Logic and Event Handlers
 */

import './types';

// DOM Elements
const initBtn = document.getElementById('initBtn') as HTMLButtonElement;
const testBtn = document.getElementById('testBtn') as HTMLButtonElement;
const executeBtn = document.getElementById('executeBtn') as HTMLButtonElement;
const loadApisBtn = document.getElementById('loadApisBtn') as HTMLButtonElement;

const gatewayUrlInput = document.getElementById('gatewayUrl') as HTMLInputElement;
const apiKeyInput = document.getElementById('apiKey') as HTMLInputElement;
const methodSelect = document.getElementById('method') as HTMLSelectElement;
const endpointInput = document.getElementById('endpoint') as HTMLInputElement;
const requestDataTextarea = document.getElementById('requestData') as HTMLTextAreaElement;

const connectionStatus = document.getElementById('connectionStatus') as HTMLDivElement;
const responseBox = document.getElementById('response') as HTMLDivElement;
const apiList = document.getElementById('apiList') as HTMLDivElement;

// Initialize SDK
initBtn.addEventListener('click', async () => {
  const config = {
    gatewayUrl: gatewayUrlInput.value.trim(),
    apiKey: apiKeyInput.value.trim() || undefined,
    timeout: 30000
  };

  if (!config.gatewayUrl) {
    showStatus('Please enter a gateway URL', 'error');
    return;
  }

  try {
    initBtn.disabled = true;
    initBtn.textContent = 'Initializing...';
    
    await window.expLinksAPI.initialize(config);
    
    const state = await window.expLinksAPI.getState();
    if (state.connected) {
      showStatus('SDK initialized successfully!', 'success');
    } else {
      showStatus('SDK initialized but connection failed', 'warning');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Initialization failed';
    showStatus(`Initialization failed: ${message}`, 'error');
  } finally {
    initBtn.disabled = false;
    initBtn.textContent = 'Initialize SDK';
  }
});

// Test connection
testBtn.addEventListener('click', async () => {
  try {
    testBtn.disabled = true;
    testBtn.textContent = 'Testing...';
    
    const connected = await window.expLinksAPI.testConnection();
    
    if (connected) {
      showStatus('Connection successful!', 'success');
    } else {
      showStatus('Connection failed', 'error');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Test failed';
    showStatus(`Test failed: ${message}`, 'error');
  } finally {
    testBtn.disabled = false;
    testBtn.textContent = 'Test Connection';
  }
});

// Execute API request
executeBtn.addEventListener('click', async () => {
  const endpoint = endpointInput.value.trim();
  
  if (!endpoint) {
    showResponse({ success: false, error: 'Please enter an endpoint' }, 'error');
    return;
  }

  let requestData = undefined;
  if (requestDataTextarea.value.trim()) {
    try {
      requestData = JSON.parse(requestDataTextarea.value);
    } catch {
      showResponse({ success: false, error: 'Invalid JSON in request data' }, 'error');
      return;
    }
  }

  const request = {
    method: methodSelect.value as 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: endpoint,
    data: requestData
  };

  try {
    executeBtn.disabled = true;
    executeBtn.textContent = 'Executing...';
    
    const response = await window.expLinksAPI.executeRequest(request);
    showResponse(response, response.success ? 'success' : 'error');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    showResponse({ success: false, error: message }, 'error');
  } finally {
    executeBtn.disabled = false;
    executeBtn.textContent = 'Execute Request';
  }
});

// Load available APIs
loadApisBtn.addEventListener('click', async () => {
  try {
    loadApisBtn.disabled = true;
    loadApisBtn.textContent = 'Loading...';
    
    await window.expLinksAPI.loadAvailableApis();
    const state = await window.expLinksAPI.getState();
    
    if (state.availableApis && state.availableApis.length > 0) {
      displayApis(state.availableApis);
    } else {
      apiList.innerHTML = '<p class="placeholder">No APIs available or connection not established</p>';
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load APIs';
    apiList.innerHTML = `<p class="error">Failed to load APIs: ${message}</p>`;
  } finally {
    loadApisBtn.disabled = false;
    loadApisBtn.textContent = 'Load Available APIs';
  }
});

// Helper: Show status message
function showStatus(message: string, type: 'success' | 'error' | 'warning') {
  connectionStatus.textContent = message;
  connectionStatus.className = `status ${type}`;
  
  setTimeout(() => {
    connectionStatus.textContent = '';
    connectionStatus.className = 'status';
  }, 5000);
}

// Helper: Show response
function showResponse(response: any, type: 'success' | 'error') {
  responseBox.innerHTML = `
    <div class="response-header ${type}">
      ${type === 'success' ? '✓' : '✗'} ${type.toUpperCase()}
    </div>
    <pre class="response-content">${JSON.stringify(response, null, 2)}</pre>
  `;
}

// Helper: Display available APIs
function displayApis(apis: any[]) {
  const html = apis.map(api => `
    <div class="api-item">
      <h3>${api.name}</h3>
      <p>${api.description}</p>
      <div class="api-meta">
        <span>Version: ${api.version}</span>
        <span>URL: ${api.baseUrl}</span>
      </div>
    </div>
  `).join('');
  
  apiList.innerHTML = html || '<p class="placeholder">No APIs found</p>';
}

// Listen for state changes
window.expLinksAPI.onStateChange((state) => {
  console.log('State changed:', state);
  
  // Update UI based on state changes
  if (state.lastError) {
    showStatus(state.lastError, 'error');
  }
});

// Initialize: Load current state
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const state = await window.expLinksAPI.getState();
    if (state.connected) {
      showStatus('SDK is connected', 'success');
    }
  } catch (error) {
    console.error('Failed to get initial state:', error);
  }
});
