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
	Product: 'MockOratorCHROMENOTRACE',
	ProductVersion: '0.0.0',
	APIServerPort: 8083,
	Profiling: (
		{
			// Tracelog is just log-based request timing encapsulation.
			TraceLog: false,

			// These profiling settings determine if we generate cpu or call graphs
			Enabled: true,
			Folder: '/tmp/',
			// Currently supported profile types: CallGrinder or ChromeCPU
			Type: 'ChromeCPU'
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
			'Alternate (chromecpu) without Trace Server Start',
			function()
			{
				test
				(
					'simple routes should work',
					function()
					{
						_Orator.webServer.get (
							'/PI', 
							function (pRequest, pResponse, fNext) 
							{
								pResponse.send('PO');
								fNext();
							}
						);
						_Orator.startWebServer();
						libSuperTest('http://localhost:8083/')
						.get('PI')
						.end(
							function (pError, pResponse)
							{
								console.log(JSON.stringify(pResponse));
								Expect(pResponse.text)
									.to.contain('PO');
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