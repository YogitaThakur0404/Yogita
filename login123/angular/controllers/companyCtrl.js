app.controller("companyCtrl", ["$scope", "$http", function($scope, $http) {

    $http({ method: "GET", url: "/company" })
        .then(function(response) {
                console.log("cmp ctrl found ");
                console.log(response);
                // $scope.status=response.status;
                $scope.companylist = response;
                console.log($scope.companylist);
            },
            function(response) {
                $scope.companylist = response.companylist || 'Request failed';
                //$scope.status = response.status;

            });


    //posting data
    //submitData(firstName,lastName,email,address,city,password,status)"></td>
    /// db.company.insert({"companyName":"TCS","companyInfo":{"RegistartionNo":1234},"status":"activated"})


    $scope.companyName = null;
    $scope.RegistartionNo = null;
    $scope.status = null;

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
                    }
                },
                function(response) {
                    $scope.msg = "error occur";
                })


    }

}])