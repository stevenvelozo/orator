/**
* Unit tests for the Orator Server
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

var Chai = require("chai");
var Expect = Chai.expect;
var Assert = Chai.assert;

var libSuperTest = require('supertest');

var _MockSettings = (
{
	Product: 'MockOratorAlternate',
	ProductVersion: '0.0.0',
	APIServerPort: 8999,
});

suite
(
	'Orator basic',
	function()
	{
		var _Orator;
		let capturedOriginalErr = null;
		let capturedReq = null;
		let capturedRes = null;
		let capturedErr = null;

		setup
		(
			function()
			{
				_Orator = require('../source/Orator.js').new(_MockSettings);
				_Orator.registerUnhandledErrorHandler((req, res, err) =>
				{
					capturedReq = req;
					capturedRes = res;
					capturedErr = err;
					return err.statusCode > 0;
				});
				_Orator.registerErrorTransformer((err) =>
				{
					capturedOriginalErr = err;
					return err;
				});
			}
		);

		teardown(() => { capturedReq = undefined; capturedRes = undefined; capturedErr = undefined; capturedOriginalErr = undefined; });

		suiteTeardown
		(
			function()
			{
				_Orator.stopWebServer();
			}
		);

		suite
		(
			'Object Sanity',
			function()
			{
				test
				(
					'initialize should build a happy little object',
					function()
					{
						Expect(_Orator)
							.to.be.an('object', 'Orator should initialize as an object directly from the require statement.');
						Expect(_Orator.serveStatic).to.be.an('function');
					}
				);
				test
				(
					'exercise the static formatters',
					function()
					{
						var tmpRequest = {};
						var tmpResponse = {setHeader:function(pHeader, pValue){console.log('---> Header '+pHeader+' set to '+pValue)}};
						_Orator.staticContentFormatter(tmpRequest, tmpResponse, new Error());
						_Orator.staticContentFormatter(tmpRequest, tmpResponse, 'pBody');
						_Orator.staticContentFormatter(tmpRequest, tmpResponse, {});
					}
				);
			}
		);
		suite
		(
			'Basic Server Start',
			function()
			{
				test
				(
					'simple routes should work',
					function(fDone)
					{
						// Setup the static formatters... this must happen before we access the webServer object.
						_Orator.setupStaticFormatters();
						_Orator.webServer.get (
							'/PIN',
							function (pRequest, pResponse, fNext)
							{
								pResponse.send('PON');
								fNext();
							}
						);
						_Orator.webServer.get (
							'/SecondAPI',
							function (pRequest, pResponse, fNext)
							{
								pResponse.send('RAWR');
								fNext();
							}
						);
						_Orator.webServer.get (
							'/ThirdAPI',
							function (pRequest, pResponse, fNext)
							{
								throw new Error('The server should give a nice stack trace');
								fNext();
							}
						);
						_Orator.webServer.get (
							'/PromiseAPI',
							async function (pRequest, pResponse)
							{
								return Promise.resolve('test promise response');
							}
						);
						_Orator.webServer.get (
							'/PromiseAPIError',
							async function (pRequest, pResponse)
							{
								return Promise.reject('error promise response');
							}
						);
						_Orator.webServer.get (
							'/SyncBug',
							function (pRequest, pResponse, fNext)
							{
								const cat = null;
								cat.dog();
							}
						);
						_Orator.webServer.get (
							'/AsyncBug',
							async function (pRequest, pResponse)
							{
								await new Promise((resolve) => setTimeout(() => resolve()), 1);
								const cat = null;
								cat.dog();
							}
						);
						// Expect this to fail
						_Orator.addStaticRoute();
						// And you can specify a path for bonus
						var libPath = require('path');
						var tmpPath = libPath.normalize(__dirname+'/');
						_Orator.addStaticRoute(tmpPath, 'Test.html', /\/content\/(.*)/, '/content/');
						// You should be able to host files just with a path
						_Orator.addStaticRoute(__dirname+'/');
						_Orator.startWebServer
						(
							function ()
							{
								libSuperTest(`http://localhost:${_MockSettings.APIServerPort}/`)
								.get('PIN')
								.end(
									function (pError, pResponse)
									{
										Expect(pResponse.text)
											.to.contain('PON');
										libSuperTest(`http://localhost:${_MockSettings.APIServerPort}/`)
										.get('ThirdAPI')
										.end(
											function (pError, pResponse)
											{
												libSuperTest(`http://localhost:${_MockSettings.APIServerPort}/`)
												.get('Test.css')
												.end(
													function (pError, pResponse)
													{
														_Orator.settings.Profiling.TraceLog = true;
														Expect(pResponse.text)
															.to.contain('50000px');
														libSuperTest(`http://localhost:${_MockSettings.APIServerPort}/`)
														.get('content/')
														.end(
															function (pError, pResponse)
															{
																Expect(pResponse.text)
																	.to.contain('Um');
																fDone();
															}
														);
													}
												);
											}
										);
									}
								);
							}
						);
					}
				);
				test
				(
					'promise routes should work',
					function(fDone)
					{
						libSuperTest(`http://localhost:${_MockSettings.APIServerPort}/`)
						.get('PromiseAPI')
						.end(
							function (pError, pResponse)
							{
								Expect(pResponse.text)
									.to.contain('test promise response');

								return fDone();
							}
						);
					}
				);
				test
				(
					'promise routes error handling',
					function(fDone)
					{
						libSuperTest(`http://localhost:${_MockSettings.APIServerPort}/`)
						.get('PromiseAPIError')
						.end(
							function (pError, pResponse)
							{
								Expect(capturedErr).to.exist;
								Expect(capturedReq).to.exist;
								Expect(capturedRes).to.exist;
								Expect(pResponse.text)
									.to.contain('error promise response');

								return fDone();
							}
						);
					}
				);
				test
				(
					'unhandled error interception',
					function(fDone)
					{
						libSuperTest(`http://localhost:${_MockSettings.APIServerPort}/`)
						.get('SyncBug')
						.end(
							function (pError, pResponse)
							{
								Expect(pError).to.not.exist;
								Expect(capturedOriginalErr).to.exist;
								Expect(capturedErr).to.exist;
								Expect(capturedOriginalErr.statusCode).to.not.exist; // raw error
								Expect(capturedErr.statusCode).to.equal(500); // wrapped to give reasonable http response
								Expect(capturedReq).to.exist; // shows we called the custom error handler
								Expect(capturedReq.RequestUUID).to.be.a('string'); // so we can log this from the handler
								Expect(capturedRes).to.exist; // shows we called the custom error handler
								Expect(capturedErr.message).to.contain('Cannot read property \'dog\'');
								Expect(pResponse.text).to.contain('Cannot read property \'dog\'');

								return fDone();
							}
						);
					}
				);
				test
				(
					'unhandled error interception async',
					function(fDone)
					{
						libSuperTest(`http://localhost:${_MockSettings.APIServerPort}/`)
						.get('AsyncBug')
						.end(
							function (pError, pResponse)
							{
								Expect(pError).to.not.exist;
								Expect(capturedOriginalErr).to.exist;
								Expect(capturedErr).to.exist;
								Expect(capturedOriginalErr.statusCode).to.not.exist; // raw error
								Expect(capturedErr.statusCode).to.equal(500); // wrapped to give reasonable http response
								Expect(capturedReq).to.exist; // shows we called the custom error handler
								Expect(capturedReq.RequestUUID).to.be.a('string'); // so we can log this from the handler
								Expect(capturedRes).to.exist; // shows we called the custom error handler
								Expect(capturedErr.message).to.contain('Cannot read property \'dog\'');
								Expect(pResponse.text).to.contain('Cannot read property \'dog\'');

								return fDone();
							}
						);
					}
				);
			}
		);
		suite
		(
			'Inverted parameters server start',
			function()
			{
				test
				(
					'inverted parameters should work',
					function(fDone)
					{
						var _MockSettingsInvertedParameters = (
							{
								Product: 'MockOratorInverted',
								ProductVersion: '0.0.0',
								APIServerPort: _MockSettings.APIServerPort - 10,
								LogStackTraces: false
							});
						var _OratorInverted = require('../source/Orator.js').new(_MockSettingsInvertedParameters);
						// Test twiddling parameters
						Expect(_OratorInverted.enabledModules.Date)
							.to.equal(false);
						_OratorInverted.enabledModules.Date = true;
						Expect(_OratorInverted.enabledModules.Date)
							.to.equal(true);
						// Testing assignment of parameters
						_OratorInverted.enabledModules = (
							{
								AcceptParser: false,
								Authorization: false,
								Date: true,
								CORS: true,
								FullResponse: true,
								Query: false,
								JsonP: true,
								GZip: true,
								Body: false,
								Throttle: true,
								Conditional: true
							});
						_OratorInverted.webServer.get (
							'/PINGU',
							function (pRequest, pResponse, fNext)
							{
								pResponse.send('PONGU');
								fNext();
							}
						);
						_OratorInverted.startWebServer();
						libSuperTest(`http://localhost:${_MockSettings.APIServerPort - 10}/`)
						.get('PINGU')
						.end(
							function (pError, pResponse)
							{
								_OratorInverted.stopWebServer();
								if (pError)
								{
									console.log('Error on Inverted Results: '+JSON.stringify(pError));
									Expect('Inverted Settings Request Error').to.equal('Nothing');
								}
								else
								{
									Expect(pResponse.text)
										.to.contain('PONGU');
								}
								fDone();
							}
						);
					}
				);
				test
				(
					'Shutdown Orator web server',
					function()
					{
						_Orator.stopWebServer();
					}
				);
			}
		);
	}
);
