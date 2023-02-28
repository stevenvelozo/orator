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
const libFable = require('fable');
const _Fable = new libFable(
	{
		Product:'Orator-BasicTests-Backplane',
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
						let tmpOrator = new libOrator(_Fable);
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
						let tmpOrator = new libOrator(_Fable);
						// Start the service server
						tmpOrator.initializeServiceServer();
						// Start the service
						Expect(tmpOrator.serviceServer.Active).to.equal(false);
						tmpOrator.startService(
							()=>
							{
								Expect(tmpOrator.serviceServer.Active).to.equal(true);
								fDone();
							});
					}
				);

				test
				(
					'ipc should be able to provide basic endpoint functionality',
					(fDone) =>
					{
						let tmpOrator = new libOrator(_Fable);
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
								tmpOrator.fable.log.info(`Endpoint sent parameters object:`,pRequest.params);
								return fNext();
							}
						);

						let tmpURI = `/test/SomeHash`;
						tmpOrator.invoke('GET', tmpURI, null, 
							(pError, pResponseData) =>
							{
								let tmpResponseObject = JSON.parse(pResponseData);
								Expect(tmpResponseObject).to.have.a.property('hash');
								Expect(tmpResponseObject.hash).to.equal('SomeHash');
								tmpOrator.log.info(`Response to [${tmpURI}] came back from IPC resulting in [${pResponseData}] which is type ${typeof(pResponseData)}!`);
								return fDone();
							});
					}
				);

				test
				(
					'ipc should be able to process any number of handler additions with the use function',
					(fDone) =>
					{
						let tmpOrator = new libOrator(_Fable);
						// Initialize the service server
						tmpOrator.initializeServiceServer();
						// Start the service
						tmpOrator.startService();

						tmpOrator.serviceServer.get
						(
							'/MagicEndpoint/:MagicWords',
							(pRequest, pResponse, fNext) =>
							{
								let tmpResponseObject = (
									{
										MagicWords: pRequest.params.MagicWords,
										MagicIngredients: pRequest.MagicIngredients
									});
								pResponse.send(tmpResponseObject);
								return fNext();
							}
						);

						_Fable.Utility.waterfall([
								(fStageComplete) =>
								{
									let tmpURI = `/MagicEndpoint/BippityBoppityBoo`;
									tmpOrator.invoke('GET', tmpURI, null, 
										(pError, pResponseData) =>
										{
											let tmpResponseObject = JSON.parse(pResponseData);
											Expect(tmpResponseObject).to.have.a.property('MagicWords');
											Expect(tmpResponseObject.MagicWords).to.equal('BippityBoppityBoo');
											Expect(tmpResponseObject).to.not.have.a.property('MagicIngredients');
											//Expect(tmpResponseObject.MagicIngredients).to.be('undefined');
											tmpOrator.log.info(`Response to [${tmpURI}] came back from IPC resulting in [${pResponseData}] which is type ${typeof(pResponseData)}!`);
											return fStageComplete();
										});
								},
								(fStageComplete) =>
								{
									// Add a use parameter that decorates the ingredients
									tmpOrator.serviceServer.use(
										(pRequest, pResponse, fNext) =>
										{
											pRequest.MagicIngredients = [];
											return fNext();
										});
									return fStageComplete();
								},
								(fStageComplete) =>
								{
									let tmpURI = `/MagicEndpoint/BippityBoppityBoo`;
									tmpOrator.invoke('GET', tmpURI, null, 
										(pError, pResponseData) =>
										{
											let tmpResponseObject = JSON.parse(pResponseData);
											Expect(tmpResponseObject).to.have.a.property('MagicWords');
											Expect(tmpResponseObject.MagicWords).to.equal('BippityBoppityBoo');
											Expect(tmpResponseObject).to.have.a.property('MagicIngredients');
											Expect(tmpResponseObject.MagicIngredients).to.be.an('array');
											tmpOrator.log.info(`Response to [${tmpURI}] came back from IPC resulting in [${pResponseData}] which is type ${typeof(pResponseData)}!`);
											return fStageComplete();
										});
								},
								(fStageComplete) =>
								{
									// Add a use parameter that decorates the ingredients
									tmpOrator.serviceServer.use(
										(pRequest, pResponse, fNext) =>
										{
											pRequest.MagicIngredients.push('Magic Outcomes');
											return fNext();
										});
									return fStageComplete();
								},
								(fStageComplete) =>
								{
									let tmpURI = `/MagicEndpoint/BippityBoppityBoo`;
									tmpOrator.invoke('GET', tmpURI, null,
										(pError, pResponseData) =>
										{
											let tmpResponseObject = JSON.parse(pResponseData);
											Expect(tmpResponseObject).to.have.a.property('MagicWords');
											Expect(tmpResponseObject.MagicWords).to.equal('BippityBoppityBoo');
											Expect(tmpResponseObject).to.have.a.property('MagicIngredients');
											Expect(tmpResponseObject.MagicIngredients).to.be.an('array');
											Expect(tmpResponseObject.MagicIngredients[0]).to.equal('Magic Outcomes');
											tmpOrator.log.info(`Response to [${tmpURI}] came back from IPC resulting in [${pResponseData}] which is type ${typeof(pResponseData)}!`);
											return fStageComplete();
										});
								}
							],
							(pError) =>
							{
								return fDone();
							})
					}
				);
			}
		);
	}
);