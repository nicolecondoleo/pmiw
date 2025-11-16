class Juego {
  constructor(fondoImg, contextoImg) {
    // imágenes
    this.fondo = fondoImg;
    this.contexto = contextoImg;

    this.pantalla = "inicio"; // "inicio", "contexto", "instrucciones", "juego", "gameover", "ganaste"

    // botones (tamaño)
    this.botonAncho = 220;
    this.botonAlto = 70;

    // astronauta
    this.astronauta = new Astronauta(width / 2 - 40, height - 110);

    // fragmentos (array)
    this.fragmentos = [];

    this.totalFragmentos = 12;
    this.vidas = 3;
    this.inicioFrame = 0;
    this.duracionFrames = 60 * 60; // 1 minuto en frames

    // explosión
    this.mostrarExplosion = false;
    this.explosionX = 0;
    this.explosionY = 0;
    this.explosionFrame = 0;
  }

  dibujar() {
    if (this.pantalla === "inicio") this.mostrarInicio();
    else if (this.pantalla === "contexto") this.mostrarContexto();
    else if (this.pantalla === "instrucciones") this.mostrarInstrucciones();
    else if (this.pantalla === "juego") this.mostrarJuego();
    else if (this.pantalla === "gameover") this.mostrarGameOver();
    else if (this.pantalla === "ganaste") this.mostrarGanaste();
  }
  mostrarInicio() {
    image(this.fondo, 0, 0, width, height);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(52);
    text("FRAGMENTADOS", width / 2, height / 2 - 40);
    this.dibujarBoton(width / 2, height / 2 + 60, "INICIAR");
  }
  mostrarContexto() {
    image(this.contexto, 0, 0, width, height);

    fill(0, 0, 0, 170);
    rectMode(CENTER);
    rect(width / 2, height / 2 - 20, 520, 160, 18);

    fill(255);
    textAlign(CENTER, TOP);
    textSize(22);
    // dos líneas explícitas para evitar recortes
    text("La nave estalló y los astronautas quedan dispersos,", width / 2, height / 2 - 60);
    text("ahora deberán esquivar todos los fragmentos.", width / 2, height / 2 - 30);

    this.dibujarBoton(width / 2, height / 2 + 70, "SIGUIENTE");
  }

mostrarInstrucciones() {
  image(this.fondo, 0, 0, width, height);

  rectMode(CORNER);
  fill(0, 0, 0, 170);
  rect(width / 2 - 280, height / 2 - 170, 560, 340, 18);

  // TÍTULO
  textAlign(CENTER, TOP);
  textSize(26);
  fill(135, 211, 247);
  text("INSTRUCCIONES:", width / 2, height / 2 - 150);

  // TEXTO (FUNCIONA AHORA)
  fill(255);
  textSize(17);
  text(
    "Sobreviví durante un minuto esquivando y disparando fragmentos.\n\n" +
      "Mover: Flechas izquierda / derecha\n" +
      "Disparar: Barra espaciadora\n\n" +
      "Evitar los fragmentos: todos quitan vidas al tocarlos.\n" +
      "Tené cuidado con los fragmentos rojos: explotan al dispararlos.",
    width / 2 - 260,
    height / 2 - 120,
    520,
    300
  );

  rectMode(CENTER);
  this.dibujarBoton(width / 2, height / 2 + 150, "JUGAR");
}

  iniciarJuego() {
    // cambiar pantalla
    this.pantalla = "juego";

    // reiniciar astronauta y fragmentos
    this.astronauta = new Astronauta(width / 2 - 40, height - 110);
    this.fragmentos = [];
    this.vidas = 3;

    // crear fragmentos (12)
    for (this.i = 0; this.i < this.totalFragmentos; this.i++) {
      this.tipo = "bueno";
      this.img = fragmentosBuenos[int(random(3))];
      if (random(1) < 0.5) {
        this.tipo = "malo";
        this.img = fragmentosMalos[int(random(3))];
      }
      this.fragmentos[this.fragmentos.length] = new Fragmento(
        random(20, width - 80),
        random(-600, -50),
        this.img,
        this.tipo
      );
    }
    this.inicioFrame = frameCount;

    // iniciar música de loop para el juego
    if (loop && loop.isLoaded) {
      loop.stop();
      loop.amp(0.35);
      loop.loop();
    }
  }

  mostrarJuego() {
    image(this.fondo, 0, 0, width, height);

    // HUD
    fill(255);
    textSize(18);
    textAlign(LEFT, TOP);
    text("Vidas: " + this.vidas, 20, 14);

    this.segundosPasados = int((frameCount - this.inicioFrame) / 60);
    this.restante = 60 - this.segundosPasados;
    if (this.restante < 0) this.restante = 0;
    textAlign(RIGHT, TOP);
    text("Tiempo: " + this.restante + " s", width - 20, 14);

    // astronauta + balas
    this.astronauta.dibujar();

    // fragmentos: mover, dibujar, colisiones
    for (this.i = 0; this.i < this.fragmentos.length; this.i++) {
      this.fragmentos[this.i].mover();
      this.fragmentos[this.i].dibujar();

      // colisión astronauta <-> fragmento -> pierde vida
      this.cxA = this.astronauta.posX + this.astronauta.tam / 2;
      this.cyA = this.astronauta.posY + this.astronauta.alto / 2;
      this.cxF = this.fragmentos[this.i].x + this.fragmentos[this.i].tam / 2;
      this.cyF = this.fragmentos[this.i].y + this.fragmentos[this.i].tam / 2;

      this.d = dist(this.cxA, this.cyA, this.cxF, this.cyF);

      if (this.d < (this.astronauta.tam / 2 + this.fragmentos[this.i].tam / 3)) {
        this.vidas = this.vidas - 1;
        this.fragmentos[this.i].reiniciar();
        if (this.vidas <= 0) {
          if (loop && loop.isPlaying()) loop.stop();
          this.pantalla = "gameover";
          return;
        }
      }

      // colisión bala <-> fragmento
      for (this.j = 0; this.j < this.astronauta.balas.length; this.j++) {
        if (this.astronauta.balas[this.j].activa === true) {
          this.db = dist(
            this.astronauta.balas[this.j].posX,
            this.astronauta.balas[this.j].posY,
            this.cxF,
            this.cyF
          );

          if (this.db < this.fragmentos[this.i].tam / 2) {
            if (this.fragmentos[this.i].tipo === "bueno") {
              this.fragmentos[this.i].reiniciar();
              this.astronauta.balas[this.j].activa = false;
            } else {
              // frag malo: resta vida, explosion sonora y visual
              this.vidas = this.vidas - 1;
              this.fragmentos[this.i].reiniciar();
              this.astronauta.balas[this.j].activa = false;

              if (explo && explo.isLoaded) {
                explo.amp(0.4);
                explo.play();
              }

              this.mostrarExplosion = true;
              this.explosionX = this.cxF - 150;
              this.explosionY = this.cyF - 150;
              this.explosionFrame = frameCount;

              if (this.vidas <= 0) {
                if (loop && loop.isPlaying()) loop.stop();
                this.pantalla = "gameover";
                return;
              }
            }
          }
        }
      }
    }

    // dibujar explosión (duración visible)
    if (this.mostrarExplosion && frameCount - this.explosionFrame < 30) {
      image(explosionImg, this.explosionX, this.explosionY, 300, 300);
    } else {
      this.mostrarExplosion = false;
    }

    // si completa el tiempo: ganaste
    if (frameCount - this.inicioFrame > this.duracionFrames) {
      if (loop && loop.isPlaying()) loop.stop();
      this.pantalla = "ganaste";
    }
  }

  // ---------- PANTALLA: GAME OVER ----------
  mostrarGameOver() {
    image(this.fondo, 0, 0, width, height);

    fill(0, 150);
    rectMode(CENTER);
    rect(width / 2, height / 2 - 10, 420, 200, 20);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(48);
    text("GAME OVER", width / 2, height / 2 - 50);

    this.dibujarBoton(width / 2, height / 2 + 40, "VOLVER A JUGAR");
  }

  // ---------- PANTALLA: GANASTE ----------
  mostrarGanaste() {
    image(this.fondo, 0, 0, width, height);

    fill(0, 150);
    rectMode(CENTER);
    rect(width / 2, height / 2 - 10, 420, 200, 20);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(48);
    text("¡GANASTE!", width / 2, height / 2 - 50);

    this.dibujarBoton(width / 2, height / 2 + 40, "VOLVER AL INICIO");
  }

  // ---------- DIBUJAR BOTÓN (centrado en cx,cy) ----------
  dibujarBoton(cx, cy, texto) {
    rectMode(CENTER);
    this.w = this.botonAncho;
    this.h = this.botonAlto;

    if (mouseX > cx - this.w / 2 && mouseX < cx + this.w / 2 &&
        mouseY > cy - this.h / 2 && mouseY < cy + this.h / 2) {
      fill(135, 211, 247);
    } else {
      fill(132, 157, 196);
    }

    noStroke();
    rect(cx, cy, this.w, this.h, 12);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(22);
    text(texto, cx, cy);
  }

  // ---------- MOUSE PRESIONADO (maneja clicks en botones) ----------
  mousePresionado() {
    // INICIO -> CONTEXTO
    if (this.pantalla === "inicio" && this.enBoton(width / 2, height / 2 + 60)) {
      if (click && click.isLoaded) { click.amp(1); click.play(); }
      this.pantalla = "contexto";
      return;
    }

    // CONTEXTO -> INSTRUCCIONES
    if (this.pantalla === "contexto" && this.enBoton(width / 2, height / 2 + 70)) {
      if (click && click.isLoaded) { click.amp(1); click.play(); }
      this.pantalla = "instrucciones";
      return;
    }

    // INSTRUCCIONES -> JUGAR
    if (this.pantalla === "instrucciones" && this.enBoton(width / 2, height / 2 + 150)) {
      if (click && click.isLoaded) { click.amp(1); click.play(); }
      this.iniciarJuego();
      return;
    }

    // GAMEOVER -> REINICIAR (JUGAR)
    if (this.pantalla === "gameover" && this.enBoton(width / 2, height / 2 + 40)) {
      if (click && click.isLoaded) { click.amp(1); click.play(); }
      this.iniciarJuego();
      return;
    }

    // GANASTE -> VOLVER AL INICIO
    if (this.pantalla === "ganaste" && this.enBoton(width / 2, height / 2 + 40)) {
      if (click && click.isLoaded) { click.amp(1); click.play(); }
      this.pantalla = "inicio";
      return;
    }

    // durante el juego los clicks no navegan; si querés click para disparar, lo habilito
  }

  enBoton(cx, cy) {
    this.w = this.botonAncho;
    this.h = this.botonAlto;
    return (mouseX > cx - this.w / 2 && mouseX < cx + this.w / 2 &&
            mouseY > cy - this.h / 2 && mouseY < cy + this.h / 2);
  }

  // ---------- KEY PRESIONADO (delegado desde global keyPressed) ----------
  keyPresionado(kc) {
    if (this.pantalla === "juego") {
      if (kc === LEFT_ARROW) this.astronauta.moverIzquierda();
      if (kc === RIGHT_ARROW) this.astronauta.moverDerecha();
      if (kc === 32) {
        // disparo por barra espaciadora
        this.astronauta.dispararBala();
        if (disparo && disparo.isLoaded) { disparo.amp(0.25); disparo.play(); }
      }
    }

    // reiniciar con ENTER desde gameover o ganaste
    if ((this.pantalla === "gameover" || this.pantalla === "ganaste") && kc === ENTER) {
      this.reiniciarAGInicio();
    }
  }

  reiniciarAGInicio() {
    this.pantalla = "inicio";
    this.vidas = 3;
    this.fragmentos = [];
    this.inicioFrame = 0;
    this.mostrarExplosion = false;
  }
}

