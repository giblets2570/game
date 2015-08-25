app.controller('NavbarCtrl', ['$scope','$sessionStorage', function(scope,storage){
	scope.userName = "";
	scope.$watch(storage.user,function(newUser){
		if(newUser){
			scope.userName = newUser.name;
		}else{
			scope.userName = "";
		}
	})
}])