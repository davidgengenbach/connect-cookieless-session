var express = require('express'),
	app = express(),
	CookielessSession = require('../../'),
	connect = require('connect'),
	RedisStore = require('connect-redis')(express),
	SessionMongoose = require('session-mongoose')(connect);

var store = new SessionMongoose({
	url: 'mongodb://localhost/session-test',
	interval: 120000,
	ttl: 1
});

var redisStore = new RedisStore();

var cookieLessSession = new CookielessSession({
	store: redisStore
	//store: store
});

/** middleware **/
app.use(cookieLessSession);
app.use(app.router);

/** routes **/

app.get('/', function(req, res) {
	req.session.hasSession = true;
	res.send(req.session);
});

app.get('/cookie_data', function(req, res) {
	res.send(req.session);
});


app.store = store;

module.exports = app;
if (!module.parent) {
	app.listen(3000);
}