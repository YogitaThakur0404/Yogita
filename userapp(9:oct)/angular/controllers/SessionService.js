//service
myapp.factory('SessionService', ["$cookies", "$http", '$location', function($http, $cookies, $location) {
    var SessionService = {};
    SessionService.login = function() {
        console.log("inside sessionservice")
    };

    return SessionService;

}])