# Orator

Orator API Server, meant to interact well with Fable, Meadow and FoxHound.

[![Coverage Status](https://coveralls.io/repos/stevenvelozo/orator/badge.svg?branch=master)](https://coveralls.io/r/stevenvelozo/orator?branch=master) [![Build Status](https://travis-ci.org/stevenvelozo/orator.svg?branch=master)](https://travis-ci.org/stevenvelozo/orator) [![Dependency Status](https://david-dm.org/stevenvelozo/orator.svg)](https://david-dm.org/stevenvelozo/orator) [![devDependency Status](https://david-dm.org/stevenvelozo/orator/dev-status.svg)](https://david-dm.org/stevenvelozo/orator#info=devDependencies)

This is not an attempt to reinvent the wheel.  Nor do we want to make a car with five of them.

Orator is a wrapper for [restify](https://github.com/restify/node-restify), which is an amazing API server.  With Orator, you can spin up a web server in a single simple line.  And config settings are managed via a consistent json format, so as you begin to have 10 or 15 or 5,000 microservices, you don't have a bunch of boilerplate API server code laying around.

## Creating a Simple Server

Okay, so you want to make a simple api server.  You would need to create a node.js project, then install the Orator dependency with npm:

```sh
npm install orator --save
```

Then within your javascript code, you could write the following:

```js
// Load the orator module with a few settings
var libOrator = require('orator').new(
	{
		Product: 'MyMicroserviceHash',
		ProductVersion: '9.8.7',

		"APIServerPort": 8000
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
```

After writing this code, you could run your service and a browser going to `http://localhost:8000/echo/Gargamel` would return a JSON object with Gargamel as the name.

Of course, this is not much different from the Restify code.  Where it gets interesting is dealing with things like logging and configuration management.  For instance, if you do

```js
// Load the orator module with a few settings
var libOrator = require('orator').new(
	{
		Product: 'MyMicroserviceHash',
		ProductVersion: '9.8.7',

		"APIServerPort": 8000,

		ConfigFile:__dirname+'/MyMicroservice-Config.json'
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
```

Then you could create a file in the same folder as this script called `MyMicroservice-Config.json` and as long as it is valid json, settings can be loaded from there.  Something like this:

```json
{
	"APIServerPort": 8080,

	"UUID":
		{
			"DataCenter": 0,
			"Worker": 0
		},

	"LogStreams":
		[
			{
				"level": "info",
				"path": "./MyMicroService-Server.log"
			},
			{
				"level": "trace",
				"streamtype": "process.stdout"
			}
		]
}
```

And suddenly the bunyan logging will write to a file and stdout, and you can configure 20 Docker instances to each have a different Worker ID.


