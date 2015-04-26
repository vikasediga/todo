var app = angular.module("login", []);

app.controller("loginCtrl", ['$scope', '$http', function ($scope, $http) {
	$scope.sendLoginReq = function () {
		$http.post("/login").success(function (response){
			window.location = response.redirect;
			$scope.username = '';
			$scope.pwd = '';
		});
	};
}]);