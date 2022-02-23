let size = 4;

class Board {
  constructor(cellsize) {
    this.size = size;
    this.cellsize = cellsize;
    this.activePlayer = 1;
    this.otherPlayer = 2;
    this.winner = false;
    this.possibleMoves = [];

    this.neighborVectors = createNeighborVectors(this.size);
    this.cells = [];
    
    this.evaluation = new Evaluation();

    for (var i = 0; i < this.size; i++) {
      for (var j = 0; j < this.size; j++) {
        for (var k = 0; k < this.size; k++) {
          this.cells[ix(i,j,k)] = new Cell(i, j, k, this.cellsize, this.size);
          this.cells[ix(i,j,k)].setNeighbors(this.neighborVectors);
          this.possibleMoves.push(createVector(i, j, k));
          this.evaluation.addLines(this.cells[ix(i,j,k)]);
        }
      }
    }
    console.table(this.neighborVectors);
  }

  show2d() {
    for (var i = 0; i < this.cells.length; i++) {
          this.cells[i].show2d();
    }
  }

  clicked2d(mx, my) {
    for (var i = 0; i < this.cells.length; i++) {
           if (this.cells[i].clicked(mx, my)) {
            return createVector(this.cells[i].x, this.cells[i].y, this.cells[i].z);
      }
    }
    return false;
  }

  show3d() {
    for (var i = 0; i < this.cells.length; i++) {
          this.cells[i].show2d();
    }
  }

  play(x, y, z, check4win = true) {
    let testVec = createVector(x, y, z);
    let index = this.possibleMoves.findIndex((element) =>
      element.equals(testVec)
    );

    var validMove = this.cells[ix(x,y,z)].play(this.activePlayer);

    if (validMove) {
      this.possibleMoves.splice(index, 1);
      if (check4win) {
        if (this.checkWinningMove(x, y, z)) {
          //GAME OVER
          this.winner = this.activePlayer;
          return true;
        }
      }
      this.otherPlayer = this.activePlayer;
      this.activePlayer = map(this.activePlayer, 1, 2, 2, 1);
      return true;
    } else {
      return false;
    }
  }

  undo(x, y, z) {
    if (this.cells[ix(x,y,z)].undo(this.activePlayer)) {
      this.otherPlayer = this.activePlayer;
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
    for (vec of this.cells[ix(x,y,z)].neighbors) {
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


  checkNeighbor(x, y, z, vec, player = this.activPlayer) {
    //returns 0 if cell or neighbor cell is invalid or cell is empty
    //returns 1 if checked cell is owned by activePlayer
    //returns negative if cell is owned by opponent
    //(negative enough to pull any line with opposing forces negative)

    switch (this.cells[ix(vec.x,vec.y,vec.z)].state) {
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
      // vec.add(x, y, z);
      console.log(vec, x, y, z);
        this.cells[ix(vec.x,vec.y,vec.z)].state += 2;
    }
  }
} //end of class board


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

function ix(x,y,z){
  return x + y * size + z * size * size;
}
