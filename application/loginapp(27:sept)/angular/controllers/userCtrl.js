myapp.controller("userCtrl", ["$scope", "$http", function($scope, $http) {

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


}])