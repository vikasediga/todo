app.controller("yearCtrl", ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {

	$scope.refresh = function () {
		$http.get('/xpense/years').success(function (response){
			if (!$scope.currYear)
				$scope.currYear = response[0]["year"];
			$scope.years = response;
			$scope.updateMonths();

			$scope.highchartsNG.title.text = $scope.currYear;
			// get curr year stats
			$http.get('/xpense/year/' + $scope.currYear).success(function (response){

			});
		}).error(function (response, status) {
			if (status === 401) {
				window.location = '/login';
			}
		});
	}

	$scope.updateMonths = function () {
		var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		var currYear = new Date().getFullYear();

		if (currYear.toString() === $scope.currYear) {
			var currMonth = new Date().getMonth();
			$scope.currMonth = months[currMonth];
			$scope.months = months.splice(0, currMonth + 1);
		} else {
			$scope.months = months;
		}
	};

	// Method to add a new list
	$scope.addYear = function ($event) {
		var data;

		if (!arguments.length || $event.which === 13) {
			if ($scope.newYear && $scope.newYear.trim()) {
				data = { newYear: $scope.newYear };
				$http.post("/xpense/years", data).success(function (response) {
					$scope.newYear = "";
					$scope.refresh();
				});
			}
		}
	};

 	$scope.gotoYear = function () {
		window.location = '#/year/' + $scope.currYear + '/month/' + $scope.currMonth;	
 	};

	$scope.refresh();

    // $scope.swapChartType = function () {
    //     if (this.highchartsNG.options.chart.type === 'line') {
    //         this.highchartsNG.options.chart.type = 'bar'
    //     } else {
    //         this.highchartsNG.options.chart.type = 'line'
    //     }
    // }

    $scope.highchartsNG = {
        options: {
            chart: {
                type: 'line'
            }
        },
        series: [{
            data: [500, 150, 1200, 800, 700, 500, 150, 1200, 800, 700, 900, 988]
        }],
        title: {
            text: ''
        },
        xAxis: {
        	categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    	},
        loading: false
    }

}]);
