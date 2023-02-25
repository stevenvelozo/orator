'use strict'

// This is taken directly from the find-my-way documentation for custom constraints and only mildly edited
const ipcResponseTypeStrategy = (
	{
		// strategy name for referencing in the route handler `constraints` options
		name: 'ipc',
		isAsync: true,

		// storage factory for storing routes in the find-my-way route tree
		storage:
			()=>
			{
				let handlers = {};

				return (
					{
						get: (type) => { return handlers[type] || null },
						set: (type, store) => { handlers[type] = store }
					});
			},

		// function to get the value of the constraint from each incoming request
		deriveConstraint: (pRequest, pContext, fDone) =>
			{
				// If we wanted to deny the IPC request based on a constraint, we would do:
				// fDone(new Error(`The request was denied because ____ in the Request object wasn't right...`));
				return fDone(null, 'IPC');
			},

		// optional flag marking if handlers without constraints can match requests that have a value for this constraint
		mustMatchWhenDerived: true
	});

module.exports = ipcResponseTypeStrategy;