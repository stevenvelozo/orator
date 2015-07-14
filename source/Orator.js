/**
* Orator Web API Server
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
* @module Orator Web Server
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

		// Create the actual web server object
		var _WebServerParameters = _Fable.settings.RawServerParameters
		// Make sure the Fable settings match the Orator settings
		_WebServerParameters.name = _Fable.settings.Product,
		_WebServerParameters.version = _Fable.settings.ProductVersion
		var _WebServer = libRestify.createServer(_WebServerParameters);

		/**
		* Connect any configured restify modules that automatically map header content into the request object
		*
		* @method inititalizeHeaderParsers
		*/
		var initializeHeaderParsers = function(pSettings, pWebServer)
		{
			if (pSettings.RestifyParsers.CORS)
			{
				pWebServer.use(libRestify.CORS());
			}
			if (pSettings.RestifyParsers.FullResponse)
			{
				pWebServer.use(libRestify.fullResponse());
			}
			if (pSettings.RestifyParsers.AcceptParser)
			{
				pWebServer.use(libRestify.acceptParser(pWebServer.acceptable));
			}
			if (pSettings.RestifyParsers.Authorization)
			{
				pWebServer.use(libRestify.authorizationParser());
			}
			if (pSettings.RestifyParsers.Date)
			{
				pWebServer.use(libRestify.dateParser());
			}
		};

		/**
		* Connect any configured restify modules that work directly with the query/body/response data
		*
		* @method initializeContentParsers
		*/
		var initializeContentParsers = function(pSettings, pWebServer)
		{
			if (pSettings.RestifyParsers.Query)
			{
				pWebServer.use(libRestify.queryParser());
			}
			if (pSettings.RestifyParsers.JsonP)
			{
				pWebServer.use(libRestify.jsonp());
			}
			if (pSettings.RestifyParsers.GZip)
			{
				pWebServer.use(libRestify.gzipResponse());
			}
			if (pSettings.RestifyParsers.Body)
			{
				pWebServer.use(libRestify.bodyParser(pSettings.BodyParserParameters));
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
				pWebServer.use(libRestify.throttle(pSettings.ThrottleParserParameters));
			}
			if (pSettings.RestifyParsers.Conditional)
			{
				pWebServer.use(libRestify.conditionalRequest());
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
				if (_Fable.settings.LogStackTraces)
				{
					_WebServer.on
					(
						'uncaughtException',
						function (pRequest, pResponse, pRoute, pError)
						{
							_Fable.log.error('Request error', {Error:true, Stack:pError.stack});
						}
					);
				}
			}
		};

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
		/*
		 * This ends the initialization of the web server object.
		 *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** ***/

		/**
		* Start the Web Server
		*
		* @method startWebServer
		*/
		var startWebServer = function(fNext)
		{
			var tmpNext = (typeof(fNext) === 'function') ? fNext : function() {};
			checkModules();
			_WebServer.listen
			(
				_Fable.settings.APIServerPort,
				function ()
				{
					_Fable.log.info(_WebServer.name+' listening at '+_WebServer.url);
					tmpNext();
				}
			);
		};


		/**
		* Container Object for our Factory Pattern
		*/
		var tmpNewOrator = (
		{
			startWebServer: startWebServer,
			new: createNew
		});

		/**
		 * The Web Server
		 *
		 * @property webServer
		 * @type Object
		 */
		Object.defineProperty(tmpNewOrator, 'webServer',
			{
				get: function() 
					{
						checkModules();
						return _WebServer;
					}
			});

		/**
		 * The enabled web modules
		 *
		 * @property webServer
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
