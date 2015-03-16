var app = angular.module("multiTodo", ['ui.bootstrap', 'ngRoute']);

// configure our routes
app.config(function($routeProvider) {
    $routeProvider
        // route for the home page
        .when('/', {
            templateUrl : 'html/home.html'
        })

        // route for the about page
        .when('/about', {
            templateUrl : 'html/about.html'
        })

        // route for the contact page
        .when('/todoList/:name/:id', {
            templateUrl : 'html/todoList.html'
        });
});

app.controller("todosCtrl", ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
	$scope.listId = $routeParams.id;
    $scope.init = ($scope.listId == 0) ? true : false;

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
}])


app.controller("todoCtrl", ['$scope', '$rootScope', '$http', '$routeParams', '$timeout',
	function ($scope, $rootScope, $http, $routeParams, $timeout) {
		var listId = $routeParams.id;
		$scope.listName = $routeParams.name;

		function refresh () {
			if (listId) {
				$http.get("/todoList/" + listId).success(function (response) {
					$scope.tasks = response['tasks'];
					$scope.progressValue = response['meta']['progress'];
				});
			}
		}

		if ($scope.listName === 'init') {
			$scope.init = true;
		} else {
			$scope.init = false;
			refresh();
		}

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
	}
])

app.controller("progressBar", ['$scope', '$timeout', function($scope, $timeout) {
  	$timeout(function(){
  		if ($scope.todo) {
    		$scope.progressValue = $scope.todo.progress;
    	}
  	}, 100);

	// Return progress bar type based on the tasks completion
	$scope.getType = function (completion) {
	  	if (completion < 30) {
            return "danger";
        } else if (completion < 60) {
            return "warning";
        } else {
            return "success";
        }
	}
}]);
