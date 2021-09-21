let testVec;
const vectIdent = (element) => element.equals(testVec);

class Board {
  constructor(size, cellsize) {
    this.size = size;
    this.cellsize = cellsize;
    this.activePlayer = 1;
    this.winner = false;
    this.maxMoves = size * size * size;
    this.possibleMoves = [];

    this.cells = [];

    for (var i = 0; i < this.size; i++) {
      this.cells[i] = [];

      for (var j = 0; j < this.size; j++) {
        this.cells[i][j] = [];

        for (var k = 0; k < this.size; k++) {
          this.cells[i][j][k] = new Cell(i, j, k, this.cellsize, this.size);
          this.possibleMoves.push(createVector(i, j, k));
        }
      }
    }
  }

  show2d() {
    for (var i = 0; i < this.size; i++) {
      for (var j = 0; j < this.size; j++) {
        for (var k = 0; k < this.size; k++) {
          this.cells[i][j][k].show2d();
        }
      }
    }
  }

  clicked2d(mx, my) {
    for (var i = 0; i < this.size; i++) {
      for (var j = 0; j < this.size; j++) {
        for (var k = 0; k < this.size; k++) {
          if (this.cells[i][j][k].clicked(mx, my)) {
            return createVector(i, j, k);
          }
        }
      }
    }
    return false;
  }

  show3d() {
    for (var i = 0; i < this.size; i++) {
      for (var j = 0; j < this.size; j++) {
        for (var k = 0; k < this.size; k++) {
          this.cells[i][j][k].show3d();
        }
      }
    }
  }

  play(x, y, z, check4win = true) {
    if (!this.validCell(x, y, z)) {
      return false;
    }
    testVec = createVector(x, y, z);
    let index = this.possibleMoves.findIndex(vectIdent);
    if (debug) {
      console.log(testVec, index, this.possibleMoves.length);
    }
    var validMove = this.cells[x][y][z].play(this.activePlayer);

    if (validMove) {
      this.possibleMoves.splice(index, 1);
      if (check4win) {
        if (this.checkWinningMove(x, y, z)) {
          //GAME OVER
          this.maxMoves = 0;
          this.winner = this.activePlayer;
          return true;
        }
      }
      this.activePlayer = map(this.activePlayer, 1, 2, 2, 1);
      this.maxMoves--;
      return true;
    } else {
      return false;
    }
  }

  undo(x, y, z) {
    if (!this.validCell(x, y, z)) {
      return false;
    }
    if (this.cells[x][y][z].undo(this.activePlayer)) {
      this.activePlayer = map(this.activePlayer, 1, 2, 2, 1);
      this.maxMoves++;
      this.possibleMoves.push(createVector(x, y, z));
    }
  }

  movePossible() {
    return this.maxMoves > 0;
  }

  checkWinningMove(x, y, z, paint = true) {
    // some checking
    var count = 0;
    var left = true;
    var right = true;

    // cell has 13 neighboring lines
    // -> array of 13 vectors
    // -> for each vector...
    var neighborVectors = createNeighborVectors();

    // each neighboring line must be checked 3 positions in positiv and negativ direction
    var receive = 0;
    var vec = [];

    for (var j = 0; j < neighborVectors.length; j++) {
      count = 0;
      vec = neighborVectors[j];

      // zero-vector in mid-position is only used to make indexing easyer
      for (var i = 1; i < this.size; i++) {
        if (left) {
          receive = this.checkNeighbor(x, y, z, vec[this.size - i - 1]);
          if (receive < 0) {
            // if a cell-2-check is not a valid line this direction can be stopped
            // if a cell beeing checked has a different state this direction
            //    must be stopped without increment
            left = false;
          } else {
            // if a cell beeing checked has the same state as the original cell it is counted
            count = count + receive;
          }
        }
        left = true;

        if (right) {
          //console.log("Vector",this.size + i - 1,vec[this.size + i - 1])
          receive = this.checkNeighbor(x, y, z, vec[this.size + i - 1]);
          if (receive < 0) {
            right = false;
          } else {
            count = count + receive;
          }
        }
        right = true;
      }

      // if the count reaches 3 the move was winning
      if (count >= 3) {
        if (paint) {
          this.paintWinner(x, y, z, vec);
        }
        return true;
      }
    }
    // if the count does not reach 4 the move was not winning
    // -> do nothing
  }

  validCell(x, y, z) {
    var valid = true;
    if (x < 0 || x >= this.size) {
      valid = false;
    }
    if (y < 0 || y >= this.size) {
      valid = false;
    }
    if (z < 0 || z >= this.size) {
      valid = false;
    }
    return valid;
  }

  checkNeighbor(x, y, z, vec) {
    //console.log("check", x, y, z, vec);

    if (!this.validCell(x + vec.x, y + vec.y, z + vec.z)) {
      //console.log("check - invalid compund");
      return -1;
    }
    if (!this.validCell(x, y, z)) {
      //console.log("check - invalid cell");

      return -1;
    }
    //console.log("check indizes",x + vec.x,y + vec.y,z + vec.z);
    if (
      this.cells[x][y][z].state !=
      this.cells[x + vec.x][y + vec.y][z + vec.z].state
    ) {
      //console.log("check - not equal");

      return -1;
    } else {
      //console.log("check - equal");
      return 1;
    }
  }

  paintWinner(x, y, z, vec) {
    for (var i = 0; i < 7; i++) {
      vec[i].add(x, y, z);
      if (this.validCell(vec[i].x, vec[i].y, vec[i].z)) {
        this.cells[vec[i].x][vec[i].y][vec[i].z].state += 2;
      }
    }
  }
}

function createNeighborVectors() {
  //create an array of 13*7 vectors
  let directions = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
    [1, 1, 0],
    [1, -1, 0],
    [1, 0, 1],
    [1, 0, -1],
    [0, 1, 1],
    [0, 1, -1],
    [1, 1, 1],
    [1, 1, -1],
    [1, -1, 1],
    [1, -1, -1],
  ];

  let vectorField = [];

  for (var i = 0; i < 13; i++) {
    vectorField[i] = [];
    for (var j = 0; j < 7; j++) {
      //create individual vectors
      vectorField[i][j] = createVector(
        directions[i][0] * (j - 3),
        directions[i][1] * (j - 3),
        directions[i][2] * (j - 3)
      );
    }
  }
  return vectorField;
}
