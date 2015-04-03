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
	APIServerPort: 8080
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
						_Orator.startWebServer
						(
							function ()
							{
								libSuperTest('http://localhost:8080/')
								.get('PIN')
								.end(
									function (pError, pResponse)
									{
										Expect(pResponse.text)
											.to.contain('PON');
										fDone();
									}
								);
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
								APIServerPort: 8089
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
						libSuperTest('http://localhost:8089/')
						.get('PINGU')
						.end(
							function (pError, pResponse)
							{
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
			}
		);
	}
);