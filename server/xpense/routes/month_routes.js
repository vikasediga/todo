module.exports = function(app) {
    var db = app.xpense.db;

    /* 
        This GET request handler receives the name of the list (mongo unique id) 
        and returns meta info of the list and tasks belonging to it as shown below.

        Example: 
        GET http://localhost:3000/tracker/list/54f56a449867e4306974519b
        response: 
        {   "meta":{"total":4,"_id":"54f56a449867e4306974519b","done":2,"progress":50},
            "tasks":[{"name":"Buy Apple","done":false,"_id":"54f56a4c9867e4306974519c"},
                     {"name":"Eat Mango","done":true,"_id":"54f56a539867e4306974519d"},
                     {"name":"Throw banana","done":false,"_id":"54f56a589867e4306974519e"},
                     {"name":"Sell pineapple","done":true,"_id":"54f56a5d9867e4306974519f"}]
        }
    */
    app.get("/xpense/year/:year/month/:month", function (req, res) {
        var year = req.params.year;
        var month = req.params.month;
        db.collection(req.session.user.username + "_" + year + "_" + month).find().toArray(function (err, records) {
            if (err) {
                res.json(err);
            } else {
                /*  lists looks like below:
                    [{"name":"grocery list","total":2,"_id":"54f534ff1945b33667f4be23"},
                    {"name":"Fruit list","total":4,"_id":"54f56a449867e4306974519b"},...] 
                */
                res.json(records);
            }
        });
    });


    /* 
        This POST request handler receives the name of the list (mongo unique id)
        and the new task to be added to that list and adds it to the specified list.

        Example: 
        POST http://localhost:3000/tracker/list/54f534ff1945b33667f4be23
        request body: {"name":"new task","done":false}
        response:     {msg: "Successfully added a new task"}
    */
    app.post("/xpense/year/:year/month/:month", function (req, res) {
        var year = req.params.year;
        var month = req.params.month;
        db.collection(req.session.user.username + "_" + year + "_" + month).insert(req.body, function (err, records) {
            if (err) {
                res.json(err);
            } else {
                res.json({msg: "Successfully added a expense"});
            }
        });
    });


    /* 
        This DELETE request handler receives the name of the list (mongo unique id)
        and the id task of the task to be deleted and deletes it from the specified list.

        Example:
        DELETE http://localhost:3000/tracker/list/54f534ff1945b33667f4be23/task/552f2f9724fb2eaa01045a1b
        response: {"msg":"Successfully removed task"}
    */
    app.delete("/xpense/year/:year/month/:month/:id", function (req, res) {
        var year = req.params.year;
        var month = req.params.month;
    	db.collection(req.session.user.username + "_" + year + "_" + month).removeById(req.params.id, function (err) {
            if (err) {
                res.json(err);
            } else {
                res.json({msg: 'Successfully removed task'});
            }
        });
    });


    /*
        This PUT request handler receives the name of the list (mongo unique id)
        and the id of the task to be updated and updates it.

        Example:
        PUT http://localhost:3000/tracker/list/54f534ff1945b33667f4be23/task/552f27f15a942a3f01f4e171
        request body: {"name":"updated new task"}
        response: {"msg":"Successfully updated task"}
    */
    app.put("/tracker/list/:name/task/:id", function (req, res) {
        var tableName = req.params.name;
    	db.collection(tableName).updateById(req.params.id, {$set: req.body}, function (err) {
            err ? res.json(err) : res.json({msg: 'Successfully updated task'});
        });
    });

    /*
        Helper function to update the 'total' tasks field in the lists table which
        holds the list of all lists created.
    */
    function updateCount(req, listName, add, cb) {
        db.collection(req.session.user.username + '_lists').updateById(listName, { $inc: {total: add}}, function (err) {
            err ? res.json(err) : cb();
        });

    }
}