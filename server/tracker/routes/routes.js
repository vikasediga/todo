module.exports = function(app) {
	// include all tracker routes
	app.get("/tracker", function (req, res) {
		res.sendFile(app.tracker.htmlDir + 'index.html');
	});

	require(__dirname + '/lists_routes.js')(app); //  /lists routes
	require(__dirname + '/list_routes.js')(app); //   /list routes
	require(__dirname + '/shared.js')(app); //  shared methods
};