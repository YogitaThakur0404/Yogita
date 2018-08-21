myApp.controller("calCtrl",["$scope",'$routeParams',function($scope,$routeParams){

    $scope.number1=$routeParams.number1;
    $scope.number2=$routeParams.number2;
    $scope.operator="";

  
 $scope.val=0;

 

    $scope.result=function(number1,number2,operator)
    {
     
     
        if($scope.model.operator == 'sub'){
            $scope.val=$scope.model.number1-$scope.model.number2;
         }

        if($scope.model.operator =='sum'){
            $scope.val=$scope.model.number1+$scope.model.number2;
        }
        if($scope.model.operator == 'dev'){
        $scope.val= $scope.model.number1/$scope.model.number2;
        }

        if($scope.model.operator =='mult'){
           // console.log("num1="+$scope.model.number1);
           // console.log("num2="+$scope.model.number2);
         //   console.log("multi");
            $scope.val= $scope.model.number1*$scope.model.number2;
         //   console.log("val="+$scope.val);
        }
        else{
            return "Invalid";
        }
        
     
    }

}]);