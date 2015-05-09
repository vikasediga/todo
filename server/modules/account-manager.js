var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/accounts", {native_parser:true});  // Include database reference

exports.authenticateUser = function (currUser, cb) {
	db.collection('users').findOne({username: currUser.username}, function (err, user) {
        if (err) {
            cb('Invalid user');
        } else if(!user) {
			cb('Invalid user');
        } else {
        	if (user.pwd === currUser.pwd) {
        		// valid username and pwd
				cb(null, user);
        	} else {
        		// Invalid pwd
        		cb('Invalid password');
        	}
        }
    });
};