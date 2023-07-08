const libOratorServiceServerBase = require('./Orator-ServiceServer-Base.js');

// A synthesized response object, for simple IPC.
const libOratorServiceServerIPCSynthesizedResponse = require('./Orator-ServiceServer-IPC-SynthesizedResponse.js');
// A simple constrainer for the find-my-way router since we aren't using any kind of headers to pass version or host
//const libOratorServiceServerIPCCustomConstrainer = require('./Orator-ServiceServer-IPC-RouterConstrainer.js');

// This library is the default router for our services
const libFindMyWay = require('find-my-way');

class OratorServiceServerIPC extends libOratorServiceServerBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
        super(pFable, pOptions, pServiceHash);

		this.router = libFindMyWay(this.options);
		//this.router.addConstraintStrategy(libOratorServiceServerIPCCustomConstrainer);

		this.ServiceServerType = 'IPC';

		this.URL = 'IPC';
		this.Port = 0;

		this.preBehaviorFunctions = [];
		this.behaviorMap = {};
		this.postBehaviorFunctions = [];
	}

	use(fHandlerFunction)
	{
		return this.addPreBehaviorFunction(fHandlerFunction);
	}

	addPreBehaviorFunction(fHandlerFunction)
	{
		if (!super.use(fHandlerFunction))
		{
			this.log.error(`IPC provider failed to map USE handler function!`);
			return false;
		}

		this.preBehaviorFunctions.push(fHandlerFunction);
		return true;
	}

	executePreBehaviorFunctions(pRequest, pResponse, fNext)
	{
		let tmpAnticipate = this.fable.serviceManager.instantiateServiceProviderWithoutRegistration('Anticipate');

		for (let i = 0; i < this.preBehaviorFunctions.length; i++)
		{
			let tmpPreBehaviorFunction = this.preBehaviorFunctions[i];
			tmpAnticipate.anticipate(
				(fStageComplete) =>
				{
					return tmpPreBehaviorFunction(pRequest, pResponse, fStageComplete);
				});
		}

		tmpAnticipate.wait(
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

		this.postBehaviorFunctions.push(fHandlerFunction);
		return true;
	}

	executePostBehaviorFunctions(pRequest, pResponse, fNext)
	{
		let tmpAnticipate = this.fable.serviceManager.instantiateServiceProviderWithoutRegistration('Anticipate');

		for (let i = 0; i < this.postBehaviorFunctions.length; i++)
		{
			let tmpPostBehaviorFunction = this.postBehaviorFunctions[i];
			tmpAnticipate.anticipate(
				(fStageComplete) =>
				{
					return tmpPostBehaviorFunction(pRequest, pResponse, fStageComplete);
				});
		}

		tmpAnticipate.wait(
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
		this.router.on(pMethod, pRoute, this.buildFindMyWayHandler(pRouteFunctionArray));
		return true;
	}

	buildFindMyWayHandler(pRouteFunctionArray)
	{
		let tmpRouteFunctionArray = pRouteFunctionArray;
		return (
			(pRequest, pResponse, pData) =>
			{
				let tmpAnticipate = this.fable.serviceManager.instantiateServiceProviderWithoutRegistration('Anticipate');

				tmpAnticipate.anticipate(
					(fNext)=>
					{
						return this.executePreBehaviorFunctions(pRequest, pResponse, fNext);
					});

				for (let i = 0; i < tmpRouteFunctionArray.length; i++)
				{
					let tmpRouteFunction = tmpRouteFunctionArray[i];
					tmpAnticipate.anticipate(
						(fNext) =>
						{
							return tmpRouteFunction(pRequest, pResponse, fNext);
						});
				}

				tmpAnticipate.anticipate(
					(fStageComplete)=>
					{
						return this.executePostBehaviorFunctions(pRequest, pResponse, fStageComplete);
					});

				return new Promise(
					(fResolve, fReject) =>
					{
						tmpAnticipate.wait(
							(pBehaviorFunctionError) =>
							{
								if (pBehaviorFunctionError)
								{
									this.log.error(`IPC Provider behavior function ${pFunctionIndex} failed with error: ${pBehaviorFunctionError}`, pBehaviorFunctionError);
									return fReject(pBehaviorFunctionError);
								}
								return fResolve();
							});
					});
			});
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
		return this.addRouteProcessor('DELETE', pRoute, Array.from(fRouteProcessingFunctions));
	}

	doPatch(pRoute, ...fRouteProcessingFunctions)
	{
		return this.addRouteProcessor('PATCH', pRoute, Array.from(fRouteProcessingFunctions));
	}

	doOpts(pRoute, ...fRouteProcessingFunctions)
	{
		return this.addRouteProcessor('OPTIONS', pRoute, Array.from(fRouteProcessingFunctions));
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
							false;

		if (!tmpCallback)
		{
			throw new Error(`IPC Provider invoke() called without a callback function.`);
		}

		// Create a bare minimum request object for IPC to pass to our router
		let tmpRequest = (
			{
				method: pMethod,
				url: pRoute,
				guid: this.fable.getUUID()
			});

		// For now, dealing with no handler constraints.
		let tmpHandler = this.router.find( tmpRequest.method, tmpRequest.url);

		// Create a container for the IPC response data to be aggregated to from send() methodds
		let tmpSynthesizedResponseData = new libOratorServiceServerIPCSynthesizedResponse(tmpHandler, this.log, tmpRequest.guid);

		// Map parsed params back to the request object
		tmpRequest.params = tmpSynthesizedResponseData.params;
		tmpRequest.searchParams = tmpSynthesizedResponseData.searchParams;

		//params: handle._createParamsObject(params)//,
        //searchParams: this.querystringParser(querystring)

		tmpHandler.handler(tmpRequest, tmpSynthesizedResponseData, pData).then(
			(pResults)=>
			{
				return tmpCallback(null, tmpSynthesizedResponseData.responseData, tmpSynthesizedResponseData, pResults);
			},
			(pError)=>
			{
				this.log.trace('IPC Response Received', {Error: pError});
				if (pError)
				{
					this.log.error(`IPC Request Error Request GUID [${tmpRequest.guid}] handling route [${pRoute}]: ${pError}`, {Error: pError, Route: pRoute, Data: pData});
				}
				return tmpCallback(pError, tmpSynthesizedResponseData.responseData, tmpSynthesizedResponseData);
			}
		);
	}
}

module.exports = OratorServiceServerIPC;