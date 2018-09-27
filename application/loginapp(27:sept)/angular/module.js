var myapp = angular.module("myapp", ["ngRoute"]);

myapp.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "index.html",
            controller: "userCtrl"
        })

    .when("/user", {
        templateUrl: "users.html",
        controller: "userCtrl"

    })

    // .when("/company", {
    //     templateUrl: "company.html",
    //     controller: "companyCtrl"

    // })

    .otherwise("/", {
        redirectTo: "index.html"
    })

});