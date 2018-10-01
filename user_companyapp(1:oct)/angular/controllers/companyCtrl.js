myapp.controller("companyCtrl", ["$scope", "$http", function($scope, $http) {
    var _id;
    var refresh = function() {
        $http({ method: "GET", url: "/company" })
            .then(function(response) {
                    console.log("cmp  ctrl found in cmpctrl.js ");
                    console.log(response.data);

                    $scope.cmplist = response.data;
                    console.log($scope.cmplist);
                },
                function(response) {
                    //$scope.userlist = response.userlist || 'Request failed';
                    //   $scope.status = response.status;

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

    $scope.companyName = null;
    $scope.RegistartionNo = null;
    $scope.status = "activated";

    $scope.submitData = function(companyName, RegistartionNo, status) {
        var inputValue = {
            "companyName": companyName,
            "companyInfo": {
                "RegistartionNo": RegistartionNo
            },

            "status": status,
        };

        $http.post("/company", inputValue)
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
        $http.delete("/company/" + id)
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
        $http.get("/company/" + id)
            .then(function(response) {
                    if (response) {
                        $scope.userlist = response;
                        console.log("data edit  ....");
                        //  $scope.alert("deleted id="+id);

                    }
                    //console.log("data=" + response);
                    $scope.companyName = response.data.companyName;
                    $scope.RegistartionNo = response.data.companyInfo.RegistartionNo;
                    // $scope.RegistartionNo = response.data.RegistartionNo;
                    //  $scope.update(id);
                    //console.log("add=" + $scope.address);
                    // console.log("regi=" + $scope.RegistartionNo);
                    console.log("regi 1===" + $scope.RegistartionNo);
                },
                function(response) {
                    $scope.msg = "error occur";
                })
        $scope.update();
    }

    //update

    $scope.update = function(companyName, RegistartionNo) {
        console.log("id in cmp to update=" + _id);
        //console.log("name in ctrl to update=" + $scope.firstName);
        var inputValue = {
            "companyName": companyName,
            "companyInfo": {
                "RegistartionNo": RegistartionNo
            }
        };

        //console.log("data in put=" + inputValue.firstName);
        $http.put("/company/" + _id, inputValue)
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

        $http.put("/company1/" + id)
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