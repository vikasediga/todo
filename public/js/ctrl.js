var app = angular.module("multiTodo", ['ngRoute']);

// configure our routes
app.config(function($routeProvider) {
    $routeProvider
        // route for the home page
        .when('/', {
            templateUrl : 'html/home.html',
            controller  : 'homeCtrl'
        })

        // route for the about page
        .when('/about', {
            templateUrl : 'html/about.html'
        })

        // route for the contact page
        .when('/todoList/:name/:id', {
            templateUrl : 'html/todoList.html',
            controller  : 'todoCtrl'
        });
});

app.controller("homeCtrl", ['$scope', '$http', function ($scope, $http) {
	function refresh () {
		$http.get("/todo").success(function (response) {
			$scope.todoLists = response;
		});
	}

	refresh();

	$scope.addTodo = function ($event) {
		var data;
		if (!arguments.length || $event.which === 13) {
			if ($scope.thisTodo !== undefined) {
				data = { newTodo: $scope.thisTodo };
				$http.post("/todo", data).success(function (response) {
					refresh();
					$scope.thisTodo = "";
				});
			}
		}
	};

	$scope.removeTodo = function (id) {
		$http.delete("/todo/" + id).success(function (response) {
			refresh();
		});
	};


	// Return List progress bar class based on the tasks completion
	$scope.getClass = function (completion) {
	  	if (completion < 30) {
            return "progress-bar-danger";
        } else if (completion < 60) {
            return "progress-bar-warning";
        } else {
            return "progress-bar-success";
        }
	}
}])


app.controller("todoCtrl", ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
	var listId = $routeParams.id;
	$scope.listName = $routeParams.name;

	function refresh () {
		if (listId) {
			$http.get("/todoList/" + listId).success(function (response) {
				$scope.tasks = response;
			});
		}
	}

	refresh();

	$scope.addTask = function ($event) {
		var data;
		if (!arguments.length || $event.which === 13) {
			if ($scope.thisTask !== undefined) {
				data = { name: $scope.thisTask, done: false };
				$http.post("/todoList/" + listId , data).success(function (response) {
					refresh();
					$scope.thisTask = "";
				});
			}
		}
	};

	$scope.removeTask = function (id) {
		$http.delete("/todoList/" + listId + "/task/" + id).success(function (response) {
			refresh();
		});
	}

	$scope.toggleTask = function (task) {
		var data = {done: task.done}
		$http.put("/todoList/" + listId + "/task/" + task._id, data).success(function (response) {
			refresh();
		});
	}
}])
