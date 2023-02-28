class OratorServiceServerBase
{
	constructor(pOrator)
	{
		this.orator = pOrator;

		this.log = pOrator.log;

		this.Name = this.orator.settings.Product;
		this.URL = 'BASE_SERVICE_SERVER';
		this.Port = this.orator.settings.ServicePort;

		this.Active = false;
	}

	/*
	 * Service Lifecycle Functions
	 *************************************************************************/
	listen(pPort, fCallback)
	{
		// Sometimes, listen does not listen on network calls.
		this.Active = true;

		return fCallback();
	}

	close(fCallback)
	{
		this.Active = false;

		return fCallback();
	}
	/*************************************************************************
	 * End of Service Lifecycle Functions
	 */

	use(fHandlerFunction)
	{
		if (typeof(fHandlerFunction) != 'function')
		{
			this.log.error(`Orator USE global handler mapping failed -- parameter was expected to be a function with prototype function(Request, Response, Next) but type was ${typeof(fHandlerFunction)} instead of a string.`)
			return false;
		}

		return true;
	}


	/*
	 * Service Route Creation Functions
	 *
	 * These base functions provide basic validation for the routes, but don't actually 
	 * do anything with them.  The design intent here is to allow derived classes to call
	 * these functions to validate that they conform to expected standards.
	 *
	 * Something like:

		get (pRoute, ...fRouteProcessingFunctions)
		{
			if (!super.get(pRoute, ...fRouteProcessingFunctions))
			{
				this.log.error(`Restify provider failed to map route [${pRoute}]!`);
				return false;
			}

			//...now we can do our actual get mapping function!....
		}

	 * This pattern and calling super is totally optional, obviously.
	 *************************************************************************/
	get(pRoute, ...fRouteProcessingFunctions)
	{
		if (typeof(pRoute) != 'string')
		{
			this.log.error(`Orator GET Route mapping failed -- route parameter was ${typeof(pRoute)} instead of a string.`)
			return false;
		}

		return true;
	}

	put(pRoute, ...fRouteProcessingFunctions)
	{
		if (typeof(pRoute) != 'string')
		{
			this.log.error(`Orator PUT Route mapping failed -- route parameter was ${typeof(pRoute)} instead of a string.`)
			return false;
		}

		return true;
	}

	post(pRoute, ...fRouteProcessingFunctions)
	{
		if (typeof(pRoute) != 'string')
		{
			this.log.error(`Orator POST Route mapping failed -- route parameter was ${typeof(pRoute)} instead of a string.`)
			return false;
		}

		return true;
	}

	del(pRoute, ...fRouteProcessingFunctions)
	{
		if (typeof(pRoute) != 'string')
		{
			this.log.error(`Orator DEL Route mapping failed -- route parameter was ${typeof(pRoute)} instead of a string.`)
			return false;
		}

		return true;
	}

	patch(pRoute, ...fRouteProcessingFunctions)
	{
		if (typeof(pRoute) != 'string')
		{
			this.log.error(`Orator PATCH Route mapping failed -- route parameter was ${typeof(pRoute)} instead of a string.`)
			return false;
		}

		return true;
	}

	opts(pRoute, ...fRouteProcessingFunctions)
	{
		if (typeof(pRoute) != 'string')
		{
			this.log.error(`Orator OPTS Route mapping failed -- route parameter was ${typeof(pRoute)} instead of a string.`)
			return false;
		}

		return true;
	}

	head(pRoute, ...fRouteProcessingFunctions)
	{
		if (typeof(pRoute) != 'string')
		{
			this.log.error(`Orator HEAD Route mapping failed -- route parameter was ${typeof(pRoute)} instead of a string.`)
			return false;
		}

		return true;
	}
	/*************************************************************************
	 * End of Service Route Creation Functions
	 */

	// Programmatically invoke a route
	invoke(pMethod, pRoute, pData, fCallback)
	{
		// The base class version of this does nothing
		this.log.debug(`Orator invoke called for route [${pRoute}] and landed on the base class; the service provider likely does not implement programmatic invoke capabilities.`, pData);
		return false;
	}
}

module.exports = OratorServiceServerBase;