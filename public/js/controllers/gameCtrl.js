app.controller('GameCtrl',['$scope','levelFactory','$sessionStorage','$http',function(scope,Levels,storage,http){

	scope.playerLogin = "Login to try for a high score";
	if(storage.user){
		scope.playerLogin = "Player logged in: " + storage.user.name;
	}

	scope.sketch = function(sketch) {
    	// Initialize sketch

    	sketch.sWidth = 800;
    	sketch.sHeight = 600;

    	sketch.gamePlaying = false;
    	sketch.loading = true;
    	sketch.initializing = true;

    	scope.score = 0;

    	Levels.query().$promise.then(function(data){
    		console.log(data.length);
    		sketch.maps = [];
    		for(var i = 0; i < data.length; i++){
    			sketch.maps.push(data[i]._id);
    		}
    		// console.log(sketch.maps);
    		scope.setup();
    		// sketch.startGame();
    	});

        sketch.startGame = function(){
		    sketch.hero.x = 200;
		    sketch.hero.y = 400;
		    sketch.hero.life = 1;
		    scope.life = 1;
		    sketch.hero.score = 0;
		    scope.score = 0;
		    sketch.timer = 0;
		    sketch.level.generateMap(function(data){
		    	sketch.level.map = data.map;
		    	sketch.gamePlaying = true;
		    	sketch.loading = false;
		    	sketch.food.changePos();
		    	scope.level = data;
		    	scope.levelName = data.name;
		    	scope.highScores = data.highScores;
		    	// scope.$apply();
		    });
		}

		sketch.endGame = function(){
		    for(var i = sketch.baddies.length - 1; i >= 0; i--){
		        sketch.baddies.splice(i,1);
		    }
		    for(var i = sketch.nails.length - 1; i >= 0; i--){
		        sketch.nails.splice(i,1);
		    }
		    for(var i = sketch.bombs.length - 1; i >= 0; i--){
		        sketch.bombs.splice(i,1);
		    }
		    sketch.gamePlaying = false;
		    if(storage.user){
		    	http({
			    	method:'POST',
			    	url:'api/score',
			    	cache:false,
			    	data:{score:scope.score,level:scope.level, user:storage.user}
			    }).success(function(data){
			    	console.log(data);
			    });
		    }
		}

        scope.setup = function() {
        	sketch.level = new Level();
    		sketch.level.generateMap(function(data){
    			scope.highScores = data.highScores;
    			scope.levelName = data.name;
		    	sketch.level.map = data.map;
		    	sketch.size(sketch.sWidth, sketch.sHeight);
		      	sketch.frameRate(60);
		      	sketch.hero = new Hero(200, 400, 8, 1, 0, 24.0);
		      	scope.life = 1;
		      	scope.level = data;
		      	sketch.food = new Food();
		      	sketch.nails = [];
		      	sketch.baddies = [];
		      	sketch.bombs = [];
		      	sketch.timer = 0;
		      	sketch.gamePlaying = true;
		    	sketch.loading = false;
		    });
	    };

    	function Hero(x, y,speed, dirX, dirY, diameter) {
		    // Public properties, assigned to the instance ('this')
		    // this.x = x;
	     //    this.y = y;
	        this.speed = speed;
	        this.dirX = dirX;
	        this.dirY = dirY;
	        this.diameter = diameter;
	        this.life = 1;
	        this.score = 0;
	        this.setPos = function(){
		        this.x = Math.floor(Math.random()* (sketch.sWidth - 120)) + 60;
		        this.y = Math.floor(Math.random()* (sketch.sHeight - 120)) + 60;
		        if(sketch.level.get(Math.floor(this.y/40),Math.floor(this.x/40)) == "w"){
		            this.setPos();
		        }
		    }
	        this.setPos();
	       	this.dropNail = function(){
		        if(this.life > 1){
		            this.life -= 1;
		            scope.life -= 1;
		            scope.$apply();
		            sketch.nails.push(new Nail(this.x, this.y));
		        }
		    }

	        this.update = function() {
				this.x += this.dirX*this.speed;
		    	this.y += this.dirY*this.speed;

		    	var x1,x2,y1,y2;
		        if(this.dirY == 0){
		            x1 = Math.floor(((this.x + this.dirX*this.diameter / 2) % sketch.sWidth) / 40);
		            x2 = Math.floor(((this.x + this.dirX*this.diameter / 2) % sketch.sWidth) / 40);
		            y1 = Math.floor(((this.y + this.diameter / 2) % sketch.sHeight) / 40);
		            y2 = Math.floor(((this.y - this.diameter / 2) % sketch.sHeight) / 40);
		        }else if(this.dirX == 0){
		            y1 = Math.floor(((this.y + this.dirY*this.diameter / 2) % sketch.sHeight) / 40);
		            y2 = Math.floor(((this.y + this.dirY*this.diameter / 2) % sketch.sHeight) / 40);
		            x1 = Math.floor(((this.x + this.diameter / 2) % sketch.sWidth) / 40);
		            x2 = Math.floor(((this.x - this.diameter / 2) % sketch.sWidth) / 40);
		        }
		        if(y1 < 0){
		        	y1 += 15
		        }
		      	if(y2 < 0){
		        	y2 += 15
		        }
		        if(x1 < 0){
		        	x1 += 20
		        }
		        if(x2 < 0){
		        	x2 += 20
		        }

		        if(sketch.level.get(y1,x1) == "w" || sketch.level.get(y2,x2) == "w"){
		            this.x -= this.dirX*this.speed;
		            this.y -= this.dirY*this.speed;
		        }
		        sketch.fill(15,144,51);
		        sketch.stroke(0,0,0);
		        if(this.x < 0){
		            this.x += sketch.sWidth;
		        }else if(this.x >= sketch.sWidth){
		            this.x -= sketch.sWidth;
		        }
		        if(this.y < 0){
		            this.y += sketch.sHeight;
		        }else if(this.y >= sketch.sHeight){
		            this.y -= sketch.sHeight;
		        }
		        sketch.ellipse( this.x, this.y, this.diameter,this.diameter);
			}
		};

		function Food() {

		    this.changePos = function(){
		        this.x = Math.floor(Math.random()* (sketch.sWidth - 80)) + 40;
		        this.y = Math.floor(Math.random()* (sketch.sHeight - 80)) + 40;

		        if(sketch.level.get(Math.floor(this.y/40),Math.floor(this.x/40)) == "w"){
		            this.changePos();
		        }
		    };
		    this.changePos();

		    this.draw = function() {
		        sketch.fill(37,39,51);
		        sketch.stroke(0,0,0);
		        sketch.ellipse(this.x,this.y,10,10);
		    }

		    this.isEaten = function(){
		        if(sketch.hero.x - sketch.hero.diameter < this.x && sketch.hero.x + sketch.hero.diameter > this.x
		            && sketch.hero.y - sketch.hero.diameter < this.y && sketch.hero.y + sketch.hero.diameter > this.y){

		            this.changePos();

		            return true;
		        }
		        return false;
		    }

		}

		function Nail(x, y) {
	        this.x = x;
	        this.y = y;
	        this.radius = 30;

		    this.draw = function(){
		        sketch.fill(3,3,5);
		        sketch.stroke(255,255,255);
		        sketch.ellipse(this.x,this.y,this.radius,this.radius);
		    }
		}

		function Bomb() {
	        this.radius = 30;
	        this.timer = 90;

	        this.setPos = function(){
		        this.x = Math.floor(Math.random()* (sketch.sWidth - 120)) + 60;
		        this.y = Math.floor(Math.random()* (sketch.sHeight - 120)) + 60;
		        if(sketch.level.get(Math.floor(this.y/40),Math.floor(this.x/40)) == "w"){
		            this.setPos();
		        }
		    }

		    this.setPos();

		    this.update = function(){
		        sketch.fill(255,216,25);
		        sketch.stroke(255,255,255);
		        sketch.ellipse(this.x,this.y,this.radius,this.radius);
		        sketch.fill(244,129,33);
		        sketch.arc(this.x,this.y,this.radius,this.radius,0,sketch.TWO_PI * (1 - this.timer/90))
		        this.timer -= 1;
		    }

		    this.hitHero = function(){
		        if(sketch.hero.x - sketch.hero.diameter < this.x && sketch.hero.x + sketch.hero.diameter > this.x
		            && sketch.hero.y - sketch.hero.diameter < this.y && sketch.hero.y + sketch.hero.diameter > this.y){
		            this.timer = 60;
		            return true;
		        }
		        return false;
		    }
		}

		function Baddie(speed, dirX, dirY, diameter) {

	        this.speed = speed;
	        this.dirX = dirX;
	        this.dirY = dirY;
	        this.diameter = diameter;
	        this.timer = 0;

		    this.setPos = function(){
		        this.x = Math.floor(Math.random()* (sketch.sWidth - 120)) + 60;
		        this.y = Math.floor(Math.random()* (sketch.sHeight - 120)) + 60;
		        if(sketch.level.get(Math.floor(this.y/40),Math.floor(this.x/40)) == "w"){
		            this.setPos();
		        }
		    }

		    this.setPos();

		    this.chooseNewDir = function(){
		        var newDir = Math.floor((Math.random()*4));
		        if(newDir%2==0){
		            this.dirX = 0;
		            if(newDir==2){
		                this.dirY=1;
		            }else{
		                this.dirY=-1;
		            }
		        }else{
		            this.dirY = 0;
		            if(newDir==3){
		                this.dirX=1;
		            }else{
		                this.dirX=-1;
		            }
		        }
		    }

		    this.isNailed = function(){
		        for(var i = sketch.nails.length - 1; i >= 0; i--){
		            var n =  sketch.nails[i];
		            if(n.x - n.radius < this.x && n.x + n.radius > this.x
		                && n.y - n.radius < this.y && n.y + n.radius > this.y){
		                sketch.nails.splice(i,1);
		                return true;
		            }
		        }
		        return false;
		    }

		    this.hitHero = function(){
		        if(this.timer > 0){
		            return false;
		        }
		        if(sketch.hero.x - sketch.hero.diameter < this.x && sketch.hero.x + sketch.hero.diameter > this.x
		            && sketch.hero.y - sketch.hero.diameter < this.y && sketch.hero.y + sketch.hero.diameter > this.y){
		            this.timer = 60;
		            return true;
		        }
		        return false;
		    }

		    this.update = function(){
		        if(this.timer > 0){
		            this.timer -= 1;
		        }else{
		            this.x += this.dirX*this.speed;
		            this.y += this.dirY*this.speed;

		            var x1,x2,y1,y2;
			        if(this.dirY == 0){
			            x1 = Math.floor(((this.x + this.dirX*this.diameter / 2) % sketch.sWidth) / 40);
			            x2 = Math.floor(((this.x + this.dirX*this.diameter / 2) % sketch.sWidth) / 40);
			            y1 = Math.floor(((this.y + this.diameter / 2) % sketch.sHeight) / 40);
			            y2 = Math.floor(((this.y - this.diameter / 2) % sketch.sHeight) / 40);
			        }else if(this.dirX == 0){
			            y1 = Math.floor(((this.y + this.dirY*this.diameter / 2) % sketch.sHeight) / 40);
			            y2 = Math.floor(((this.y + this.dirY*this.diameter / 2) % sketch.sHeight) / 40);
			            x1 = Math.floor(((this.x + this.diameter / 2) % sketch.sWidth) / 40);
			            x2 = Math.floor(((this.x - this.diameter / 2) % sketch.sWidth) / 40);
			        }

			        if(y1 < 0){
		        		y1 += 15
			        }
			      	if(y2 < 0){
			        	y2 += 15
			        }
			        if(x1 < 0){
			        	x1 += 20
			        }
			        if(x2 < 0){
			        	x2 += 20
			        }


			        if(sketch.level.get(y1,x1) == "w" || sketch.level.get(y2,x2) == "w"){
			            this.x -= this.dirX*this.speed;
			            this.y -= this.dirY*this.speed;
			            this.chooseNewDir()
			        }
		        }
		        if(this.x < 0){
		            this.x += sketch.sWidth;
		        }else if(this.x >= sketch.sWidth){
		            this.x -= sketch.sWidth;
		        }
		        if(this.y < 0){
		            this.y += sketch.sHeight;
		        }else if(this.y >= sketch.sHeight){
		            this.y -= sketch.sHeight;
		        }
		        sketch.fill(155,39,51);
		        sketch.stroke(0,0,0);
		        sketch.ellipse( this.x, this.y, this.diameter,this.diameter);
		    }

		}

		function Level() {

			this.generateMap = function(callback){
		        var map_choice = Math.floor((Math.random() * sketch.maps.length));
		        Levels.get({level_id:sketch.maps[map_choice]},callback);
		    };
		    // this.generateMap();
		    this.get = function(i,j){
		        return this.map[i][j];
		    };
		    this.draw = function(){
		        sketch.noStroke();
		        for(var i = 0; i < this.map.length; i++){
		            for(var j = 0; j < this.map[i].length; j++){
		                if(this.map[i][j] == "w"){
		                    // Set fill-color to blue
		                    sketch.fill(37,39,164);
		                    sketch.rect(j*40,i*40,40,40);
		                };
		            };
		        }
		    }

		};

		sketch.keyPressed = function(){
			// Conditionally display based on string value
		    if (sketch.key.code == 119) {
		        sketch.hero.dirX = 0;
		        sketch.hero.dirY = -1;
		    }
		    if (sketch.key.code == 115) {
		        sketch.hero.dirX = 0;
		        sketch.hero.dirY = 1;
		    }
		    if (sketch.key.code == 97) {
		        sketch.hero.dirX = -1;
		        sketch.hero.dirY = 0;
		    }
		    if (sketch.key.code == 100) {
		        sketch.hero.dirX = 1;
		        sketch.hero.dirY = 0;
		    }
		    if(sketch.key == 32){
		        sketch.hero.dropNail();
		    }
		    if(sketch.key == 121 && !sketch.gamePlaying){
		        sketch.startGame();
		    }
		}

			// Main draw loop
		sketch.draw = function() {
			sketch.background(183,191,200);
			if(sketch.gamePlaying){
				sketch.level.draw();
				sketch.food.draw();
				for(var i = sketch.bombs.length - 1; i >= 0; i--){
		        	var b = sketch.bombs[i];
		        	if(b.hitHero()){
		        		sketch.hero.score += sketch.baddies.length;
		                scope.score += sketch.baddies.length;
		                sketch.bombs.splice(i,1);
		                for(var i = sketch.baddies.length - 1; i >= 0; i--){
		                	sketch.baddies.splice(i,1);
		                }
		                scope.$apply();
		        	}else{
		        		if(b.timer <= 0){
			        		sketch.bombs.splice(i,1);
			        	}else{
			        		b.update();
			        	}
		        	}
		        }
				for(var i = sketch.baddies.length - 1; i >= 0; i--){
		            var b = sketch.baddies[i];
		            if(b.isNailed()){
		                sketch.baddies.splice(i,1);
		                sketch.hero.score += 1;
		                scope.score += 1;
		            	scope.$apply();
		            }else{
		                if(b.hitHero()){
		                    sketch.hero.life -= 1;
		                    scope.life -= 1;
		                    scope.$apply();
		                };
		                b.update();
		            }
		        }

		        if(sketch.timer%180 == 0){
		            if(sketch.baddies.length < 40){
		                sketch.baddies.push(new Baddie(9, 1, 0, 20.0));
		            }
		        }
		        if(sketch.timer%300 == 0){
                	sketch.bombs.push(new Bomb());
		        }
		        sketch.timer += 1;
				if(sketch.food.isEaten()){
		            sketch.hero.life += 1;
		            scope.life += 1;
		            scope.$apply();
		        }

		        for(var i = 0; i < sketch.nails.length; i++){
	            	var n = sketch.nails[i];
	            	n.draw();
	        	}
	        	sketch.text("Hero's life: " + sketch.hero.life + ", Score: " + sketch.hero.score, 0, 10, 80, 40,100);
	        	sketch.hero.update();

	        	if(sketch.hero.life <= 0){
		            sketch.endGame();
		        }

			}else if(sketch.loading){
				sketch.text("Loading");
			}else {
				sketch.text("Score: "+ sketch.hero.score+", play again?: (y for yes)", 0, 10, 80, 40,100);
			}

		};
	};

}]);