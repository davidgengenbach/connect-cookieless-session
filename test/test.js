process.env.NODE_ENV = 'test';
// get the application server module
var app = require('./app/server'),
	request = require('request'),
	assert = require('assert');

var headerName = 'x-user-session',
	baseUrl = 'http://localhost:3000';

var userSessionSid = 'asjdaskds';

describe('cookies', function() {
	before(function() {
		this.server = app.listen(3000);
		this.headers = {};
		this.headers[headerName] = userSessionSid;

		this.request = request.defaults({
			uri: baseUrl,
			headers: this.headers,
			json: true
		});
	});

	before(function(done) {
		app.store.destroy(userSessionSid, done);
	});

	it('creates an cookie', function(done) {
		var self = this;
		setTimeout(function() {
			self.request({
				uri: baseUrl,
			}, function(error, response, body) {
				assert.ok(body.hasSession);
				done();
			});
		}, 1800);
	});

	it('creates retrieves the cookie', function(done) {
		this.request({
			uri: baseUrl + '/cookie_data',
		}, function(error, response, body) {
			assert.ok(body.hasSession);
			done();
		});
	});

	after(function(done) {
		//app.store.destroy(userSessionSid, done);
		done();
	});

	after(function(done) {
		this.server.close(done);
	});
});