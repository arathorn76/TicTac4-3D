var board;

let baseTime;

let debug = false;

let view;
let div2d3d;
let div1, div2, div3;

let slider3DView;
var sliderX, sliderY, sliderZ;

let players = [];

let control;
let buttonRestart;

let player1, player2;

var myFont;
function preload() {
  myFont = loadFont("assets/SourceSansPro-Regular.otf");
}

function setup() {
  createCanvas(600, 600, WEBGL);

  textFont(myFont);
  textSize(30);

  createGameControls();

  startGame();

  frameRate(30);
}

function draw() {
  baseTime = millis();
  show();

  fill(255, 0, 0);
  if (board.winner) {
    text("WINNER: " + board.activePlayer, 0, -height / 3);
    // show()
    noLoop();
    return;
  } else {
    if (board.movePossible()) {
      text("Player: " + board.activePlayer, 0, -height / 3);
      // show()
      players[board.activePlayer - 1].makeMove();
    } else {
      text("TIE!", 0, -height / 3);
      // show()
      noLoop();
      return;
    }
  }
  console.log( `frame duration = ${ round( ( millis() - baseTime ) / 1000 , 3)} seconds` );
}

function mousePressed() {
  // ignore mouse button events outside the canvas
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
    return;
  }

  // process human moves - 2D version
  if (
    board.movePossible() &&
    players[board.activePlayer - 1].type === `HUMAN` &&
    slider3DView.value() === 0
  ) {
    // player 2 = human
    let move = false;
    let mx = mouseX - width / 2;
    let my = mouseY - height / 2;
    move = board.clicked2d(mx, my);
    if (move) {
      board.play(move.x, move.y, move.z);
      show();
      text("Player: " + board.activePlayer, 0, -height / 3);
    }
  }
}

function createViewControls() {
  if (view) view.remove();
  view = createDiv("view controls<br />");
  div2d3d = createDiv("Ansicht 2D/3D");
  div2d3d.parent(view);
  slider3DView = createSlider(0, 1, 0, 1);
  slider3DView.parent(view);
  div1 = createDiv("X rotation");
  div1.parent(view);
  sliderX = createSlider(PI * -1, PI, -0.75, 0.1);
  sliderX.parent(div1);
  div2 = createDiv("Y rotation");
  div2.parent(view);
  sliderY = createSlider(PI * -1, PI, -0.35, 0.1);
  sliderY.parent(div2);
  div3 = createDiv("Z rotation");
  div3.parent(view);
  sliderZ = createSlider(PI * -1, PI, -0.05, 0.1);
  sliderZ.parent(div3);
}

function createGameControls() {
  control = createDiv("game controls");
  buttonRestart = createButton(`restart game`);
  buttonRestart.parent(control);
  buttonRestart.mouseClicked(startGame);
  player1 = createSelect();
  player1.position(5, height - 30);
  player1.option(`HUMAN`);
  player1.option(`RANDOM`);
  player1.option(`AI1`);
  player1.selected(`RANDOM`);
  player2 = createSelect();
  player2.position(150, height - 30);
  player2.option(`HUMAN`);
  player2.option(`RANDOM`);
  player2.option(`AI1`);
  player2.selected(`RANDOM`);
}

function startGame() {
  createViewControls();
  board = new Board(4, 40);
  players[0] = new playerAI(player1.value(), 1);
  players[1] = new playerAI(player2.value(), 2);
  show();
  loop();
}

function show() {
  background(80);
  if (slider3DView.value() === 0) {
    board.show2d();
  } else {
    board.show3d();
  }
}
