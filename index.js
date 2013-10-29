var exports = module.exports = CookielessSession,
	_ = require('lodash');

var header = 'x-user-session';

function CookielessSession(options) {
	this.store = options.store;
	return _.bind(this.onRequest, this);
}

CookielessSession.prototype.onRequest = function(req, res, next) {
	var self = this,
		sessionId = req.headers[header];

	req.sessionId = sessionId;
	req.session = req.session || {};

	if(req.sessionId) {
		this.store.get(req.sessionId, function(err, result) {
			if(result) {
				req.session = result;
			}
			next();
		});
	} else {
		next();
	}

	res.on('finish', function() {
		if(!req.sessionId) delete req.session;
		self.saveSession(req, function(err) {
			if(err) {
				console.log(":(");
			}
		});
	});
};

CookielessSession.prototype.saveSession = function(req, cb) {
	req.session.cookie = {
		maxAge: 999999999999
	};
	this.store.set(req.sessionId, req.session, function(err, session) {
		cb(err, session);
	});
};