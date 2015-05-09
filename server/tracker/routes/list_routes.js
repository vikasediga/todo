module.exports = function(app) {
    var db = app.tracker.db;

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
    app.get("/tracker/list/:name", function (req, res) {
        var tableName = req.params.name;
    	db.collection(tableName).find().toArray(function (err, tasks) {
            if (err) {
                res.json(err);
            } else {
                var resp = {};
                var completedTasks = tasks.filter(function (task) {
                    return task.done === true;
                });
                resp.tasks = tasks;
                // Add meta data
                resp.meta = {
                    '_id': tableName,
                    'total': tasks.length,
                    'done': completedTasks.length
                };
                resp.meta.progress = Math.floor((resp.meta.done/resp.meta.total)*100);
                res.json(resp);
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
    app.post("/tracker/list/:name", function (req, res) {
        var tableName = req.params.name;
        db.collection(tableName).insert(req.body, function (err, records) {
            if (err) {
                res.json(err);
            } else {
                updateCount(req, tableName, 1, function() {
                    res.json({msg: "Successfully added a new task"});
                });
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
    app.delete("/tracker/list/:name/task/:id", function (req, res) {
        var tableName = req.params.name;
    	db.collection(tableName).removeById(req.params.id, function (err) {
            if (err) {
                res.json(err);
            } else {
                updateCount(req, tableName, -1, function() {
                    res.json({msg: 'Successfully removed task'});
                });
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