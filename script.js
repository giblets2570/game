// Global variables
// int diameter = 20;
// int X, Y;

int speed = 8;
ArrayList walls;
Hero hero;
Food food;

// int[] numbers
// boolean hit;


//defining the shape of the level

level = [ "wwwwwwwwwwwwwwwwwwww",
          "w    w             w",
          "w    w             w",
          "w    w             w",
          "w    wwwwww        w",
          "w                  w",
          "w                  w",
          "w                  w",
          "w                  w",
          "w           w      w",
          "w           w      w",
          "wwwwwwwwwwwww      w",
          "w                  w",
          "w                  w",
          "wwwwwwwwwwwwwwwwwwww"];


// Setup the Processing Canvas
void setup(){
  size( 800, 600 );
  strokeWeight( 0 );
  frameRate( 60 );
  walls = new ArrayList();
  hero = new Hero(200, 400, 8, 1, 0, 30.0);
  food = new Food();
}

// Main draw loop
void draw(){

	// Fill canvas grey
	background(183,191,200);

	// Set fill-color to blue
	fill( 37,39,164 );

	// Set stroke-color white
	stroke(255);

	// Draw circle
	// ellipse( X, Y, diameter, diameter );
  for(int i = 0; i < level.length; i++){
    // walls[i].draw();
    for(int j = 0; j < level[i].length; j++){
      // println(level[i][j]=='w');
      // rect(j*40,i*40,40,40);
      if(level[i][j] == "w"){
        rect(j*40,i*40,40,40);
      }
    }
  }

	hero.update();
	hero.draw();

  food.draw();

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
}

class Food {
  int x, y;

  Food(){
    this.x = int(random(20, width - 20));
    this.y = int(random(20, height - 20));
  }

  void changePos(){
    this.x = int(random(20, width - 20));
    this.y = int(random(20, height - 20));
  }

  void draw() {
    fill(37,39,51);
    ellipse(this.x,this.y,10,10);
  }

}

class Hero {

  int dirX, dirY, speed, x, y;

  float diameter;

  Hero (int x, int y,int speed, int dirX, int dirY, float diameter){
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.dirX = dirX;
    this.dirY = dirY;
    this.diameter = diameter;
  }

  void update(){
  	this.x += this.dirX*this.speed;
  	this.y += this.dirY*this.speed;

    int x1 = 0;
    int y1 = 0;
    int x2 = 0;
    int y2 = 0;

    if(dirY == 0){
      x1 = int((this.x + dirX*diameter / 2) / 40);
      x2 = int((this.x + dirX*diameter / 2) / 40);
      y1 = int((this.y + diameter / 2) / 40);
      y2 = int((this.y - diameter / 2) / 40);


    }else if(dirX == 0){
      y1 = int((this.y + dirY*diameter / 2) / 40);
      y2 = int((this.y + dirY*diameter / 2) / 40);
      x1 = int((this.x + diameter / 2) / 40);
      x2 = int((this.x - diameter / 2) / 40);
    }

    if(level[y1][x1] == "w" || level[y2][x2] == "w"){
      this.x -= this.dirX*this.speed;
      this.y -= this.dirY*this.speed;
    }

  }
  void draw() {
  	ellipse( this.x, this.y, this.diameter,this.diameter);
  }

}
