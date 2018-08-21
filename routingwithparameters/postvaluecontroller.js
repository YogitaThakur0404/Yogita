myapp.controller("postDataCtrl",["$scope","$http",function($scope,$http){
    $scope.userId=null;
    
    $scope.title=null;
    $scope.body=null;
    
    $scope.submitData=function(userId,title,body){
     var inputValue={
        "userId":userId,
        
        "title":title,
        "body":body
     };
    
    $http.post("https://jsonplaceholder.typicode.com/posts",inputValue)
    .then(function(response)
    {
        if(response){
            $scope.msg="data posted ...."}
    },
    function(response)
    {
        $scope.msg="error occur";
    })
    
    
    }
    }])
    
    