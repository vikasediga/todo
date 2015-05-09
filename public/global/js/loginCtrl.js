var app = angular.module("login", []).config(function($locationProvider) {
	$locationProvider.html5Mode(true);
});

app.controller("loginCtrl", ['$scope', '$http', '$location', function ($scope, $http, $location) {
	$scope.self = ($location.search().user !== 'guest') ? true : false;
	
	$scope.sendLoginReq = function () {
		var data;
		if ($scope.self) {
			data = { username: $scope.username,
					 pwd: $scope.pwd
					};
		} else {
			data = { username: 'guest', 
					 pwd: 'p@ssword', 
					 guest: $scope.guestname,
					 next: $location.search().next
					};	
		}
		$http.post("/login", data).success(function (response){
			window.location = response.redirect;
			$scope.username = '';
			$scope.pwd = '';
		});
	};

	$scope.getGuestLogin = function () {
		$scope.self = false;
	}
}]);