/*
 * winston-request-logger
 *
 * https://github.com/markw/winston-request-logger
 *
 * Copyright (c) 2013 Mark Wolfe
 * Licensed under the MIT license.
 */

var url = require('url')
  , events = require('events')
  , colors = require('colors')
  , Logger = {};

/**
 * Winston logger which integrates with express to capture information about the http request.
 *
 * @param logger - Winston logger instance.
 * @param format (optional) - Object containing format options (see below).
 * @return {Function}
 */
Logger.create = function (logger, format) {

    /**
     * Function to classify the level based on the HTTP status code.
     *
     * @param status
     * @return {string}
     * @private
     */
    function _colorStatus(status) {

        if (status < 400) { // anything below 400 is OK(ish)
            return (status).toString().green;
        }

        if (status < 500) { // less than 500 is all still not an error per say
            return (status).toString().yellow;
        }

        return (status).toString().red; // anything above 500 is badness
    }

    return function (req, res, next) {
        var requestEnd = res.end
          , requestedUrl = url.parse(req.originalUrl)
          , startTime = new Date();

        // Proxy the real end function
        res.end = function (chunk, encoding) {

            // Do the work expected
            res.end = requestEnd;
            res.end(chunk, encoding);

            // Our format argument above contains key-value pairs for the output
            // object we send to Winston. Let's use this to format our results:
            var data = {};
            var tokens = {
                ':date': startTime.toISOString(),
                ':statusCode': _colorStatus(res.statusCode),
                ':method': req.method,
                ':responseTime': (new Date() - startTime),
                ':url\\[([a-z]+)\\]': function (str, segment) { return requestedUrl[segment]; },
                ':ip': req.headers['x-forwarded-for'] || req.connection.remoteAddress
            };

            // Let's define a default format
            if (typeof(format) !== 'object') {
                format = {
                    date: ':date',
                    status: ':statusCode',
                    method: ':method',
                    url: ':url[pathname]',
                    response_time: ':responseTime'
                };
            }

            // ... and replace our tokens!
            var replaceToken = function (str, match) { return tokens[token]; };
            for (var key in format) {
                data[key] = format[key];
                for (var token in tokens) {
                    data[key] = data[key].replace(new RegExp(token), typeof(tokens[token]) === 'function' ? tokens[token] : replaceToken);
                }
            }

            // If we have a `message` key, we'll treat it as special and pass
            // it into Winston correctly.
            if (data.message) {
                var message = data.message;
                delete data.message;
                return logger.info(message, data);
            }
            logger.info(data);
        };

        next();
    };
};

module.exports = Logger;