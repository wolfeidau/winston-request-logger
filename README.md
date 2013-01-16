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

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/gruntjs/grunt).

## License
Copyright (c) 2013 Mark Wolfe  
Licensed under the MIT license.
