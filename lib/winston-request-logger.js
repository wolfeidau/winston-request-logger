/*
 * winston-request-logger
 *
 *
 * https://github.com/markw/winston-request-logger
 *
 * Copyright (c) 2013 Mark Wolfe
 * Licensed under the MIT license.
 */

var url = require('url')

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
            date: req.requestStartTime.toISOString(), method: req.method, url: url.parse(req.originalUrl).pathname, type: 'request'
        }

        // Proxy the real end function
        res.end = function (chunk, encoding) {
            // Do the work expected
            res.end = requestEnd
            res.end(chunk, encoding)

            // Save a few more variables that we can only get at the end
            req.requestLogEntry.status = res.statusCode
            req.requestLogEntry.response_time = (new Date() - req.requestStartTime)

            // Send the log off to winston
            var level = _levelByStatus(res.statusCode)
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
    function _levelByStatus(status) {

        if (status < 400) { // anything below 400 is OK(ish)
            return 'info'
        }

        if (status < 500) { // less than 500 is all still not an error per say
            return 'warn'
        }

        return 'error' // anything above 500 is badness
    }
}