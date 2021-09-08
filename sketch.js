var board;

var sliderX;
var sliderY;
var sliderZ;

var myFont;
function preload(){
  myFont = loadFont('assets/SourceSansPro-Regular.otf');
}

function setup() {
  createCanvas(600, 600, WEBGL);
  board = new Board(4, 40);
  
  textFont(myFont);
  textSize(30);
  
  sliderX = createSlider(PI * -1, PI, -0.75, 0.1);
  sliderY = createSlider(PI * -1, PI, -0.35, 0.1);
  sliderZ = createSlider(PI * -1, PI, -0.05, 0.1);

  //initialize display
  //background(80);
  //board.show2d();
}

function draw() {
  if (!board.movePossible) {
    console.log("TIE!");
    noLoop();
    return;
  }

  //background(80);
  board.show2d();
  fill(255,0,0);
  text(("next Player: " + board.activePlayer), 0 , -height / 3);

}

function mousePressed() {
  if (board.movePossible()) {
    if (board.activePlayer === 1){ // player 1 = randomAI
    while (!board.play(floor(random(4)), floor(random(4)), floor(random(4))));
    } else if (board.activePlayer === 2){ // player 2 = human
      var x = mouseX;
      var y = mouseY;
      console.log(x,y);
    }
    
  }
}
