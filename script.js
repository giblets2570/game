// Global variables
// int diameter = 20;
// int X, Y;

int speed = 8;
int dirX, dirY;
Wall[] walls;
Hero hero;

// int[] numbers
// boolean hit;


// Setup the Processing Canvas
void setup(){
  size( 500, 500 );
  strokeWeight( 1 );
  frameRate( 60 );
  walls = {new Wall(0,0,width,16),new Wall(0,0,16,height),new Wall(0,height-16,width,16),new Wall(width-16,0,16,height)};
  hero = new Hero(200, 200, 8, 1, 0, 20.0);
}

// Main draw loop
void draw(){

	// Fill canvas grey
	background( 100 );

	// Set fill-color to blue
	fill( 0, 121, 184 );

	// Set stroke-color white
	stroke(255);

	// Draw circle
	// ellipse( X, Y, diameter, diameter );
	for(int i = 0; i < walls.length; i++){
		walls[i].draw();
	}
	hero.update();
	hero.draw();

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

class Wall {

  float x, y, w, h;

  Wall (float x, float y, float w, float h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  void draw() {
    rect(x,y,w,h);
  }

};

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
  	boolean hit = false;

  	if(this.x - this.diameter < this.diameter / 2){
  		hit = true;
  	}

  	if(this.x + this.diameter > width - this.diameter / 2){
  		hit = true;
  	}

  	if(this.y - this.diameter < this.diameter / 2){
  		hit = true;
  	}

  	if(this.y + this.diameter > height - this.diameter / 2){
  		hit = true;
  	}

  	if(hit){
  		this.x -= this.dirX*this.speed;
  		this.y -= this.dirY*this.speed;
  	}

  }
  void draw() {
  	ellipse( this.x, this.y, this.diameter,this.diameter);
  }

}
