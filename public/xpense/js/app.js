var app = angular.module("xpense", ['ui.bootstrap', 'ngRoute', 'highcharts-ng']);

// configure our routes
app.config(function($routeProvider) {
    $routeProvider
        // route for the home page
        .when('/', {
            templateUrl : 'html/year.html'
        })

        // route for the about page
        .when('/about', {
            templateUrl : 'html/about.html'
        })

        // route for the contact page
        .when('/year/:year/month/:month', {
            templateUrl : 'html/month.html'
        });
});