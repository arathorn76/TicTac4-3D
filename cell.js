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

    this.scale2d = 0.9;
    this.size2d = floor(min(width / 16, height / 16));
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

  // functions specific to 2D-mode
  show2d() {
    let x = this.xpos2d();//(this.xind + 4 * this.zind - 8) * this.size2d;
    let y = (this.yind + 4 * this.zind - 8) * this.size2d;

    if (this.state === 1) {
      noFill();
      rect(
        x + (this.size2d / 4) * this.scale2d,
        y + (this.size2d / 4) * this.scale2d,
        (this.size2d / 2) * this.scale2d
      );
      fill(255, 100, 100, 100);
    } else if (this.state === 2) {
      noFill();
      ellipseMode(CENTER);
      ellipse(
        x + (this.size2d / 2) * this.scale2d,
        y + (this.size2d / 2) * this.scale2d,
        (this.size2d / 2) * this.scale2d
      );
      fill(100, 255, 100, 100);
    } else if (this.state === 3) {
      fill(255, 0, 0);
    } else if (this.state === 4) {
      fill(0, 255, 0);
    } else {
      fill(255, 255, 255);
    }

    rect(x, y, this.size2d * this.scale2d);

    // mark cell 0,0,0
    if (this.xind === 0 && this.yind === 0 && this.zind === 0) {
      fill(0, 0, 255);
      ellipseMode(CENTER);
      ellipse(
        x + (this.size2d / 2) * this.scale2d,
        y + (this.size2d / 2) * this.scale2d,
        (this.size2d / 2) * this.scale2d
      );
    }
  }

  clicked(mx, my) {
    //let size2d = min(width / 16, height / 16);
    let x = this.xpos2d();
    let y = (this.yind + 4 * this.zind - 8) * this.size2d;

    if (mx >= x && mx <= (x + (this.size2d * this.scale2d))) {
      if (my >= y && my <= (y + (this.size2d  * this.scale2d))) {
        return true;
        box(x,y,(x + this.size2d) * this.scale2d );
      }
    }
    return false;
  }
  
  xpos2d(){
    let x = (this.xind + 4 * this.zind - 8) * this.size2d;
    return x;
  }
  // functions specific to 3D-mode
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
}
