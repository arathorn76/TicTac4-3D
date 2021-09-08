class Cell {
  constructor(x, y, z, size) {
    this.xind = x / size + 2;
    this.yind = y / size + 2;
    this.zind = z / size + 2;
    
    this.x = x;
    this.y = y;
    this.z = z;
    this.size = size;
    this.state = 0;
  }

  show2d() {
    var scale = 0.8;
    var x = scale * (this.x - 4 * this.size * (this.z / this.size) - this.size);
    var y = scale * (this.y - 4 * this.size * (this.z / this.size) - this.size);

    if (this.state === 1) {
      noFill();
      rect(
        x + (this.size / 4) * scale,
        y + (this.size / 4) * scale,
        (this.size / 2) * scale
      );
      fill(255, 100, 100, 100);
    } else if (this.state === 2) {
      noFill();
      ellipseMode(CENTER);
      ellipse(
        x + (this.size / 2) * scale,
        y + (this.size / 2) * scale,
        (this.size / 2) * scale
      );
      fill(100, 255, 100, 100);
    } else if (this.state === 3) {
      fill(255, 0, 0);
    } else if (this.state === 4) {
      fill(0, 255, 0);
    } else {
      fill(255, 255, 255);
    }

    rect(x, y, this.size * scale);

    if (this.xind === 0 && this.yind === 0 && this.zind === 0) {
      fill(0, 0, 255);
      ellipseMode(CENTER);
      ellipse(
        x + (this.size / 2) * scale,
        y + (this.size / 2) * scale,
        (this.size / 2) * scale
      );
    }
  }

  show3d() {
    //rect(this.x , this.y , this.size);
    push();
    rotateX(sliderX.value());
    rotateY(sliderY.value());
    rotateZ(sliderZ.value());
    translate(this.x, this.y, this.z);
    if (this.state === 1) {
      fill(255, 100, 100, 100);
      sphere(this.size / 2);
    } else if (this.state === 2) {
      fill(100, 255, 100, 100);
      box(this.size / 2);
    } else {
      noFill();
      box(this.size);
    }

    pop();
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
}
