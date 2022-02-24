class Evaluation {
  constructor() {
    this.lines = [];
    this.values = [];

    this.evals = {
      row1: 1,
      row2: 3,
      row3: 10,
      row4: 10000,
      multirow3: 10,
      noGood: 0,
    };
  }

  addLines(cell) {
    for (let newLine of cell.neighbors) {
      // Suchen, ob es diese Zeile schon gibt
      let pushIt = true;
      for (let i = 0; i < this.lines.length; i++) {
        let lineExists = 0;
        for (let j = 0; j < newLine.length; j++) {
          for (let k = 0; k < this.lines[i].length; k++) {
            if (this.lines[i][k].equals(newLine[j])) {
              //passenden Merker setzen
              lineExists += 1;
            }
          }
        }
        if (lineExists == newLine.length) {
          pushIt = false;
        }
      }
      if (pushIt) {
        this.lines.push(newLine);
        this.values.push(new Values(this.values.length));
      }
    }
  }

  updateValues(cell) {
    let vec = createVector(cell.x, cell.y, cell.z);
    // find all lines containing cell
    for (let i = 0; i < this.lines.length; i++) {
      let update = false;
      for (let point of this.lines[i]) {
        if (vec.equals(point)) {
          // evaluate each of those lines
          // and set the values for each evaluated line
          this.evalLine(i);
          break;
        }
      }
    }
  }

  evalLine(idx) {
    let lineVal = new Values(idx);
    let counterP1 = 0;
    let counterP2 = 0;
    // line evaluation
    // lineVal.player1 += 5;
    // lineVal.player2 += 5;
    let evalLine = this.lines[idx];
    for (let c of evalLine) {
      switch (board.cells[ix(c.x, c.y, c.z)].state) {
        case 1:
          counterP1++;
          break;
        case 2:
          counterP2++;
          break;
        default:
        // do nothing
      }
      if (counterP1 > 0 && counterP2 > 0) {
        // no player can complete this line => no value added
      } else if (counterP1 > 0) {
        switch (counterP1) {
          case 1:
            lineVal.player1 += this.evals.row1;
            break;
          case 2:
            lineVal.player1 += this.evals.row2;
            break;
          case 3:
            lineVal.player1 += this.evals.row3;
            break;
          case 4:
            lineVal.player1 = this.evals.row4;
            // console.log("win1");
            break;
          default:
          //do nothing
        }
      } else if (counterP2 > 0) {
        switch (counterP2) {
          case 1:
            lineVal.player2 += this.evals.row1;
            break;
          case 2:
            lineVal.player2 += this.evals.row2;
            break;
          case 3:
            lineVal.player2 += this.evals.row3;
            break;
          case 4:
            lineVal.player2 = this.evals.row4;
            // console.log("win2");
            break;
          default:
          //do nothing
        }
      }
    }

    this.values[idx] = lineVal;
  }

  getCellValues(cell) {
    let cellVal = new Values();
    let vec = createVector(cell.x, cell.y, cell.z);
    // find all lines containing cell
    for (let i = 0; i < this.lines.length; i++) {
      let update = false;
      for (let point of this.lines[i]) {
        if (vec.equals(point)) {
          // sum values for those lines
          cellVal.add(this.values[i]);
        }
      }
    }
    return cellVal;
  }

  getBoardValues() {
    let boardVal = new Values();

    // sum values for all lines
    for (let v of this.values) {
      boardVal.add(v);
    }

    return boardVal;
  }
  getBoardValuesString() {
    let boardVal = this.getBoardValues();
    return `Player1: ${boardVal.player1}, Player2: ${boardVal.player2}`;
  }

  getBoardValue(player) {
    let temp = this.getBoardValues();
    switch (player) {
      case 1:
        return temp.player1 - temp.player2;
        break;
      case 2:
        return temp.player2 - temp.player1;
        break;
      default:
        return undefined;
    }
  }
}

class Values {
  constructor( idx = 0) {
    this.player1 = 0;
    this.player2 = 0;
    this.idx = idx;
  }

  add(other) {
    this.player1 += other.player1;
    this.player2 += other.player2;
    if(other.player1 > 1000 || other.player2 > 1000){
      this.idx = other.idx;
    }
  }
}
