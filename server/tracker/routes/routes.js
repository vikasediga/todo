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

	app.use('/tracker', requireLogin);

	// include all tracker routes
	app.get("/tracker", function (req, res) {
		res.sendFile(app.tracker.htmlDir + 'index.html');
	});

	require(__dirname + '/lists_routes.js')(app); //  /lists routes
	require(__dirname + '/list_routes.js')(app); //   /list routes
	require(__dirname + '/shared.js')(app); //  shared methods
};