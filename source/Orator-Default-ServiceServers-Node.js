/**
* Default Service Server Function
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
*/

// Return the servers that are available without extensions loaded
getDefaultServiceServers = () =>
{
	let tmpDefaultServiceServers = {};

	tmpDefaultServiceServers.ipc = require('./Orator-ServiceServer-IPC.js');

	tmpDefaultServiceServers.default = tmpDefaultServiceServers.ipc;

	return tmpDefaultServiceServers;
}

module.exports = getDefaultServiceServers();