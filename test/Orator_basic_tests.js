/**
* Unit tests for the Orator Server
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

const libOrator = require('../source/Orator.js');

const Chai = require("chai");
const Expect = Chai.expect;
const Assert = Chai.assert;

//const libSuperTest = require('supertest');

const _MockSettings = (
{
	Product: 'MockOratorAlternate',
	ProductVersion: '0.0.0',
	APIServerPort: 8099
});

suite
(
	'Orator',
	() =>
	{
		suite
		(
			'Object Sanity',
			() =>
			{
				test
				(
					'initialize should build a happy little object',
					(fDone) =>
					{
						let tmpOrator = new libOrator();
						Expect(tmpOrator).to.be.an('object', 'Orator should initialize as an object directly from the require statement.');
						Expect(tmpOrator.startService).to.be.an('function');
						Expect(tmpOrator.settings).to.be.an('object');
						fDone();
					}
				);

				test
				(
					'orator should be able to initialize and start a service with no effort',
					(fDone) =>
					{
						let tmpOrator = new libOrator();
						// Start the service server
						tmpOrator.initializeServiceServer();
						// Start the service
						tmpOrator.startService(fDone);
					}
				);

				test
				(
					'ipc should be able to provide basic endpoint functionality',
					(fDone) =>
					{
						let tmpOrator = new libOrator();
						// Initialize the service server
						tmpOrator.initializeServiceServer();
						// Start the service
						tmpOrator.startService();

						tmpOrator.serviceServer.get
						(
							'/test/:hash',
							(pRequest, pResponse, fNext) =>
							{
								// Send back the request parameters
								pResponse.send(pRequest.params);
								tmpOrator.fable.log.info(`sent ${pRequest.params}`);
								return fNext();
							}
						);

						let tmpURI = `/test/SomeHash`;
						tmpOrator.invoke('GET', tmpURI, null, 
							(pError, pResponseData) =>
							{
								tmpOrator.log.info(`Response to [${tmpURI}] came back from IPC resulting in [${pResponseData}]!`)
								return fDone();
							});
					}
				);
			}
		);
	}
);