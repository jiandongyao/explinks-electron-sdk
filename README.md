# ExpLinks Electron SDK

ExpLinks SDK for Electron desktop applications - Access thousands of cloud APIs from your desktop application.

ExpLinks SDK 让你的桌面应用轻松接入上万种云端 API，包括第三方服务、AI API 和提示词 API。用户在 [ExpLinks.com](https://www.explinks.com) 平台创建私有网关后，即可订阅所需 API，无需重复集成。SDK 提供统一调用接口和 OpenAPI 描述，极大降低开发成本，让 AI 编程工具也能快速生成调用代码。

## Features

- 🚀 **Easy Integration**: Simple TypeScript API for Electron applications
- 🏗️ **Clean Architecture**: Separated layers (UI, Store, Adapter) for maintainability
- 🔒 **Secure**: Context isolation and IPC communication
- 💼 **Production Ready**: TypeScript, error handling, and state management
- 🎨 **Modern UI**: Beautiful gradient design with responsive layout

## Quick Start

### Installation

```bash
npm install
```

### Running the Application

```bash
npm start
```

This will:
1. Build the TypeScript code
2. Copy the necessary assets
3. Launch the Electron application

### Development

```bash
npm run dev
```

## Project Structure

```
explinks-electron-sdk/
├── src/
│   ├── adapter/           # SDK Adapter Layer
│   │   └── ExpLinksAdapter.ts
│   ├── store/             # Application Store Layer
│   │   └── AppStore.ts
│   ├── types/             # TypeScript type definitions
│   │   └── sdk.ts
│   ├── renderer/          # UI/Renderer Layer
│   │   ├── index.html
│   │   ├── renderer.ts
│   │   ├── styles.css
│   │   └── types.d.ts
│   ├── main.ts            # Electron Main Process
│   └── preload.ts         # Preload Script (IPC Bridge)
├── dist/                  # Built files (generated)
├── package.json
└── tsconfig.json
```

## Architecture

### Layer Separation

1. **Adapter Layer** (`src/adapter/`)
   - Handles direct communication with ExpLinks Gateway
   - Manages HTTP requests using Axios
   - Provides error handling and response formatting

2. **Store Layer** (`src/store/`)
   - Manages application state
   - Coordinates between adapter and UI
   - Implements observer pattern for state updates

3. **UI Layer** (`src/renderer/`)
   - User interface and interaction logic
   - Communicates with main process via IPC
   - Updates based on state changes

## Usage

### Basic Configuration

1. Start the application with `npm start`
2. Enter your ExpLinks Gateway URL (default: `https://api.explinks.com`)
3. Optionally enter your API key
4. Click "Initialize SDK" to connect

### Making API Requests

1. Select HTTP method (GET, POST, PUT, DELETE)
2. Enter the API endpoint
3. Add request data (JSON format) if needed
4. Click "Execute Request"

### Viewing Available APIs

Click "Load Available APIs" to see all APIs available through your gateway.

## Configuration Options

The SDK can be configured with the following options:

```typescript
interface ExpLinksConfig {
  gatewayUrl: string;    // Your ExpLinks Gateway URL
  apiKey?: string;       // Optional API key for authentication
  timeout?: number;      // Request timeout in milliseconds (default: 30000)
}
```

## Example: Making an API Request

```typescript
const request = {
  method: 'GET',
  endpoint: '/api/example',
  data: { key: 'value' }  // Optional
};

const response = await window.expLinksAPI.executeRequest(request);
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Scripts

- `npm start` - Build and run the application
- `npm run build` - Build TypeScript and copy assets
- `npm run dev` - Build and run (alias for start)
- `npm run clean` - Remove dist directory
- `npm run copy-assets` - Copy HTML and CSS files

## Requirements

- Node.js 16+
- npm 7+

## License

Apache-2.0

## Links

- [ExpLinks Website](https://www.explinks.com)
- Documentation: Available at ExpLinks.com
