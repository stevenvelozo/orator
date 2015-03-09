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
	Product: 'MockOratorGRINDER',
	ProductVersion: '0.0.0',
	APIServerPort: 8082,
	Profiling: (
		{
			// Tracelog is just log-based request timing encapsulation.
			TraceLog: true,

			// These profiling settings determine if we generate cpu or call graphs
			Enabled: true,
			Folder: '/tmp/',
			// Currently supported profile types: CallGrinder or ChromeCPU
			Type: 'CallGrinder'
		})

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
			'Alternate (cachegrinder) Server Start',
			function()
			{
				test
				(
					'simple routes should work',
					function()
					{
						_Orator.webServer.get (
							'/PING', 
							function (pRequest, pResponse, fNext) 
							{
								pResponse.send('PONG');
								fNext();
							}
						);
						_Orator.startWebServer(
							function()
							{
								libSuperTest('http://localhost:8082/')
								.get('PING')
								.end(
									function (pError, pResponse)
									{
										console.log(JSON.stringify(pResponse));
										Expect(pResponse.text)
											.to.contain('PONG');
									}
								);
							}
						);
						Expect(_Orator)
							.to.be.an('object', 'Orator should initialize as an object directly from the require statement.');
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