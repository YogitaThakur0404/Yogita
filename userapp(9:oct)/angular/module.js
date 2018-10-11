var myapp = angular.module("myapp", ["ngRoute", "ngCookies"])
myapp.config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $routeProvider
        .when("/", {
            templateUrl: "login.html",
            controller: "loginCtrl"

        })

    .when("/user", {
            templateUrl: "user.html",
            controller: "loginCtrl",
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

// myapp.run(['$rootScope', "$location", "SessionService",
//     function($rootScope, $location, SessionService) {
//         console.log("service called");

//         // $rootScope.$on('$locationChangeStart', function(event, next, current) {
//         $rootScope.$on("$routeChangeStart",
//             function(event, next, current) {
//                 if (next.$$route.authenticated) {
//                     console.log("in auth of fact");
//                     if (!SessionService.getAuthStatus()) {
//                         $location.path('/');
//                     }
//                 }

//                 if (next.$$route.originalPath == '/') {
//                     if (SessionService.getAuthStatus()) {
//                         $location.path(current.$$route.originalPath);
//                     }
//                 }
//             })

//     }
// ])




myapp.run(["$rootScope", "$location", "SessionService", function($rootScope, $location, SessionService) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        console.log("event=" + event);
        console.log("current=" + current);
        console.log("next=" + next);
        //if route is authenticated
        if (next.$$route.originalPath == '/') {
            console.log("in check");
            $location.path('/');
            //svar userAuth = userModel.getAccessTocken();
            // if (!SessionService.getAuthStatus()) {
            //     $location.path('/');
            // }
        }
        // if (next.$$route.originalPath) {
        //     console.log('login page');
        //     if (SessionService.getAuthStatus()) {
        //         $location.path(current.$$route.originalPath);
        //         // $location.path("/");
        //     }
        // }

    });
}]);



// //var isFreeAccess = next.$$route.access.isFree;
// var isFreeAccess = true;
// //var originalPath = "/";
// // console.log("isFreeAccess" + isFreeAccess);
// if (isFreeAccess) {
//     if (!SessionService.getAuthStatus()) {
//         $location.path('/');
//     }

// }
//     if ($location.path() == "/") {
//         //if (next.$$route.originalPath == "/") {
//         if (!SessionService.getAuthStatus()) {
//             if (SessionService.getAuthStatus()) {
//                 $location.path(current.$$route.originalPath);
//             }
//         }

//     }

//  })

//}])

/*
var app = angular.module('myApp', ['ngRoute', 'ui.bootstrap', 'ngCookies'])
app.config(function($routeProvider) {
    $routeProvider.when('/', {
            templateUrl: 'login.html',
            controller: 'loginCtrl'
        })
        .when('/user', {
            templateUrl: 'user.html',
            controller: 'userCtrl',
            authenticated: true
        })
        .when('/companies', {
            templateUrl: 'company.html',
            controller: 'companyCtrl',
            authenticated: true
        })
        .when('/error', {
            templateUrl: 'error.html'
        })
        .otherwise({
            template: "<h1>None</h1><p>Content Not Found</p>"
        });
});


app.run(["$rootScope", "$location", "myFactory",
    function($rootScope, $location, myFactory) {
        $rootScope.$on("$routeChangeStart",
            function(event, next, current) {
                if (next.$$route.authenticated) {
                    if (!myFactory.getAuthStatus()) {
                        $location.path('/');
                    }
                }
                if (next.$$route.originalPath == '/') {
                    if (myFactory.getAuthStatus()) {
                        $location.path(current.$$route.originalPath);
                    }
                }
            })
    }
])
*/