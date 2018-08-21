myapp.controller("calCtrl",["$scope","$routeParams",function($scope,$routeParams){

    $scope.number1=parseInt($routeParams.number1);
    $scope.number2=parseInt($routeParams.number2);
    $scope.operator="sum";

  
 $scope.val=null;

 

    $scope.result=function(number1,number2,operator)
    {
     console.log("num1="+$scope.number1);
     console.log("num2="+$scope.number2);
     console.log("operator="+$scope.operator);
     console.log("inside function");
     
        if($scope.operator == 'sum'){
            $scope.val=$scope.number1+$scope.number2;
         }

        if($scope.operator =='sub'){
            $scope.val=$scope.number1-$scope.number2;
        }
        if($scope.operator == 'dev'){
        $scope.val= $scope.number1/$scope.number2;
        }

        if($scope.operator =='mult'){
           
            $scope.val= $scope.number1*$scope.number2;
         
        }
        else{
            return "Invalid";
        }
        
     
    }

}]);

