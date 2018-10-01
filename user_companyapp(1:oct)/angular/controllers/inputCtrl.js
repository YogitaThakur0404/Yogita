myapp.controller("inputCtrl", ["$scope", "$http", function($scope, $http) {

    $scope.submit = function submit(email, password) {
        console.log("inputCTRL called");
        $scope.email = email;
        $scope.password = password;
        console.log($scope.email);
        console.log($scope.password);
        // $http.post('/login', $scope.data).then(function(response) {
        //     console.log("in post");
        //     console.log(response.data[0]);
        //     $location.path(response.data[0]);
        // });
    }

}])