// Load the orator module with a few simple routes
const libOrator = require(__dirname+'/../source/Orator.js');
const libFable = require('fable');

let _Fable = new libFable({
		"Product": "HarnessService",
		"ProductVersion": "1.2.3",

		"APIServerPort": 8888
	});

// Uncomment the following line to test the restify server plug-in
// > make sure to run "npm i orator-serviceserver-restify" from the parent directory first so the package is available
// > please don't --save it!
// _Fable.serviceManager.instantiateServiceProvider('OratorServiceServer', require('orator-serviceserver-restify'));
const libOratorServiceServerRestify = require('orator-serviceserver-restify');
_Fable.serviceManager.addAndInstantiateServiceType('OratorServiceServer', libOratorServiceServerRestify);

_Fable.serviceManager.addServiceType('Orator', libOrator);
const tmpServiceServer = _Fable.serviceManager.instantiateServiceProvider('Orator');

// Start the service
tmpServiceServer.startService();

// Add a GET endpoint
tmpServiceServer.webServer.get
(
	'/test/:hash',
	(pRequest, pResponse, fNext) =>
	{
		// Send back whatever was sent as "name" in the URI
		pResponse.send(pRequest.params);
		tmpServiceServer.log.info(`Service has served the test echo route!`);
		return fNext();
	}
);

// If this is a web server, invoke is likely not implemented and will error.
let tmpURI = `/test/SomeHash`;
tmpServiceServer.invoke('GET', tmpURI, null, 
	(pError, pResponseData) =>
	{
		tmpServiceServer.log.info(`Response to [${tmpURI}] came back from IPC resulting in [${pResponseData}]!`)
	});

tmpServiceServer.addStaticRoute('site', 'Test.html', '/*', '/');