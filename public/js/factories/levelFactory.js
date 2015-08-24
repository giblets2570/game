app.factory('levelFactory', ['$resource', function(resource){
	return resource("/api/levels/:level_id");
}]);