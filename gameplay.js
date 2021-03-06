class playerAI {
  constructor(type_, id_) {
    /* possible types:
        HUMAN  - doesn´t do a thing, is just a placeholder
        RANDOM - choses a random available cell
        AI1 - Minimax approach using alpha-beta and maximum depth constriction
     */
    this.type = type_;
    this.id = id_;
    this.evals = {
      row4: 1000,
      row2: 3,
      row3: 10,
      multirow3: 10,
      noGood: 0,
    };
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
    let maxDepth = 2;
    let alpha = -Infinity;
    let beta = Infinity;
    let lastMove;

    let playerEval = board.activePlayer;

    for (let move of board.possibleMoves) {
      let score = -Infinity;
      score = this.minimax(
        //board,
        move,
        maxDepth,
        true,
        playerEval,
        alpha,
        beta
      );
      if (debug) {
        console.log("MakeMove", move, score);
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
    if (debug) {
      console.log(`Move: ${bestMove} Value: ${bestScore}`);
    }
    board.play(bestMove.x, bestMove.y, bestMove.z);
  }

  minimax(move, depth, isMaximizer, playerEval, alpha, beta) {
    // print(alpha,beta);
    // update and check depth
    let actualDepth = depth;
    actualDepth--;
    if (debug) {
      console.log(`move ${move} Max = ${isMaximizer} depth = ${actualDepth}`);
    }
    if (actualDepth < 0) {
      // evaluate the board, return actual evaluation value
      return this.minimaxEvaluateBoardState(playerEval);
    }
    // make the move that is beeing checked
    // at every subsequent return the move MUST be undone
    board.play(move.x, move.y, move.z, false);

    // check if this move is winning, return if so
    if (board.checkWinningMove(move.x, move.y, move.z, false)) {
      board.undo(move.x, move.y, move.z);
      let winValue = this.evals.row4;
      if (!isMaximizer) {
        winValue *= -1;
      }
      if (debug) {
        console.log(`WinValue`, winValue);
      }
      return winValue;
    }

    // pick a move for the other player
    let bestScore = alpha;
    let bestMove;
    let lastMove;

    if (isMaximizer) {
      for (let move of board.possibleMoves) {
        let score = -Infinity;

        score = this.minimax(
          // board,
          move,
          actualDepth,
          !isMaximizer,
          playerEval,
          bestScore, // alpha
          beta
        );
        bestScore = max(bestScore, score);
        lastMove = move.copy();
        if (bestScore >= beta) {
          break;
        }
      }
    } else {
      bestScore = beta;
      for (let move of board.possibleMoves) {
        let score = Infinity;
        score = this.minimax(
          // board,
          move,
          actualDepth,
          !isMaximizer,
          playerEval,
          alpha,
          bestScore // beta
        );
        bestScore = min(bestScore, score);
        lastMove = move.copy();
        if (bestScore <= alpha) {
          break;
        }
      }
    }
    // catch all for development purpose
    board.undo(move.x, move.y, move.z);
    return bestScore;
  }

  minimaxEvaluateBoardState(playerEval) {
    //Evaluation prinziple:
    //starting points are only available cells
    //(value lies in the fact that this line can be completed)
    let boardValue = 0;
    for (let cell of board.possibleMoves) {
      let cellValue = 0;
      //check all lines with this cell
      let neighborVectors = board.cells[ix(cell.x,cell.y,cell.z)].neighbors;
      for (let vector of neighborVectors) {
        let lineValue = 0;
        let lineFlags = 0;
if(debug && cell.x === 3 && cell.y === 3 && cell.z === 1){
  }
        for (let neighbor of vector) {
          let receive = board.checkNeighbor(
            cell.x,
            cell.y,
            cell.z,
            neighbor,
            playerEval
          );
          lineFlags += receive;
        } //end neighbor of line
        // lineValue = lineFlags;
        switch (lineFlags) {
          // case 1:
          //   break;
          // case 2:
          //   lineValue += this.evals.row2;
          //   break;
          case 3:
            lineValue += this.evals.row3;
            break;
          case 4:
            lineValue += this.evals.row4;
          // case -2:
          //   lineValue += this.evals.noGood;
          //   break;
          // case -3:
          //   lineValue += this.evals.noGood;
          //   break;
          // case -4:
          //   lineValue += this.evals.noGood;
          //   break;
          // case -7:
          //   lineValue += this.evals.noGood;
          //   break;
          // case -8:
          //   lineValue -= this.evals.row2;
          //   break;
          case -12:
            lineValue -= this.evals.row3 * 2;
            break;
          case -16:
            lineValue -= this.evals.row4;
          default:
        } //end switch
        cellValue += lineValue;
      } //vector of neighborVectors

      //acumulate cellValues to build boardValue;
      boardValue += cellValue;
    }
    if(debug){
      console.log(`Evaluation for ${playerEval} result ${boardValue}`);
    }
    return boardValue;
  }
}
