/**
* Unit tests for Orator complex routes and static file serving
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

const libOrator = require('../source/Orator.js');

const Chai = require("chai");
const Expect = Chai.expect;
const Assert = Chai.assert;

const libFable = require('fable');
const libPath = require('path');

const defaultFableSettings = (
	{
		Product:'Orator-ComplexRouteTests',
		ProductVersion: '0.0.0',
		APIServerPort: 0
	});

suite
(
	'Orator',
	() =>
	{
		suite
		(
			'Multiple HTTP Verbs',
			() =>
			{
				test
				(
					'ipc should be able to handle POST routes',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();

						tmpOrator.serviceServer.post
						(
							'/api/item',
							(pRequest, pResponse, fNext) =>
							{
								pResponse.send({Created: true, Method: 'POST'});
								return fNext();
							}
						);

						tmpOrator.invoke('POST', '/api/item', {Name: 'TestItem'},
							(pError, pResponseData) =>
							{
								let tmpResponseObject = JSON.parse(pResponseData);
								Expect(tmpResponseObject).to.have.a.property('Created');
								Expect(tmpResponseObject.Created).to.equal(true);
								Expect(tmpResponseObject.Method).to.equal('POST');
								tmpOrator.log.info(`POST /api/item responded with [${pResponseData}]`);
								return fDone();
							});
					}
				);

				test
				(
					'ipc should be able to handle PUT routes',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();

						tmpOrator.serviceServer.put
						(
							'/api/item/:id',
							(pRequest, pResponse, fNext) =>
							{
								pResponse.send({Updated: true, ID: pRequest.params.id, Method: 'PUT'});
								return fNext();
							}
						);

						tmpOrator.invoke('PUT', '/api/item/42', {Name: 'UpdatedItem'},
							(pError, pResponseData) =>
							{
								let tmpResponseObject = JSON.parse(pResponseData);
								Expect(tmpResponseObject).to.have.a.property('Updated');
								Expect(tmpResponseObject.Updated).to.equal(true);
								Expect(tmpResponseObject.ID).to.equal('42');
								Expect(tmpResponseObject.Method).to.equal('PUT');
								tmpOrator.log.info(`PUT /api/item/42 responded with [${pResponseData}]`);
								return fDone();
							});
					}
				);

				test
				(
					'ipc should be able to handle DELETE routes',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();

						tmpOrator.serviceServer.del
						(
							'/api/item/:id',
							(pRequest, pResponse, fNext) =>
							{
								pResponse.send({Deleted: true, ID: pRequest.params.id, Method: 'DELETE'});
								return fNext();
							}
						);

						tmpOrator.invoke('DELETE', '/api/item/99', null,
							(pError, pResponseData) =>
							{
								let tmpResponseObject = JSON.parse(pResponseData);
								Expect(tmpResponseObject).to.have.a.property('Deleted');
								Expect(tmpResponseObject.Deleted).to.equal(true);
								Expect(tmpResponseObject.ID).to.equal('99');
								Expect(tmpResponseObject.Method).to.equal('DELETE');
								tmpOrator.log.info(`DELETE /api/item/99 responded with [${pResponseData}]`);
								return fDone();
							});
					}
				);

				test
				(
					'ipc should be able to handle PATCH routes',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();

						tmpOrator.serviceServer.patch
						(
							'/api/item/:id',
							(pRequest, pResponse, fNext) =>
							{
								pResponse.send({Patched: true, ID: pRequest.params.id, Method: 'PATCH'});
								return fNext();
							}
						);

						tmpOrator.invoke('PATCH', '/api/item/7', null,
							(pError, pResponseData) =>
							{
								let tmpResponseObject = JSON.parse(pResponseData);
								Expect(tmpResponseObject).to.have.a.property('Patched');
								Expect(tmpResponseObject.Patched).to.equal(true);
								Expect(tmpResponseObject.ID).to.equal('7');
								Expect(tmpResponseObject.Method).to.equal('PATCH');
								tmpOrator.log.info(`PATCH /api/item/7 responded with [${pResponseData}]`);
								return fDone();
							});
					}
				);

				test
				(
					'ipc should be able to register and invoke all verb types in the same service',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();

						// Register multiple verbs on the same path pattern
						tmpOrator.serviceServer.get('/api/resource/:id',
							(pRequest, pResponse, fNext) =>
							{
								pResponse.send({Action: 'read', ID: pRequest.params.id});
								return fNext();
							});

						tmpOrator.serviceServer.post('/api/resource',
							(pRequest, pResponse, fNext) =>
							{
								pResponse.send({Action: 'create'});
								return fNext();
							});

						tmpOrator.serviceServer.put('/api/resource/:id',
							(pRequest, pResponse, fNext) =>
							{
								pResponse.send({Action: 'update', ID: pRequest.params.id});
								return fNext();
							});

						tmpOrator.serviceServer.del('/api/resource/:id',
							(pRequest, pResponse, fNext) =>
							{
								pResponse.send({Action: 'delete', ID: pRequest.params.id});
								return fNext();
							});

						tmpFable.Utility.waterfall([
								(fStageComplete) =>
								{
									tmpOrator.invoke('GET', '/api/resource/10', null,
										(pError, pResponseData) =>
										{
											let tmpResponseObject = JSON.parse(pResponseData);
											Expect(tmpResponseObject.Action).to.equal('read');
											Expect(tmpResponseObject.ID).to.equal('10');
											return fStageComplete();
										});
								},
								(fStageComplete) =>
								{
									tmpOrator.invoke('POST', '/api/resource', {Name: 'New'},
										(pError, pResponseData) =>
										{
											let tmpResponseObject = JSON.parse(pResponseData);
											Expect(tmpResponseObject.Action).to.equal('create');
											return fStageComplete();
										});
								},
								(fStageComplete) =>
								{
									tmpOrator.invoke('PUT', '/api/resource/10', {Name: 'Updated'},
										(pError, pResponseData) =>
										{
											let tmpResponseObject = JSON.parse(pResponseData);
											Expect(tmpResponseObject.Action).to.equal('update');
											Expect(tmpResponseObject.ID).to.equal('10');
											return fStageComplete();
										});
								},
								(fStageComplete) =>
								{
									tmpOrator.invoke('DELETE', '/api/resource/10', null,
										(pError, pResponseData) =>
										{
											let tmpResponseObject = JSON.parse(pResponseData);
											Expect(tmpResponseObject.Action).to.equal('delete');
											Expect(tmpResponseObject.ID).to.equal('10');
											return fStageComplete();
										});
								}
							],
							(pError) =>
							{
								tmpOrator.log.info('All CRUD operations completed successfully via IPC');
								return fDone();
							});
					}
				);
			}
		);

		suite
		(
			'Complex Route Patterns',
			() =>
			{
				test
				(
					'ipc should be able to handle multiple URL parameters',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();

						tmpOrator.serviceServer.get
						(
							'/api/:entity/:id/child/:childId',
							(pRequest, pResponse, fNext) =>
							{
								pResponse.send(
									{
										Entity: pRequest.params.entity,
										ID: pRequest.params.id,
										ChildID: pRequest.params.childId
									});
								return fNext();
							}
						);

						tmpOrator.invoke('GET', '/api/Author/5/child/12', null,
							(pError, pResponseData) =>
							{
								let tmpResponseObject = JSON.parse(pResponseData);
								Expect(tmpResponseObject.Entity).to.equal('Author');
								Expect(tmpResponseObject.ID).to.equal('5');
								Expect(tmpResponseObject.ChildID).to.equal('12');
								tmpOrator.log.info(`Nested route responded with entity [${tmpResponseObject.Entity}] id [${tmpResponseObject.ID}] child [${tmpResponseObject.ChildID}]`);
								return fDone();
							});
					}
				);

				test
				(
					'ipc should be able to handle routes that return string responses',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();

						tmpOrator.serviceServer.get
						(
							'/api/version',
							(pRequest, pResponse, fNext) =>
							{
								pResponse.send('1.0.0');
								return fNext();
							}
						);

						tmpOrator.invoke('GET', '/api/version', null,
							(pError, pResponseData) =>
							{
								Expect(pResponseData).to.equal('1.0.0');
								tmpOrator.log.info(`String endpoint responded with [${pResponseData}]`);
								return fDone();
							});
					}
				);

				test
				(
					'ipc should handle chained route handlers sequentially',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();

						// Register a route with multiple handler functions chained together
						tmpOrator.serviceServer.get
						(
							'/api/chained/:value',
							// First handler: decorate the request
							(pRequest, pResponse, fNext) =>
							{
								pRequest.Decorated = true;
								pRequest.ProcessingSteps = ['step1'];
								return fNext();
							},
							// Second handler: add more decoration
							(pRequest, pResponse, fNext) =>
							{
								pRequest.ProcessingSteps.push('step2');
								return fNext();
							},
							// Third handler: send the response
							(pRequest, pResponse, fNext) =>
							{
								pResponse.send(
									{
										Value: pRequest.params.value,
										Decorated: pRequest.Decorated,
										Steps: pRequest.ProcessingSteps
									});
								return fNext();
							}
						);

						tmpOrator.invoke('GET', '/api/chained/TestValue', null,
							(pError, pResponseData) =>
							{
								let tmpResponseObject = JSON.parse(pResponseData);
								Expect(tmpResponseObject.Value).to.equal('TestValue');
								Expect(tmpResponseObject.Decorated).to.equal(true);
								Expect(tmpResponseObject.Steps).to.be.an('array');
								Expect(tmpResponseObject.Steps).to.have.lengthOf(2);
								Expect(tmpResponseObject.Steps[0]).to.equal('step1');
								Expect(tmpResponseObject.Steps[1]).to.equal('step2');
								tmpOrator.log.info(`Chained handler responded after ${tmpResponseObject.Steps.length} processing steps`);
								return fDone();
							});
					}
				);

				test
				(
					'ipc should handle post-behavior functions after route handlers',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();

						let tmpPostBehaviorExecuted = false;

						// Add a post-behavior function
						tmpOrator.serviceServer.addPostBehaviorFunction(
							(pRequest, pResponse, fNext) =>
							{
								tmpPostBehaviorExecuted = true;
								return fNext();
							});

						tmpOrator.serviceServer.get
						(
							'/api/postbehavior',
							(pRequest, pResponse, fNext) =>
							{
								pResponse.send({Message: 'Handled'});
								return fNext();
							}
						);

						tmpOrator.invoke('GET', '/api/postbehavior', null,
							(pError, pResponseData) =>
							{
								let tmpResponseObject = JSON.parse(pResponseData);
								Expect(tmpResponseObject.Message).to.equal('Handled');
								Expect(tmpPostBehaviorExecuted).to.equal(true, 'Post-behavior function should have executed');
								tmpOrator.log.info(`Post-behavior test completed, postBehaviorExecuted: ${tmpPostBehaviorExecuted}`);
								return fDone();
							});
					}
				);
			}
		);

		suite
		(
			'Service Lifecycle',
			() =>
			{
				test
				(
					'orator should be able to stop and report inactive status',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService(
							() =>
							{
								Expect(tmpOrator.serviceServer.Active).to.equal(true);
								tmpOrator.stopService(
									() =>
									{
										Expect(tmpOrator.serviceServer.Active).to.equal(false);
										tmpOrator.log.info('Service started and stopped successfully');
										return fDone();
									});
							});
					}
				);

				test
				(
					'orator should warn when stopping a service that has not been initialized',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						// Try to stop without starting
						tmpOrator.stopService(
							(pError) =>
							{
								Expect(pError).to.be.a('string');
								tmpOrator.log.info(`Stop-before-init warning: ${pError}`);
								return fDone();
							});
					}
				);

				test
				(
					'orator should use ServicePort from options and fall back to defaults',
					(fDone) =>
					{
						// ServicePort passed directly in options should be used
						let tmpFable = new libFable(
							{
								Product:'Orator-PortTest',
								ProductVersion: '0.0.0'
							});
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {ServicePort: 9999});
						Expect(tmpOrator.options.ServicePort).to.equal(9999);

						// Test the legacy APIServerPort migration from fable settings
						let tmpFableLegacy = new libFable(
							{
								Product:'Orator-LegacyPortTest',
								ProductVersion: '0.0.0',
								APIServerPort: 7777
							});
						tmpFableLegacy.serviceManager.addServiceType('Orator', libOrator);
						let tmpOratorLegacy = tmpFableLegacy.serviceManager.instantiateServiceProvider('Orator', {});
						Expect(tmpOratorLegacy.options.ServicePort).to.equal(7777);

						// Test the default port when nothing is configured
						let tmpFableDefault = new libFable(
							{
								Product:'Orator-DefaultPortTest',
								ProductVersion: '0.0.0'
							});
						tmpFableDefault.serviceManager.addServiceType('Orator', libOrator);
						let tmpOratorDefault = tmpFableDefault.serviceManager.instantiateServiceProvider('Orator', {});
						Expect(tmpOratorDefault.options.ServicePort).to.equal(8080);

						tmpOrator.log.info('Port configuration tests passed');
						return fDone();
					}
				);

				test
				(
					'orator should provide a legacy webServer property',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.initialize(
							() =>
							{
								Expect(tmpOrator.webServer).to.be.an('object');
								Expect(tmpOrator.webServer).to.equal(tmpOrator.serviceServer);
								Expect(tmpOrator.webServer.ServiceServerType).to.equal('IPC');
								tmpOrator.log.info('Legacy webServer alias verified');
								return fDone();
							});
					}
				);

				test
				(
					'orator legacy startWebServer and stopWebServer should work',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startWebServer(
							() =>
							{
								Expect(tmpOrator.serviceServer.Active).to.equal(true);
								tmpOrator.stopWebServer(
									() =>
									{
										Expect(tmpOrator.serviceServer.Active).to.equal(false);
										tmpOrator.log.info('Legacy start/stop methods verified');
										return fDone();
									});
							});
					}
				);
			}
		);

		suite
		(
			'Static File Serving',
			() =>
			{
				test
				(
					'addStaticRoute should return false when no file path is provided',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.initialize(
							() =>
							{
								let tmpResult = tmpOrator.addStaticRoute();
								Expect(tmpResult).to.equal(false);
								tmpOrator.log.info('addStaticRoute correctly rejected missing file path');
								return fDone();
							});
					}
				);

				test
				(
					'addStaticRoute should return true with a valid file path',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.initialize(
							() =>
							{
								let tmpStaticPath = libPath.normalize(__dirname + '/static_content/');
								let tmpResult = tmpOrator.addStaticRoute(tmpStaticPath);
								Expect(tmpResult).to.equal(true);
								tmpOrator.log.info(`addStaticRoute mapped [${tmpStaticPath}] successfully`);
								return fDone();
							});
					}
				);

				test
				(
					'addStaticRoute should accept all optional parameters',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.initialize(
							() =>
							{
								let tmpStaticPath = libPath.normalize(__dirname + '/static_content/');
								let tmpResult = tmpOrator.addStaticRoute(tmpStaticPath, 'about.html', '/content/*', '/content/', {maxAge: '1d'});
								Expect(tmpResult).to.equal(true);
								tmpOrator.log.info('addStaticRoute accepted all optional parameters');
								return fDone();
							});
					}
				);

				test
				(
					'addStaticRoute should reject non-string file paths',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.initialize(
							() =>
							{
								Expect(tmpOrator.addStaticRoute(42)).to.equal(false);
								Expect(tmpOrator.addStaticRoute(null)).to.equal(false);
								Expect(tmpOrator.addStaticRoute({})).to.equal(false);
								Expect(tmpOrator.addStaticRoute(true)).to.equal(false);
								tmpOrator.log.info('addStaticRoute rejected all non-string file paths');
								return fDone();
							});
					}
				);
			}
		);

		suite
		(
			'Route Validation',
			() =>
			{
				test
				(
					'service server should reject non-string route parameters',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.initialize(
							() =>
							{
								Expect(tmpOrator.serviceServer.get(42)).to.equal(false);
								Expect(tmpOrator.serviceServer.post(null)).to.equal(false);
								Expect(tmpOrator.serviceServer.put(undefined)).to.equal(false);
								Expect(tmpOrator.serviceServer.del({})).to.equal(false);
								Expect(tmpOrator.serviceServer.patch([])).to.equal(false);
								Expect(tmpOrator.serviceServer.opts(true)).to.equal(false);
								tmpOrator.log.info('All verb methods correctly rejected non-string routes');
								return fDone();
							});
					}
				);

				test
				(
					'service server use should reject non-function handlers',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.initialize(
							() =>
							{
								Expect(tmpOrator.serviceServer.use('not a function')).to.equal(false);
								Expect(tmpOrator.serviceServer.use(42)).to.equal(false);
								Expect(tmpOrator.serviceServer.use(null)).to.equal(false);
								tmpOrator.log.info('use() correctly rejected non-function handlers');
								return fDone();
							});
					}
				);
			}
		);

		suite
		(
			'Middleware and Complex Behavior Pipeline',
			() =>
			{
				test
				(
					'multiple pre-behavior functions should execute in order',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();

						// Add three pre-behavior functions that build up an array
						tmpOrator.serviceServer.use(
							(pRequest, pResponse, fNext) =>
							{
								pRequest.Pipeline = ['first'];
								return fNext();
							});

						tmpOrator.serviceServer.use(
							(pRequest, pResponse, fNext) =>
							{
								pRequest.Pipeline.push('second');
								return fNext();
							});

						tmpOrator.serviceServer.use(
							(pRequest, pResponse, fNext) =>
							{
								pRequest.Pipeline.push('third');
								return fNext();
							});

						tmpOrator.serviceServer.get
						(
							'/api/pipeline',
							(pRequest, pResponse, fNext) =>
							{
								pResponse.send({Pipeline: pRequest.Pipeline});
								return fNext();
							}
						);

						tmpOrator.invoke('GET', '/api/pipeline', null,
							(pError, pResponseData) =>
							{
								let tmpResponseObject = JSON.parse(pResponseData);
								Expect(tmpResponseObject.Pipeline).to.be.an('array');
								Expect(tmpResponseObject.Pipeline).to.have.lengthOf(3);
								Expect(tmpResponseObject.Pipeline[0]).to.equal('first');
								Expect(tmpResponseObject.Pipeline[1]).to.equal('second');
								Expect(tmpResponseObject.Pipeline[2]).to.equal('third');
								tmpOrator.log.info(`Pipeline executed in order: ${tmpResponseObject.Pipeline.join(' -> ')}`);
								return fDone();
							});
					}
				);

				test
				(
					'pre-behavior and post-behavior functions should bracket the route handler',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();

						let tmpExecutionOrder = [];

						tmpOrator.serviceServer.use(
							(pRequest, pResponse, fNext) =>
							{
								tmpExecutionOrder.push('pre');
								return fNext();
							});

						tmpOrator.serviceServer.addPostBehaviorFunction(
							(pRequest, pResponse, fNext) =>
							{
								tmpExecutionOrder.push('post');
								return fNext();
							});

						tmpOrator.serviceServer.get
						(
							'/api/bracket',
							(pRequest, pResponse, fNext) =>
							{
								tmpExecutionOrder.push('handler');
								pResponse.send({Order: 'captured'});
								return fNext();
							}
						);

						tmpOrator.invoke('GET', '/api/bracket', null,
							(pError, pResponseData) =>
							{
								Expect(tmpExecutionOrder).to.have.lengthOf(3);
								Expect(tmpExecutionOrder[0]).to.equal('pre');
								Expect(tmpExecutionOrder[1]).to.equal('handler');
								Expect(tmpExecutionOrder[2]).to.equal('post');
								tmpOrator.log.info(`Execution order: ${tmpExecutionOrder.join(' -> ')}`);
								return fDone();
							});
					}
				);

				test
				(
					'middleware should share request state across separate invoke calls',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.startService();

						let tmpRequestCount = 0;

						// Middleware that counts requests
						tmpOrator.serviceServer.use(
							(pRequest, pResponse, fNext) =>
							{
								tmpRequestCount++;
								pRequest.RequestNumber = tmpRequestCount;
								return fNext();
							});

						tmpOrator.serviceServer.get
						(
							'/api/counted',
							(pRequest, pResponse, fNext) =>
							{
								pResponse.send({RequestNumber: pRequest.RequestNumber});
								return fNext();
							}
						);

						tmpFable.Utility.waterfall([
								(fStageComplete) =>
								{
									tmpOrator.invoke('GET', '/api/counted', null,
										(pError, pResponseData) =>
										{
											let tmpResponseObject = JSON.parse(pResponseData);
											Expect(tmpResponseObject.RequestNumber).to.equal(1);
											return fStageComplete();
										});
								},
								(fStageComplete) =>
								{
									tmpOrator.invoke('GET', '/api/counted', null,
										(pError, pResponseData) =>
										{
											let tmpResponseObject = JSON.parse(pResponseData);
											Expect(tmpResponseObject.RequestNumber).to.equal(2);
											return fStageComplete();
										});
								},
								(fStageComplete) =>
								{
									tmpOrator.invoke('GET', '/api/counted', null,
										(pError, pResponseData) =>
										{
											let tmpResponseObject = JSON.parse(pResponseData);
											Expect(tmpResponseObject.RequestNumber).to.equal(3);
											return fStageComplete();
										});
								}
							],
							(pError) =>
							{
								Expect(tmpRequestCount).to.equal(3);
								tmpOrator.log.info(`Request counter middleware tracked ${tmpRequestCount} invocations`);
								return fDone();
							});
					}
				);
			}
		);

		suite
		(
			'IPC Server Properties',
			() =>
			{
				test
				(
					'ipc service server should have correct properties',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.initialize(
							() =>
							{
								Expect(tmpOrator.serviceServer.ServiceServerType).to.equal('IPC');
								Expect(tmpOrator.serviceServer.URL).to.equal('IPC');
								Expect(tmpOrator.serviceServer.Port).to.equal(0);
								Expect(tmpOrator.serviceServer.Active).to.equal(false);
								Expect(tmpOrator.serviceServer.Name).to.equal('Orator-ComplexRouteTests');
								tmpOrator.log.info('IPC service server properties verified');
								return fDone();
							});
					}
				);

				test
				(
					'ipc bodyParser should return a passthrough function',
					(fDone) =>
					{
						let tmpFable = new libFable(defaultFableSettings);
						tmpFable.serviceManager.addServiceType('Orator', libOrator);
						let tmpOrator = tmpFable.serviceManager.instantiateServiceProvider('Orator', {});
						tmpOrator.initialize(
							() =>
							{
								let tmpBodyParser = tmpOrator.serviceServer.bodyParser();
								Expect(tmpBodyParser).to.be.a('function');
								// The IPC body parser should be a no-op passthrough
								let tmpNextCalled = false;
								tmpBodyParser({}, {},
									() =>
									{
										tmpNextCalled = true;
									});
								Expect(tmpNextCalled).to.equal(true);
								tmpOrator.log.info('IPC bodyParser is a passthrough function');
								return fDone();
							});
					}
				);
			}
		);
	}
);
