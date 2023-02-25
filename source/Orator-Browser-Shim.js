/**
* Simple browser shim loader - assign the npm module to a window global automatically
*
* @license MIT
* @author <steven@velozo.com>
*/
var libNPMModuleWrapper = require('./Orator.js');

if ((typeof(window) === 'object') && !window.hasOwnProperty('Orator'))
{
	window.Orator = libNPMModuleWrapper;
}

module.exports = libNPMModuleWrapper;