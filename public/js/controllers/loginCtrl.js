app.controller('LoginCtrl', ['$scope','userFactory','$sessionStorage','$http','$location',function(scope,Users,storage,http,location){

	scope.signup = function(){
		console.log("Here");
		if(scope.signupPassword == null || scope.signupPassword == "" || scope.signupName == null || scope.signupName == "")
			return;
		Users.save({
			name:scope.signupName,
			password:scope.signupPassword
		},function(data){
			console.log(data);
			storage.user = data.user;
			location.path('/game');
		});
	}

	scope.login = function(){
		http({
			method:'POST',
			url:'/api/login',
			data:{
				name: scope.loginName,
				password: scope.loginPassword
			},
			cache:false
		}).success(function(data){
			console.log(data);
			storage.user = data.user;
			location.path('/game');
		});
	}

}]);