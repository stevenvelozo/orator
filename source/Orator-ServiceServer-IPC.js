const libOratorServiceServerBase = require('./Orator-ServiceServer-Base.js');

// A synthesized response object, for simple IPC.
const libOratorServiceServerIPCSynthesizedResponse = require('./Orator-ServiceServer-IPC-SynthesizedResponse.js');
// A simple constrainer for the find-my-way router since we aren't using any kind of headers to pass version or host
const libOratorServiceServerIPCCustomConstrainer = require('./Orator-ServiceServer-IPC-RouterConstrainer.js');

// This library is the default router for our services
const libFindMyWay = require('find-my-way');
//const libAsync = require('async');
const libAsyncWaterfall = require("async/waterfall");
const libAsyncEachOfSeries = require('async/eachOfSeries')

class OratorServiceServerIPC extends libOratorServiceServerBase
{
	constructor(pOrator)
	{
		super(pOrator);

		this.routerOptions = (this.orator.settings.hasOwnProperty('router_options') && (typeof(this.orator.settings.router_options) == 'object')) ? this.orator.settings.router_options : {};
		this.router = libFindMyWay(this.routerOptions);
		this.router.addConstraintStrategy(libOratorServiceServerIPCCustomConstrainer);

		this.ServiceServerType = 'IPC';

		this.URL = 'IPC';

		this.preBehaviorFunctions = [];
		this.behaviorMap = {};
		this.postBehaviorFunctions = [];
	}

	use(fHandlerFunction)
	{
		if (!super.use(fHandlerFunction))
		{
			this.log.error(`IPC provider failed to map USE handler function!`);
			return false;
		}

		this.preBehaviorFunctions.push(fHandlerFunction);
	}

	addPostBehaviorFunction(fHandlerFunction)
	{
		if (!super.use(fHandlerFunction))
		{
			this.log.error(`IPC provider failed to map USE handler function!`);
			return false;
		}

		this.preBehaviorFunctions.push(fHandlerFunction);
	}

	executePreBehaviorFunctions(pRequest, pResponse, fNext)
	{
		libAsyncEachOfSeries(this.preBehaviorFunctions,
			(fBehaviorFunction, pFunctionIndex, fCallback) =>
			{
				return fBehaviorFunction(pRequest, pResponse, fCallback);
			},
			(pError) =>
			{
				if (pError)
				{
					this.log.error(`IPC Provider preBehaviorFunction ${pFunctionIndex} failed with error: ${pError}`, pError);
				}
				return fNext(pError);
			});
	}

	addPostBehaviorFunction(fHandlerFunction)
	{
		if (!super.use(fHandlerFunction))
		{
			this.log.error(`IPC provider failed to map USE handler function!`);
			return false;
		}

		this.preBehaviorFunctions.push(fHandlerFunction);
	}

	executePostBehaviorFunctions(pRequest, pResponse, fNext)
	{
		libAsyncEachOfSeries(this.postBehaviorFunctions,
			(fBehaviorFunction, pFunctionIndex, fCallback) =>
			{
				return fBehaviorFunction(pRequest, pResponse, fCallback);
			},
			(pError) =>
			{
				if (pError)
				{
					this.log.error(`IPC Provider postBehaviorFunction ${pFunctionIndex} failed with error: ${pError}`, pError);
				}
				return fNext(pError);
			});
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
			//...now we can do our actual get mapping function!....
		}

	 * This pattern and calling super is totally optional, obviously.
	 *************************************************************************/
	addRouteProcessor(pMethod, pRoute, pRouteFunctionArray)
	{
		// We have a constrainer on IPC so we can control channels eventually, if we like.
		// For now it just makes sure it was added with an IPC service server.
		this.router.on(pMethod, pRoute, { constraints: { "ipc": "IPC" } },
			(pRequest, pResponse, pParameters) =>
			{
				libAsyncWaterfall(
					[
						(fStageComplete)=>
						{
							// Added to make this mimic what we saw with route parsing in the old restify
							pRequest.params = pParameters;
							return fStageComplete();
						},
						(fStageComplete)=>
						{
							return this.executePreBehaviorFunctions(pRequest, pResponse, fStageComplete);
						},
						(fStageComplete)=>
						{
							libAsyncEachOfSeries(pRouteFunctionArray,
								(fBehaviorFunction, pFunctionIndex, fCallback) =>
								{
									return fBehaviorFunction(pRequest, pResponse, fCallback);
								},
								(pBehaviorFunctionError) =>
								{
									if (pBehaviorFunctionError)
									{
										this.log.error(`IPC Provider behavior function ${pFunctionIndex} failed with error: ${pBehaviorFunctionError}`, pBehaviorFunctionError);
										return fNext(pError);
									}
								});
						},
						(fStageComplete)=>
						{
							return this.executePostBehaviorFunctions(pRequest, pResponse, fStageComplete);
						}
					],
					(pRequestError)=>
					{
						if (pRequestError)
						{
							this.log.error(`IPC Provider behavior function ${pFunctionIndex} failed with error: ${pBehaviorFunctionError}`, pBehaviorFunctionError);
						}
					});
			});

		return true;
	}

	// This is the virtualized "body parser"
	bodyParser()
	{
		return (pRequest, pResponse, fNext) =>
		{
			return fNext();
		};
	}

	doGet(pRoute, ...fRouteProcessingFunctions)
	{
		return this.addRouteProcessor('GET', pRoute, Array.from(fRouteProcessingFunctions));
	}

	doPut(pRoute, ...fRouteProcessingFunctions)
	{
		return this.addRouteProcessor('PUT', pRoute, Array.from(fRouteProcessingFunctions));
	}

	doPost(pRoute, ...fRouteProcessingFunctions)
	{
		return this.addRouteProcessor('POST', pRoute, Array.from(fRouteProcessingFunctions));
	}

	doDel(pRoute, ...fRouteProcessingFunctions)
	{
		return this.addRouteProcessor('DEL', pRoute, Array.from(fRouteProcessingFunctions));
	}

	doPatch(pRoute, ...fRouteProcessingFunctions)
	{
		return this.addRouteProcessor('PATCH', pRoute, Array.from(fRouteProcessingFunctions));
	}

	doOpts(pRoute, ...fRouteProcessingFunctions)
	{
		return this.addRouteProcessor('OPTS', pRoute, Array.from(fRouteProcessingFunctions));
	}

	doHead(pRoute, ...fRouteProcessingFunctions)
	{
		return this.addRouteProcessor('HEAD', pRoute, Array.from(fRouteProcessingFunctions));
	}
	/*************************************************************************
	 * End of Service Route Creation Functions
	 */

	// Programmatically invoke a route
	invoke(pMethod, pRoute, pData, fCallback)
	{
		// If the data is skipped and a callback is parameter 3, do the right thing
		let tmpCallback = (typeof(fCallback) == 'function') ? fCallback :
							(typeof(pData) == 'function') ? pData :
							// This is here in case the developer passed no callback and just wants to fire and forget the IPC call which might not be async safe
							()=>{};

		// Create a bare minimum request object for IPC to pass to our router
		let tmpRequest = (
			{
				method: pMethod,
				url: pRoute,
				guid: this.orator.fable.getUUID()
			});

		// Create a container for the IPC response data to be aggregated to from send() methodds
		let tmpSynthesizedResponseData = new libOratorServiceServerIPCSynthesizedResponse(this.log, tmpRequest.guid);

		return this.router.lookup(
			tmpRequest,
			tmpSynthesizedResponseData,
			(pError, pResults)=>
			{
				if (pError)
				{
					this.log.error(`IPC Request Error Request GUID [${tmpRequest.guid}] handling route [${pRoute}]: ${pError}`, {Error: pError, Route: pRoute, Data: pData});
				}

				// by default, send data back through
				return tmpCallback(pError, tmpSynthesizedResponseData.responseData, tmpSynthesizedResponseData, pResults);
			});
	}
}

module.exports = OratorServiceServerIPC;