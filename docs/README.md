# Orator

> An unopinionated API server abstraction for REST and IPC services

Orator is a thin abstraction layer over service server implementations, providing a consistent interface for building API servers. It doesn't care whether you're running Restify, building an in-process service mesh, or doing something entirely novel with your own service server implementation. Orator provides the lifecycle, the configuration, and the conventions -- you provide the service logic.

## Features

- **Unopinionated Design** - Wraps any service server implementation through a consistent interface
- **REST and IPC** - Full HTTP server support via Restify, or in-process IPC for testing and microservice composition
- **Lifecycle Management** - Before/After hooks for initialization and service start phases
- **Static File Serving** - Built-in static file serving with subdomain-based folder routing
- **Fable Integration** - First-class service provider in the Fable ecosystem with logging and configuration
- **Browser & Node.js** - Works in both environments with automatic service server selection

## Quick Start

```javascript
const libFable = require('fable');
const libOrator = require('orator');
const libOratorServiceServerRestify = require('orator-serviceserver-restify');

const _Fable = new libFable({
	Product: 'MyAPIServer',
	ProductVersion: '1.0.0',
	ServicePort: 8080
});

// Register Orator and a service server with Fable
_Fable.serviceManager.addServiceType('Orator', libOrator);
_Fable.serviceManager.addServiceType('OratorServiceServer', libOratorServiceServerRestify);
_Fable.serviceManager.instantiateServiceProvider('Orator');
_Fable.serviceManager.instantiateServiceProvider('OratorServiceServer');

// Add an API endpoint
_Fable.Orator.serviceServer.get('/hello/:name',
	(pRequest, pResponse, fNext) =>
	{
		pResponse.send({ greeting: `Hello ${pRequest.params.name}!` });
		return fNext();
	});

// Start the service
_Fable.Orator.startService(
	() =>
	{
		console.log('Server is running on port 8080');
	});
```

## Installation

```bash
npm install orator
```

## How It Works

Orator follows the Fable service provider pattern. You register it with a Fable instance, and it orchestrates one or more service server implementations to handle incoming requests. If you don't provide a service server, Orator will automatically set up its built-in IPC server -- which is useful for testing and in-process communication where no network traffic is needed.

```
Fable (Core)
  └── Orator (Service Orchestration)
        └── Service Server (Restify, IPC, or custom)
              ├── Route Registration (GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD)
              ├── Middleware Pipeline
              └── Static File Serving
```

## Configuration

Orator accepts configuration through the Fable settings object:

```json
{
	"Product": "MyAPIServer",
	"ProductVersion": "1.0.0",
	"ServicePort": 8080,
	"RestifyConfiguration": {}
}
```

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `Product` | string | `"Unnamed_Service"` | Application name identifier |
| `ProductVersion` | string | `"0.0.1"` | Application version string |
| `ServicePort` | number | `8080` | Port for the service server to listen on |
| `APIServerPort` | number | - | Legacy alias for ServicePort (automatically migrated) |
| `RestifyConfiguration` | object | `{}` | Configuration passed to Restify server creation |
| `ServiceServerOptions` | object | `{}` | Options passed to the auto-initialized service server |

## API Reference

### Lifecycle Methods

| Method | Description |
|--------|-------------|
| `initialize(fCallback)` | Initializes Orator and its service server |
| `startService(fCallback)` | Starts the service server listening on the configured port |
| `stopService(fCallback)` | Stops the running service server |

### Route Invocation

| Method | Description |
|--------|-------------|
| `invoke(pMethod, pRoute, pData, fCallback)` | Programmatically invoke a registered route without HTTP |

### Static Files

| Method | Description |
|--------|-------------|
| `addStaticRoute(pFilePath, pDefaultFile, pRoute, pRouteStrip, pParams)` | Serve static files from a directory |

### Legacy Methods

| Method | Maps To |
|--------|---------|
| `startWebServer(fCallback)` | `startService(fCallback)` |
| `stopWebServer(fCallback)` | `stopService(fCallback)` |
| `getWebServer()` | Returns `serviceServer` (lazy-initializes if needed) |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `serviceServer` | object | The active service server instance |
| `webServer` | object | Legacy alias for `serviceServer` |

## Testing

```bash
npm test
```

## Related Packages

- [orator-serviceserver-base](https://github.com/stevenvelozo/orator-serviceserver-base) - Abstract base class for service servers
- [orator-serviceserver-restify](https://github.com/stevenvelozo/orator-serviceserver-restify) - Restify service server implementation
- [orator-http-proxy](https://github.com/stevenvelozo/orator-http-proxy) - HTTP proxy pass-through for Orator
- [orator-static-server](https://github.com/stevenvelozo/orator-static-server) - Static file serving module
- [fable](https://github.com/stevenvelozo/fable) - Service provider framework
- [meadow](https://github.com/stevenvelozo/meadow) - Data access layer with automatic REST endpoints
