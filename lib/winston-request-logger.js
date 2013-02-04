/*
 * winston-request-logger
 *
 * https://github.com/markw/winston-request-logger
 *
 * Copyright (c) 2013 Mark Wolfe
 * Licensed under the MIT license.
 */

var url = require('url')
    , colors = require('colors')

/**
 * Winston logger which integrates with express to capture information about the http request.
 *
 * @param logger
 * @return {Function}
 */
exports.create = function (logger) {

    return function (req, res, next) {
        var requestEnd = res.end

        // To track response time
        req.requestStartTime = new Date()

        // Setup the key-value object of data to log and include some basic info
        req.requestLogEntry = {
            date: req.requestStartTime.toISOString(), status: null, method: req.method, url: url.parse(req.originalUrl).pathname
        }

        // Proxy the real end function
        res.end = function (chunk, encoding) {
            // Do the work expected
            res.end = requestEnd
            res.end(chunk, encoding)

            // Save a few more variables that we can only get at the end
            req.requestLogEntry.status = _colorStatus(res.statusCode)
            req.requestLogEntry.response_time = (new Date() - req.requestStartTime)

            // Send the log off to winston
            var level = 'info'
                , msg = req.requestLogEntry.message || ''

            if (msg.length) {
                delete req.requestLogEntry.message
            }

            logger.log(level, msg, req.requestLogEntry)
        }

        next()
    }

    /**
     * Function to classify the level based on the HTTP status code.
     *
     * @param status
     * @return {string}
     * @private
     */
    function _colorStatus(status) {

        if (status < 400) { // anything below 400 is OK(ish)
            return (status).toString().green
        }

        if (status < 500) { // less than 500 is all still not an error per say
            return (status).toString().yellow
        }

        return (status).toString().red // anything above 500 is badness
    }
}