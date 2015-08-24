app.controller('inputController', ['$scope','$http', function(scope,http){

	scope.map = [ "wwwwwwwwwwwwwwwwwwww",
          "w        w         w",
          "w wwwww  w w w w w w",
          "w     w  w         w",
          "w   w w  w w w w w w",
          "w     w            w",
          "w wwwww            w",
          "w                  w",
          "w  wwww            w",
          "w  w  w     w   w  w",
          "w           w   w  w",
          "ww          w   w  w",
          "w      w        w  w",
          "w  w       w       w",
          "wwwwwwwwwwwwwwwwwwww"];

	scope.clicked = function(){
		http({
			method:'POST',
			url:'api/levels',
			data: {map: scope.map},
			cache: false
		}).success(function(data){
			console.log(data);
		})
	}
	scope.delete = function(){
		http({
			method:'DELETE',
			url:'api/levels',
			cache: false
		}).success(function(data){
			console.log(data);
		})
	}
}])