// Create a mock server to test with and include any dependencies for the
// test suite.
var connect = require('connect')
  , winston = require('winston')
  , should = require('should')
  , request = require('supertest');

// Helper method to create a fake Connect server with our middleware and
// logger options.
var createServer = function (logger, options) {
    var app = connect();

    // Instantiate our Winston logger as middleware.
    app.use(require('../lib/winston-request-logger').create(logger, options));

    // Use Connect's static middleware so we can make a dummy request.
    app.use(connect.static(__dirname));

    return app;
};

// And on to the tests!
describe('winston-request-logger', function () {
    describe('logger', function () {
        it('should log request with default data', function (done) {

            // Bootstrap our environment
            var logger = new (winston.Logger)();
            var app = createServer(logger);

            // Winston emits a `logged` event, so we will listen for when our
            // middleware actual logs the event so we can test it.
            logger.once('logged', function (level, message, data) {
                data.should.have.property('date');
                data.should.have.property('status');
                data.should.have.property('method');
                data.should.have.property('url');
                data.should.have.property('response_time');
                data.should.have.property('user_agent');
                done();
            });

            // Make our dummy request.
            request(app)
              .get(__filename.replace(__dirname, ''))
              .end(function (err, res) {
                if (err) { done(err); }
              });
        });

        it('should log request with custom data', function (done) {

            // Bootstrap our environment
            var logger = new (winston.Logger)();
            var app = createServer(logger, {
                customKey: ':method :url[pathname]'
            });

            // Winston emits a `logged` event, so we will listen for when our
            // middleware actual logs the event so we can test it.
            logger.once('logged', function (level, message, data) {
                data.should.have.property('customKey');
                done();
            });

            // Make our dummy request.
            request(app)
              .get(__filename.replace(__dirname, ''))
              .end(function (err, res) {
                if (err) { done(err); }
              });
       });

        it('should log request with message property', function (done) {

            // Bootstrap our environment
            var logger = new (winston.Logger)();
            var app = createServer(logger, {
                message: ':method :url[pathname] :response_time'
            });

            // Winston emits a `logged` event, so we will listen for when our
            // middleware actual logs the event so we can test it.
            logger.once('logged', function (level, message, data) {
                message.length.should.be.greaterThan(0);
                done();
            });

            // Make our dummy request.
            request(app)
              .get(__filename.replace(__dirname, ''))
              .end(function (err, res) {
                if (err) { done(err); }
              });
       });
    });
});
