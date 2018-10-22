var myapp = angular.module("myapp", ["ngRoute"]);

myapp.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "login.html",
            controller: "loginCtrl"
        })

    .when("/user", {
            templateUrl: "user.html",
            controller: "loginCtrl"

        })
        .otherwise("/", {
            redirectTo: "index.html"
        })

});