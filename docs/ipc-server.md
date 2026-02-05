# IPC Server

Orator includes a built-in IPC (Inter-Process Communication) service server that handles route invocation entirely in-process, without any network traffic. This is the default service server when no external implementation (like Restify) is registered.

## When to Use IPC

- **Unit Testing** - Test your route handlers without starting an HTTP server
- **Microservice Composition** - Call routes programmatically within the same process
- **Browser Environments** - Orator's browser build uses IPC by default since there's no server to listen on

## Automatic Setup

If you don't register an `OratorServiceServer` with Fable, Orator creates an IPC server automatically during initialization:

```javascript
const libFable = require('fable');
const libOrator = require('orator');

const _Fable = new libFable({ Product: 'MyService' });
_Fable.serviceManager.addServiceType('Orator', libOrator);
_Fable.serviceManager.instantiateServiceProvider('Orator');

// serviceServer is now an IPC server
_Fable.Orator.initialize(
	() =>
	{
		console.log(_Fable.Orator.serviceServer.ServiceServerType); // "IPC"
	});
```

## Programmatic Invocation

The key feature of the IPC server is `invoke()`, which calls registered routes programmatically:

```javascript
// Register a route
_Fable.Orator.serviceServer.get('/api/user/:id',
	(pRequest, pResponse, fNext) =>
	{
		pResponse.send({ id: pRequest.params.id, name: 'Example User' });
		return fNext();
	});

// Invoke it without HTTP
_Fable.Orator.invoke('GET', '/api/user/42', {},
	(pError, pResponseData) =>
	{
		console.log(pResponseData); // { id: '42', name: 'Example User' }
	});
```

## Request and Response Objects

When invoking routes via IPC, the server creates synthesized request and response objects:

**Request Object:**
- `method` - The HTTP method string
- `url` - The route path
- `guid` - A unique identifier for the request
- `params` - Parsed URL parameters

**Response Object (Synthesized):**
- `send(pData)` - Accumulates response data
- `responseData` - The aggregated response after all handlers complete

## Pre and Post Behavior Functions

The IPC server supports middleware through pre-behavior and post-behavior functions:

```javascript
const tmpServiceServer = _Fable.Orator.serviceServer;

// Runs before every route handler
tmpServiceServer.addPreBehaviorFunction(
	(pRequest, pResponse, fNext) =>
	{
		pRequest.startTime = Date.now();
		return fNext();
	});

// Runs after every route handler
tmpServiceServer.addPostBehaviorFunction(
	(pRequest, pResponse, fNext) =>
	{
		let tmpDuration = Date.now() - pRequest.startTime;
		console.log(`Request took ${tmpDuration}ms`);
		return fNext();
	});
```

The `use()` method is an alias for `addPreBehaviorFunction()`.

## Execution Flow

When a route is invoked via IPC, the execution follows this sequence:

```
invoke(method, route, data)
    ↓
Router matches route (find-my-way)
    ↓
Execute pre-behavior functions (sequential)
    ↓
Execute route handler functions (sequential)
    ↓
Execute post-behavior functions (sequential)
    ↓
Callback with aggregated response data
```

All stages are executed sequentially using the Fable Anticipate service for asynchronous flow control.

## Routing

The IPC server uses [find-my-way](https://github.com/delvedor/find-my-way) for route matching, which supports parametric and wildcard routes:

```javascript
// Parametric route
tmpServiceServer.get('/user/:id', handler);

// Wildcard route
tmpServiceServer.get('/files/*', handler);
```
