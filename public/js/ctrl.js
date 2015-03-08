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
        .when('/todoList/', {
            templateUrl : 'html/todoList.html',
            controller  : 'todoCtrl'
        });
});

app.factory('Data', function () {
  return {};
});

app.controller("homeCtrl", ['$scope', '$http', 'Data', function ($scope, $http, Data) {
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

	$scope.gotoTodo = function (currentTodo) {
		Data.currTodo = currentTodo;
	};

}])


app.controller("todoCtrl", ['$scope', '$http', 'Data', function ($scope, $http, Data) {
	var currTodo = Data.currTodo;
	$scope.currList = currTodo.name;

	function refresh () {
		if (currTodo) {
			$http.get("/todoList/" + currTodo._id).success(function (response) {
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
				$http.post("/todoList/" + currTodo._id , data).success(function (response) {
					refresh();
					$scope.thisTask = "";
				});
			}
		}
	};

	$scope.removeTask = function (id) {
		$http.delete("/todoList/" + currTodo._id + "/task/" + id).success(function (response) {
			refresh();
		});
	}

	$scope.toggleTask = function (task) {
		var data = {done: task.done}
		$http.put("/todoList/" + currTodo._id + "/task/" + task._id, data).success(function (response) {
			refresh();
		});
	}
}])
