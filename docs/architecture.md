# Architecture

Orator's design separates the concerns of service lifecycle management from the specifics of any HTTP server implementation. This abstraction allows you to swap service servers, test without network overhead, and maintain consistent patterns across many microservices.

## Layered Design

```
┌─────────────────────────────────────────────┐
│                   Fable                     │
│        (Configuration, Logging, DI)         │
└─────────────────────┬───────────────────────┘
                      │
┌─────────────────────▼───────────────────────┐
│                  Orator                     │
│    (Lifecycle, Static Files, Invocation)    │
└─────────────────────┬───────────────────────┘
                      │
┌─────────────────────▼───────────────────────┐
│        OratorServiceServerBase              │
│     (Abstract Route & Middleware API)       │
└───────┬─────────────┬───────────────────────┘
        │             │
┌───────▼──────┐ ┌────▼──────────────┐
│  IPC Server  │ │  Restify Server   │
│  (built-in)  │ │  (network HTTP)   │
└──────────────┘ └───────────────────┘
```

### Fable Layer

Fable provides the foundation: dependency injection, configuration management, logging, and service wiring. Orator registers itself as a Fable service and gains access to all of these capabilities automatically.

### Orator Layer

Orator manages the service lifecycle (initialization, starting, stopping) and provides higher-level features like static file serving and programmatic route invocation. It delegates actual HTTP handling to whichever service server implementation is registered.

### Service Server Layer

Service servers implement the actual HTTP verb handling. The base class (`orator-serviceserver-base`) defines the interface, and concrete implementations like `orator-serviceserver-restify` and the built-in IPC server provide the behavior.

## Service Provider Pattern

All Orator modules follow the Fable service provider pattern. Services are registered with a Fable instance by type, then instantiated on demand:

```javascript
// Register the service types
_Fable.serviceManager.addServiceType('Orator', libOrator);
_Fable.serviceManager.addServiceType('OratorServiceServer', libOratorServiceServerRestify);

// Instantiate them -- Fable handles wiring
_Fable.serviceManager.instantiateServiceProvider('Orator');
_Fable.serviceManager.instantiateServiceProvider('OratorServiceServer');

// Access via Fable
_Fable.Orator.startService();
```

## Auto-Initialization

If no service server is registered when Orator initializes, it will automatically create and register the built-in IPC service server. This makes it possible to use Orator for in-process route invocation without configuring a network server:

```javascript
// No OratorServiceServer registered -- IPC is used automatically
_Fable.serviceManager.addServiceType('Orator', libOrator);
_Fable.serviceManager.instantiateServiceProvider('Orator');

_Fable.Orator.serviceServer.get('/api/data',
	(pRequest, pResponse, fNext) =>
	{
		pResponse.send({ value: 42 });
		return fNext();
	});

// Invoke the route programmatically (no network call)
_Fable.Orator.invoke('GET', '/api/data', {},
	(pError, pResponseData) =>
	{
		console.log(pResponseData); // { value: 42 }
	});
```

## Template Method Pattern

The service server base class uses a template method pattern for route registration. The base class validates inputs, and derived classes implement the `do*` methods with actual behavior:

```
Base: get(pRoute, ...) → validates pRoute → calls doGet(pRoute, ...)
  └── Restify: doGet(pRoute, ...) → this.server.get(pRoute, ...)
  └── IPC: doGet(pRoute, ...) → this.addRouteProcessor('GET', pRoute, ...)
```

This pattern allows derived classes to focus on implementation without duplicating validation logic.
