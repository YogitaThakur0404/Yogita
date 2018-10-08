myapp.controller("loginCtrl", ["$scope", "$http", '$location', '$window', function($scope, $http, $location, $window) {

    //login
    $scope.submit = function(email, password) {
        console.log("loginCTRL for login  called");
        $scope.email = email;
        $scope.password = password;
        console.log($scope.email);
        console.log($scope.password);

        $http.post("/", $scope.email, $scope.password)
            .then(function(response) {
                    console.log("resp in login ctrl after input " + response.data);
                    if (response) {
                        var resp = response;
                        console.log("resp" + resp);
                        console.log(response.data[0]);
                        $location.path('/student');
                    } else {
                        $scope.alert("invalid credentials try again");
                        $location.path('#');
                    }
                },
                function(response) {

                    $scope.msg = "error occur";
                })
            //}
    }



}])