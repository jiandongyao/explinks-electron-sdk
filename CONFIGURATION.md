# Example Configuration

## Basic Setup

To use the ExpLinks SDK, you need to configure the gateway URL and optionally an API key.

### Configuration Example

```json
{
  "gatewayUrl": "https://api.explinks.com",
  "apiKey": "your-api-key-here",
  "timeout": 30000
}
```

### Getting Started

1. Visit [ExpLinks.com](https://www.explinks.com) and create an account
2. Create a private gateway in your dashboard
3. Copy your gateway URL and API key
4. Use them to initialize the SDK in the application

## Example API Requests

### GET Request

```json
{
  "method": "GET",
  "endpoint": "/api/weather/current"
}
```

### POST Request with Data

```json
{
  "method": "POST",
  "endpoint": "/api/users",
  "data": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Using Custom Headers

The SDK automatically handles common headers, but you can add custom headers:

```json
{
  "method": "GET",
  "endpoint": "/api/data",
  "headers": {
    "X-Custom-Header": "value"
  }
}
```

## Testing the Connection

Use the "Test Connection" button to verify:
- Your gateway URL is accessible
- The SDK is properly initialized
- Network connectivity is working

## Common Endpoints

Depending on your ExpLinks gateway configuration, you might have access to:

- `/api/list` - List all available APIs
- `/health` - Health check endpoint
- Various third-party API endpoints based on your subscriptions

## Troubleshooting

### Connection Failed
- Verify your gateway URL is correct
- Check your internet connection
- Ensure the gateway is online

### Authentication Errors
- Verify your API key is correct
- Check if your API key has the necessary permissions
- Ensure your subscription is active

### Request Timeout
- Increase the timeout value in configuration
- Check if the target API endpoint is responsive
- Verify network stability
