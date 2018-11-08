// ##### Part of the **[retold](https://stevenvelozo.github.io/retold/)** system
/**
* @license MIT
* @author <steven@velozo.com>
*/

/**
* Orator Web API Server
*
* @class Orator
* @constructor
*/
var Orator = function()
{
	var createNew = function(pSettings)
	{
		// This object requires a settings object
		if (typeof(pSettings) !== 'object')
		{
			return {new: createNew};
		}

		// Restify for the routing and API serving
		var libRestify = require('restify');
		// NodeGrind for request profiling
		var libNodegrind = false;
		// FS for writing out profiling information
		var libFS = require('fs');
		// Cluster API for spawning multiple worker processes
		var libCluster = require('cluster');
		// HTTP Forward Proxy
		var libHttpForward = require('http-forward');
		var _ProxyRoutes = [];

		// This state is used to lazily initialize the Native Restify Modules on route creation the first time
		var _RestifyParsersInitialized = false;

		// Build the server settings
		var _SettingsDefaults = (
		{
			Product: 'Orator',

			RestifyParsers: (
			{
				AcceptParser: true,   // Limit requests to well-formed content types.
				Authorization: true,  // Parse the authorization header (Basic and Signature auth types).
				Date: false,          // Parses out the HTTP Date header (if present) and checks for clock skew (default allowed clock skew is 300s, like Kerberos).
				CORS: false,          // Supports tacking CORS headers into actual requests (as defined by the spec).
				FullResponse: false,  // Automatically parse the OPTIONS headers for CORS to work
				Query: true,          // Parses the HTTP query string (i.e., /foo?id=bar&name=mark). If you use this, the parsed content will always be available in
				                      // req.query, additionally params are merged into req.params. You can disable by passing in mapParams: false in the options object.
				JsonP: false,         // Supports checking the query string for callback or jsonp and ensuring that the content-type is appropriately set.
				GZip: false,          // If the client sends an accept-encoding: gzip header (or one with an appropriate q-val), then the server will automatically gzip all response data.
				Body: true,           // Blocks your chain on reading and parsing the HTTP request body. Switches on Content-Type and does the appropriate logic.
				Throttle: false,      // You define "global" request rate and burst rate, and you can define overrides for specific keys.  (this can also be done per route)
				Conditional: false    // You can use this handler to let clients do nice HTTP semantics with the "match" headers.
			}),

			// By default don't map parameters from the query string to the param string
			BodyParserParameters: (
			{
				//maxBodySize: 0,
				//mapFiles: false,
				//overrideParams: false,
				//multipartHandler: function(pPart)
				//	{
				//		pPart.on('data',
				//			function(pData)
				//			{
				//				// Do something with pData
				//			}
				//		);
				//	},
				//multipartFileHandler: function(pPart)
				//	{
				//		pPart.on('data',
				//			function(pData)
				//			{
				//				// Do something with pData
				//			}
				//		);
				//	},
				//keepExtensions: false,
				//uploadDir: os.tmpdir(),
				//multiples: true,
				mapParams: false
			}),

			QueryParserParameters: (
			{
				mapParams: true
			}),

			ThrottleParserParameters: (
			{
				burst: 100,
				rate: 50,
				ip: true,
				overrides: (
				{
					'127.0.0.1': (
					{
						rate: 0,  // Unlimited throttle for this IP
						burst: 0
					})
				})
			}),

			// This is used as the base object for instantiating the server.  You can add custom parsers and formatters safely with lambdas here.
			RawServerParameters: {},

			// Turning these on decreases speed dramatically, and generates a cachegrind file for each request.
			Profiling: (
			{
				// Tracelog is just log-based request timing encapsulation.
				TraceLog: false,

				// Requestlog is to log each request ID and Session ID.
				RequestLog: false,

				// These profiling settings determine if we generate cpu or call graphs
				Enabled: false,
				Folder: '/tmp/',
				// Currently supported profile types: CallGrinder or ChromeCPU
				Type: 'CallGrinder'
			}),

			// Turning this on logs stack traces
			LogStackTraces: true
		});

		var _Fable = require('fable').new(pSettings);
		// Merge in passed-in settings
		_Fable.settingsManager.fill(_SettingsDefaults);

		// The Request UUID Generator
		var libRequestUUID = require('fable-uuid').new(_Fable.settings);

		/*** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** ***
		 * This block of code begins the initialization of the web server.
		 */

		// Create the raw web server parameters object
		var _WebServerParameters = _Fable.settings.RawServerParameters;
		// We are lazily initializing this now, so parameters can change before init.
		var _WebServer;

		/**
		* Connect any configured restify modules that automatically map header content into the request object
		*
		* @method inititalizeHeaderParsers
		*/
		var initializeHeaderParsers = function(pSettings, pWebServer)
		{
			// -- ProxyHandler needs to run before any others manipulate incoming data
			pWebServer.pre(proxyHandler);

			if (pSettings.RestifyParsers.CORS)
			{
				pWebServer.use(libRestify.CORS({credentials:true})); //by default if CORS is enabled, then also enable 'Allow-Credentials' header for AJAX
				//respond with 200 OK to all preflight requests
				pWebServer.opts(/\.*/, function (pRequest, pResponse, next)
				{
					var origin = pRequest.headers.origin;
			        pResponse.header('Access-Control-Allow-Origin', origin);
			        pResponse.header('Access-Control-Allow-Credentials', true);
			        pResponse.header('Access-Control-Allow-Headers', getHeader(pRequest, "Access-Control-Request-Headers") || "content-type");
			        pResponse.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
				    pResponse.send(200);
				    return next();
				});
			}
			if (pSettings.RestifyParsers.FullResponse)
			{
				pWebServer.use(libRestify.plugins.fullResponse());
			}
			if (pSettings.RestifyParsers.AcceptParser)
			{
				pWebServer.use(libRestify.plugins.acceptParser(pWebServer.acceptable));
			}
			if (pSettings.RestifyParsers.Authorization)
			{
				pWebServer.use(libRestify.plugins.authorizationParser());
			}
			if (pSettings.RestifyParsers.Date)
			{
				pWebServer.use(libRestify.plugins.dateParser());
			}
		};

		/**
		* Get Request header, regardless of case-sensitivity and whitespace
		*
		* @method getHeader
		*/
		var getHeader = function(pRequest, pHeaderName)
		{
			if (pRequest.headers)
			{
				for(var name in pRequest.headers)
				{
					if (name.trim().toLowerCase() == pHeaderName.trim().toLowerCase())
						return pRequest.headers[name];
				}
			}

			return "";
		}

		/**
		* Connect any configured restify modules that work directly with the query/body/response data
		*
		* @method initializeContentParsers
		*/
		var initializeContentParsers = function(pSettings, pWebServer)
		{
			if (pSettings.RestifyParsers.Query)
			{
				pWebServer.use(libRestify.plugins.queryParser());
			}
			if (pSettings.RestifyParsers.JsonP)
			{
				pWebServer.use(libRestify.plugins.jsonp());
			}
			if (pSettings.RestifyParsers.GZip)
			{
				pWebServer.use(libRestify.plugins.gzipResponse());
			}
			if (pSettings.RestifyParsers.Body)
			{
				pWebServer.use(libRestify.plugins.bodyParser(pSettings.BodyParserParameters));
			}
		};

		/**
		* Connect any configured restify modules that affect load capability and route branching
		*
		* @method initializeLogicParsers
		*/
		var initializeLogicParsers = function(pSettings, pWebServer)
		{
			if (pSettings.RestifyParsers.Throttle)
			{
				pWebServer.use(libRestify.plugins.throttle(pSettings.ThrottleParserParameters));
			}
			if (pSettings.RestifyParsers.Conditional)
			{
				pWebServer.use(libRestify.plugins.conditionalRequest());
			}
		};

		/**
		* Check that modules are initialized, initialize them if they aren't.
		*
		* @method checkModules
		*/
		var checkModules = function()
		{
			// Lazily initialize the Restify parsers the first time we access this object.
			// This creates a behavior where changing the "enabledModules" property does not
			//     do anything after routes have been created.  We may want to eventually
			//     throw a warning (and ignroe the change) if someone accesses the property 
			//     after _RestifyParsersInitialized is true.
			if (!_RestifyParsersInitialized)
			{
				_RestifyParsersInitialized = true;
				initializeHeaderParsers(_Fable.settings, _WebServer);
				initializeContentParsers(_Fable.settings, _WebServer);
				initializeLogicParsers(_Fable.settings, _WebServer);
				_WebServer.on
				(
					'uncaughtException',
					function (pRequest, pResponse, pRoute, pError)
					{
						if (typeof(_Fable.settings.UncaughtExceptionHook) === 'function')
						{
							_Fable.settings.UncaughtExceptionHook(pRequest, pResponse, pRoute, pError);
						}
						if (_Fable.settings.LogStackTraces)
						{
							_Fable.log.error('Request error', {Error:true, Stack:pError.stack});
						}
					}
				);
			}
		};


		var initializeInstrumentation = function()
		{
			/***
			 * Hook the profiler in
			 */
			_WebServer.pre
			(
				function (pRequest, pResponse, fNext)
				{
					pRequest.RequestUUID = 'REQ'+libRequestUUID.getUUID();

					if (_Fable.settings.Profiling.RequestLog)
					{
						_Fable.log.info('Request', {ClientIP:pRequest.connection.remoteAddress, RequestUUID:pRequest.RequestUUID});
					}

					if (_Fable.settings.Profiling.TraceLog)
					{
						_Fable.log.trace('Request start...',{RequestUUID: pRequest.RequestUUID});
					}

					if (_Fable.settings.Profiling.Enabled)
					{
						// Lazily load NodeGrind
						if (!libNodegrind)
						{
							libNodegrind = require('nodegrind');
						}
						// If profiling is enabled, build a callgrind file
						_Fable.log.debug('Request '+pRequest.RequestUUID+' starting with full profiling...');
						pRequest.ProfilerName = _Fable.settings.Product+'-'+_Fable.settings.ProductVersion+'-'+pRequest.RequestUUID;
						libNodegrind.startCPU(pRequest.RequestUUID);
					}

					return fNext();
				}
			);

			_WebServer.on
			(
				'after',
				function (pRequest, pResponse)
				{
					if (_Fable.settings.Profiling.TraceLog)
					{
						_Fable.log.trace("... Request finished.",{RequestUUID: pRequest.RequestUUID, ResponseCode: pResponse.code, ResponseLength: pResponse.contentLength});
					}

					if (typeof(pRequest.ProfilerName) === 'string')
					{
						var tmpRequestProfile = '';
						var tmpRequestProfilePrefix = '';
						var tmpRequestProfilePostfix = '';

						if (_Fable.settings.Profiling.Type === 'CallGrinder')
						{
							// Get the callgrind profile as a string
							tmpRequestProfile = libNodegrind.stopCPU(pRequest.RequestUUID);
							tmpRequestProfilePrefix = 'callgrind.';
						}
						else
						{
							// Alternatively, get a Chrome *.cpuprofile that you can load into the Chrome
							// profiler (right-click on 'Profiles' in left pane in the 'Profiles' tab)
							tmpRequestProfile = libNodegrind.stopCPU(pRequest.RequestUUID, 'cpuprofile');
							tmpRequestProfilePostfix = '.cpuprofile';
						}

						libFS.writeFileSync(_Fable.settings.Profiling.Folder+tmpRequestProfilePrefix+pRequest.ProfilerName+tmpRequestProfilePostfix, tmpRequestProfile);

						if (_Fable.settings.Profiling.TraceLog)
						{
							_Fable.log.trace('... Request '+pRequest.RequestUUID+' profile written to: '+_Fable.settings.Profiling.Folder+pRequest.ProfilerName);
						}
					}
				}
			);
		};
		/*
		 * This ends the initialization of the web server object.
		 *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** ***/


		/**
		* Start worker processes (called from startWebServer)
		*
		* @method startWorkers
		*/
		 var startWorkers = function(pWorkers, fCallback)
		 {
		 	if (pWorkers === 0)
		 	{
		 		return fCallback();
		 	}
		 	else if (pWorkers < 0)
		 	{
		 		pWorkers = require('os').cpus().length;
		 	}

			for (var i=0; i<pWorkers; i++)
			{
				libCluster.fork();
			}

			var tmpActiveWorkers = 0;

			libCluster.on('message', function(message)
			{
			    _Fable.log.trace('Orator Worker ' + message.pid + ' started.');

			    if (++tmpActiveWorkers === pWorkers)
			    {
			    	//The Master process fires the callback when all
			    	// the workers have started. This is used by
			    	// unit tests.
			    	return fCallback();
			    }
			});
			libCluster.on('exit', function(worker, code, signal)
			{
			    _Fable.log.trace('Orator Worker ' + worker.id + '/' + worker.process.pid + ' died');

			    // APIWorkerRestart flag auto-restarts a worker if it crashes
			    if (_Fable.settings.APIWorkerRestart)
			    {
			    	libCluster.fork();
			    }
			});
		};

		/**
		* Start the Web Server
		*
		* @method startWebServer
		*/
		var startWebServer = function(fNext)
		{
			var tmpNext = (typeof(fNext) === 'function') ? fNext : function() {};

			// Create # worker processes if configured. The master
			//  process will hold the handle for the listening port
			//  (see https://nodejs.org/api/cluster.html#cluster_how_it_works)
			//  So we only call the listener on spawned workers.
			if (libCluster.isMaster &&
				_Fable.settings.APIWorkers &&
				_Fable.settings.APIWorkers > 0)
			{
				return startWorkers(_Fable.settings.APIWorkers, tmpNext);
			}
			else
			{
				getWebServer().listen
				(
					_Fable.settings.APIServerPort,
					function ()
					{
						_Fable.log.info(_WebServer.name+' listening at '+_WebServer.url);
						if (!libCluster.isMaster)
						{
							// notify master about the request
    						process.send({ signal: 'notifyListening', pid: process.pid });
						}
						return tmpNext();
					}
				);
			}
		};

		/**
		* Stop the Web Server
		*
		* @method stopWebServer
		*/
		var stopWebServer = function()
		{
			getWebServer().close();
		};


		// ### Static content formatter (useful to manage content lengths of large text media files)
		var staticContentFormatter = function(pRequest, pResponse, pBody)
		{
			// This is specifically used to serve CSS which the older internet explorers treat ... strangely.
			if (pBody instanceof Error)
			{
				pResponse.statusCode = pBody.statusCode || 500;
				pBody = pBody.message;
			}
			else if (typeof (pBody) === 'object')
			{
				pBody = JSON.stringify(pBody);
			}
			else
			{
				pBody = pBody.toString();
			}

			pResponse.setHeader('Content-Length', Buffer.byteLength(pBody));
			return (pBody);
		};


		// ### Configure static formatters to work with ie (specifically CSS)
		var setupStaticFormatters = function()
		{
			_WebServerParameters = (
			{
				formatters:
				{
					'application/javascript; q=0.1': libRestify.formatters['application/javascript; q=0.1'],
					'application/json; q=0.4': libRestify.formatters['application/json; q=0.4'],
					'text/plain; q=0.3': libRestify.formatters['text/plain; q=0.3'],
					// It is really important for this to be equal to text/plain in priority!
					'text/css; q=0.3': staticContentFormatter,
					'application/octet-stream; q=0.2': libRestify.formatters['application/octet-stream; q=0.2']
				},
				acceptable:
				[
					'text/css',
					'text/plain',
					'application/octet-stream',
					'application/javascript',
					'application/json'
				]
			});
			_Fable.settings.RawServerParameters = _WebServerParameters;
		};

		/**
		* Map all routes for a prefix to proxy to a remote server
		*
		* @method addProxyRoute
		*/
		var addProxyRoute = function(pRoutePrefix, pRemoteServerURL, pDropPrefix)
		{
			pDropPrefix = !(pDropPrefix == false);

			if (typeof(pRemoteServerURL) !== 'string')
			{
				_Fable.log.error('A remote server URL must be passed in to addProxyRoute().');
				return false;
			}

			// be flexible on formatting for route prefix
			if (pRoutePrefix.indexOf('/') !== 0)
				pRoutePrefix = '/' + pRoutePrefix;
			if (pRoutePrefix.lastIndexOf('/') !== pRoutePrefix.length-1)
				pRoutePrefix += '/';

			// will pick up ANY requests with prefix
			var tmpRouteRegex = new RegExp(pRoutePrefix + '.*');
			//var tmpDomain = pRemoteServerURL.match(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/im)[1];

			_ProxyRoutes.push({
				Prefix: pRoutePrefix,
				RouteRegex: tmpRouteRegex,
				RemoteServerURL: pRemoteServerURL,
				DropPrefix: pDropPrefix
			});

			_Fable.log.info('Orator mapping proxy route to server: '+pRoutePrefix+' ==> '+pRemoteServerURL);
		};

		/**
		* Add an exception to the route rules for Proxy requests
		*
		* @method omitProxyRoute
		*/
		var omitProxyRoute = function(pRoutePrefix)
		{
			var tmpRouteRegex = new RegExp(pRoutePrefix + '.*');

			//put the rule at the top
			_ProxyRoutes.splice(0, 0, {
				Prefix: pRoutePrefix,
				RouteRegex: tmpRouteRegex,
				Skip: true
			});

			_Fable.log.info('Orator omitting proxy route to remote server: '+pRoutePrefix);
		};

		// Add the route
		var proxyHandler = function(pRequest, pResponse, fNext)
		{
			var tmpTargetRoute = null;
			for(var i=0; i<_ProxyRoutes.length; i++)
			{
				var tmpRoute = _ProxyRoutes[i];
				var tmpRouteRegex = tmpRoute.RouteRegex;
				if (tmpRouteRegex.test(pRequest.url))
				{
					if (!tmpRoute.Skip)
						tmpTargetRoute = tmpRoute;
					break;
				}
			}

			if (!tmpTargetRoute)
				return fNext();

			if (tmpTargetRoute.DropPrefix)
				pRequest.url = pRequest.url.replace(tmpTargetRoute.Prefix, '/');

			//built a URL string to log the request
			var tmpRequestURL = tmpTargetRoute.RemoteServerURL + pRequest.url;

			_Fable.log.trace('Proxying request: '+tmpRequestURL);

			let tmpChangeOrigin = false;
			//if connecting via FQDN (like sending from local dev box) then we need to change origin header
			if (tmpTargetRoute.RemoteServerURL.indexOf('.com')>0)
				tmpChangeOrigin = true;

			pRequest.forward = {
				target: tmpTargetRoute.RemoteServerURL,
				changeOrigin: tmpChangeOrigin,
				secure: (_Fable.settings['RemoteSSLValidation'] == true)
			};
			return libHttpForward(pRequest, pResponse, function(pError)
			{
				if (pError)
				{
					_Fable.log.error('Proxy error', pError);
				}

				return fNext(true);
			});
		};


		var addStaticRoute = function(pFilePath, pDefaultFile, pRoute, pRouteStrip)
		{
			if (typeof(pFilePath) !== 'string')
			{
				_Fable.log.error('A file path must be passed in as part of the server.');
				return false;
			}

			// Default to just serving from root
			var tmpRoute = (typeof(pRoute) === 'undefined') ? /\/.*/ : pRoute;
			var tmpRouteStrip = (typeof(pRouteStrip) === 'undefined') ? '/' : pRouteStrip;

			// Default to serving index.html
			var tmpDefaultFile = (typeof(pDefaultFile) === 'undefined') ? 'index.html' : pDefaultFile;

			_Fable.log.info('Orator mapping static route to files: '+tmpRoute+' ==> '+pFilePath+' '+tmpDefaultFile);

			// Add the route
			getWebServer().get
			(
				tmpRoute,
				function(pRequest, pResponse, fNext)
				{
					// The split removes query string parameters so they are ignored by our static web server.
					// The substring cuts that out from the file path so relative files serve from the folders and server
					pRequest.url = pRequest.url.split("?")[0].substr(tmpRouteStrip.length);
					pRequest.path = function() { return pRequest.url; };
					if (_Fable.settings.Profiling.TraceLog)
					{
						_WebServer.log.trace('Serving content: '+pRequest.url);
					}
					var tmpServe = libRestify.plugins.serveStatic
					(
						{
							directory: pFilePath,
							default: tmpDefaultFile
						}
					);
					tmpServe(pRequest, pResponse, fNext);
				}
			);
		};

		/**
		* Container Object for our Factory Pattern
		*/
		var tmpNewOrator = (
		{
			startWebServer: startWebServer,
			stopWebServer: stopWebServer,

			addProxyRoute: addProxyRoute,
			omitProxyRoute: omitProxyRoute,
			addStaticRoute: addStaticRoute,

			staticContentFormatter: staticContentFormatter,
			setupStaticFormatters: setupStaticFormatters,
			serveStatic: libRestify.plugins.serveStatic,
			getHeader: getHeader,

			new: createNew
		});

		/**
		 * The Web Server
		 *
		 * @property webServer
		 * @type Object
		 */
		var getWebServer = function() 
					{
						// Lazily load the webserver the first time it is accessed
						if (typeof(_WebServer) === 'undefined')
						{
							// Make sure the Fable settings match the Orator settings
							_WebServerParameters.name = _Fable.settings.Product;
							_WebServerParameters.version = _Fable.settings.ProductVersion;
							_WebServer = libRestify.createServer(_WebServerParameters);
							initializeInstrumentation();
						}
						checkModules();
						return _WebServer;
					};
		Object.defineProperty(tmpNewOrator, 'webServer', {get: getWebServer });

		/**
		 * The Restify body parser (for use when you manually run body parsing)
		 *
		 * @property bodyParser
		 * @type Object
		 */
		Object.defineProperty(tmpNewOrator, 'bodyParser', {get: libRestify.bodyParser});

		/**
		 * The enabled web modules
		 *
		 * @property enabledModules
		 * @type Object
		 */
		Object.defineProperty(tmpNewOrator, 'enabledModules',
			{
				get: function() { return _Fable.settings.RestifyParsers; },
				set: function(pRestifyParsers) { _Fable.settings.RestifyParsers = pRestifyParsers; }
			});

		// Add fable services to the object, for sharing with other modules.
		_Fable.addServices(tmpNewOrator);

		return tmpNewOrator;
	};

	return createNew();
};

module.exports = new Orator();
