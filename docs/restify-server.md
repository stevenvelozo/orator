# Restify Server

The Restify service server (`orator-serviceserver-restify`) is the production HTTP server implementation for Orator. It wraps [Restify](https://restify.com/), providing a full-featured HTTP API server with body parsing, middleware, and all standard HTTP verbs.

## Setup

```bash
npm install orator-serviceserver-restify
```

```javascript
const libOratorServiceServerRestify = require('orator-serviceserver-restify');

_Fable.serviceManager.addServiceType('OratorServiceServer', libOratorServiceServerRestify);
_Fable.serviceManager.instantiateServiceProvider('OratorServiceServer');
```

## Restify Configuration

Pass Restify-specific options through the `RestifyConfiguration` setting:

```javascript
const _Fable = new libFable({
	Product: 'MyAPIServer',
	ServicePort: 8080,
	RestifyConfiguration: {
		strictNext: true
	}
});
```

The default Restify configuration sets `maxParamLength` to `Number.MAX_SAFE_INTEGER` to avoid truncating long URL parameters.

## Body Parsing

The Restify server uses Restify's built-in body parser plugin. Use the `WithBodyParser` convenience methods to automatically parse request bodies:

```javascript
_Fable.Orator.serviceServer.postWithBodyParser('/api/items',
	(pRequest, pResponse, fNext) =>
	{
		// pRequest.body contains the parsed request body
		let tmpNewItem = pRequest.body;
		pResponse.send({ created: true, item: tmpNewItem });
		return fNext();
	});
```

## Pre-Route Middleware

Restify distinguishes between `use` middleware (runs after routing) and `pre` middleware (runs before routing). The Restify service server exposes both:

```javascript
const tmpServiceServer = _Fable.Orator.serviceServer;

// Runs after routing (standard middleware)
tmpServiceServer.use(
	(pRequest, pResponse, fNext) =>
	{
		return fNext();
	});

// Runs before routing (pre-middleware)
tmpServiceServer.pre(
	(pRequest, pResponse, fNext) =>
	{
		return fNext();
	});
```

## Accessing the Raw Restify Server

The underlying Restify server instance is available at `serviceServer.server` if you need direct access to Restify-specific features:

```javascript
const tmpRestifyServer = _Fable.Orator.serviceServer.server;
```

## Related

- [orator-serviceserver-restify documentation](https://github.com/stevenvelozo/orator-serviceserver-restify)
- [Restify documentation](https://restify.com/)
