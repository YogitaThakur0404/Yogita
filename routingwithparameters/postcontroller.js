
myapp.controller("postCtrl",["$scope","$http",function($scope,$http)
{
$scope.method="GET";
$scope.url="https://jsonplaceholder.typicode.com/posts";

$scope.fetch=function(){
    console.log("url="+$scope.url);

    $scope.code=null;
    $scope.response=null;
    
    $http({method:$scope.method,url:$scope.url})
    
    .then(function(response){
        console.log(response);
       $scope.status=response.status;
        $scope.datas=response.data;
    },function(response){
        $scope.datas = response.data || 'Request failed';
         $scope.status = response.status;

    });

    //console.log("url end ="+$scope.url);

}
//console.log("data="+fetch);
}])



