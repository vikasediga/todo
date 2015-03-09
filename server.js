var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var async = require('async');

// Database
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/multiTodo", {native_parser:true});

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    res.send("hello world");
});

function updateStatus(todos, cb) {
    var cbDummy = function (err) {};

    async.eachSeries(todos, function (todo, cbDummy) {
        var todoTable = todo._id.toString();
        db.collection(todoTable).find({done: true}).toArray(function (err, records) {
            todo['done'] = records.length;
            // progress bar info
            todo['progress'] = Math.floor((todo['done']/todo['total'])*100);
            cbDummy();
        });
    }, function (err) {
        if (err) { throw err; }
        cb(todos);
    });
}

app.get("/todo", function (req, res) {
	db.collection("todos").find().toArray(function (err, records) {
        if (err) {
            res.json(err);
        } else {
            updateStatus(records, function (response) {
                res.json(response);
            });
        }
    });
});

app.post('/todo', function (req, res) {
    console.log("Add new todo called: " + req.body.newTodo);
    var todoTable = {};
    todoTable['name'] = req.body.newTodo;
    todoTable['total'] = 0;
    todoTable['done'] = 0;

    db.collection("todos").insert(todoTable, function (err, records) {
        if (err) {
            res.json(err);
        } else {
            res.json(records);
        }
    });
});

// Drop todo list table.
// Also delete its reference from the todos table.
app.delete("/todo/:id", function (req, res) {
    db.collection(req.params.id).drop(function () {
        // Ignore the err as it might be because the table was never created but just a reference.
        db.collection('todos').removeById(req.params.id, function (err) {
            if (err) {
                res.json(err);
            } else {
                res.json({msg: 'Successfully removed todo list'});
            }
        });
    });
});

app.get("/todoList/:name", function (req, res) {
	db.collection(req.params.name).find().toArray(function (err, records) {
        if (err) {
            res.json(err);
        } else {
            res.json(records);
        }
    });
});

function updateCount(todoTableName, add, cb) {
    db.collection('todos').updateById(todoTableName, { $inc: {total: add}}, function (err) {
        if (err) {
            res.json(err);
        } else {
            cb();
        }
    });

}

app.post("/todoList/:name", function (req, res) {
	var todoTableName = req.params.name;
    db.collection(todoTableName).insert(req.body, function (err, records) {
        if (err) {
            res.json(err);
        } else {
            updateCount(todoTableName, 1, function() {
                res.json(records);
            });
        }
    });
});

app.delete("/todoList/:name/task/:id", function (req, res) {
    var todoTableName = req.params.name;
	db.collection(todoTableName).removeById(req.params.id, function (err) {
        if (err) {
            res.json(err);
        } else {
            updateCount(todoTableName, -1, function() {
                res.json({msg: 'Successfully removed task'});
            });
        }
    });
});

app.put("/todoList/:name/task/:id", function (req, res) {
	db.collection(req.params.name).updateById(req.params.id, {$set: req.body}, function (err) {
        if (err) {
            res.json(err);
        } else {
         	res.json({msg: 'Successfully updated contact'});
        }
    });
});

app.listen(3000);
console.log("server listening on port 3000");