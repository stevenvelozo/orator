# Service Servers

A service server is the component that actually handles HTTP requests (or their in-process equivalent). Orator doesn't implement HTTP handling directly -- it delegates to a service server implementation that conforms to the `orator-serviceserver-base` interface.

## Available Implementations

| Implementation | Package | Transport | Use Case |
|---------------|---------|-----------|----------|
| **Restify** | `orator-serviceserver-restify` | HTTP/HTTPS | Production API servers |
| **IPC** | Built into `orator` | In-process | Testing, microservice composition |

## Registering a Service Server

Service servers are registered with Fable before Orator initializes:

```javascript
const libOratorServiceServerRestify = require('orator-serviceserver-restify');

_Fable.serviceManager.addServiceType('OratorServiceServer', libOratorServiceServerRestify);
_Fable.serviceManager.instantiateServiceProvider('OratorServiceServer');
```

The key is the service type name `OratorServiceServer`. Orator looks for this specific name when it initializes. If it finds one registered, it uses it. If not, it falls back to the built-in IPC server.

## Route Registration

All service servers share the same route registration API:

```javascript
const tmpServiceServer = _Fable.Orator.serviceServer;

// Standard HTTP verbs
tmpServiceServer.get('/path', handler);
tmpServiceServer.post('/path', handler);
tmpServiceServer.put('/path', handler);
tmpServiceServer.del('/path', handler);
tmpServiceServer.patch('/path', handler);
tmpServiceServer.opts('/path', handler);
tmpServiceServer.head('/path', handler);

// With automatic body parsing
tmpServiceServer.postWithBodyParser('/path', handler);
tmpServiceServer.putWithBodyParser('/path', handler);
tmpServiceServer.delWithBodyParser('/path', handler);
tmpServiceServer.patchWithBodyParser('/path', handler);
```

## Handler Signature

Route handlers follow the standard `(pRequest, pResponse, fNext)` pattern:

```javascript
tmpServiceServer.get('/api/items/:id',
	(pRequest, pResponse, fNext) =>
	{
		let tmpItemID = pRequest.params.id;
		pResponse.send({ id: tmpItemID });
		return fNext();
	});
```

## Middleware

Register middleware that runs before all route handlers:

```javascript
tmpServiceServer.use(
	(pRequest, pResponse, fNext) =>
	{
		// Runs before every request
		return fNext();
	});
```

## Service Server Properties

| Property | Type | Description |
|----------|------|-------------|
| `ServiceServerType` | string | Identifier for the implementation (e.g., `"Restify"`, `"IPC"`) |
| `Name` | string | Server name (from `fable.settings.Product`) |
| `URL` | string | Server URL or identifier |
| `Port` | number | Listening port |
| `Active` | boolean | Whether the server is currently listening |

## Building Custom Service Servers

You can create your own service server implementation by extending `orator-serviceserver-base`. See the [orator-serviceserver-base documentation](https://github.com/stevenvelozo/orator-serviceserver-base) for the interface contract.
