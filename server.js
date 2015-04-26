// External modules
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongo = require('mongoskin');

// app set up
app.use(express.static(__dirname + '/public'));
app.use('/tracker/static', express.static(__dirname + '/public/tracker'));
app.use('/tracker/global', express.static(__dirname + '/public/global'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Global data shared across all apps
app.global = {}
app.global.htmlDir = __dirname + '/public/global/html/';

// Global routes like login
require(__dirname + '/server/routes/routes.js')(app);

// App Specific set up

//  ---------
// | Tracker:|
//  ---------
app.tracker = {};
app.tracker.shared = {};
app.tracker.htmlDir = __dirname + '/public/tracker/html/';
app.tracker.db = mongo.db("mongodb://localhost:27017/taskTrackerDB", {native_parser:true});  // Include database reference
require(__dirname + '/server/tracker/routes/routes.js')(app);                            // Include routes

// start server
app.listen(3000);
console.log("server listening on port 3000");