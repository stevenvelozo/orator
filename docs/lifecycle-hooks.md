# Lifecycle Hooks

Orator provides lifecycle hooks that allow you to customize behavior at specific points during initialization and service startup. This is useful for setting up middleware, connecting to databases, or performing other setup tasks that need to happen at specific times.

## Initialization Lifecycle

When `initialize()` is called, Orator executes these hooks in order:

```
onBeforeInitialize() / onBeforeInitializeAsync(fNext)
    ↓
onInitialize() / onInitializeAsync(fNext)
    ↓
onAfterInitialize() / onAfterInitializeAsync(fNext)
```

The `onBeforeInitializeAsync` step is where the service server is set up. If no `OratorServiceServer` is registered with Fable, the built-in IPC server is created automatically at this point.

## Service Start Lifecycle

When `startService()` is called, Orator executes these hooks in order:

```
[initialize() — if not already initialized]
    ↓
onBeforeStartService(fNext)
    ↓
onStartService(fNext) — calls serviceServer.listen()
    ↓
onAfterStartService(fNext)
```

## Overriding Hooks

To customize the lifecycle, extend the Orator class and override any of the hook methods:

```javascript
const libOrator = require('orator');

class MyOrator extends libOrator
{
	onBeforeInitializeAsync(fNext)
	{
		// Call super to set up the service server
		super.onBeforeInitializeAsync(
			(pError) =>
			{
				if (pError) return fNext(pError);

				// Now add your custom setup
				this.log.info('Setting up custom middleware...');
				this.serviceServer.use(
					(pRequest, pResponse, fNext) =>
					{
						pRequest.customTimestamp = Date.now();
						return fNext();
					});

				return fNext();
			});
	}

	onAfterStartService(fNext)
	{
		this.log.info('Server started, performing post-startup tasks...');
		return fNext();
	}
}
```

## Sync and Async Hooks

Each lifecycle phase has both a synchronous and asynchronous variant. The synchronous version is called from within the async version by default:

```javascript
// Synchronous hook (for simple logging, etc.)
onBeforeInitialize()
{
	this.log.trace('About to initialize...');
}

// Asynchronous hook (for I/O operations)
onBeforeInitializeAsync(fNext)
{
	this.onBeforeInitialize();
	// ... async setup ...
	return fNext();
}
```

Override the async version when you need to perform asynchronous operations. Override the sync version for simple, non-blocking tasks.

## Auto-Initialization

If `startService()` is called before `initialize()`, Orator will automatically run initialization first. You don't need to manually call `initialize()` unless you need to set up routes before starting the server.
