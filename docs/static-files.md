# Static File Serving

Orator includes built-in static file serving through the `addStaticRoute` method. This serves files from a local directory over HTTP, with support for subdomain-based folder routing and MIME type detection.

## Basic Usage

```javascript
// Serve files from ./public, defaulting to index.html
_Fable.Orator.addStaticRoute('./public/');
```

This maps all incoming requests to files in the `./public/` directory. A request to `/styles.css` would serve `./public/styles.css`.

## Parameters

```javascript
_Fable.Orator.addStaticRoute(pFilePath, pDefaultFile, pRoute, pRouteStrip, pParams);
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `pFilePath` | string | *required* | Path to the directory to serve files from |
| `pDefaultFile` | string | `"index.html"` | Default file when no specific file is requested |
| `pRoute` | string | `"/*"` | Route pattern to match for static file requests |
| `pRouteStrip` | string | `"/"` | Prefix to strip from URL paths before looking up files |
| `pParams` | object | `{}` | Additional options passed to the `serve-static` library |

## Route Stripping

The `pRouteStrip` parameter removes a prefix from the URL before mapping it to the filesystem. This is useful when your static files are served under a subpath:

```javascript
// Serve /app/styles.css from ./dist/styles.css
_Fable.Orator.addStaticRoute('./dist/', 'index.html', '/app/*', '/app/');
```

## Subdomain Magic Hosting

Orator has a built-in feature for subdomain-based folder routing. When a request comes in with a subdomain prefix, Orator checks if a matching subfolder exists in the serve directory. If it does, files are served from that subfolder instead.

For example, with a serve path of `./sites/`:

- A request to `http://clienta.example.com/page.html` would check for `./sites/clienta/page.html`
- If `./sites/clienta/` exists, it serves from there
- If not, it falls back to `./sites/page.html`

This enables a simple multi-tenant static hosting setup without any additional configuration.

## MIME Type Detection

Orator automatically sets the `Content-Type` header based on the file extension. It uses the `mime` library for detection and falls back to `application/octet-stream` for unknown types.

## Example: Single Page Application

A common pattern is serving a single page application where all routes should fall back to `index.html`:

```javascript
// Serve the SPA from ./dist, all routes map to index.html
_Fable.Orator.addStaticRoute('./dist/', 'index.html', '/*');
```

## Example: API Server with Static Frontend

```javascript
// Set up API routes first
_Fable.Orator.serviceServer.get('/api/data',
	(pRequest, pResponse, fNext) =>
	{
		pResponse.send({ value: 42 });
		return fNext();
	});

// Then serve static files for everything else
_Fable.Orator.addStaticRoute('./public/', 'index.html', '/*');
```
