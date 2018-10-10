var myapp = angular.module("myapp", ["ngRoute", "ngCookies"]);

//window.routes =


myapp.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "login.html",
            controller: "loginCtrl",
            access: {
                isFree: false
            }


        })

    .when("/user", {
        templateUrl: "user.html",
        controller: "loginCtrl",
        access: {
            isFree: true
        }

    })

    .when("/company", {
        templateUrl: "company.html",
        controller: "companyCtrl",
        access: {
            isFree: true
        }
    })

    .otherwise("/", {
        redirectTo: "login.html"
    })
}])

myapp.run(['$rootScope', "$location", "SessionService", function($rootScope, $location, SessionService) {
    console.log("service called");
    $rootScope.$on('$locationChangeStart', function(event, next, current) {

        //var isFreeAccess = next.$$route.access.isFree;
        var isFreeAccess = true;
        //var originalPath = "/";
        // console.log("isFreeAccess" + isFreeAccess);
        if (isFreeAccess) {
            if (!SessionService.getAuthStatus()) {
                $location.path('/');
            }

        }
        if ($location.path() == "/") {
            //if (next.$$route.originalPath == "/") {
            if (!SessionService.getAuthStatus()) {
                if (SessionService.getAuthStatus()) {
                    $location.path(current.$$route.originalPath);
                }
            }

        }

    })

}])

//}])