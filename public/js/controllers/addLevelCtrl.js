app.controller('addLevelCtrl', ['$scope','levelFactory','$sessionStorage','$location', function(scope,Levels,storage,location){

	scope.newLevel =[ "wwwwwwwwwwwwwwwwwwww",
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



	if(storage.user){
		scope.message = "Add a new level!";
	}else{
		scope.message = "Login to add new levels";
	}

	var convertToArray = function(){
		var result = [];
		for(var i = 0; i < scope.newLevel.length; i++){
			result.push([]);
			for(var j = 0; j < scope.newLevel[i].length; j++){
				result[i].push({i:i,j:j,value: scope.newLevel[i][j]});
			}
		}
		return result;
	}
	var convertToString = function(){
		var result = [];
		for(var i = 0; i < scope.newLevelArray.length; i++){
			var r = "";
			for(var j = 0; j < scope.newLevelArray[i].length; j++){
				r += scope.newLevelArray[i][j].value;
			}
			result.push(r);
		}
		return result;
	}

	scope.newLevelArray = convertToArray();

	scope.change = function(cell){
		if(scope.newLevelArray[cell.i][cell.j].value == "w"){
			scope.newLevelArray[cell.i][cell.j].value = " ";
		}else{
			scope.newLevelArray[cell.i][cell.j].value = "w";
		}
	}

	scope.submit = function(){
		if(scope.levelName == null || scope.levelName == ""){
			scope.message = "Give you level a name!";
			return;
		}
		if(storage.user){
			scope.message = "Saving...";
			Levels.save({map:convertToString(),name:scope.levelName},function(data){
				console.log(data);
				scope.message = data.message;
				location.path('/game');
			});
		}
	};

	scope.getClass = function(cell){
		if(scope.newLevelArray[cell.i][cell.j].value == "w"){
			return 'mbtn btn btn-success'
		}
		return 'mbtn btn btn-default'
	}

}]);