class Bala {
  constructor(x, y) {
    this.posX = x;
    this.posY = y;
    this.tam = 10;
    this.vel = 8;
    this.activa = true;
  }

  mover() {
    if (this.activa === true) {
      this.posY = this.posY - this.vel;
      if (this.posY < -this.tam) this.activa = false;
    }
  }

  dibujar() {
    if (this.activa === true) {
      noStroke();
      fill(100, 200, 255);
      ellipse(this.posX, this.posY, this.tam, this.tam);
    }
  }
}
