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
	APIServerPort: 8181
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
								pResponse.send('RAWR');
								throw new Error('The server should give a nice stack trace');
								fNext();
							}
						);
						
						// Create a route to proxy HTTP requests to google
						_Orator.addProxyRoute('google/', 'https://google.com/');
						// Expect this to fail
						_Orator.addStaticRoute();
						// And you can specify a path for bonus
						_Orator.addStaticRoute(__dirname+'/../', 'LICENSE', /\/content\/(.*)/, '/content/');
						// You should be able to host files just with a path
						_Orator.addStaticRoute(__dirname+'/');
						
						_Orator.startWebServer(fDone);
					}
				);
				test
				(
					'Test endpoints',
					function(fDone)
					{
						libSuperTest('http://localhost:' + _MockSettings.APIServerPort + '/')
						.get('PIN')
						.end(
							function (pError, pResponse)
							{
								return fDone();
							}
						);

					}
				);
				test
				(
					'Test proxy GET request',
					function(fDone)
					{
						libSuperTest('http://localhost:' + _MockSettings.APIServerPort + '/')
						.get('google/search?q=laser+shark')
						.end(
							function (pError, pResponse)
							{
								//check for google search result
								Expect(pResponse.text)
									.to.contain('laser shark');
								return fDone();
							}
						);

					}
				);
				test
				(
					'Test proxy POST request, verify http statusCode result',
					function(fDone)
					{
						libSuperTest('http://localhost:' + _MockSettings.APIServerPort)
						.post('/google/search')
						.send('q=laser+shark')
						.end(
							function (pError, pResponse)
							{
								Expect(pResponse.statusCode)
									.to.equal(405); //MethodNotAllowed (POST query not allowed by google)

								return fDone();
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
