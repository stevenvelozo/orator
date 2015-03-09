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
var _Log = require('fable-log').new(_MockSettings);
_Log.initialize();

suite
(
	'Fable-Log',
	function()
	{
		var _Orator;

		setup
		(
			function()
			{
				_Orator = require('../source/Orator.js').new(_MockSettings, _Log);
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
					function()
					{
						_Orator.webServer.get (
							'/PIN', 
							function (pRequest, pResponse, fNext) 
							{
								pResponse.send('PON');
								fNext();
							}
						);
						_Orator.startWebServer();
						libSuperTest('http://localhost:8080/')
						.get('PIN')
						.end(
							function (pError, pResponse)
							{
								console.log(JSON.stringify(pResponse));
								Expect(pResponse.text)
									.to.contain('PON');
							}
						);
					}
				);
				test
				(
					'dynamically turn on tracing',
					function()
					{
					}
				);
			}
		);
	}
);