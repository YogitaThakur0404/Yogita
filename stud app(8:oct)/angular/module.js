var myapp = angular.module("myapp", ["ngRoute"]);

myapp.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "login.html",
            //controller: "adminCtrl"
        })
        // .when("/admin", {
        //     templateUrl: "login.html",
        //     controller: "adminCtrl"
        // })
        .when("/student", {
            templateUrl: "student.html",
            controller: "studentCtrl"

        })

    // .when("/company", {
    //     templateUrl: "company.html",
    //     controller: "companyCtrl"
    //         ///Users/Yogita/Desktop/nodeproject/mydir/userapp1235/angular/company.html
    // })

    // .otherwise("/", {
    //     redirectTo: "index.html"
    // })

});