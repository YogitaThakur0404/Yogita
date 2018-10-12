var myapp = angular.module("myapp", ["ngRoute", "ngCookies"])
myapp.config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $routeProvider
        .when("/", {
            templateUrl: "login.html",
            controller: "inputCtrl"

        })

    .when("/user", {
            templateUrl: "user.html",
            controller: "userCtrl",
            authenticated: true
        })
        .when("/company", {
            templateUrl: "company.html",
            controller: "companyCtrl",
            authenticated: true
        })
        .otherwise("/", {
            redirectTo: "login.html"
        })
})

myapp.run(["$rootScope", "$location", "SessionService", function($rootScope, $location, SessionService) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        console.log("event=" + event);
        console.log("current=" + current);
        console.log("next=" + next);

        if (next.$$route.originalPath == '/') {
            console.log("in check");
            $location.path('/');

        }

    });
}]);