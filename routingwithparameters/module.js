var myapp=angular.module("myApp",["ngRoute"]);

myapp.config(function($routeProvider){
    $routeProvider
    
    .when('/profile', {
        templateUrl: 'profile.html',
        controller: 'profileCtrl'
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

    .when('/post', {
        templateUrl: 'postdata.html',
        controller: 'postCtrl'
    })
    
    .when('/post/submit', {
        templateUrl: 'postdatafile.html',
        controller: 'postDataCtrl'
    })
    
})


