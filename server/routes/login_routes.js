var AM = require('../modules/account-manager');
var url = require('url');

module.exports = function(app) {
	var htmlDir = app.global.htmlDir;

	// global single login routes
	app.get('/login', function(req, res) {
		if (req.session.user) {
			var url_parts = url.parse(req.url, true);
			var next = url_parts.query.next;
	    	res.redirect(next ? next : '/home');
	    } else {
	    	res.sendFile(htmlDir + 'login.html');
	    }
	});

	app.post('/login', function(req, res) {
	    // TODO Add authentication here and session setup here
		AM.authenticateUser(req.body, function (err, user) {
			if (err) {
				res.send(err, 400);
			} else {
				req.session.user = user;
				res.status(200).send({redirect: req.body.next ? req.body.next : '/home'});
			}

		});
	});

	app.get('/logout', function(req, res) {
		req.session.destroy();
	    res.redirect('/login');
	});
}