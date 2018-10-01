myapp.controller("loginCtrl", ["$scope", "$http", function($scope, $http) {
    var _id;
    var refresh = function() {
        $http({ method: "GET", url: "/user" })
            .then(function(response) {
                    console.log("user login  ctrl found ");
                    console.log(response.data);
                    //  user1={
                    //      "uname":"abc","age":"40"
                    //  }
                    //  user2={
                    //     "uname":"abcd","age":"40"
                    // }

                    //  var userlist=[user1,user2];
                    //  $scope.userlist=userlist;

                    //                  // $scope.status=response.status;
                    $scope.userlist = response.data;
                    console.log($scope.userlist);
                },
                function(response) {
                    //$scope.userlist = response.userlist || 'Request failed';
                    //$scope.status = response.status;

                });
    }
    refresh();

    // $http({ method: "GET", url: "/user" })
    // .then(function(response) {
    //         console.log("user data  ctrl found ");
    //          console.log(response);


    //           $scope.status=response.status;

    //           $scope.userlist = response;
    //         console.log($scope.userlist);
    //     },
    //     function(response) {
    //         //$scope.userlist = response.userlist || 'Request failed';
    //         //$scope.status = response.status;

    //     });



    //posting data
    //submitData(firstName,lastName,email,address,city,password,status)"></td>

    $scope.firstName = null;
    $scope.lastName = null;
    $scope.email = null;
    $scope.address = null;
    $scope.city = null;
    $scope.password = null;
    $scope.status = "activated";

    $scope.submitData = function(firstName, lastName, email, address, city, password, status) {
        var inputValue = {
            "firstName": firstName,
            "lastName": lastName,
            "email": email,
            "userInfo": {
                "address": address,
                "city": city,
            },
            "password": password,
            "status": status,
        };

        $http.post("/user", inputValue)
            .then(function(response) {
                    if (response) {
                        $scope.msg = "data posted ...."
                        refresh();
                    }
                },
                function(response) {
                    $scope.msg = "error occur";
                })


    }





    //delete
    $scope.remove = function(id) {
        $http.delete("/user/" + id)
            .then(function(response) {
                    if (response) {
                        refresh();
                        console.log("data deleted ....");
                        //  $scope.alert("deleted id="+id);

                    }
                },
                function(response) {
                    $scope.msg = "error occur";
                })
    }

    //edit
    $scope.edit = function(id) {
            _id = id;
            $http.get("/user/" + id)
                .then(function(response) {
                        if (response) {
                            $scope.userlist = response;
                            console.log("data edit  ....");
                            //  $scope.alert("deleted id="+id);

                        }
                        //console.log("data=" + response);
                        $scope.firstName = response.data.firstName;
                        $scope.lastName = response.data.lastName;
                        $scope.email = response.data.email;
                        $scope.password = response.data.password;
                        $scope.address = response.data.userInfo.address;
                        $scope.city = response.data.userInfo.city;
                        //  $scope.update(id);
                        //console.log("add=" + $scope.address);
                        // console.log("city=" + $scope.userInfo.city);
                    },
                    function(response) {
                        $scope.msg = "error occur";
                    })
            $scope.update();
        }
        //update

    $scope.update = function(firstName, lastName, email, address, city, password) {
            console.log("id in login to update=" + _id);
            //console.log("name in ctrl to update=" + $scope.firstName);
            var inputValue = {
                "firstName": firstName,
                "lastName": lastName,
                "email": email,
                "userInfo": {
                    "address": address,
                    "city": city,
                },
                "password": password
            };
            console.log("data in put=" + inputValue.firstName);
            $http.put("/user/" + _id, inputValue)
                .then(function(response) {
                        if (response) {
                            console.log("resp" + response);
                            $scope.msg = "data posted ...."
                            refresh();
                        }
                    },
                    function(response) {
                        $scope.msg = "error occur";
                    })
        }
        //deactivate

    //update
    //deactivate(user._id)
    $scope.deactivate = function(id) {
        console.log("id in login to deactivate=" + id);
        //console.log("name in ctrl to update=" + $scope.firstName);

        $http.put("/user1/" + id)
            .then(function(response) {
                    if (response) {
                        // console.log("resp" + response);
                        $scope.msg = "data posted ...."
                        refresh();
                    }
                },
                function(response) {
                    $scope.msg = "error occur";
                })
    }



}])