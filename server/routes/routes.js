module.exports = function(app) {
	// all global routes
	require(__dirname + '/login_routes.js')(app);

	// Home page after login
	app.get("/home", function (req, res) {
		res.sendFile(app.global.htmlDir + 'home.html');
	});
}