class Evaluation {
  constructor() {
    this.lines = [];
    this.values = [];

    // TODO 3* 16 Linien parallel zu den Achsen
    // TODO 6* 4 FlächenDiagonalen
    // TODO 4 Raumdiagonalen
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
        this.values.push(new Values());
      }
    }
  }

  updateValues(cell) {
    let vec = createVector(cell.x, cell.y, cell.z);
    // find all lines containing cell
    for (let i = 0; i < this.lines.length; i++) {
      let update = false;
      for (let point of (line = this.lines[i])) {
        if (vec.equals(point)) {
          // evaluate each of those lines
          this.evalLine(i);
        }
      }
    }

    // set the values for each evaluated line
  }

  evalLine(idx) {
    let lineVal = new Values();
    // line evaluation
    lineVal.player1 += 5;
    lineVal.player2 += 5;

    this.values[idx] = lineVal;
  }

  getCellValues(cell) {
    let cellVal = new Values();
    // find all lines containing cell

    // sum values for those lines

    // return values object
  }

  getBoardValues() {
    let boardVal = new Values();

    // sum values for all lines
    for (let v of this.values) {
      boardVal.add(v);
    }

    return boardVal;
  }
}

class Values {
  constructor() {
    this.player1 = 0;
    this.player2 = 0;
  }

  add(other) {
    this.player1 += other.player1;
    this.player2 += other.player2;
  }
}
