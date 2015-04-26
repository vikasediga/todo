var async = require('async');

module.exports = function(app) {
	var db = app.tracker.db;

	app.tracker.shared.addMetaData = function (lists, cb) {
	    var cbDummy = function (err) {};

	    async.eachSeries(lists, function (list, cbDummy) {
	        var listName = list._id.toString();
	        // add meta data
	        db.collection(listName).find({done: true}).toArray(function (err, doneTasks) {
	            list.done = doneTasks.length;
	            list.progress = Math.floor((list['done']/list['total'])*100); // list progress
	            cbDummy();
	        });
	    }, function (err) {
	        err ? cb(err) : cb(lists);
	    });
	}	
};