/**
* Unit tests for Orator Static File Serving
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

const libOrator = require('../source/Orator.js');

const Chai = require("chai");
const Expect = Chai.expect;
const Assert = Chai.assert;

const libFable = require('fable');
const libPath = require('path');
const libHTTP = require('http');

const defaultFableSettings = (
	{
		Product:'Orator-StaticServingTests',
		ProductVersion: '0.0.0',
		APIServerPort: 0
	});

const _StaticContentPath = libPath.normalize(__dirname + '/static_content/');

// Port counter for test HTTP servers to avoid collisions
let _NextTestPort = 19100;
function getNextTestPort()
{
	return _NextTestPort++;
}

/**
 * Create a lightweight HTTP server that routes GET requests through Orator's IPC router.
 * This allows testing static file serving (which requires a real HTTP response stream)
 * without needing the orator-serviceserver-restify dependency.
 *
 * @param {Object} pOrator - The Orator instance with routes already registered.
 * @param {number} pPort - The port to listen on.
 * @param {Function} fCallback - Called with (server, port) when the server is ready.
 */
function createTestHTTPServer(pOrator, pPort, fCallback)
{
	let tmpServer = libHTTP.createServer(
		(pRequest, pResponse) =>
		{
			let tmpHandler = pOrator.serviceServer.router.find(pRequest.method, pRequest.url);
			if (tmpHandler)
			{
				pRequest.params = tmpHandler.params || {};
				pRequest.searchParams = tmpHandler.searchParams || {};
				tmpHandler.handler(pRequest, pResponse, null);
			}
			else
			{
				pResponse.writeHead(404);
				pResponse.end('Not found');
			}
		});

	tmpServer.listen(pPort,
		() =>
		{
			return fCallback(tmpServer, tmpServer.address().port);
		});
}

/**
 * Make an HTTP GET request and collect the response.
 *
 * @param {number} pPort - Port to connect to.
 * @param {string} pPath - URL path to request.
 * @param {Function} fCallback - Called with (error, statusCode, headers, body).
 * @param {Object} [pHeaders] - Optional extra headers for the request.
 */
function makeRequest(pPort, pPath, fCallback, pHeaders)
{
	let tmpOptions = (
		{
			hostname: 'localhost',
			port: pPort,
			path: pPath,
			method: 'GET',
			headers: Object.assign({}, pHeaders || {})
		});

	let tmpRequest = libHTTP.request(tmpOptions,
		(pResponse) =>
		{
			let tmpData = '';
			pResponse.on('data',
				(pChunk) =>
				{
					tmpData += pChunk;
				});
			pResponse.on('end',
				() =>
				{
					return fCallback(null, pResponse.statusCode, pResponse.headers, tmpData);
				});
		});

	tmpRequest.on('error',
		(pError) =>
		{
			return fCallback(pError);
		});

	tmpRequest.end();
}

suite
(
	'Orator',
	() =>
	{
		suite
		(
			'Static File Serving - Parameter Validation',
			() =>
			{
				test
				(
					'addStaticRoute should return false when no file path is provided',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.initialize(
							() =>
							{
								let tmpResult = tmpOrator.addStaticRoute();
								Expect(tmpResult).to.equal(false);
								tmpOrator.log.info('addStaticRoute correctly rejected missing file path');
								return fDone();
							});
					}
				);

				test
				(
					'addStaticRoute should reject non-string file paths',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.initialize(
							() =>
							{
								Expect(tmpOrator.addStaticRoute(42)).to.equal(false);
								Expect(tmpOrator.addStaticRoute(null)).to.equal(false);
								Expect(tmpOrator.addStaticRoute({})).to.equal(false);
								Expect(tmpOrator.addStaticRoute(true)).to.equal(false);
								Expect(tmpOrator.addStaticRoute(undefined)).to.equal(false);
								Expect(tmpOrator.addStaticRoute([])).to.equal(false);
								tmpOrator.log.info('addStaticRoute rejected all non-string file paths');
								return fDone();
							});
					}
				);

				test
				(
					'addStaticRoute should return true with a valid file path',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.initialize(
							() =>
							{
								let tmpResult = tmpOrator.addStaticRoute(_StaticContentPath);
								Expect(tmpResult).to.equal(true);
								tmpOrator.log.info(`addStaticRoute mapped [${_StaticContentPath}] successfully`);
								return fDone();
							});
					}
				);

				test
				(
					'addStaticRoute should accept all optional parameters',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.initialize(
							() =>
							{
								let tmpResult = tmpOrator.addStaticRoute(_StaticContentPath, 'about.html', '/content/*', '/content/', {maxAge: '1d'});
								Expect(tmpResult).to.equal(true);
								tmpOrator.log.info('addStaticRoute accepted all optional parameters');
								return fDone();
							});
					}
				);

				test
				(
					'addStaticRoute should use default route /* when no route is specified',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();

						let tmpResult = tmpOrator.addStaticRoute(_StaticContentPath);
						Expect(tmpResult).to.equal(true);

						// Verify the wildcard route is registered by checking the router
						let tmpHandler = tmpOrator.serviceServer.router.find('GET', '/anything');
						Expect(tmpHandler).to.not.equal(null);
						Expect(tmpHandler.handler).to.be.a('function');
						tmpOrator.log.info('Default wildcard route /* was registered');
						return fDone();
					}
				);

				test
				(
					'addStaticRoute should register a GET route on the service server',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();

						let tmpResult = tmpOrator.addStaticRoute(_StaticContentPath, 'index.html', '/static/*', '/static/');
						Expect(tmpResult).to.equal(true);

						// The route should match paths under /static/
						let tmpHandler = tmpOrator.serviceServer.router.find('GET', '/static/test.html');
						Expect(tmpHandler).to.not.equal(null);
						Expect(tmpHandler.handler).to.be.a('function');

						tmpOrator.log.info('Custom route /static/* was registered');
						return fDone();
					}
				);
			}
		);

		suite
		(
			'Static File Serving - MIME Type Detection',
			() =>
			{
				test
				(
					'setMimeHeader should set Content-Type for HTML files',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.initialize(
							() =>
							{
								// Trigger auto-registration of OratorStaticServer
								tmpOrator.addStaticRoute(_StaticContentPath);
								let tmpStaticServer = tmpFable.OratorStaticServer;

								let tmpCapturedHeaders = {};
								let tmpMockResponse = { setHeader: function(pName, pValue) { tmpCapturedHeaders[pName] = pValue; } };

								tmpStaticServer.setMimeHeader('index.html', tmpMockResponse);
								Expect(tmpCapturedHeaders['Content-Type']).to.equal('text/html');

								tmpStaticServer.setMimeHeader('/path/to/page.html', tmpMockResponse);
								Expect(tmpCapturedHeaders['Content-Type']).to.equal('text/html');

								tmpOrator.log.info('HTML MIME type correctly detected');
								return fDone();
							});
					}
				);

				test
				(
					'setMimeHeader should set Content-Type for CSS files',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.initialize(
							() =>
							{
								tmpOrator.addStaticRoute(_StaticContentPath);
								let tmpStaticServer = tmpFable.OratorStaticServer;

								let tmpCapturedHeaders = {};
								let tmpMockResponse = { setHeader: function(pName, pValue) { tmpCapturedHeaders[pName] = pValue; } };

								tmpStaticServer.setMimeHeader('style.css', tmpMockResponse);
								Expect(tmpCapturedHeaders['Content-Type']).to.equal('text/css');

								tmpOrator.log.info('CSS MIME type correctly detected');
								return fDone();
							});
					}
				);

				test
				(
					'setMimeHeader should set Content-Type for JSON files',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.initialize(
							() =>
							{
								tmpOrator.addStaticRoute(_StaticContentPath);
								let tmpStaticServer = tmpFable.OratorStaticServer;

								let tmpCapturedHeaders = {};
								let tmpMockResponse = { setHeader: function(pName, pValue) { tmpCapturedHeaders[pName] = pValue; } };

								tmpStaticServer.setMimeHeader('data.json', tmpMockResponse);
								Expect(tmpCapturedHeaders['Content-Type']).to.equal('application/json');

								tmpOrator.log.info('JSON MIME type correctly detected');
								return fDone();
							});
					}
				);

				test
				(
					'setMimeHeader should set Content-Type for JavaScript files',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.initialize(
							() =>
							{
								tmpOrator.addStaticRoute(_StaticContentPath);
								let tmpStaticServer = tmpFable.OratorStaticServer;

								let tmpCapturedHeaders = {};
								let tmpMockResponse = { setHeader: function(pName, pValue) { tmpCapturedHeaders[pName] = pValue; } };

								tmpStaticServer.setMimeHeader('app.js', tmpMockResponse);
								Expect(tmpCapturedHeaders['Content-Type']).to.equal('application/javascript');

								tmpOrator.log.info('JavaScript MIME type correctly detected');
								return fDone();
							});
					}
				);

				test
				(
					'setMimeHeader should set Content-Type for image files',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.initialize(
							() =>
							{
								tmpOrator.addStaticRoute(_StaticContentPath);
								let tmpStaticServer = tmpFable.OratorStaticServer;

								let tmpCapturedHeaders = {};
								let tmpMockResponse = { setHeader: function(pName, pValue) { tmpCapturedHeaders[pName] = pValue; } };

								tmpStaticServer.setMimeHeader('photo.png', tmpMockResponse);
								Expect(tmpCapturedHeaders['Content-Type']).to.equal('image/png');

								tmpStaticServer.setMimeHeader('logo.jpg', tmpMockResponse);
								Expect(tmpCapturedHeaders['Content-Type']).to.equal('image/jpeg');

								tmpStaticServer.setMimeHeader('icon.gif', tmpMockResponse);
								Expect(tmpCapturedHeaders['Content-Type']).to.equal('image/gif');

								tmpStaticServer.setMimeHeader('vector.svg', tmpMockResponse);
								Expect(tmpCapturedHeaders['Content-Type']).to.equal('image/svg+xml');

								tmpOrator.log.info('Image MIME types correctly detected');
								return fDone();
							});
					}
				);

				test
				(
					'setMimeHeader should set Content-Type for common web font and document types',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.initialize(
							() =>
							{
								tmpOrator.addStaticRoute(_StaticContentPath);
								let tmpStaticServer = tmpFable.OratorStaticServer;

								let tmpCapturedHeaders = {};
								let tmpMockResponse = { setHeader: function(pName, pValue) { tmpCapturedHeaders[pName] = pValue; } };

								tmpStaticServer.setMimeHeader('document.pdf', tmpMockResponse);
								Expect(tmpCapturedHeaders['Content-Type']).to.equal('application/pdf');

								tmpStaticServer.setMimeHeader('archive.zip', tmpMockResponse);
								Expect(tmpCapturedHeaders['Content-Type']).to.equal('application/zip');

								tmpStaticServer.setMimeHeader('data.xml', tmpMockResponse);
								Expect(tmpCapturedHeaders['Content-Type']).to.equal('application/xml');

								tmpStaticServer.setMimeHeader('readme.txt', tmpMockResponse);
								Expect(tmpCapturedHeaders['Content-Type']).to.equal('text/plain');

								tmpOrator.log.info('Document and archive MIME types correctly detected');
								return fDone();
							});
					}
				);

				test
				(
					'setMimeHeader should fall back to application/octet-stream for unknown extensions',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.initialize(
							() =>
							{
								tmpOrator.addStaticRoute(_StaticContentPath);
								let tmpStaticServer = tmpFable.OratorStaticServer;

								let tmpCapturedHeaders = {};
								let tmpMockResponse = { setHeader: function(pName, pValue) { tmpCapturedHeaders[pName] = pValue; } };

								tmpStaticServer.setMimeHeader('mystery.xyz123', tmpMockResponse);
								Expect(tmpCapturedHeaders['Content-Type']).to.equal('application/octet-stream');

								tmpStaticServer.setMimeHeader('noextension', tmpMockResponse);
								Expect(tmpCapturedHeaders['Content-Type']).to.equal('application/octet-stream');

								tmpOrator.log.info('Unknown MIME types fall back to application/octet-stream');
								return fDone();
							});
					}
				);

				test
				(
					'setMimeHeader should handle file paths with directories',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.initialize(
							() =>
							{
								tmpOrator.addStaticRoute(_StaticContentPath);
								let tmpStaticServer = tmpFable.OratorStaticServer;

								let tmpCapturedHeaders = {};
								let tmpMockResponse = { setHeader: function(pName, pValue) { tmpCapturedHeaders[pName] = pValue; } };

								tmpStaticServer.setMimeHeader('/assets/css/main.css', tmpMockResponse);
								Expect(tmpCapturedHeaders['Content-Type']).to.equal('text/css');

								tmpStaticServer.setMimeHeader('/deep/nested/path/to/image.png', tmpMockResponse);
								Expect(tmpCapturedHeaders['Content-Type']).to.equal('image/png');

								tmpOrator.log.info('MIME type detected correctly from paths with directories');
								return fDone();
							});
					}
				);
			}
		);

		suite
		(
			'Static File Serving - Serving HTML Files',
			() =>
			{
				test
				(
					'should serve index.html with correct content and Content-Type',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();
						tmpOrator.addStaticRoute(_StaticContentPath);

						let tmpPort = getNextTestPort();
						createTestHTTPServer(tmpOrator, tmpPort,
							(pServer, pActualPort) =>
							{
								makeRequest(pActualPort, '/index.html',
									(pError, pStatusCode, pHeaders, pBody) =>
									{
										Expect(pError).to.equal(null);
										Expect(pStatusCode).to.equal(200);
										Expect(pHeaders['content-type']).to.contain('text/html');
										Expect(pBody).to.contain('Test Index');
										Expect(pBody).to.contain('Welcome to the test server');
										tmpOrator.log.info(`Served index.html: status=${pStatusCode} content-type=${pHeaders['content-type']}`);
										pServer.close();
										return fDone();
									});
							});
					}
				);

				test
				(
					'should serve about.html with correct content',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();
						tmpOrator.addStaticRoute(_StaticContentPath);

						let tmpPort = getNextTestPort();
						createTestHTTPServer(tmpOrator, tmpPort,
							(pServer, pActualPort) =>
							{
								makeRequest(pActualPort, '/about.html',
									(pError, pStatusCode, pHeaders, pBody) =>
									{
										Expect(pError).to.equal(null);
										Expect(pStatusCode).to.equal(200);
										Expect(pHeaders['content-type']).to.contain('text/html');
										Expect(pBody).to.contain('About');
										Expect(pBody).to.contain('About page content');
										tmpOrator.log.info(`Served about.html: status=${pStatusCode}`);
										pServer.close();
										return fDone();
									});
							});
					}
				);

				test
				(
					'should serve default file (index.html) when requesting the root path',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();
						tmpOrator.addStaticRoute(_StaticContentPath);

						let tmpPort = getNextTestPort();
						createTestHTTPServer(tmpOrator, tmpPort,
							(pServer, pActualPort) =>
							{
								makeRequest(pActualPort, '/',
									(pError, pStatusCode, pHeaders, pBody) =>
									{
										Expect(pError).to.equal(null);
										Expect(pStatusCode).to.equal(200);
										// The Content-Type should be text/html even when requesting '/' (no extension)
										Expect(pHeaders['content-type']).to.contain('text/html');
										Expect(pBody).to.contain('Test Index');
										tmpOrator.log.info(`Root path served default index.html: status=${pStatusCode} content-type=${pHeaders['content-type']}`);
										pServer.close();
										return fDone();
									});
							});
					}
				);

				test
				(
					'should serve a custom default file when specified',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();
						// Set about.html as the default file
						tmpOrator.addStaticRoute(_StaticContentPath, 'about.html');

						let tmpPort = getNextTestPort();
						createTestHTTPServer(tmpOrator, tmpPort,
							(pServer, pActualPort) =>
							{
								makeRequest(pActualPort, '/',
									(pError, pStatusCode, pHeaders, pBody) =>
									{
										Expect(pError).to.equal(null);
										Expect(pStatusCode).to.equal(200);
										// Even with a custom default file, Content-Type should be text/html
										Expect(pHeaders['content-type']).to.contain('text/html');
										Expect(pBody).to.contain('About page content');
										tmpOrator.log.info(`Custom default file about.html served: status=${pStatusCode} content-type=${pHeaders['content-type']}`);
										pServer.close();
										return fDone();
									});
							});
					}
				);
			}
		);

		suite
		(
			'Static File Serving - Directory MIME Type Resolution',
			() =>
			{
				test
				(
					'should set text/html Content-Type for directory paths with html default file',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();
						tmpOrator.addStaticRoute(_StaticContentPath, 'index.html', '/site/*', '/site/');

						let tmpPort = getNextTestPort();
						createTestHTTPServer(tmpOrator, tmpPort,
							(pServer, pActualPort) =>
							{
								makeRequest(pActualPort, '/site/',
									(pError, pStatusCode, pHeaders, pBody) =>
									{
										Expect(pError).to.equal(null);
										Expect(pStatusCode).to.equal(200);
										// Directory path should resolve MIME from default file, not the bare '/'
										Expect(pHeaders['content-type']).to.contain('text/html');
										Expect(pBody).to.contain('Test Index');
										tmpOrator.log.info(`Directory path MIME resolved to text/html from default file`);
										pServer.close();
										return fDone();
									});
							});
					}
				);

				test
				(
					'should set correct Content-Type for extensionless paths based on default file',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.initialize(
							() =>
							{
								// Trigger auto-registration of OratorStaticServer
								tmpOrator.addStaticRoute(_StaticContentPath);
								let tmpStaticServer = tmpFable.OratorStaticServer;

								// Test the MIME detection logic directly with a mock response
								let tmpCapturedHeaders = {};
								let tmpMockResponse = { setHeader: function(pName, pValue) { tmpCapturedHeaders[pName] = pValue; } };

								// A URL like '/' has no extension, so should fall back to default
								// This simulates what happens in addStaticRoute after the fix
								let tmpUrl = '/';
								let tmpMimeTarget = tmpUrl;
								if (tmpMimeTarget.endsWith('/') || tmpMimeTarget.indexOf('.') < 0)
								{
									tmpMimeTarget = 'index.html';
								}
								tmpStaticServer.setMimeHeader(tmpMimeTarget, tmpMockResponse);
								Expect(tmpCapturedHeaders['Content-Type']).to.equal('text/html');

								// A URL like '/somepath' (no extension, no slash) should also fall back
								tmpUrl = '/somepath';
								tmpMimeTarget = tmpUrl;
								if (tmpMimeTarget.endsWith('/') || tmpMimeTarget.indexOf('.') < 0)
								{
									tmpMimeTarget = 'index.html';
								}
								tmpStaticServer.setMimeHeader(tmpMimeTarget, tmpMockResponse);
								Expect(tmpCapturedHeaders['Content-Type']).to.equal('text/html');

								// A URL with an extension should use its own extension
								tmpUrl = '/style.css';
								tmpMimeTarget = tmpUrl;
								if (tmpMimeTarget.endsWith('/') || tmpMimeTarget.indexOf('.') < 0)
								{
									tmpMimeTarget = 'index.html';
								}
								tmpStaticServer.setMimeHeader(tmpMimeTarget, tmpMockResponse);
								Expect(tmpCapturedHeaders['Content-Type']).to.equal('text/css');

								tmpOrator.log.info('Directory and extensionless MIME detection verified');
								return fDone();
							});
					}
				);
			}
		);

		suite
		(
			'Static File Serving - FilePersistence Auto-Instantiation',
			() =>
			{
				test
				(
					'addStaticRoute should auto-instantiate FilePersistence if not present',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						// Verify FilePersistence is NOT yet on fable before Orator construction
						Expect(tmpFable.FilePersistence).to.equal(undefined);

						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.initialize(
							() =>
							{
								// FilePersistence is auto-instantiated by OratorStaticServer.addStaticRoute
								tmpOrator.addStaticRoute(_StaticContentPath);

								Expect(tmpFable.FilePersistence).to.be.an('object');
								Expect(tmpFable.FilePersistence.libFS).to.be.an('object');
								Expect(tmpFable.FilePersistence.libFS.existsSync).to.be.a('function');
								tmpOrator.log.info('FilePersistence auto-instantiated by addStaticRoute');
								return fDone();
							});
					}
				);

				test
				(
					'addStaticRoute should not re-instantiate FilePersistence if already present',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						// Pre-instantiate FilePersistence
						let tmpOriginal = tmpFable.serviceManager.instantiateServiceProvider('FilePersistence');
						Expect(tmpFable.FilePersistence).to.equal(tmpOriginal);

						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.initialize(
							() =>
							{
								tmpOrator.addStaticRoute(_StaticContentPath);

								// Should still be the same instance, not a new one
								Expect(tmpFable.FilePersistence).to.equal(tmpOriginal);
								tmpOrator.log.info('FilePersistence preserved when already present');
								return fDone();
							});
					}
				);
			}
		);

		suite
		(
			'Static File Serving - CSS and JSON Files',
			() =>
			{
				test
				(
					'should serve CSS files with correct Content-Type',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();
						tmpOrator.addStaticRoute(_StaticContentPath);

						let tmpPort = getNextTestPort();
						createTestHTTPServer(tmpOrator, tmpPort,
							(pServer, pActualPort) =>
							{
								makeRequest(pActualPort, '/style.css',
									(pError, pStatusCode, pHeaders, pBody) =>
									{
										Expect(pError).to.equal(null);
										Expect(pStatusCode).to.equal(200);
										Expect(pHeaders['content-type']).to.contain('text/css');
										Expect(pBody).to.contain('font-family');
										Expect(pBody).to.contain('sans-serif');
										tmpOrator.log.info(`Served style.css: content-type=${pHeaders['content-type']}`);
										pServer.close();
										return fDone();
									});
							});
					}
				);

				test
				(
					'should serve JSON files with correct Content-Type and parseable content',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();
						tmpOrator.addStaticRoute(_StaticContentPath);

						let tmpPort = getNextTestPort();
						createTestHTTPServer(tmpOrator, tmpPort,
							(pServer, pActualPort) =>
							{
								makeRequest(pActualPort, '/data.json',
									(pError, pStatusCode, pHeaders, pBody) =>
									{
										Expect(pError).to.equal(null);
										Expect(pStatusCode).to.equal(200);
										Expect(pHeaders['content-type']).to.contain('application/json');
										let tmpParsed = JSON.parse(pBody);
										Expect(tmpParsed).to.have.a.property('TestKey');
										Expect(tmpParsed.TestKey).to.equal('TestValue');
										Expect(tmpParsed.Numbers).to.be.an('array');
										Expect(tmpParsed.Numbers).to.have.lengthOf(3);
										tmpOrator.log.info(`Served data.json: parsed successfully with TestKey=${tmpParsed.TestKey}`);
										pServer.close();
										return fDone();
									});
							});
					}
				);
			}
		);

		suite
		(
			'Static File Serving - Route Stripping',
			() =>
			{
				test
				(
					'should strip route prefix from URL before serving files',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();
						// Serve static content at /assets/* and strip /assets/ from the path
						tmpOrator.addStaticRoute(_StaticContentPath, 'index.html', '/assets/*', '/assets/');

						let tmpPort = getNextTestPort();
						createTestHTTPServer(tmpOrator, tmpPort,
							(pServer, pActualPort) =>
							{
								makeRequest(pActualPort, '/assets/style.css',
									(pError, pStatusCode, pHeaders, pBody) =>
									{
										Expect(pError).to.equal(null);
										Expect(pStatusCode).to.equal(200);
										Expect(pHeaders['content-type']).to.contain('text/css');
										Expect(pBody).to.contain('font-family');
										tmpOrator.log.info(`Route stripping: /assets/style.css served correctly with content-type=${pHeaders['content-type']}`);
										pServer.close();
										return fDone();
									});
							});
					}
				);

				test
				(
					'should serve the default file at the stripped route root',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();
						tmpOrator.addStaticRoute(_StaticContentPath, 'index.html', '/docs/*', '/docs/');

						let tmpPort = getNextTestPort();
						createTestHTTPServer(tmpOrator, tmpPort,
							(pServer, pActualPort) =>
							{
								makeRequest(pActualPort, '/docs/',
									(pError, pStatusCode, pHeaders, pBody) =>
									{
										Expect(pError).to.equal(null);
										Expect(pStatusCode).to.equal(200);
										Expect(pBody).to.contain('Test Index');
										tmpOrator.log.info(`Route root /docs/ served default index.html`);
										pServer.close();
										return fDone();
									});
							});
					}
				);

				test
				(
					'should serve JSON through a stripped route',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();
						tmpOrator.addStaticRoute(_StaticContentPath, 'index.html', '/api/static/*', '/api/static/');

						let tmpPort = getNextTestPort();
						createTestHTTPServer(tmpOrator, tmpPort,
							(pServer, pActualPort) =>
							{
								makeRequest(pActualPort, '/api/static/data.json',
									(pError, pStatusCode, pHeaders, pBody) =>
									{
										Expect(pError).to.equal(null);
										Expect(pStatusCode).to.equal(200);
										Expect(pHeaders['content-type']).to.contain('application/json');
										let tmpParsed = JSON.parse(pBody);
										Expect(tmpParsed.TestKey).to.equal('TestValue');
										tmpOrator.log.info(`Served data.json through stripped route /api/static/data.json`);
										pServer.close();
										return fDone();
									});
							});
					}
				);
			}
		);

		suite
		(
			'Static File Serving - Query String Handling',
			() =>
			{
				test
				(
					'should strip query strings from URLs before serving files',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();
						tmpOrator.addStaticRoute(_StaticContentPath);

						let tmpPort = getNextTestPort();
						createTestHTTPServer(tmpOrator, tmpPort,
							(pServer, pActualPort) =>
							{
								makeRequest(pActualPort, '/style.css?v=1.0.0&bust=true',
									(pError, pStatusCode, pHeaders, pBody) =>
									{
										Expect(pError).to.equal(null);
										Expect(pStatusCode).to.equal(200);
										Expect(pHeaders['content-type']).to.contain('text/css');
										Expect(pBody).to.contain('font-family');
										tmpOrator.log.info('Query string was stripped and file served correctly');
										pServer.close();
										return fDone();
									});
							});
					}
				);
			}
		);

		suite
		(
			'Static File Serving - Missing Files',
			() =>
			{
				test
				(
					'should return 404 for a file that does not exist',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();
						tmpOrator.addStaticRoute(_StaticContentPath);

						let tmpPort = getNextTestPort();
						createTestHTTPServer(tmpOrator, tmpPort,
							(pServer, pActualPort) =>
							{
								makeRequest(pActualPort, '/nonexistent.html',
									(pError, pStatusCode, pHeaders, pBody) =>
									{
										Expect(pError).to.equal(null);
										Expect(pStatusCode).to.equal(404);
										tmpOrator.log.info(`Missing file correctly returned 404`);
										pServer.close();
										return fDone();
									});
							});
					}
				);

				test
				(
					'should return 404 for a path traversal attempt',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();
						tmpOrator.addStaticRoute(_StaticContentPath, 'index.html', '/safe/*', '/safe/');

						let tmpPort = getNextTestPort();
						createTestHTTPServer(tmpOrator, tmpPort,
							(pServer, pActualPort) =>
							{
								makeRequest(pActualPort, '/safe/../../../etc/passwd',
									(pError, pStatusCode, pHeaders, pBody) =>
									{
										Expect(pError).to.equal(null);
										// serve-static should prevent path traversal
										Expect(pStatusCode).to.be.oneOf([400, 403, 404]);
										tmpOrator.log.info(`Path traversal attempt correctly blocked with status ${pStatusCode}`);
										pServer.close();
										return fDone();
									});
							});
					}
				);
			}
		);

		suite
		(
			'Static File Serving - Response Headers',
			() =>
			{
				test
				(
					'should include standard caching headers in responses',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();
						tmpOrator.addStaticRoute(_StaticContentPath);

						let tmpPort = getNextTestPort();
						createTestHTTPServer(tmpOrator, tmpPort,
							(pServer, pActualPort) =>
							{
								makeRequest(pActualPort, '/index.html',
									(pError, pStatusCode, pHeaders, pBody) =>
									{
										Expect(pError).to.equal(null);
										Expect(pStatusCode).to.equal(200);
										// serve-static sets these headers by default
										Expect(pHeaders).to.have.a.property('etag');
										Expect(pHeaders).to.have.a.property('last-modified');
										Expect(pHeaders).to.have.a.property('content-length');
										Expect(pHeaders).to.have.a.property('accept-ranges');
										tmpOrator.log.info(`Standard headers present: etag=${pHeaders['etag']} last-modified=${pHeaders['last-modified']}`);
										pServer.close();
										return fDone();
									});
							});
					}
				);

				test
				(
					'should pass custom serve-static params through to the library',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();
						// Pass maxAge as a custom parameter to serve-static
						tmpOrator.addStaticRoute(_StaticContentPath, 'index.html', '/*', '/', {maxAge: 86400000});

						let tmpPort = getNextTestPort();
						createTestHTTPServer(tmpOrator, tmpPort,
							(pServer, pActualPort) =>
							{
								makeRequest(pActualPort, '/index.html',
									(pError, pStatusCode, pHeaders, pBody) =>
									{
										Expect(pError).to.equal(null);
										Expect(pStatusCode).to.equal(200);
										// maxAge should be reflected in the Cache-Control header
										Expect(pHeaders['cache-control']).to.contain('max-age=86400');
										tmpOrator.log.info(`Custom params applied: cache-control=${pHeaders['cache-control']}`);
										pServer.close();
										return fDone();
									});
							});
					}
				);
			}
		);

		suite
		(
			'Static File Serving - Subdomain Magic Subfolder Routing',
			() =>
			{
				test
				(
					'should serve from a subfolder when the hostname matches an existing subfolder',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						// FilePersistence is now auto-instantiated by OratorStaticServer.addStaticRoute
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();
						tmpOrator.addStaticRoute(_StaticContentPath);

						let tmpPort = getNextTestPort();
						createTestHTTPServer(tmpOrator, tmpPort,
							(pServer, pActualPort) =>
							{
								// Request with host 'subsite.example.com' -- the 'subsite' prefix matches the subfolder
								makeRequest(pActualPort, '/',
									(pError, pStatusCode, pHeaders, pBody) =>
									{
										Expect(pError).to.equal(null);
										Expect(pStatusCode).to.equal(200);
										// Should serve from static_content/subsite/index.html
										Expect(pBody).to.contain('Subsite');
										Expect(pBody).to.contain('Subsite index page');
										tmpOrator.log.info(`Subdomain magic routing: host=subsite.example.com served subsite content`);
										pServer.close();
										return fDone();
									},
									{ 'Host': 'subsite.example.com' });
							});
					}
				);

				test
				(
					'should serve from the root folder when the hostname does not match any subfolder',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						// FilePersistence is now auto-instantiated by OratorStaticServer.addStaticRoute
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();
						tmpOrator.addStaticRoute(_StaticContentPath);

						let tmpPort = getNextTestPort();
						createTestHTTPServer(tmpOrator, tmpPort,
							(pServer, pActualPort) =>
							{
								// Request with host 'nonexistent.example.com' -- no matching subfolder
								makeRequest(pActualPort, '/',
									(pError, pStatusCode, pHeaders, pBody) =>
									{
										Expect(pError).to.equal(null);
										Expect(pStatusCode).to.equal(200);
										// Should serve from static_content/index.html (root)
										Expect(pBody).to.contain('Test Index');
										tmpOrator.log.info(`Non-matching subdomain served root content correctly`);
										pServer.close();
										return fDone();
									},
									{ 'Host': 'nonexistent.example.com' });
							});
					}
				);

				test
				(
					'should serve from the root folder when hostname has only one segment (no dots)',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();
						tmpOrator.addStaticRoute(_StaticContentPath);

						let tmpPort = getNextTestPort();
						createTestHTTPServer(tmpOrator, tmpPort,
							(pServer, pActualPort) =>
							{
								// 'localhost' has no dots, so no subdomain magic should apply
								makeRequest(pActualPort, '/',
									(pError, pStatusCode, pHeaders, pBody) =>
									{
										Expect(pError).to.equal(null);
										Expect(pStatusCode).to.equal(200);
										Expect(pBody).to.contain('Test Index');
										tmpOrator.log.info(`Single-segment hostname served root content`);
										pServer.close();
										return fDone();
									},
									{ 'Host': 'localhost' });
							});
					}
				);
			}
		);

		suite
		(
			'Static File Serving - Subsite Direct Access',
			() =>
			{
				test
				(
					'should serve files from a subdirectory path directly',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();
						tmpOrator.addStaticRoute(_StaticContentPath);

						let tmpPort = getNextTestPort();
						createTestHTTPServer(tmpOrator, tmpPort,
							(pServer, pActualPort) =>
							{
								makeRequest(pActualPort, '/subsite/index.html',
									(pError, pStatusCode, pHeaders, pBody) =>
									{
										Expect(pError).to.equal(null);
										Expect(pStatusCode).to.equal(200);
										Expect(pHeaders['content-type']).to.contain('text/html');
										Expect(pBody).to.contain('Subsite');
										tmpOrator.log.info(`Subsite direct path access: /subsite/index.html served correctly`);
										pServer.close();
										return fDone();
									});
							});
					}
				);
			}
		);

		suite
		(
			'Static File Serving - Multiple Static Routes',
			() =>
			{
				test
				(
					'should be able to register multiple static routes on different paths',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();

						// Register the subsite as a separate static route
						let tmpSubsitePath = libPath.normalize(__dirname + '/static_content/subsite/');
						let tmpResult1 = tmpOrator.addStaticRoute(_StaticContentPath, 'index.html', '/main/*', '/main/');
						let tmpResult2 = tmpOrator.addStaticRoute(tmpSubsitePath, 'index.html', '/sub/*', '/sub/');

						Expect(tmpResult1).to.equal(true);
						Expect(tmpResult2).to.equal(true);

						let tmpPort = getNextTestPort();
						createTestHTTPServer(tmpOrator, tmpPort,
							(pServer, pActualPort) =>
							{
								tmpFable.Utility.waterfall([
										(fStageComplete) =>
										{
											makeRequest(pActualPort, '/main/data.json',
												(pError, pStatusCode, pHeaders, pBody) =>
												{
													Expect(pStatusCode).to.equal(200);
													let tmpParsed = JSON.parse(pBody);
													Expect(tmpParsed.TestKey).to.equal('TestValue');
													tmpOrator.log.info('Route /main/ served data.json from main content');
													return fStageComplete();
												});
										},
										(fStageComplete) =>
										{
											makeRequest(pActualPort, '/sub/',
												(pError, pStatusCode, pHeaders, pBody) =>
												{
													Expect(pStatusCode).to.equal(200);
													Expect(pBody).to.contain('Subsite');
													tmpOrator.log.info('Route /sub/ served index.html from subsite content');
													return fStageComplete();
												});
										}
									],
									(pError) =>
									{
										pServer.close();
										return fDone();
									});
							});
					}
				);
			}
		);

		suite
		(
			'Static File Serving - oldLibMime Compatibility Flag',
			() =>
			{
				test
				(
					'should correctly detect the mime library version',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.initialize(
							() =>
							{
								// Trigger auto-registration of OratorStaticServer
								tmpOrator.addStaticRoute(_StaticContentPath);
								let tmpStaticServer = tmpFable.OratorStaticServer;

								// The oldLibMime flag should be a boolean
								Expect(tmpStaticServer.oldLibMime).to.be.a('boolean');
								tmpOrator.log.info(`oldLibMime flag is ${tmpStaticServer.oldLibMime}`);
								return fDone();
							});
					}
				);
			}
		);
	}
);
