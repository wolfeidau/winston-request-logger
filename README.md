# winston-request-logger

Winston http request logger for express which is loosely based on [express-request-logger](https://github.com/mathrawka/express-request-logger).

[![Build Status](https://secure.travis-ci.org/wolfeidau/winston-request-logger.png)](http://travis-ci.org/wolfeidau/winston-request-logger)

## Getting Started
In an existing express project you can add the following configuration fragment to enable request logging to console,
with colors while in development or test.

```javascript
    app.configure('development', 'test', function(){
        // Request Logging
        var logger = new (winston.Logger)({ transports: [ new (winston.transports.Console)({colorize:true}) ] });
        app.use(require('winston-request-logger').create(logger));
    });
```

## Custom formats
You can optionally specify a second argument to `create(logger, [format])` to customize the object sent to Winston:

```javascript
	app.use(require('winston-request-logger').create(logger, {
		'responseTime': ':responseTime ms',		// outputs '5 ms'
		'url': ':url[pathname]'					// outputs '/some/path'
	}));
```

### Format tokens:
* `:date` - Timestamp of the request.
* `:statusCode` - HTTP status code of the request.
* `:method` - HTTP method (GET, POST, etc.)
* `:url[segment]` - Segment of the URL requested (Refer to the [url module](http://nodejs.org/api/url.html) for options).
* `:responseTime` - Time it took for the response (in milliseconds).
* `:ip` - The client's IP address (looks to `X-forwarded-for` header first).
* `:userAgent` - The client's browser agent (parsed with [`useragent`](https://github.com/3rd-Eden/useragent).


## Contributors
<table><tbody>
<tr><th align="left">Mark Wolfe</th><td><a href="https://github.com/wolfeidau">GitHub/wolfeidau</a></td><td><a href="http://twitter.com/wolfeidau">Twitter/@wolfeidau</a></td></tr>
<tr><th align="left">Evan Dudla</th><td><a href="https://github.com/evNN">GitHub/evNN</a></td><td><a href="http://twitter.com/evandudla">Twitter/@evandudla</a></td></tr>
</tbody></table>

### Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/gruntjs/grunt).


## License
Copyright (c) 2013 Mark Wolfe  
Licensed under the MIT license.
