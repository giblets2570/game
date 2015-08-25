app.factory('userFactory', ['$resource', function(resource){
	return resource("/api/users/:user_id");
}]);