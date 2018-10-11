//service
myapp.factory('SessionService', ["$cookies", "$http", '$location', function($http, $cookies, $location) {
    var SessionService = {};
    SessionService.login = function() {
        console.log("inside sessionservice")
    };

    // SessionService.getAuthStatus = function() {
    //     var status = $cookies.get('cks');
    //     if (status) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }
    // SessionService.dologout = function() {
    //     $cookies.remove('cks');
    // }

    return SessionService;

}])

/*


// /*



app.factory('userModel', ['$cookies', function($cookies) {
    var userModel = {};
    userModel.stack = function() {
        console.log("hello world");
    }

    userModel.getAuthStatus = function() {
        var status = $cookies.get('abc');
        if (status) {
            return true;
        } else {
            return false;
        }
    }
    userModel.dologout = function() {
        $cookies.remove('abc');
    }

    return userModel;
}]);

// //service
// myapp.factory('SessionService', ["$cookies", "$http", '$location', function($http, $cookies, $location) {
//     var SessionService = {};
//     SessionService.login = function(data) {
//         // console.log(email);
//         console.log("inside sessionservice")
//             /*
//             app.factory('userModel', ['$cookies', function($cookies) {
//                 var userModel = {};
//                 userModel.stack = function() {
//                     console.log("hello world");
//                 }

//                 userModel.getAuthStatus = function() {
//                     var status = $cookies.get('abc');
//                     if (status) {
//                         return true;
//                     } else {
//                         return false;
//                     }
//                 }
//                 userModel.dologout = function() {
//                     $cookies.remove('abc');
//                 }

//                 return userModel;
//             }]);

//             */


//         // $http.post("/", data).then(function(response) {
//         //         //  $http.post("/", data).then(function(response) {
//         //         console.log("data in fact" + response);
//         //         if (response.data != null) {
//         //             $cookies.put('/', response);
//         //         } else {
//         //             $location.path('/');
//         //         }
//         //     }

//         // )

//         /*
//          return $http.post('/login', loginData).then(function(response) {
//                     console.log(response);
//                     if (response.data == 'user') {
//                         $cookies.put('auth', response);
//                         $location.path(response.data);
//                     } else {
//                         alert("email and password not match")
//                         $location.path('/');
//                     }
//                 });
//                 */

//             };
//             SessionService.getAuthStatus = function() {
//                 var status = $cookies.get('cks');
//                 if (status) {
//                     return true;
//                 } else {
//                     return false;
//                 }
//             }
//             SessionService.dologout = function() {
//                 $cookies.remove('cks');
//             }

//             return SessionService;

//         }])

//         /*
//         app.factory('myFactory', ['$http', '$cookies', '$location', function($http, $cookies, $location) {
//             var userModel = {};
//             userModel.doLogin = function(loginData) {
//                 console.log(loginData);
//                 return $http.post('/login', loginData).then(function(response) {
//                     console.log(response);
//                     if (response.data == 'user') {
//                         $cookies.put('auth', response);
//                         $location.path(response.data);
//                     } else {
//                         alert("email and password not match")
//                         $location.path('/');
//                     }
//                 });
//             };

//             userModel.getAuthStatus = function() {
//                 var status = $cookies.get('auth');
//                 if (status) {
//                     return true;
//                 } else {
//                     return false;
//                 }
//             }
//             return userModel;
//         }]);
//         */
// */