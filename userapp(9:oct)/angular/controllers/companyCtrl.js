myapp.controller("companyCtrl", ["$scope", "$http", '$location', '$window', function($scope, $http, $location, $window) {
    var _id;
    var refresh = function() {
        $http({ method: "GET", url: "/company" })
            .then(function(response) {
                    console.log("cmp  ctrl found in cmpctrl.js ");
                    console.log(response.data);
                    if (response.data == 'nouser') {
                        $location.path("/");
                        $window.alert("You need to Login first..")
                    }
                    $scope.cmplist = response.data;
                    console.log($scope.cmplist);
                },
                function(response) {
                    $scope.status = response.status;

                });
    }
    refresh();


    var putdata = 0;
    //posting data
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
        console.log("putdata=" + putdata);
        $http.post("/company", inputValue)
            .then(function(response) {
                    if (response) {
                        putdata = 1;
                        $scope.msg = "data posted ...."
                        refresh();
                        //$window.alert("data inserted");
                    } else {
                        putdata = 0;
                        // $window.alert("data not inserted");
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
                        $window.alert("data deleted ....");
                        console.log("data deleted ....");

                    } else {

                    }
                },
                function(response) {
                    $scope.msg = "error occur";
                })
    }

    var editflag = 0;
    //edit
    $scope.edit = function(id) {
        _id = id;
        checkedit = 0;
        $http.get("/company/" + id)
            .then(function(response) {
                    if (response) {
                        refresh();
                        $scope.userlist = response;
                        console.log("data edit  ....");
                        //  $window.alert("data edited ....");
                        $scope.editflag = 1;
                        //  $scope.alert("deleted id="+id);
                    } else {
                        $scope.status = response.status;
                        //   $window.alert("Id not found ...." + $scope.status);
                    }
                    //console.log("data=" + response);
                    $scope.companyName = response.data.companyName;
                    $scope.RegistartionNo = response.data.companyInfo.RegistartionNo;
                    $scope.editflag = 1;

                    // $scope.RegistartionNo = response.data.RegistartionNo;
                    //  $scope.update(id);
                    //console.log("add=" + $scope.address);
                    // console.log("regi=" + $scope.RegistartionNo);
                    console.log("regi 1===" + $scope.RegistartionNo);
                },
                function(response) {
                    $scope.msg = "error occur";
                })
            // $scope.update();
    }

    //update
    $scope.update = function(companyName, RegistartionNo) {
        console.log("id in cmp to update=" + _id);
        // console.log("checkedit=" + checkedit);
        if (_id == null) {
            $window.alert("company data not exist ti update");
        } else {
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
                            $scope.companyName = "";
                            $scope.msg = "data posted ...."
                            refresh();
                        }
                    },
                    function(response) {
                        $scope.msg = "error occur";
                    })
        }
    }

    //deactivate
    //update
    $scope.status = null;
    $scope.deactivate = function(id, status) {
        console.log("id in login to deactivate=" + id);
        console.log("status flag in deactivate=" + status);
        //console.log("name in ctrl to update=" + $scope.firstName);
        if (status == "statusflag") {
            //console.log("status flag in deactivate=" + statusflag);
            var inputValue = {

                "status": "deactivated"
            };
            $http.put("/company1/" + id, inputValue)
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
        if (status == "statusflag1") {
            /// console.log("statusflag1 in if cond=" + statusflag1);
            var inputValue = {
                "status": "activated"
            };
            $http.put("/company1/" + id, inputValue)
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

    }


    //logout
    $scope.logout = function() {
        console.log("cmp logout fun called  ");
        $http({ method: "GET", url: "/logout" })
            .then(function(response) {
                    console.log("cmp logout ");
                    console.log(response);
                    $location.path('/');
                },
                function(response) {
                    //$scope.userlist = response.userlist || 'Request failed';
                    $scope.status = response.status;

                });
    }
}])