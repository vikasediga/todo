module.exports = function(app) {
    var db = app.xpense.db;

    /*
        This GET request handler returns list of all the available lists along with thier meta data.

        Example: 
        GET http://localhost:3000/tracker/lists
        response: 
        [{"name":"grocery list","total":2,"done":1,"_id":"54f534ff1945b33667f4be23","progress":50},
         {"name":"Fruit list","total":4,"done":3,"_id":"54f56a449867e4306974519b","progress":75},...]
    */
    app.get("/xpense/years", function (req, res) {
    	db.collection(req.session.user.username + "_years").find().toArray(function (err, years) {
            if (err) {
                res.json(err);
            } else {
                /*  lists looks like below:
                    [{"name":"grocery list","total":2,"_id":"54f534ff1945b33667f4be23"},
                    {"name":"Fruit list","total":4,"_id":"54f56a449867e4306974519b"},...] 
                */
                res.json(years);
            }
        });
    });


    /*
        This POST request handler receives the name of the new list to be created
        and adds the new entry to the lists table

        Example: 
        POST http://localhost:3000/tracker/lists
        request body: {"newList":"Movie list"}
        response: {msg: "Successfully created new list"}
    */
    app.post('/xpense/years', function (req, res) {
        var newYear = {
            'year': req.body.newYear
        };

        db.collection(req.session.user.username + "_years").insert(newYear, function (err, records) {
            err ? res.json(err) : res.json({msg: "Successfully created new year"});
        });
    });


    /*
        This DELETE request handler receives the name (mongo unique id) of the list to be deleted
        and deletes that table and its reference from the lists table

        Example: 
        DELETE http://localhost:3000/tracker/lists/552f4ea659061b0e027a186b
        request body: {"newList":"Movie list"}
        response: {msg: "Successfully created new list"}
    */
    app.delete("/tracker/lists/:id", function (req, res) {
        var tableName = req.params.id;
        db.collection(tableName).drop(function () {
            // Ignore the err as it might be because the table was never created but just a reference.
            db.collection(req.session.user.username + '_lists').removeById(tableName, function (err) {
                err ? res.json(err) : res.json({msg: 'Successfully removed list'});
            });
        });
    });



    /*
        This GET request handler returns list of all the available lists along with thier meta data.

        Example: 
        GET http://localhost:3000/tracker/lists
        response: 
        [{"name":"grocery list","total":2,"done":1,"_id":"54f534ff1945b33667f4be23","progress":50},
         {"name":"Fruit list","total":4,"done":3,"_id":"54f56a449867e4306974519b","progress":75},...]
    */
    app.get("/xpense/year/:year", function (req, res) {
        var year = req.params.year;
        db.collection(req.session.user.username + "_" + year).find().toArray(function (err, years) {
            if (err) {
                res.json(err);
            } else {
                /*  lists looks like below:
                    [{"name":"grocery list","total":2,"_id":"54f534ff1945b33667f4be23"},
                    {"name":"Fruit list","total":4,"_id":"54f56a449867e4306974519b"},...] 
                */
                res.json(years);
            }
        });
    });
}