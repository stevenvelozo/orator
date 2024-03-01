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

const defaultOratorConfiguration = require('./Orator-Default-Configuration.js');

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
	}

	onBeforeInitialize()
	{
		if (this.fable.settings.LogNoisiness > 3)
		{
			this.log.trace(`Orator [${this.UUID}]::[${this.Hash}] ${this.options.Product} onBeforeInitialize:`);
		}
	}
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
	onInitializeAsync(fNext)
	{
		this.onInitialize();
		return fNext();
	}

	onAfterInitialize()
	{
		if (this.fable.settings.LogNoisiness > 3)
		{
			this.log.trace(`Orator [${this.UUID}]::[${this.Hash}] ${this.options.Product} onAfterInitialize:`);
		}
	}
	onAfterInitializeAsync(fNext)
	{
		this.onAfterInitialize();
		return fNext();
	}

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

	onBeforeStartService(fNext)
	{
		return fNext();
	}
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
	onAfterStartService(fNext)
	{
		return fNext();
	}

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

	invoke(pMethod, pRoute, pData, fCallback)
	{
		//this.log.trace(`Orator [${this.UUID}]::[${this.Hash}] ${this.options.Product} invoking ${pMethod} ${pRoute}`);
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
			this.initialize();
		}

		return this.serviceServer;
	}
	/*************************************************************************
	 * End of Legacy Orator Functions
	 */
}

module.exports = Orator;
module.exports.ServiceServerBase = require('orator-serviceserver-base');
module.exports.ServiceServerIPC = require('./Orator-ServiceServer-IPC.js');
