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
	Product: 'MockOratorRequestLogging',
	APIServerPort: 8085,
	Profiling: (
		{
			// Tracelog is just log-based request timing encapsulation.
			TraceLog: true,
			RequestLog: true
		}),
		UncaughtExceptionHook: function(pRequest, pResponse, pRoute, pError) { console.log('Uncaught Exception Hook Triggered: '+pError); pResponse.send(pError); pResponse.end(); }
});

suite
(
	'Orator',
	function()
	{
		var _Orator;

		setup
		(
			function()
			{
				_Orator = require('../source/Orator.js').new(_MockSettings);
			}
		);

		suiteTeardown
		(
			function()
			{
				_Orator.stopWebServer();
			}
		);

		suite
		(
			'Request Logging Server Start',
			function()
			{
				test
				(
					'simple routes should work',
					function(fDone)
					{
						_Orator.webServer.get (
							'/PINGOLo',
							function (pRequest, pResponse, fNext)
							{
								pResponse.send('Loggo');
								fNext();
							}
						);
						_Orator.webServer.get (
							'/PINataGOLo',
							function (pRequest, pResponse, fNext)
							{
								throw new Error("Something absolutely dire has occurred.");
								pResponse.send('Loggso');
								fNext();
							}
						);
						_Orator.webServer.get (
							'/PINataGOLo_promise',
							async function (pRequest, pResponse)
							{
								return Promise.reject("Something absolutely dire has occurred.");
							}
						);
						_Orator.startWebServer();
						libSuperTest('http://localhost:8085/')
						.get('PINGOLo')
						.end(
							function (pError, pResponse)
							{
								if (pError)
								{
									console.log('Error on Logfile Results: '+JSON.stringify(pError));
									Expect('Logged Request Error').to.equal('Nothing');
								}
								else
								{
									Expect(pResponse.text)
										.to.contain('Loggo');
								}
								libSuperTest('http://localhost:8085/')
								.get('PINataGOLo')
								.end(
									function (pError, pResponse)
									{
										if (pError)
										{
											console.log('Error on Logfile Results: '+JSON.stringify(pError));
											Expect('Logged Request Error').to.equal('Nothing');
										}
										else
										{
											Expect(pResponse.statusCode)
												.to.equal(500);
											Expect(pResponse.text)
												.to.contain('dire');
										}
										// Next uncaught exception should be passed through without logging the stack trace
										_Orator.settings.LogStackTraces = false;
										fDone();
									}
								);
							}
						);
					}
				);
				test
				(
					'uncaught exceptions should throw properly.',
					function(fDone)
					{
						libSuperTest('http://localhost:8085/')
						.get('PINataGOLo')
						.end(
							function (pError, pResponse)
							{
								if (pError)
								{
									console.log('Error on Logfile Results: '+JSON.stringify(pError));
									Expect('Logged Request Error').to.equal('Nothing');
								}
								else
								{
									Expect(pResponse.statusCode)
										.to.equal(500);
									Expect(pResponse.text)
										.to.contain('dire');
								}
								fDone();
							}
						);
					}
				);
				test
				(
					'rejected promises should throw properly.',
					function(fDone)
					{
						libSuperTest('http://localhost:8085/')
						.get('PINataGOLo_promise')
						.end(
							function (pError, pResponse)
							{
								if (pError)
								{
									console.log('Error on Logfile Results: '+JSON.stringify(pError));
									Expect('Logged Request Error').to.equal('Nothing');
								}
								else
								{
									Expect(pResponse.text)
										.to.contain('dire');
								}
								fDone();
							}
						);
					}
				);
			}
		);
	}
);
