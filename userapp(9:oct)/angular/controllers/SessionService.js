//service
myapp.factory('SessionService', ["$cookies", "$http", function($http, $cookies) {
    var SessionService = {};


    SessionService.login = function(email, password) {
        console.log(email);
        var data = {
            email: email,
            password: password
        }
        console.log("inside sessionservice")
        return $http.post("/", data).then(function(response) {
                $cookies.put(response);
            }

        )

        /*
        ($http.post("/", email, password)
                .then(function(response) {

                })*/

        // $http({
        //        url: baseUrl + 'auth',
        //     method: "POST",
        //     data: {
        //         email: data.email,
        //         password: data.password
        //     }
        // }).success(function(response) {
        //     //$cookies.put('auth', response);
        //     $cookies.put(response);

        // }).error(function(data, status) {
        //     alert(data);

        // })
        // console.log("url=" + url);
    };
    SessionService.getAuthStatus = function() {
        var status = true;
        if (status) {
            return true;
        } else {
            return false;
        }
    }


    return SessionService;
    // var userIsAuthenticated = false;

    // this.setUserAuthenticated = function(value) {
    //     userIsAuthenticated = value;
    // };

    // this.getUserAuthenticated = function() {
    //     return userIsAuthenticated;
    // };

}])