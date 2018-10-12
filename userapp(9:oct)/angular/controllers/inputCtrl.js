myapp.controller("inputCtrl", ["$scope", "$http", '$location', '$window', 'SessionService', function($scope, $http, $location, $window, SessionService) {
    console.log("inputCTRL for login  called");
    $scope.submit = function(email, password) {
        console.log("inside submit");
        console.log($scope.email);
        console.log($scope.password);
        var data = {
            "email": email,
            "password": password
        }

        $http.post("/login", data)
            .then(function(response) {
                    console.log("resp in input ctrl after input " + response.data);
                    if (response.data == 'data') {

                        console.log(response.data);
                        $location.path("/user");

                    } else {
                        $scope.alert("invalid credentials try again");
                        $location.path('/');
                    }
                },
                function(response) {

                    $scope.msg = "error occur";
                })


    }

}])