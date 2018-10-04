myapp.controller("loginCtrl", ["$scope", "$http", '$location', '$window', function($scope, $http, $location, $window) {
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

                    //  // $scope.status=response.status;
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
    //var status = "activated";

    $scope.submitData = function(firstName, lastName, email, address, city, password) {
        var inputValue = {
            "firstName": firstName,
            "lastName": lastName,
            "email": email,
            "userInfo": {
                "address": address,
                "city": city,
            },
            "password": password,
            "status": "activated",
        };

        console.log("input to post=" + inputValue.data);
        $http.post("/user", inputValue)
            .then(function(response) {
                    if (response) {
                        editflag = 0;
                        $scope.msg = "data posted ...."
                        $window.alert("user data inserted");
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
    var editflag = 0;
    console.log("out edit flag=" + editflag);
    //edit
    $scope.edit = function(id) {
        _id = id;
        $http.get("/user/" + id)
            .then(function(response) {
                    if (response) {
                        $scope.editflag = 1;
                        console.log("in edit flag=" + editflag);
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
                    $scope.editflag = 1;
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
                        refresh();
                        console.log("resp" + response);
                        $scope.msg = "data posted ...."


                    }
                },
                function(response) {
                    $scope.msg = "error occur";
                })
    }

    //deactivate
    //update
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

                        $location.path('/user');
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