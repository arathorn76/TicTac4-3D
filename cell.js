class Cell {
  constructor(x, y, z, size, gridsize) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.size3d = size;
    this.gridsize = gridsize;
    this.state = 0;

    this.scale2d = 0.9;

    let factor = this.gridsize * this.gridsize;
    this.size2d = floor(min(width / factor, height / factor));

    this.neighbors = [];
  }

  setNeighbors(neighborVectors) {
    for (let h = 0; h < neighborVectors.length; h++) {
      let line = neighborVectors[h];
      this.neighbors[h] = [];
      for (let nei of line) {
        if (this.validCell(this.x + nei.x, this.y + nei.y, this.z + nei.z)) {
          this.neighbors[h].push(nei);
        }
      }
    }
    //lines < 4 cells can be removed
    for (let h = this.neighbors.length - 1; h >= 0 ; h--) {
      if(this.neighbors[h].length < this.gridsize){
        this.neighbors.splice(h,1);
      }
    }
  }
  validCell(x, y, z) {
    var valid = true;
    if (x < 0 || x >= this.gridsize) {
      valid = false;
    }
    if (y < 0 || y >= this.gridsize) {
      valid = false;
    }
    if (z < 0 || z >= this.gridsize) {
      valid = false;
    }
    return valid;
  }

  play(player) {
    if (this.state === 0) {
      this.state = player;
      return true;
    } else {
      console.log("invalid move");
      return false;
    }
  }
  undo() {
    if (this.state === 0) {
      return false;
    } else {
      this.state = 0;
      return true;
    }
  }

  // functions specific to 2D-mode
  show2d() {
    let x = this.pos2d(this.x);
    let y = this.pos2d(this.y);
    let offset = floor((this.size2d / 2) * this.scale2d);

    switch (this.state) {
      case 1:
        // player 1
        noFill();
        rectMode(CENTER);
        rect(x + offset, y + offset, offset);
        fill(255, 100, 100, 100);
        break;

      case 2:
        // player 2
        noFill();
        ellipseMode(CENTER);
        ellipse(x + offset, y + offset, offset);
        fill(100, 255, 100, 100);
        break;

      case 3:
        // winning field of player 1
        fill(255, 0, 0);
        break;

      case 4:
        // winning field of player 2
        fill(0, 255, 0);
        break;

      default:
        fill(255, 255, 255);
    }

    rectMode(CORNER);
    rect(x, y, offset * 2);
  }

  clicked(mx, my) {
    let x = this.pos2d(this.x);
    let y = this.pos2d(this.y);

    if (mx >= x && mx <= x + this.size2d * this.scale2d) {
      if (my >= y && my <= y + this.size2d * this.scale2d) {
        return true;
      }
    }
    return false;
  }

  pos2d(dimension) {
    let pos =
      (dimension + this.gridsize * (this.z - this.gridsize / 2)) * this.size2d;
    return pos;
  }

  // functions specific to 3D-mode
  show3d() {
    let x = this.pos3d(this.x);
    let y = this.pos3d(this.y);
    let z = this.pos3d(this.z);
    push();
    rotateX(sliderX.value());
    rotateY(sliderY.value());
    rotateZ(sliderZ.value());
    translate(x, y, z);
    if (this.state === 1) {
      fill(255, 100, 100, 100);
      noStroke();
      sphere(this.size3d / 2);
      stroke(0);
    } else if (this.state === 2) {
      fill(100, 255, 100, 100);
      box(this.size3d / 2);
    } else if (this.state === 3) {
      fill(255, 100, 100);
      noStroke();
      sphere(this.size3d / 2);
      stroke(0);
    } else if (this.state === 4) {
      fill(100, 255, 100);
      box(this.size3d / 2);
    } else {
    }
    noFill();
    box(this.size3d);
    pop();
  }

  pos3d(dimension) {
    let pos = (dimension - this.gridsize * 0.5) * this.size3d;
    return pos;
  }
}
