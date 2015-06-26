module.exports = function(app) {
	function requireLogin(req, res, next) {
	    var session = req.session;
	    // Check if the session has an authenticated user
	    if (!session.user) {
	        session.error = 'Access denied.';
	        res.redirect('/login?next=' + req.originalUrl);
	    }
	    if (!session.error) {
     		next();
    	}
	}

	app.use('/xpense', requireLogin);

	// include all xpense routes
	app.get("/xpense", function (req, res) {
		res.sendFile(app.xpense.htmlDir + 'index.html');
	});

	require(__dirname + '/year_routes.js')(app); //  /year routes
	require(__dirname + '/month_routes.js')(app); //  /year/XXX/month/XXX routes
	// require(__dirname + '/list_routes.js')(app); //   /list routes
	// require(__dirname + '/shared.js')(app); //  shared methods
};