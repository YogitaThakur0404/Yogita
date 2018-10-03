app.controller("userCtrl", ["$scope", "$http", function($scope, $http) {
    //get dta
    $http({ method: "GET", url: "/user" })
        .then(function(response) {
                console.log("user ctrl found ");
                console.log(response);
                // $scope.status=response.status;
                $scope.userlist = response;
                console.log($scope.userlist);
            },
            function(response) {
                $scope.userlist = response.userlist || 'Request failed';
                //$scope.status = response.status;
            });


    // //posting data
    // //submitData(firstName,lastName,email,address,city,password,status)"></td>

    // $scope.firstName = null;
    // $scope.lastName = null;
    // $scope.email = null;
    // $scope.address = null;
    // $scope.city = null;
    // $scope.password = null;
    // $scope.status = null;

    // $scope.submitData = function(firstName, lastName, email, address, city, password, status) {
    //     var inputValue = {
    //         "firstName": firstName,
    //         "lastName": lastName,
    //         "email": email,
    //         "userInfo": {
    //             "address": address,
    //             "city": city,
    //         },
    //         "password": password,
    //         "status": status,
    //     };

    //     $http.post("/user", inputValue)
    //         .then(function(response) {
    //                 if (response) {
    //                     $scope.msg = "data posted ...."
    //                 }
    //             },
    //             function(response) {
    //                 $scope.msg = "error occur";
    //             })


    // }
}])
