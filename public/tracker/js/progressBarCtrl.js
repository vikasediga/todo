app.controller("progressBarCtrl", ['$scope', '$timeout', function($scope, $timeout) {
  	$timeout(function(){
  		if ($scope.list) {
    		$scope.progressValue = $scope.list.progress;
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
