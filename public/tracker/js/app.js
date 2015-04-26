var app = angular.module("taskTracker", ['ui.bootstrap', 'ngRoute']);

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
        .when('/lists', {
            templateUrl : 'html/lists.html'
        })

        // route for the contact page
        .when('/list/:name/:id', {
            templateUrl : 'html/list.html'
        });
});