class Fragmento {
  constructor(x, y, img, tipo) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.tipo = tipo; // "bueno" o "malo"
    this.tam = 60;
    this.vel = random(1, 3); // velocidad aumentada
  }

  mover() {
    this.y = this.y + this.vel;
    if (this.y > height + this.tam) this.reiniciar();
  }

  dibujar() {
    image(this.img, this.x, this.y, this.tam, this.tam);
  }

  reiniciar() {
    this.x = random(20, width - 80);
    this.y = random(-600, -50);
    this.vel = random(1, 3);
  }
}
