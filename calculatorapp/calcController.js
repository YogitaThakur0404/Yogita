myApp.controller("calCtrl",["$scope",function($scope){

    $scope.num1=0;
    $scope.num2=0;
    $scope.operator="";

  /*
    $scope.sum=function(num1,num2){
        console.log($scope.model.num1);
        console.log($scope.model.num1);
        return  $scope.model.num1+$scope.model.num2;
      
    }
*/

 $scope.val=0;

 

    $scope.result=function(num1,num2,operator)
    {
     
     
        if($scope.model.operator == 'sub'){
            $scope.val=$scope.model.num1-$scope.model.num2;
         }

        if($scope.model.operator =='sum'){
            $scope.val=$scope.model.num1+$scope.model.num2;
        }
        if($scope.model.operator == 'dev'){
        $scope.val= $scope.model.num1/$scope.model.num2;
        }

        if($scope.model.operator =='mult'){
            console.log("num1="+$scope.model.num1);
            console.log("num2="+$scope.model.num2);
            console.log("multi");
            $scope.val= $scope.model.num1*$scope.model.num2;
            console.log("val="+$scope.val);
        }
        else{
            return "Invalid";
        }
        
     
    }

}]);