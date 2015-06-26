app.controller("monthCtrl", ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {

	$scope.refresh = function () {
		$scope.currYear = $routeParams.year;
		$scope.currMonth = $routeParams.month;
		$scope.chart.setTitle({text: $scope.currMonth +  ' ' + $scope.currYear});
		$scope.updateMonths();

		// get curr month stats
		$http.get('/xpense/year/' + $scope.currYear + '/month/' + $scope.currMonth).success(function (response){
				$scope.expenses = response;
				// update series data
				$scope.total = 0;
				$scope.expenses.forEach(function (expense) {
					expense.y = parseFloat(expense.amount);
					$scope.total += expense.y;
				});
				$scope.total = Math.round($scope.total * 100)/100;

				$scope.chart.series[0].update({data: $scope.expenses});
				$scope.chart.legend.allItems[0].update({name: $scope.currMonth});
		}).error(function (response, status) {
			if (status === 401) {
				window.location = '/login';
			}
		});
	}

	// Method to add a new expense
	$scope.addExpense = function () {
		var data;
		if ($scope.desc && $scope.desc.trim() && $scope.amount && $scope.amount.trim()) {
			expense = { desc: $scope.desc, amount: $scope.amount };
			$http.post("/xpense/year/" + $scope.currYear + '/month/' + $scope.currMonth, expense).success(function (response) {
				$scope.desc = "";
				$scope.amount = "";
				$scope.refresh();
			});
		}
	};

	$scope.removeExpense = function (id) {
		$http.delete("/xpense/year/" + $scope.currYear + '/month/' + $scope.currMonth + '/' + id).success(function (response) {
			$scope.refresh();
		});
	}

	$scope.updateMonths = function () {
		var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		var currYear = new Date().getFullYear();

		if (currYear.toString() === $scope.currYear) {
			var currMonth = new Date().getMonth();
			$scope.months = months.splice(0, currMonth + 1);
		} else {
			$scope.months = months;
		}
	};

	$scope.gotoMonth = function () {
		window.location = '#/year/' + $scope.currYear + '/month/' + $scope.currMonth;	
 	};

 	$scope.chart = new Highcharts.Chart({
        chart: {
            renderTo: 'monthChart',
            type: 'line'
        },
        series: [{}],
        title: {
    	    text: ''
    	},
        tooltip: {
            formatter: function() {
            	return this.point.desc + ': $' + this.point.y;
            }
        },
        loading: false
    });

    $scope.refresh();

}]);
