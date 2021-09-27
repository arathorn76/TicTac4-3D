class Board {
  constructor(size, cellsize) {
    this.size = size;
    this.cellsize = cellsize;
    this.activePlayer = 1;
    this.winner = false;
    this.possibleMoves = [];

    this.neighborVectors = createNeighborVectors(4);
    this.cells = [];

    for (var i = 0; i < this.size; i++) {
      this.cells[i] = [];

      for (var j = 0; j < this.size; j++) {
        this.cells[i][j] = [];

        for (var k = 0; k < this.size; k++) {
          this.cells[i][j][k] = new Cell(i, j, k, this.cellsize, this.size);
          this.cells[i][j][k].setNeighbors(this.neighborVectors);
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
    let testVec = createVector(x, y, z);
    let index = this.possibleMoves.findIndex((element) =>
      element.equals(testVec)
    );

    var validMove = this.cells[x][y][z].play(this.activePlayer);

    if (validMove) {
      this.possibleMoves.splice(index, 1);
      if (check4win) {
        if (this.checkWinningMove(x, y, z)) {
          //GAME OVER
          this.winner = this.activePlayer;
          return true;
        }
      }
      this.activePlayer = map(this.activePlayer, 1, 2, 2, 1);
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
      this.possibleMoves.push(createVector(x, y, z));
    }
  }

  movePossible() {
    return this.possibleMoves.length > 0;
  }

  checkWinningMove(x, y, z, paint = true) {
    // some checking
    var count = 0;

    // cell has 13 neighboring lines
    // -> array of 13 lines
    // each neighboring line must be checked <this.size> positions
    // in positiv and negativ direction
    // -> array of 13 lines * [( 2 * this.size ) - 1] points
    // var neighborVectors = createNeighborVectors(this.size);

    var receive = 0;
    var vec = [];

    //check all lines
    for (vec of this.neighborVectors) {
      count = 0;
      //check all points in line
      for (let vector of vec) {
        receive = this.checkNeighbor(x, y, z, vector, this.activePlayer);
        if (receive > 0) {
          count += receive;
        }
      }

      // if the count reaches this.size the move was winning
      if (count === this.size) {
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

  checkNeighbor(x, y, z, vec, player = this.activPlayer) {
    //returns 0 if cell or neighbor cell is invalid or cell is empty
    //returns 1 if checked cell is owned by activePlayer
    //returns negative if cell is owned by opponent
    //(negative enough to pull any line with opposing forces negative)
    if (!this.validCell(x + vec.x, y + vec.y, z + vec.z)) {
      return 0;
    }
    if (!this.validCell(x, y, z)) {
      return 0;
    }

    switch (this.cells[x + vec.x][y + vec.y][z + vec.z].state) {
      case player:
        return 1;
      case 0:
        return 0;
      default:
        return -4;
    }
  }

  paintWinner(x, y, z, vectorarray) {
    for (let vec of vectorarray) {
      vec.add(x, y, z);
      console.log(vec, x, y, z);
      if (this.validCell(vec.x, vec.y, vec.z)) {
        this.cells[vec.x][vec.y][vec.z].state += 2;
      }
    }
  }
} //end of class board


class NeighborVectors{
  constructor(size){
  }
  

}
function createNeighborVectors(size) {
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

  //  for(let dir of directions){
  for (var i = 0; i < directions.length; i++) {
    vectorField[i] = [];
    for (var j = 0; j < 2 * size - 1; j++) {
      //create individual vectors
      vectorField[i][j] = createVector(
        directions[i][0] * (j + 1 - size),
        directions[i][1] * (j + 1 - size),
        directions[i][2] * (j + 1 - size)
      );
    }
  }
  return vectorField;
}
