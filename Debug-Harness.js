// Load the orator module with a few settings
var libOrator = require(__dirname+'/source/Orator.js').new(
	{
		Product: 'MyMicroserviceHash',
		ProductVersion: '9.8.7',

		"APIServerPort": 8080
	});

// Add an API endpoint
libOrator.webServer.post
(
	'/echo/:name',
	function(pRequest, pResponse, fNext)
	{
		// Send back whatever was sent as "name" in the URI
		pResponse.send(pRequest.params);
		return fNext();
	}
);

// Start the web service
libOrator.startWebServer();
