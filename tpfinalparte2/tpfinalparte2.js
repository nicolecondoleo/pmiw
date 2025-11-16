// ================= GLOBAL: imágenes y sonidos (permitidos) =================
// instancia principal (necesaria para draw)
let juego;
let fondo, contexto, astronautaImg, explosionImg;
let fragmentosBuenos = [];
let fragmentosMalos = [];

// sonidos
let disparo, click, loop, explo;

// ================= PRELOAD =================
function preload() {
  fondo = loadImage("data/fondo.png");
  contexto = loadImage("data/contexto.png");
  astronautaImg = loadImage("data/astronauta.png");
  explosionImg = loadImage("data/explosion.png");

  for (let i = 0; i < 3; i++) {
    fragmentosBuenos[i] = loadImage("data/fragbueno" + (i + 1) + ".png");
    fragmentosMalos[i] = loadImage("data/fragmalo" + (i + 1) + ".png");
  }

  // sonidos
  disparo = loadSound("data/disparo.mp3");
  click = loadSound("data/click.mp3");
  loop = loadSound("data/loop.mp3");
  explo = loadSound("data/explo.mp3");
}

// ================= SETUP =================
function setup() {
  createCanvas(640, 480);
  juego = new Juego(fondo, contexto); // instancia principal
}

// ================= DRAW =================
function draw() {
  background(0);
  juego.dibujar();
}

// ================= TECLAS =================
function keyPressed() {
  // delego al juego; la lógica decide si mover/disparar según pantalla
  juego.keyPresionado(keyCode);
}

// ================= MOUSE =================
function mousePressed() {
  juego.mousePresionado();
}
