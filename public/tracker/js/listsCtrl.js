app.controller("listsCtrl", ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
	$scope.listId = $routeParams.id;
    $scope.home = $scope.listId ? false : true;

    // refresh lists on page load
	refresh();

	// Method to reload the lists from server
	function refresh () {
		$http.get("/tracker/lists").success(function (response) {
			$scope.lists = response;
		}).error(function(response, status) {
			if (status === 401) {
				window.location = '/login';
			}
		});
	}

	// Method to add a new list
	$scope.addList = function ($event) {
		var data;

		if (!arguments.length || $event.which === 13) {
			if ($scope.newList && $scope.newList.trim()) {
				data = { newList: $scope.newList };
				$http.post("/tracker/lists", data).success(function (response) {
					refresh();
					$scope.newList = "";
				});
			}
		}
	};

	// Method to remove an existing list
	$scope.removeList = function (id) {
		$http.delete("/tracker/lists/" + id).success(function (response) {
			refresh();
		});
	};

	// TODO: below two methods are redundant in listCtrl.js, find better way to share code
	$scope.taskHoverIn = function (e) {
		e.currentTarget.querySelector('.icons-container').classList.remove('invisible');
	};

	$scope.taskHoverOut = function (e) {
		e.currentTarget.querySelector('.icons-container').classList.add('invisible');
	};

}]);
