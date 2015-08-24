// Global variables
// int diameter = 20;
// int X, Y;

Hero hero;
Food food;
Baddie baddie;
ArrayList baddies;
ArrayList nails;
Level level;

int timer;

// int screenWidth = screen.width - screen.width%40;
int screenWidth = 800;
// int screenHeight = screen.height - screen.height%40;
int screenHeight = 600;

boolean gamePlaying = true;

//defining the shape of the level

maps = [[ "wwwwwwwwwwwwwwwwwwww",
          "         w   w      ",
          "w wwwww  w   w www w",
          "w w      w   w     w",
          "w w www  w   w www w",
          "w w                w",
          "w wwwww            w",
          "w                  w",
          "w  w  w            w",
          "w  w  w     w   w  w",
          "w           w   w  w",
          "wwwwwwwwwwwww   w  w",
          "w      w        w  w",
          "w  w       w       w",
          "wwwwwwwwwwwwwwwwwwww"],
        [ "wwwwwwwwwwwwwwwwwwww",
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
          "wwwwwwwwwwwwwwwwwwww"]];


void endGame(){
    for(int i = baddies.size() - 1; i >= 0; i--){
        baddies.remove(i);
    }
    for(int i = nails.size() - 1; i >= 0; i--){
        nails.remove(i);
    }
    gamePlaying = false;
}

void startGame(){
    hero.x = 200;
    hero.y = 400;
    hero.life = 1;
    hero.score = 0;
    timer = 0;
    level.generateMap();
    gamePlaying = true;
}

// Setup the Processing Canvas
void setup(){
    size( screenWidth, screenHeight );
    strokeWeight(1);
    frameRate( 60 );
    timer = 0;
    level = new Level();
    hero = new Hero(200, 400, 8, 1, 0, 24.0);
    // baddie = new Baddie(300, 400, 10, 1, 0, 20.0);
    baddies = new ArrayList();
    nails = new ArrayList();
    food = new Food();
}

// Main draw loop
void draw(){
	// Fill canvas grey
	background(183,191,200);
    if(gamePlaying){
        level.draw();
        food.draw();
        for(int i = baddies.size() - 1; i >= 0; i--){
            Baddie b = (Baddie) baddies.get(i);
            if(b.isNailed()){
                baddies.remove(i);
                hero.score += 1;
            }else{
                if(b.hitHero()){
                    hero.life -= 1;
                };
                b.update();
            }
        }
        for(int i = 0; i < nails.size(); i++){
            Nail n = (Nail) nails.get(i);
            n.draw();
        }
        //
        if(timer%180 == 0){
            if(baddies.size() < 40){
                baddies.add(new Baddie(9, 1, 0, 20.0));
            }
        }

        if(food.isEaten()){
            hero.life += 1;
        }
        text("Hero's life: " + str(hero.life) + ", Score: " + str(hero.score), 0, 10, 80, 40,100);
        timer += 1;
        hero.update();

        if(hero.life == 0){
            endGame();
        }
    }else{
        text("Score: "+str(hero.score)+", play again?: (y for yes)", 0, 10, 80, 40,100);
    }
}

void keyPressed(){
	// Conditionally display based on string value
    if (key == 'w') {
        hero.dirX = 0;
        hero.dirY = -1;
    }
    if (key == 's') {
        hero.dirX = 0;
        hero.dirY = 1;
    }
    if (key == 'a') {
        hero.dirX = -1;
        hero.dirY = 0;
    }
    if (key == 'd') {
        hero.dirX = 1;
        hero.dirY = 0;
    }
    if(key == 32){
        hero.dropNail();
    }
    if(key == 'y' && !gamePlaying){
        startGame();
    }
}

class Food {
    int x, y;

    Food(){
        this.changePos();
    }

    void changePos(){
        this.x = int(random(40, width - 40));
        this.y = int(random(40, height - 40));
        if(level.get(int(this.y/40),int(this.x/40)) == "w"){
            changePos();
        }
    }

    void draw() {
        fill(37,39,51);
        stroke(0,0,0);
        ellipse(this.x,this.y,10,10);
    }

    boolean isEaten(){
        if(hero.x - hero.diameter < this.x && hero.x + hero.diameter > this.x
            && hero.y - hero.diameter < this.y && hero.y + hero.diameter > this.y){
            this.changePos();
            return true;
        }
        return false;
    }

}

class Nail {
    int x, y, radius;

    Nail(int x, int y){
        this.x = x;
        this.y = y;
        this.radius = 30;
    }

    void draw() {
        fill(3,3,5);
        stroke(255,255,255);
        ellipse(this.x,this.y,this.radius,this.radius);
    }
}

class Hero {

    int dirX, dirY, speed, x, y, life, score;

    float diameter;

    Hero (int x, int y,int speed, int dirX, int dirY, float diameter){
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.dirX = dirX;
        this.dirY = dirY;
        this.diameter = diameter;
        this.life = 1;
        this.score = 0;
    }

    void dropNail(){
        if(this.life > 1){
            this.life -= 1;
            nails.add(new Nail(this.x, this.y));
        }
    }

    void update(){
    	this.x += this.dirX*this.speed;
    	this.y += this.dirY*this.speed;

        int x1, y1, x2, y2;

        if(dirY == 0){
            x1 = int(((this.x + dirX*diameter / 2) % screenWidth) / 40);
            x2 = int(((this.x + dirX*diameter / 2) % screenWidth) / 40);
            y1 = int(((this.y + diameter / 2) % screenHeight) / 40);
            y2 = int(((this.y - diameter / 2) % screenHeight) / 40);
        }else if(dirX == 0){
            y1 = int(((this.y + dirY*diameter / 2) % screenHeight) / 40);
            y2 = int(((this.y + dirY*diameter / 2) % screenHeight) / 40);
            x1 = int(((this.x + diameter / 2) % screenWidth) / 40);
            x2 = int(((this.x - diameter / 2) % screenWidth) / 40);
        }
        if(level.get(y1,x1) == "w" || level.get(y2,x2) == "w"){
            this.x -= this.dirX*this.speed;
            this.y -= this.dirY*this.speed;
        }
        fill(15,144,51);
        stroke(0,0,0);
        if(this.x < 0){
            this.x += screenWidth;
        }else if(this.x >= screenWidth){
            this.x -= screenWidth;
        }
        if(this.y < 0){
            this.y += screenHeight;
        }else if(this.y >= screenWidth){
            this.y -= screenHeight;
        }
        ellipse( this.x, this.y, this.diameter,this.diameter);
    }

}

class Baddie {

    int dirX, dirY, speed, x, y, timer;

    float diameter;

    Baddie (int speed, int dirX, int dirY, float diameter){
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.dirX = dirX;
        this.dirY = dirY;
        this.diameter = diameter;
        this.timer = 0;
        this.setPos();
    }

    void setPos(){
        this.x = int(random(60, width - 60));
        this.y = int(random(60, height - 60));
        if(level.get(int(this.y/40),int(this.x/40)) == "w"){
            this.setPos();
        }
    }

    void chooseNewDir(){
        int newDir = int(random(0,4));
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

    boolean isNailed(){
        for(int i = nails.size() - 1; i >= 0; i--){
            Nail n = (Nail) nails.get(i);
            if(n.x - n.radius < this.x && n.x + n.radius > this.x
                && n.y - n.radius < this.y && n.y + n.radius > this.y){
                nails.remove(i);
                return true;
            }
        }
        return false;
    }

     boolean hitHero(){
        if(this.timer > 0){
            return false;
        }
        if(hero.x - hero.diameter < this.x && hero.x + hero.diameter > this.x
            && hero.y - hero.diameter < this.y && hero.y + hero.diameter > this.y){
            this.timer = 60;
            return true;
        }
        return false;
    }

    void update(){
        if(timer > 0){
            timer -= 1;
        }else{
            this.x += this.dirX*this.speed;
            this.y += this.dirY*this.speed;

            int x1, y1, x2, y2;

            if(dirY == 0){
                x1 = int(((this.x + dirX*diameter / 2) % screenWidth) / 40);
                x2 = int(((this.x + dirX*diameter / 2) % screenWidth) / 40);
                y1 = int(((this.y + diameter / 2) % screenHeight) / 40);
                y2 = int(((this.y - diameter / 2) % screenHeight) / 40);
            }else if(dirX == 0){
                y1 = int(((this.y + dirY*diameter / 2) % screenHeight) / 40);
                y2 = int(((this.y + dirY*diameter / 2) % screenHeight) / 40);
                x1 = int(((this.x + diameter / 2) % screenWidth) / 40);
                x2 = int(((this.x - diameter / 2) % screenWidth) / 40);
            }

            if(level.get(y1,x1) == "w" || level.get(y2,x2) == "w"){
                this.x -= this.dirX*this.speed;
                this.y -= this.dirY*this.speed;
                this.chooseNewDir();
            }
        }
        if(this.x < 0){
            this.x += screenWidth;
        }else if(this.x > screenWidth){
            this.x = 0
        }
        if(this.y < 0){
            this.y += screenHeight;
        }else if(this.y > screenWidth){
            this.y = 0
        }
        fill(155,39,51);
        stroke(0,0,0);
        ellipse( this.x, this.y, this.diameter,this.diameter);
    }

}

class Level {

    String[] map;

    Level (){
        this.generateMap();
    }

    void generateMap(){
        int map_choice = int(random(0,maps.length))
        this.map = maps[map_choice];
    }

    String get(i,j){
        return this.map[i][j];
    }

    void draw(){
        noStroke();
        for(int i = 0; i < this.map.length; i++){
            for(int j = 0; j < this.map[i].length; j++){
                if(this.map[i][j] == "w"){
                    // Set fill-color to blue
                    fill(37,39,164);
                    rect(j*40,i*40,40,40);
                }
            }
        }
    }

}
