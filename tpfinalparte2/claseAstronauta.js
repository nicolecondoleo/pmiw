class Astronauta {
  constructor(posX, posY) {
    this.posX = posX;
    this.posY = posY;
    this.tam = 80;
    this.alto = this.tam;
    this.balas = [];
  }

  dibujar() {
    image(astronautaImg, this.posX, this.posY, this.tam, this.alto);

    for (this.i = 0; this.i < this.balas.length; this.i++) {
      this.balas[this.i].mover();
      this.balas[this.i].dibujar();

      if (this.balas[this.i].activa === false) {
        for (this.j = this.i; this.j < this.balas.length - 1; this.j++) {
          this.balas[this.j] = this.balas[this.j + 1];
        }
        this.balas.length = this.balas.length - 1;
        this.i = this.i - 1;
      }
    }
  }

  moverIzquierda() {
    this.posX = this.posX - 10;
    if (this.posX < 0) this.posX = 0;
  }

  moverDerecha() {
    this.posX = this.posX + 10;
    if (this.posX > width - this.tam) this.posX = width - this.tam;
  }

  dispararBala() {
    this.bX = this.posX + this.tam / 2;
    this.bY = this.posY;
    this.balas[this.balas.length] = new Bala(this.bX, this.bY);
      if (disparo && disparo.isLoaded()) {
      disparo.amp(0.9);       // << SUBÍ EL VOLUMEN ACÁ
      disparo.play();
    }
  }
}
