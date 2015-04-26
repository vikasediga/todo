app.controller("listCtrl", ['$scope', '$http', '$routeParams', '$timeout',
	function ($scope, $http, $routeParams, $timeout) {
		var listId = $routeParams.id;
		var totalTasks;
		var allTasks;
		var totalPages;
		$scope.listName = $routeParams.name;
		$scope.updatedTasks = {};
		$scope.order = '';

		function markTasksEditFlag(show) {
			$scope.tasks.forEach(function (task) {
				$scope['edit_' + task._id] = show;
				$scope.updatedTasks[task._id] = task.name;
			});
		}

		function refresh () {
			var cb = arguments.length ? arguments[0] : false;
			document.querySelector('#main').style.opacity = '0.3';
			if (listId) {
				$http.get("/tracker/list/" + listId).success(function (response) {
					// pagination
					allTasks = response['tasks'];
					totalTasks = response['meta']['total'];
					totalPages = Math.ceil(totalTasks/10);
					if (totalTasks > 10) {
						$scope.paginate = true;
						$scope.tasks = response['tasks'].slice(0,10);
						$scope.currPage = 1;
					} else {
						$scope.paginate = false;
						$scope.tasks = response['tasks'];
					}

					$scope.progressValue = response['meta']['progress'];
					
					$scope.doneTasks = response['meta']['done'];
					$scope.undoneTasks = totalTasks - response['meta']['done'];
					if (cb) {
						cb();
					}
					document.querySelector('#main').style.opacity = '1';
				});
			}
		}

		if ($scope.listName) {
			$scope.home = false;
			refresh();
		} else {
			$scope.home = true;
		}

		function refreshCallBack(pageNo) {
			var _pageNo = (pageNo === undefined) ? $scope.currPage : pageNo;
			return function () {
				// after new task is added; go to the relevant page
				$scope.updateTablePage(_pageNo);
				markTasksEditFlag(false);
			};
		}

		$scope.addTask = function ($event) {
			var data;
			if (!arguments.length || $event.which === 13) {
				if ($scope.thisTask !== undefined) {
					data = { name: $scope.thisTask, done: false, starred: false};
					$http.post("/tracker/list/" + listId , data).success(function (response) {
						refresh(refreshCallBack(totalPages));
						$scope.thisTask = "";
					});
				}
			}
		};

		$scope.removeTask = function (id) {
			$http.delete("/tracker/list/" + listId + "/task/" + id).success(function (response) {
				refresh(refreshCallBack());
			});
		}

		$scope.toggleTask = function (task) {
			var data = {done: task.done};
			$http.put("/tracker/list/" + listId + "/task/" + task._id, data).success(function (response) {
				refresh(refreshCallBack());
			});
		}

		$scope.updateTask = function (id) {
			var data = { name: $scope.updatedTasks[id] };
			$http.put("/tracker/list/" + listId + "/task/" + id, data).success(function (response) {
				refresh(refreshCallBack());
			});
		}

		$scope.editPaneForTask = function (task, show) {
			markTasksEditFlag(false);
			$scope['edit_' + task._id] = show;
		};

		$scope.showEditPane = function (id) {
			return $scope['edit_' + id];
		};

		// TODO: below two methods are redundant in listsCtrl.js, find better way to share code
		$scope.taskHoverIn = function (e) {
			e.currentTarget.querySelector('.icons-container').classList.remove('invisible');
		};

		$scope.taskHoverOut = function (e) {
			e.currentTarget.querySelector('.icons-container').classList.add('invisible');
		};

		$scope.setStar = function (e, task) {
			var srcNode = e.currentTarget;
			var starred = srcNode.classList.contains('task-starred');
			var data = {starred: !starred};

			$http.put("/tracker/list/" + listId + "/task/" + task._id, data).success(function (response) {
				refresh(refreshCallBack());
				if (starred) {
					srcNode.setAttribute('title', 'Not starred');
				} else {
					srcNode.setAttribute('title', 'Starred');
				}
			});
		};

		$scope.setOrder = function (o) {
			if (o) {
				$scope.order = 'done';
			} else {
				$scope.order = '-done';
			}
		};

		$scope.updateTablePage = function (pageNo) {
			if (pageNo >= 1 && pageNo <= totalPages) {
				$scope.currPage = pageNo;
				$scope.tasks = allTasks.slice((pageNo-1)*10, (pageNo-1)*10 + 10);
			}
		}
	}
]);
