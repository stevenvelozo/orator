# HTTP Proxy

The `orator-http-proxy` module provides HTTP proxy pass-through for Orator. It forwards incoming requests matching specified route prefixes to a destination URL, making it easy to proxy API calls to backend services.

## Setup

```bash
npm install orator-http-proxy
```

```javascript
const libOratorHTTPProxy = require('orator-http-proxy');

_Fable.serviceManager.addServiceType('OratorHTTPProxy', libOratorHTTPProxy);
_Fable.serviceManager.instantiateServiceProvider('OratorHTTPProxy',
	{
		DestinationURL: 'http://backend-api:3000/',
		RequestPrefixList: ['/api/v1/*']
	});

// After Orator is initialized, connect the proxy routes
_Fable.OratorHTTPProxy.connectProxyRoutes();
```

## Configuration

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `DestinationURL` | string | `"http://127.0.0.1/"` | URL to proxy requests to |
| `RequestPrefixList` | array | `["/1.0/*"]` | Route prefixes to intercept and proxy |
| `LogLevel` | number | `0` | Logging verbosity (higher = more output) |
| `httpProxyOptions` | object | `{}` | Additional options passed to `http-proxy` |

Configuration can also be set via Fable settings with the `OratorHTTPProxy` prefix:
- `OratorHTTPProxyDestinationURL`
- `OratorHTTPProxyRequestPrefixList`
- `OratorHTTPProxyLogLevel`

## How It Works

For each prefix in `RequestPrefixList`, the proxy registers GET, PUT, POST, and DELETE handlers on the Orator service server. When a matching request arrives, it is forwarded to the `DestinationURL` using the `http-proxy` library.

## Related

- [orator-http-proxy documentation](https://github.com/stevenvelozo/orator-http-proxy)
