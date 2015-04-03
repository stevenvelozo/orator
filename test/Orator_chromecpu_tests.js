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
	Product: 'MockOratorCHROME',
	APIServerPort: 8081,
	Profiling: (
		{
			// Tracelog is just log-based request timing encapsulation.
			TraceLog: true,

			// These profiling settings determine if we generate cpu or call graphs
			Enabled: true,
			Folder: '/tmp/',
			// Currently supported profile types: CallGrinder or ChromeCPU
			Type: 'ChromeCPU'
		})

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
			'Alternate (chromecpu) Server Start',
			function()
			{
				test
				(
					'simple routes should work',
					function(fDone)
					{
						_Orator.webServer.get (
							'/PINGO', 
							function (pRequest, pResponse, fNext) 
							{
								pResponse.send('PONGO');
								fNext();
							}
						);
						_Orator.startWebServer();
						libSuperTest('http://localhost:8081/')
						.get('PINGO')
						.end(
							function (pError, pResponse)
							{
								if (pError)
								{
									console.log('Error on Inverted Results: '+JSON.stringify(pError));
									Expect('Chrome Trace Request Error').to.equal('Nothing');
								}
								else
								{
									Expect(pResponse.text)
										.to.contain('PONGO');
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