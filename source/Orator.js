/**
* Orator Service Abstraction
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
* @module Orator Service
*/

const libFable = require('fable');

const defaultOratorConfiguration = require('./Orator-Default-Configuration.js');
const defaultOratorServiceServers = require('./Orator-Default-ServiceServers-Node.js');

class Orator
{
	constructor(pFable, pServiceProvider)
	{
		// Need to figure out if pFable is a Fable object or a Settings object or neither
		if ((typeof(pFable) === 'object') && (pFable instanceof libFable))
		{
			// We were passed a fully operational fable -- use this
			this.fable = pFable;
		}
		else if (typeof(pFable) == 'object')
		{
			this.fable = new libFable(pFable);
		}
		else
		{
			this.fable = new libFable(defaultOratorConfiguration);
		}

		// Carry core application requirements into the orator object for simplicity
		this.settings = this.fable.settings;
		this.log = this.fable.log;

		// Create the empty, important logic containers
		this.serviceServer = false;
		this.serviceServerProvider = false;

		if (typeof(pServiceProvider) !== 'undefined')
		{
			this.serviceServerProvider = pServiceProvider;
		}

		// Now check to see that the ServicePort is set (this used to be APIServerPort)
		if (!this.settings.hasOwnProperty('ServicePort'))
		{
			if (this.settings.hasOwnProperty('APIServerPort'))
			{
				// Automatically migrate the legacy APIServerPort to ServicePort
				this.settings.ServicePort = this.fable.settings.APIServerPort;
			}
			else
			{
				// Default to whatever the ... default is!
				this.settings.ServicePort = defaultOratorConfiguration.ServicePort;
			}
		}

		// Now check to see that the Product name is set
		if (!this.settings.hasOwnProperty('Product'))
		{
			this.settings.Product = defaultOratorConfiguration.Product;
		}
	}

	initializeServiceServer(fNext)
	{
		var tmpNext = (typeof(fNext) === 'function') ? fNext : ()=>{};

		if (!this.serviceServer)
		{
			// If the developer hasn't set this to a service provider class of their own choosing, 
			// use the built-in network-less one.
			if (!this.serviceServerProvider)
			{
				this.serviceServerProvider = defaultOratorServiceServers.default;
			}

			this.serviceServer = new this.serviceServerProvider(this);

			// For legacy reasons, we also will provide this under the "webServer" variable.
			this.webServer = this.serviceServer;
		}
		else
		{
			this.log.warn(`Orator attempting to initialize a service server after initialization has already completed.`)
		}

		return tmpNext()
	}

	_startServiceListener(fNext)
	{
		return this.serviceServer.listen
		(
			this.settings.ServicePort,
			(pError)	=>
			{
				this.log.info(`${this.serviceServer.Name} listening at ${this.serviceServer.URL} port ${this.serviceServer.Port}`);
				return fNext(pError);
			}
		);
	}

	startService(fNext)
	{
		var tmpNext = (typeof(fNext) === 'function') ? fNext : ()=>{};

		if (!this.serviceServer)
		{
			this.initializeServiceServer();
		}

		return this._startServiceListener(tmpNext);
	}

	stopService(fNext)
	{
		var tmpNext = (typeof(fNext) === 'function') ? fNext : ()=>{};

		if (!this.serviceServer)
		{
			let tmpMessage = `Orator attempting to stop a service server but the service server has not been intialized yet.`;
			this.log.warn(tmpMessage);
			return tmpNext(tmpMessage);
		}

		if (!this.serviceServer.Active)
		{
			let tmpMessage = `Orator attempting to stop a service server but the service server is not actively running.`;
			this.log.warn(tmpMessage);
			return tmpNext(tmpMessage);
		}

		return this.serviceServer.close(tmpNext);
	}

	invoke(pMethod, pRoute, pData, fCallback)
	{
		return this.serviceServer.invoke(pMethod, pRoute, pData, fCallback);
	}


	/*
	 * Legacy Orator Functions
	 *************************************************************************/
	startWebServer(fNext)
	{
		return this.startService(fNext);
	}

	// For legacy purposes
	stopWebServer(fNext)
	{
		return this.stopService(fNext);
	}

	// For legacy purposes
	getWebServer()
	{
		// The old behavior was to lazily construct the service the first time 
		// this accessor function is called.
		if (!this.serviceServer)
		{
			this.initializeServiceServer();
		}

		return this.serviceServer;
	}
	/*************************************************************************
	 * End of Legacy Orator Functions
	 */
}

module.exports = Orator;
