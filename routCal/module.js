
        var myApp = angular.module("myApp", ["ngRoute"]);
       

        myApp.config('$routeProvider',function($routeProvider) {
            $routeProvider
            .when("/", {
                templateUrl : "main.html"
            })
            .when("/calculator", {
                templateUrl : "calculator.html",
                controller:"calCtrl"
            })
            
            .when('/calculator/:number1/:number2', {
                templateUrl: 'calculator.html',
                controller: 'calCtrl'
            })
            .when('/calculator/:number1', {
                templateUrl: 'calculator.html',
                controller: 'calCtrl'
            })
            .when('/profile', {
                templateUrl: 'profile.html',
                controller: 'profileCtrl'
            })
        });
        