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

suite
(
	'Fable-Log',
	function()
	{
		setup
		(
			function()
			{
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
						var tmpOrator = require('../source/Orator.js').new();
						Expect(tmpOrator)
							.to.be.an('object', 'Orator should initialize as an object directly from the require statement.');
					}
				);
			}
		);
	}
);