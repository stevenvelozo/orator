# Configuration Reference

Orator is configured through the Fable settings object. Settings can be provided directly, loaded from a configuration file, or a combination of both.

## Orator Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `Product` | string | `"Unnamed_Service"` | Application name identifier |
| `ProductVersion` | string | `"0.0.1"` | Application version string |
| `ServicePort` | number | `8080` | Port for the service server to listen on |
| `APIServerPort` | number | - | Legacy alias for `ServicePort` (automatically migrated) |
| `ServiceServerOptions` | object | `{}` | Options passed to the auto-initialized service server |

## Restify Settings

When using the Restify service server:

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `RestifyConfiguration` | object | `{}` | Configuration passed to `restify.createServer()` |
| `RestifyConfiguration.maxParamLength` | number | `Number.MAX_SAFE_INTEGER` | Maximum URL parameter length |

## HTTP Proxy Settings

When using the HTTP proxy module:

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `OratorHTTPProxyDestinationURL` | string | `"http://127.0.0.1/"` | URL to proxy requests to |
| `OratorHTTPProxyRequestPrefixList` | array | `["/1.0/*"]` | Route prefixes to proxy |
| `OratorHTTPProxyLogLevel` | number | `0` | Proxy logging verbosity |

## Fable Settings

These Fable settings are commonly used with Orator:

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `LogStreams` | array | `[{ level: "info" }]` | Log output destinations |
| `LogNoisiness` | number | `0` | Controls Orator's internal trace logging |
| `UUID.DataCenter` | number | `0` | Data center ID for UUID generation |
| `UUID.Worker` | number | `0` | Worker ID for UUID generation |

## Example Configuration File

```json
{
	"Product": "MyAPIServer",
	"ProductVersion": "2.1.0",
	"ServicePort": 8080,

	"RestifyConfiguration": {
		"strictNext": true
	},

	"UUID": {
		"DataCenter": 0,
		"Worker": 1
	},

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

## Loading Configuration

```javascript
// Direct configuration
const _Fable = new libFable({
	Product: 'MyAPIServer',
	ServicePort: 8080
});

// From a JSON file
const _Fable = new libFable({
	ConfigFile: __dirname + '/config.json'
});

// Combined (direct settings override file settings)
const _Fable = new libFable({
	ConfigFile: __dirname + '/config.json',
	ServicePort: 9090  // Overrides whatever is in config.json
});
```
