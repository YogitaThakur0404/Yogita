var app = angular.module('usersApp', ['ngRoute', 'ui.bootstrap'])
app.config(function($routeProvider) {
    $routeProvider

        .when('/', {
            templateUrl: 'index.html',
            // controller: 'controllers/loginCtrl'
        })
        .when('/user', {
            templateUrl: 'angular/users.html',
            ///Users/Yogita/Desktop/nodeproject/mydir/login123/angular/users.html
            controller: 'angular/controllers/userCtrl'
                ///Users/Yogita/Desktop/nodeproject/mydir/login123/angular/controllers/userCtrl.js
        })
        .when('/company', {
            templateUrl: 'angular/company.html',
            controller: 'angular/controllers/companyCtrl'
        })
        .otherwise({
            template: "<h1>None</h1><p>Content Not Found</p>"
        });

});