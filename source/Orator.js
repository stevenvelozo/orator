/**
* Orator Service Abstraction
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
* @module Orator Service
*/

const libFableServiceProviderBase = require('fable-serviceproviderbase');

const libDefaultOratorServiceServer = require('./Orator-Default-ServiceServer.js');

const libServeStatic = require('serve-static');
const libFinalHandler = require('finalhandler');
const libMime = require('mime');

const defaultOratorConfiguration = require('./Orator-Default-Configuration.js');

/**
 * @class Orator
 * @extends libFableServiceProviderBase
 * 
 * Represents the Orator service provider.
 * 
 * @param {Object} pFable - The Fable instance.
 * @param {Object} pOptions - The options for the Orator service.
 * @param {string} pServiceHash - The hash of the service.
 */
class Orator extends libFableServiceProviderBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
        super(pFable, pOptions, pServiceHash);

        this.serviceType = 'Orator';

		// Create the empty, important logic containers
		this.serviceServer = false;
		this.serviceServerProvider = false;

		// Now check to see that the ServicePort is set (this used to be APIServerPort)
		if (!this.options.hasOwnProperty('ServicePort'))
		{
			if (this.fable.settings.hasOwnProperty('APIServerPort'))
			{
				// Automatically migrate the legacy APIServerPort to ServicePort
				this.options.ServicePort = this.fable.settings.APIServerPort;
			}
			else
			{
				// Default to whatever the ... default is!
				this.options.ServicePort = defaultOratorConfiguration.ServicePort;
			}
		}

		// Now check to see that the Product name is set
		if (!this.options.hasOwnProperty('Product'))
		{
			this.options.Product = defaultOratorConfiguration.Product;
		}

		// This is here because libMime has a breaking change from v1 to v2 and the lookup function was update to be getType per https://stackoverflow.com/a/60741078
		// We don't want to introspect properties on this library every single time we need to check mime types.
		// Therefore we are setting this boolean here and using it to branch.
		this.oldLibMime = false;
		if ('lookup' in libMime)
		{
			this.oldLibMime = true;
		}
	}

	/**
	 * Lifecycle event that executes before initializing the service.  For overloading.
	 */
	onBeforeInitialize()
	{
		if (this.fable.settings.LogNoisiness > 3)
		{
			this.log.trace(`Orator [${this.UUID}]::[${this.Hash}] ${this.options.Product} onBeforeInitialize:`);
		}
	}
	/**
	 * Lifecycle event that executes before initializing the service.  For overloading.
	 * 
	 * @param {Function} fNext - The callback function to be called after the actions are executed.
	 */
	onBeforeInitializeAsync(fNext)
	{
		this.onBeforeInitialize();
		// Check to see if there is a service server active; if not instantiate one (and use IPC if none is registered with Fable as the default provider)
		if (!this.serviceServer)
		{
			// If the developer hasn't set this to a service provider class of their own choosing, 
			// TODO: Give the developer a chance to set a service provider instantiation address of their own choosing.
			// use the built-in network-less one.
			if (!this.fable.OratorServiceServer)
			{
				// If there isn't a default Service Server setup, create one.
				let tmpServiceServerOptions = (typeof(this.options.ServiceServerOptions) == 'undefined') ? {} : this.options.ServiceServerOptions;
				if (!this.fable.serviceManager.servicesMap.hasOwnProperty('OratorServiceServer'))
				{
					// Only register IPC if there isn't one yet.
					this.fable.serviceManager.addServiceType('OratorServiceServer', libDefaultOratorServiceServer);
				}
				this.fable.serviceManager.instantiateServiceProvider('OratorServiceServer', tmpServiceServerOptions, 'OratorServiceServer-AutoInit');
			}
			this.serviceServer = this.fable.OratorServiceServer;
			// For legacy reasons, we also will provide this under the "webServer" variable.
			this.webServer = this.serviceServer;
		}
		else
		{
			this.log.warn(`Orator attempting to initialize a service server after initialization has already completed.`)
		}
		fNext();
	}

	onInitialize()
	{
		if (this.fable.settings.LogNoisiness > 3)
		{
			this.log.trace(`Orator [${this.UUID}]::[${this.Hash}] ${this.options.Product} onInitialize:`);
		}
	}
	/**
	 * Lifecycle event that executes at the moment of initializing the service.  For overloading.
	 *
	 * @param {Function} fNext - The callback function to be executed after initialization.
	 */
	onInitializeAsync(fNext)
	{
		this.onInitialize();
		return fNext();
	}

	/**
	 * Lifecycle event that executes after initializing the service.  For overloading.
	 */
	onAfterInitialize()
	{
		if (this.fable.settings.LogNoisiness > 3)
		{
			this.log.trace(`Orator [${this.UUID}]::[${this.Hash}] ${this.options.Product} onAfterInitialize:`);
		}
	}
	/**
	 * Lifecycle event that executes after initializing the service.  For overloading.
	 * @param {Function} fNext - The callback function to be called after executing onAfterInitialize.
	 * @returns {Promise} - A promise that resolves when the callback function is called.
	 */
	onAfterInitializeAsync(fNext)
	{
		this.onAfterInitialize();
		return fNext();
	}

	/**
	 * Initializes the Orator instance.
	 *
	 * @param {Function} fCallback - The callback function to be executed after initialization.
	 */
	initialize(fCallback)
	{
		// I hate this -- as long as we want to be "mostly" backwards compatible it needs to do it though
		let tmpCallback = (typeof(fCallback) === 'function') ? fCallback : () => {};

		if (!this.initializeTimestamp)
		{
			let tmpAnticipate = this.fable.serviceManager.instantiateServiceProviderWithoutRegistration('Anticipate');

			if (this.fable.LogNoisiness > 3)
			{
				this.log.trace(`Orator [${this.UUID}]::[${this.Hash}] ${this.options.Product} beginning initialization steps...`);
			}

			tmpAnticipate.anticipate(this.onBeforeInitializeAsync.bind(this));
			tmpAnticipate.anticipate(this.onInitializeAsync.bind(this));
			tmpAnticipate.anticipate(this.onAfterInitializeAsync.bind(this));

			tmpAnticipate.wait(
				(pError) =>
				{
					this.initializeTimestamp = this.fable.log.getTimeStamp();
					if (this.fable.LogNoisiness > 2)
					{
						this.log.trace(`Orator [${this.UUID}]::[${this.Hash}] ${this.options.Product} initialization steps complete.`);
					}
					return tmpCallback(pError);
				});
		}
		else
		{
			this.log.warn(`Orator [${this.UUID}]::[${this.Hash}] ${this.options.Product} async initialize called but initialization is already completed.  Aborting.`);
			// TODO: Should this be returning an error?
			return tmpCallback();
		}
	}

	/**
	 * Lifecycle event that executes before starting the service.  For overloading.
	 *
	 * @param {Function} fNext - The function to be executed before starting the service.
	 * @returns {Promise} A promise that resolves when the function is completed.
	 */
	onBeforeStartService(fNext)
	{
		return fNext();
	}
	/**
	 * Lifecycle event that executes when the service starts.  For overloading.
	 * 
	 * @param {Function} fNext - The callback function to be called after the service starts.
	 * @returns {Promise} A promise that resolves when the service starts successfully, or rejects with an error.
	 */
	onStartService(fNext)
	{
		this.onAfterInitialize();
		return this.serviceServer.listen
		(
			this.options.ServicePort,
			(pError)	=>
			{
				this.log.info(`${this.serviceServer.Name} listening on port ${this.options.ServicePort}`);
				return fNext(pError);
			}
		);
	}
	/**
	 * Lifecycle event that executes after starting the service.  For overloading.
	 *
	 * @param {Function} fNext - The callback function to be executed after the service starts.
	 * @returns {Promise} - A promise that resolves when the callback function is completed.
	 */
	onAfterStartService(fNext)
	{
		return fNext();
	}

	/**
	 * Starts the service.
	 * 
	 * @param {Function} fNext - The callback function to be executed after the service has started.
	 */
	startService(fNext)
	{
		var tmpNext = (typeof(fNext) === 'function') ? fNext : ()=>{};

		let tmpAnticipate = this.fable.serviceManager.instantiateServiceProviderWithoutRegistration('Anticipate');

		if (this.fable.LogNoisiness > 3)
		{
			this.log.trace(`Orator [${this.UUID}]::[${this.Hash}] ${this.options.Product} beginning startService steps...`);
		}

		// Auto initialize if there is no serviceServer
		if (!this.serviceServer)
		{
			tmpAnticipate.anticipate(this.initialize.bind(this));
		}

		tmpAnticipate.anticipate(this.onBeforeStartService.bind(this));
		tmpAnticipate.anticipate(this.onStartService.bind(this));
		tmpAnticipate.anticipate(this.onAfterStartService.bind(this));

		tmpAnticipate.wait(
			(pError) =>
			{
				this.startServiceTimestamp = this.fable.log.getTimeStamp();
				if (this.fable.LogNoisiness > 2)
				{
					this.log.trace(`Orator [${this.UUID}]::[${this.Hash}] ${this.options.Product} startService steps complete.`);
				}
				return tmpNext(pError);
			});
	}

	/**
	 * Stops the service server.
	 * 
	 * @param {Function} fCallback - The callback function to be executed after the service server is stopped.
	 * @returns {void}
	 */
	stopService(fCallback)
	{
		var tmpCallback = (typeof(fCallback) === 'function') ? fCallback : ()=>{};

		if (!this.serviceServer)
		{
			let tmpMessage = `Orator attempting to stop a service server but the service server has not been intialized yet.`;
			this.log.warn(tmpMessage);
			return tmpCallback(tmpMessage);
		}

		if (!this.serviceServer.Active)
		{
			let tmpMessage = `Orator attempting to stop a service server but the service server is not actively running.`;
			this.log.warn(tmpMessage);
			return tmpCallback(tmpMessage);
		}

		return this.serviceServer.close(tmpCallback);
	}

	/**
	 * Programmatically invokes a method on the service server.
	 *
	 * @param {string} pMethod - The method to invoke.
	 * @param {string} pRoute - The route to invoke.
	 * @param {any} pData - The data to send with the invocation.
	 * @param {Function} fCallback - The callback function to execute after the invocation.
	 * @returns {any} - The result of the invocation.
	 */
	invoke(pMethod, pRoute, pData, fCallback)
	{
		//this.log.trace(`Orator [${this.UUID}]::[${this.Hash}] ${this.options.Product} invoking ${pMethod} ${pRoute}`);
		return this.serviceServer.invoke(pMethod, pRoute, pData, fCallback);
	}

	/*
	 * Legacy Orator / Backwards Compatibility Functions
	 *************************************************************************/
	/**
	 * Starts the web server.
	 *
	 * @param {Function} fNext - The callback function to be executed after the web server starts.
	 * @returns {Promise} A promise that resolves when the web server has started.
	 */
	startWebServer(fNext)
	{
		return this.startService(fNext);
	}

	/**
	 * Stops the web server.
	 *
	 * @param {Function} fNext - The callback function to be called after the web server is stopped.
	 * @returns {Promise} A promise that resolves when the web server is stopped.
	 */
	stopWebServer(fNext)
	{
		return this.stopService(fNext);
	}

	/**
	 * Retrieves the web server instance.
	 * 
	 * @returns {WebServer} The web server instance.
	 */
	getWebServer()
	{
		// The old behavior was to lazily construct the service the first time 
		// this accessor function is called.
		if (!this.serviceServer)
		{
			this.initialize();
		}

		return this.serviceServer;
	}
	/*************************************************************************
	 * End of Legacy Orator Functions
	 */

	setMimeHeader(pFileName, pResponse)
	{
		let tmpHeader;
		
		if (this.oldLibMime)
		{
			tmpHeader = libMime.lookup(pFileName);
		}
		else
		{
			tmpHeader = libMime.getType(pFileName);
		}

		if (!tmpHeader)
		{
			tmpHeader = 'application/octet-stream';
		}

		pResponse.setHeader('Content-Type', tmpHeader);		
	}

	/**
	 * Serve a static folder, optionally with magic subdomain masking.
	 *
	 * @param {string} pFilePath The path on disk that we are serving files from.
	 * @param {string?} pDefaultFile (optional) The default file served if no specific file is requested.
	 * @param {string?} pRoute (optional) The route matcher that will be used. Defaults to everything.
	 * @param {string?} pRouteStrip (optional) If provided, this prefix will be removed from URL paths before being served.
	 * @param {object?} pParams (optional) Additional parameters to pass to serve-static.
	 * @return {boolean} true if the handler was successfully installed, otherwise false.
	 */
	addStaticRoute(pFilePath, pDefaultFile, pRoute, pRouteStrip, pParams)
	{
		if (typeof(pFilePath) !== 'string')
		{
				this.fable.log.error('A file path must be passed in as part of the server.');
				return false;
		}

		// Default to just serving from root
		const tmpRoute = (typeof(pRoute) === 'undefined') ? '/*' : pRoute;
		const tmpRouteStrip = (typeof(pRouteStrip) === 'undefined') ? '/' : pRouteStrip;

		// Default to serving index.html
		const tmpDefaultFile = (typeof(pDefaultFile) === 'undefined') ? 'index.html' : pDefaultFile;

		this.fable.log.info('Orator mapping static route to files: '+tmpRoute+' ==> '+pFilePath+' '+tmpDefaultFile);

		// Add the route
		this.serviceServer.get(tmpRoute,
			(pRequest, pResponse, fNext) =>
			{
					// See if there is a magic subdomain put at the beginning of a request.
					// If there is, then we need to see if there is a subfolder and add that to the file path
					let tmpHostSet = pRequest.headers.host.split('.');
					let tmpPotentialSubfolderMagicHost = false;
					let servePath = pFilePath;
					// Check if there are more than one host in the host header (this will be 127 a lot)
					if (tmpHostSet.length > 1)
					{
						tmpPotentialSubfolderMagicHost = tmpHostSet[0];
					}
					if (tmpPotentialSubfolderMagicHost)
					{
						// Check if the subfolder exists -- this is only one dimensional for now
						let tmpPotentialSubfolder = servePath + tmpPotentialSubfolderMagicHost;
						if (this.fable.FilePersistence.libFS.existsSync(tmpPotentialSubfolder))
						{
							// If it does, then we need to add it to the file path
							servePath = `${tmpPotentialSubfolder}/`;
						}
					}
					pRequest.url = pRequest.url.split('?')[0].substr(tmpRouteStrip.length) || '/';
					pRequest.path = function()
					{
							return pRequest.url;
					};

					this.setMimeHeader(pRequest.url, pResponse);

					const tmpServe = libServeStatic(servePath, Object.assign({ index: tmpDefaultFile }, pParams));
					tmpServe(pRequest, pResponse, libFinalHandler(pRequest, pResponse));
					// TODO: This may break things if a post request send handler is setup...
					//fNext();
			});
		return true;
	}
}

module.exports = Orator;
module.exports.ServiceServerBase = require('orator-serviceserver-base');
module.exports.ServiceServerIPC = require('./Orator-ServiceServer-IPC.js');
