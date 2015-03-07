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
	function createNew(pSettings, pLogProvider)
	{
		// This generates an object that requires you to construct it with new(Settings,Provider) before using it...
		if ((typeof(pSettings) !== 'object') || (typeof(pLogProvider) !== 'object'))
		{
			return {new: createNew};
		}

		// TODO: Validate pSettings and pLogProvider more.

		var _Settings = pSettings;
		var _Log = pLogProvider;

		// Underscore for utility
		var libUnderscore = require('underscore');
		// Restify for the routing and API serving
		var libRestify = require('restify');
		// NodeGrind for request profiling
		var libNodegrind = require('nodegrind');
		// FS for writing out profiling information
		var libFS = require('fs');

		// Build the server settings
		var _SettingsDefaults = (
		{
			Product: 'Orator',
			ProductVersion: '00.00.001',
			APIServerPort: 8080,

			// Turning these on decreases speed dramatically, and generates a cachegrind file for each request.
			Profiling: (
			{
				// Tracelog is just log-based request timing encapsulation.
				TraceLog: false,

				// These profiling settings determine if we generate cpu or call graphs
				Enabled: false,
				Folder: '/tmp/',
				// Currently supported profile types: CallGrinder or ChromeCPU
				Type: 'CallGrinder'
			}),

			UUID: (
				{
					DataCenter: 0,
					Worker: 0
				})
		});
		var _SettingsFile = {};
		try
		{
			_SettingsFile = require(__dirname+'/MicroService-Config.json');
		}
		catch (pException)
		{
			console.log('Microservice Warning: Configuration file found but there was a problem loading it.  Using defaults.');
			console.log('       Loading Exception: '+pException);
		}
		var _Settings = libUnderscore.extend(_SettingsDefaults, _SettingsFile);

		// Create the log file
		var _Log = require('fable-log').new(_Settings);
		_Log.initialize();

		// The Router API object
		var libRouter = require("./source/Headlight-Router.js").new(_Settings, _Log);

		// The Request UUID Generator
		var libRequestUUID = require('fable-uuid').new(_Settings, _Log);

		// Create a simple echoing web server
		var _WebServer = libRestify.createServer(
		{
		  name: _Settings.Product,
		  version: _Settings.ProductVersion
		});

		_WebServer.use(libRestify.acceptParser(_WebServer.acceptable));
		_WebServer.use(libRestify.queryParser());
		_WebServer.use(libRestify.bodyParser());

		/***
		 * Hook the profiler in
		 */
		_WebServer.pre
		(
			function (pRequest, pResponse, fNext)
			{
				pRequest.RequestUUID = 'REQ'+libRequestUUID.getUUID();

				if (_Settings.RequestTraceLog)
				{
					_Log.trace('Request start...',{RequestUUID: pRequest.RequestUUID});
				}

				if (_Settings.RequestProfiling)
				{
					// If profiling is enabled, build a callgrind file
					_Log.debug('Request '+pRequest.RequestUUID+' starting with full profiling...')
					pRequest.ProfilerName = _Settings.Product+'-'+_Settings.ProductVersion+'-'+pRequest.RequestUUID;
					libNodegrind.startCPU(pRequest.RequestUUID);
				}

				return fNext();
			}
		);


		_WebServer.on
		(
			'after',
			function (pRequest, pResponse, fNext)
			{

				_Log.trace("... Request finished.",{RequestUUID: pRequest.RequestUUID});

				if (typeof(pRequest.ProfilerName) === 'string')
				{
					var tmpRequestProfile = '';
					var tmpRequestProfilePrefix = '';
					var tmpRequestProfilePostfix = '';

					if (_Settings.RequestProfileType === 'CallGrinder')
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

					libFS.writeFileSync(_Settings.RequestProfilingFolder+tmpRequestProfilePrefix+pRequest.ProfilerName+tmpRequestProfilePostfix, tmpRequestProfile);

					if (_Settings.RequestTraceLog)
					{
						_Log.trace('... Request '+pRequest.RequestUUID+' profile written to: '+_Settings.RequestProfilingFolder+pRequest.ProfilerName);
					}
				}
			}
		);


		_WebServer.listen
		(
			_Settings.APIServerPort,
			function ()
			{
				_Log.info(_WebServer.name+' listening at '+_WebServer.url);
			}
		);

		/**
		* Container Object for our Factory Pattern
		*/
		var tmpNewOrator = (
		{
			new: createNew
		});

		return tmpNewOrator;
	}

	return createNew();
};

module.exports = new Orator();
