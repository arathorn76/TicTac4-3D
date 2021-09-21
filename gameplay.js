class playerAI {
  constructor(type_, id_) {
    /* possible types:
        HUMAN  - doesn´t do a thing, is just a placeholder
        RANDOM - choses a random available cell
     */
    this.type = type_;
    this.id = id_;
    this.evals = { WIN: Infinity, row2: 3, row3: 10, multirow3: 10 };
  }

  makeMove() {
    switch (this.type) {
      case "HUMAN":
        // do nothing
        break;
      case "RANDOM":
        this.makeMoveRandom();
        break;
      case "AI1":
        this.makeMoveMinimax1();
        break;
      default:
        console.log(`What am I?`);
    }
  }

  makeMoveRandom() {
    let move = random(board.possibleMoves);
    board.play(move.x, move.y, move.z);
  }

  makeMoveMinimax1() {
    let bestScore = -Infinity;
    let bestMove;
    let maxDepth = 1;
    let lastMove;

    for (let move of board.possibleMoves) {
      if (debug) {
        console.log(move);
      }
      let score = -Infinity;
      score = this.minimax(board, move, maxDepth, true);
      if (debug) {
        print(move, score);
      }
      if (score > bestScore) {
        bestMove = move.copy();
        bestScore = score;
      }
      lastMove = move.copy();
    }
    if (!bestMove) {
      bestMove = lastMove.copy();
    }
    board.play(bestMove.x, bestMove.y, bestMove.z);
  }

  minimax(board, move, depth, isMaximizer) {
    // update and check depth
    let actualDepth = depth;
    actualDepth--;
    if (actualDepth < 0) {
      //   print("depth exceeded");
      // evaluate the board, return actual evaluation value
      return this.minimaxEvaluateBoardState();
      //return -1000;
    }

    // make the move that is beeing checked
    // at every subsequent return the move MUST be undone
    board.play(move.x, move.y, move.z, false);

    // check if this move is winning, return if so
    if (board.checkWinningMove(move.x, move.y, move.z, false)) {
      //  if (board.winner) {
      board.undo(move.x, move.y, move.z);
      return this.evals["WIN"];
    }

    // pick a move for the other player
    let bestScore = -Infinity;
    let bestMove;
    let lastMove;

    for (let i = 0; i < board.size; i++) {
      for (let j = 0; j < board.size; j++) {
        for (let k = 0; k < board.size; k++) {
          let move = createVector(i, j, k);
          let score = -Infinity;
          if (board.cells[move.x][move.y][move.z].state === 0) {
            score = this.minimax(board, move, actualDepth, !isMaximizer);
            //   print(move, score);
            if (score > bestScore) {
              bestMove = move.copy();
              bestScore = score;
            }
            lastMove = move.copy();
          }
        }
      }
    }
    if (!isMaximizer) {
      bestScore *= -1;
    }
    // catch all for development purpose
    board.undo(move.x, move.y, move.z);
    return bestScore;
  }

  minimaxEvaluateBoardState() {
    let value = 0;
    for (let i = 0; i < board.size; i++) {
      for (let j = 0; j < board.size; j++) {
        for (let k = 0; k < board.size; k++) {
          let cell = board.cells[i][j][k];
          if (cell.state === 0) {
            // evaluate further
          }
        }
      }
    }
    return value;
  }
}
