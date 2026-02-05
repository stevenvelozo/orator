# Getting Started

This guide walks through setting up an Orator-based API server from scratch.

## Installation

Create a new Node.js project and install the dependencies:

```bash
mkdir my-api-server && cd my-api-server
npm init -y
npm install fable orator orator-serviceserver-restify
```

## Basic Server

The simplest possible Orator server:

```javascript
const libFable = require('fable');
const libOrator = require('orator');
const libOratorServiceServerRestify = require('orator-serviceserver-restify');

// 1. Create a Fable instance with your service configuration
const _Fable = new libFable({
	Product: 'MyAPIServer',
	ProductVersion: '1.0.0',
	ServicePort: 8080
});

// 2. Register Orator and a service server
_Fable.serviceManager.addServiceType('Orator', libOrator);
_Fable.serviceManager.addServiceType('OratorServiceServer', libOratorServiceServerRestify);
_Fable.serviceManager.instantiateServiceProvider('Orator');
_Fable.serviceManager.instantiateServiceProvider('OratorServiceServer');

// 3. Define your API endpoints
_Fable.Orator.serviceServer.get('/api/status',
	(pRequest, pResponse, fNext) =>
	{
		pResponse.send({ status: 'ok', timestamp: new Date().toISOString() });
		return fNext();
	});

// 4. Start the server
_Fable.Orator.startService(
	() =>
	{
		_Fable.log.info('API server is ready');
	});
```

Run it with `node server.js` and visit `http://localhost:8080/api/status` in your browser.

## Adding Routes

Orator's service server exposes methods for all standard HTTP verbs. Each handler receives `pRequest`, `pResponse`, and `fNext` -- the standard Restify handler signature.

```javascript
// GET with URL parameters
_Fable.Orator.serviceServer.get('/api/user/:id',
	(pRequest, pResponse, fNext) =>
	{
		let tmpUserID = pRequest.params.id;
		pResponse.send({ id: tmpUserID, name: 'Example User' });
		return fNext();
	});

// POST with body parsing
_Fable.Orator.serviceServer.postWithBodyParser('/api/user',
	(pRequest, pResponse, fNext) =>
	{
		let tmpNewUser = pRequest.body;
		_Fable.log.info(`Creating user: ${tmpNewUser.name}`);
		pResponse.send({ created: true, user: tmpNewUser });
		return fNext();
	});

// PUT, DELETE, PATCH follow the same pattern
_Fable.Orator.serviceServer.del('/api/user/:id',
	(pRequest, pResponse, fNext) =>
	{
		pResponse.send({ deleted: true, id: pRequest.params.id });
		return fNext();
	});
```

## Using Middleware

Register middleware that runs before all route handlers:

```javascript
// Add a middleware function
_Fable.Orator.serviceServer.use(
	(pRequest, pResponse, fNext) =>
	{
		_Fable.log.trace(`${pRequest.method} ${pRequest.url}`);
		return fNext();
	});
```

## Configuration from File

Fable supports loading configuration from a JSON file, which means your Orator server configuration can live outside your code:

```json
{
	"Product": "MyAPIServer",
	"ProductVersion": "1.0.0",
	"ServicePort": 8080,
	"LogStreams": [
		{
			"level": "info",
			"path": "./server.log"
		},
		{
			"level": "trace",
			"streamtype": "process.stdout"
		}
	]
}
```

```javascript
const _Fable = new libFable({ ConfigFile: __dirname + '/config.json' });
```

## Next Steps

- [Architecture](architecture.md) - Understand the service server abstraction
- [Lifecycle Hooks](lifecycle-hooks.md) - Customize initialization and startup behavior
- [Static File Serving](static-files.md) - Serve files from disk
- [IPC Server](ipc-server.md) - Use Orator without a network server
