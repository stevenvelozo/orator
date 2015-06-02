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
								fDone();
							}
						);
					}
				);
			}
		);
	}
);