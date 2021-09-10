var board;

let view;
var sliderX;
var sliderY;
var sliderZ;

let slider1;
let slider2;
let slider3;

var myFont;
function preload() {
  myFont = loadFont("assets/SourceSansPro-Regular.otf");
}

function setup() {
  createCanvas(600, 600, WEBGL);
  board = new Board(4, 40);

  textFont(myFont);
  textSize(30);

  view = createDiv("view controls<br />");
  slider1 = createDiv("X rotation");
  slider1.parent(view);
  sliderX = createSlider(PI * -1, PI, -0.75, 0.1);
  sliderX.parent(slider1);
  slider2 = createDiv("Y rotation");
  slider2.parent(view);
  sliderY = createSlider(PI * -1, PI, -0.35, 0.1);
  sliderY.parent(slider2);
  slider3 = createDiv("Z rotation");
  slider3.parent(view);
  sliderZ = createSlider(PI * -1, PI, -0.05, 0.1);
  sliderZ.parent(slider3);


  //initialize display
  //background(80);
  //board.show2d();
}

function draw() {
  background(80);
  board.show2d();

  if (!board.movePossible) {
    console.log("TIE!");
    noLoop();
    return;
  } else {
    if (board.activePlayer === 1) {
      // player 1 = randomAI
      while (!board.play(floor(random(4)), floor(random(4)), floor(random(4))));
    }
  }

  fill(255, 0, 0);
  if (board.winner) {
    text("WINNER: " + board.activePlayer, 0, -height / 3);
    view.remove();
  } else {
    text("next Player: " + board.activePlayer, 0, -height / 3);
  }
}

function mousePressed() {
  if (board.movePossible() && board.activePlayer === 2) {
    // player 2 = human
    var x = mouseX - width / 2;
    var y = mouseY - height / 2;
    let move = false;
    while(!move) {
      move = board.clicked2d(x, y);
    } 
    
    board.play(move.x, move.y, move.z);
    
  }
}

