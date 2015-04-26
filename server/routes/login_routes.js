module.exports = function(app) {
	var htmlDir = app.global.htmlDir;

	// global single login routes
	app.get('/login', function(req, res) {
	    res.sendFile(htmlDir + 'login.html');
	});

	app.post('/login', function(req, res) {
	    // TODO Add authentication here and session setup here
	    res.send({redirect: '/home'});
	});

	app.get('/logout', function(req, res) {
	    res.redirect('/login');
	});
}