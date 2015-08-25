app.controller('addLevelCtrl', ['$scope','levelFactory', function(scope,Levels){

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

	scope.message = "Add a new level!";

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

	scope.log = function(cell){
		if(scope.newLevelArray[cell.i][cell.j].value == "w"){
			scope.newLevelArray[cell.i][cell.j].value = " ";
		}else{
			scope.newLevelArray[cell.i][cell.j].value = "w";
		}
	}

	scope.submit = function(){
		scope.message = "Saving...";
		Levels.save({map:convertToString(),name:scope.levelName},function(data){
			console.log(data);
			scope.message = data.message;
		});
	};
}]);