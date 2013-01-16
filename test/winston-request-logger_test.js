var winston_request_logger = require('../lib/winston-request-logger.js')
    , should = require('should')

describe('winston-request-logger', function () {
    describe('logger', function () {
        it('should log request', function (done) {
            var logger = winston_request_logger.create(logger)
                , req = {method: 'GET', originalUrl: '/d41d8cd98f/js/main.min.js'}
                , response = {statusCode: 200}
            logger(req, response, function () {
                should.exist(req.requestLogEntry)
                req.requestLogEntry.should.have.property('url')
                req.requestLogEntry.should.have.property('method')
                req.requestLogEntry.should.have.property('date')
                done()
            })
        })
    })
})