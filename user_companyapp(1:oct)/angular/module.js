var myapp = angular.module("myapp", ["ngRoute"]);

myapp.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "login.html",
            // controller: "inputCtrl"
        })

    .when("/user", {
        templateUrl: "user.html",
        controller: "loginCtrl"

    })

    .when("/company", {
        templateUrl: "company.html",
        controller: "companyCtrl"
            ///Users/Yogita/Desktop/nodeproject/mydir/userapp1235/angular/company.html
    })

    // .otherwise("/", {
    //     redirectTo: "index.html"
    // })

});