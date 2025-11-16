//Alumnas: Alessandra Angiolillo y Nicole Condoleo
//Comisión 1
//Link Youtube: https://www.youtube.com/watch?v=nj-49eN_7dI

//VARIABLES GLOBALES DE AUDIO
let inicio_snd; 
let boton_snd;

//Variable booleana
let sonando = false; 

//VARIABLES GLOBALES DE NAVEGACIÓN Y CONTENIDO
let imagenes = [];           
let lineasCreditos = [];     
let estado = 0;              
let creditosY = 0;           
let frameInicio = 0;         
let finY = -50;              
let Y_FINAL_FIN = 100;       

//Arreglo que contiene el texto de la narrativa para cada estado
let frases = [
'La nave estalló y los astronautas quedan dispersos',  // ESTADO 1 (img1)
'Primer contacto entre ellos',                       // ESTADO 2 (img2) 
'',                                                  // ESTADO 3 (img3)
'',                                                  // ESTADO 4 (img4) 
'El puño metálico de Hollis aplastó la cara del compañero', // ESTADO 5 (img5)
'Hollis intenta calmar y cesar los gritos de sus compañeros',// ESTADO 6 (img6)
'Se arma disputa entre ellos',                       // ESTADO 7 (img7)
'',                                                  // ESTADO 8 (img8)
'Hollis se aleja solo hacia la Tierra',              // ESTADO 9 (img9)
'Al momento de caer, un niño lo confunde con una estrella fugaz', // ESTADO 10 (img10)
'El niño pide el deseo de "nunca olvidar a los muertos"',    // ESTADO 11 (img11)
''                                                   // ESTADO 12 (img12)
];

let totalPantallas = 13; 

//Carga de archivos
function preload() {
inicio_snd = loadSound('data/naveinicio.mp3'); 
boton_snd = loadSound('data/naveboton.mp3'); 

for (let i = 0; i < totalPantallas; i++) {
imagenes[i] = loadImage("data/img" + i + ".jpg"); 
} 
} 

function setup() {
createCanvas(640, 480);    
textAlign(CENTER, CENTER);  
textSize(20);              
frameInicio = frameCount;  

inicio_snd.amp(0.5); 
boton_snd.amp(0.3);

sonando = false; 
}

function draw() {
background(0); 

if (imagenes[estado]) {
image(imagenes[estado], 0, 0, width, height); 
}

///LÓGICA DEL ESTADO INICIO (estado === 0)
if (estado === 0) {
let framesTranscurridos = frameCount - frameInicio; 

//Acelerado a 50 frames para el fade-in
let opacidad = map(framesTranscurridos, 0, 50, 0, 255);  
opacidad = constrain(opacidad, 0, 255);                   

fill(255, opacidad);   
textSize(56);          
textStyle(BOLD);       
text("CALIDOSCOPIO", width / 2, height / 2 - 40); 
textSize(20);          
textStyle(BOLD);
text("Ray Bradbury", width / 2, height / 2);

if (opacidad >= 250) { 
botonilli(width / 2 - 75, height / 2 + 20, 150, 50, "INICIAR"); 
}

} else {

///LÓGICA DE PANTALLAS DE NARRATIVA (estado > 0)
fill(255);           
textSize(20);        
textStyle(BOLD);

let indiceFrase = estado - 1; 

if (indiceFrase >= 0 && indiceFrase < frases.length && frases[indiceFrase] !== '') {
text(frases[indiceFrase], width / 2, height - 30); 
}

//Estado 8 (Texto de dos líneas)
if (estado === 8) {
fill(255);      
textSize(20);   
textStyle(BOLD);

let centroX = width / 2;
let separacion = 40; 
let linea2Y = height - 30; 
let linea1Y = linea2Y - separacion;

text("Mueren solos, sin esperanza,", centroX, linea1Y); 
text("en el olvido del espacio.", centroX, linea2Y);     
textStyle(NORMAL);
}

//Última pantalla
if (estado === 12) {
let Y_FINAL_CREDITOS = 300; 
let velocidad_creditos = 1; 
let velocidad_fin = 5;

if (finY < Y_FINAL_FIN) {
finY += velocidad_fin;
if (finY > Y_FINAL_FIN) finY = Y_FINAL_FIN;
}

creditosY = manejarCreditos(creditosY, Y_FINAL_CREDITOS, velocidad_creditos); 
let currentY_creditos = creditosY; 

fill(255);
textSize(24);
textStyle(BOLD);

let centroX = width / 2;
let separacion = 30; 

if (lineasCreditos.length > 0) { 
let lineaAutorY = currentY_creditos; 
let lineaAutoresY = currentY_creditos + separacion; 

text(lineasCreditos[0], centroX, lineaAutorY);           
if (lineasCreditos.length > 1) {                         
text(lineasCreditos[1], centroX, lineaAutoresY);     
}
}

textSize(64); 
textStyle(BOLD);
text("FIN", width / 2, finY);
textStyle(NORMAL); 

if (finY === Y_FINAL_FIN) {
botonilli(width / 2 - 120, 400, 240, 50, "VOLVER AL INICIO"); 
}
}
}

///LÓGICA DE DIBUJO DE BOTONES DE DECISIÓN

//Estado 2: PRIMERA DECISIÓN
if (estado === 2) {
let botonAncho = 150; 
let botonAlto = 50;
let separacion = 30; 
let posXIzquierda = width / 2 - separacion / 2 - botonAncho;
let posXDerecha = width / 2 + separacion / 2;

botonilli(posXIzquierda, 350, botonAncho, botonAlto, "GRITAR"); 
botonilli(posXDerecha, 350, botonAncho, botonAlto, "REFLEXIONAR");
}

//Estado 7: SEGUNDA DECISIÓN
if (estado === 7) {
let botonAncho = 220; 
let botonAlto = 50;
let separacion = 20; 
let botonY = height - 120; 

let posXIzquierda = width / 2 - separacion / 2 - botonAncho;
let posXDerecha = width / 2 + separacion / 2;

botonilli(posXIzquierda, botonY, botonAncho, botonAlto, "Mueren solos en el olvido"); 
botonilli(posXDerecha, botonY, botonAncho, botonAlto, "Hollis se aleja hacia la Tierra");
}


//Dibuja la flecha de AVANCE en todos los estados menos en: estado de inicio, decisión o última pantalla
if (estado !== 0 && estado !== 2 && estado !== 7 && estado !== 12) { 
let flechaTamCirculo = 40; 
let margen = 20; 
let flechaY = height - 90; 
let flechaXDerecha = width - margen - flechaTamCirculo / 2;

dibujarFlecha(flechaXDerecha, flechaY, flechaTamCirculo); 
}
}

///Interacciones
function mousePressed() {

let flechaTamCirculo = 40; 
let margen = 20; 
let flechaY = height - 90; 
let flechaXDerecha = width - margen - flechaTamCirculo / 2;
let flechaDerechaClickada = overMouseFlecha(flechaXDerecha, flechaY, flechaTamCirculo);

//LÓGICA DE FLUJO

//Estado 12: VOLVER AL INICIO
if (estado === 12) {
if (finY === Y_FINAL_FIN) { 
if (overMouse(width / 2 - 120, 400, 240, 50)) {
inicio_snd.play();

estado = 0;           
creditosY = 0;   
finY = -50; 
frameInicio = frameCount; 
return; 
}
}
return; 
}

//Estado 0: INICIAR
if (estado === 0) {
if (overMouse(width / 2 - 75, height / 2 + 20, 150, 50)) {

inicio_snd.play(); 

let framesTranscurridos = frameCount - frameInicio;
let opacidad = map(framesTranscurridos, 0, 50, 0, 255); 

if (opacidad >= 250) {
estado = 1; 
return; 
}
return; 
}
}

//Estado 2: Botones de Decisión
if (estado === 2) {
let botonAncho = 150; 
let botonAlto = 50;
let separacion = 30; 
let posXIzquierda = width / 2 - separacion / 2 - botonAncho;
let posXDerecha = width / 2 + separacion / 2;

if (overMouse(posXIzquierda, 350, botonAncho, botonAlto)) { 
boton_snd.play();
estado = 4; // Avanza a Estado 4 (GRITAR)
return; 
}
else if (overMouse(posXDerecha, 350, botonAncho, botonAlto)) { 
boton_snd.play();
estado = 3; // Avanza a Estado 3 (REFLEXIONAR)
return; //
}
} 

//Estado 7: Botones de Decisión
if (estado === 7) {
let botonAncho = 220; 
let botonAlto = 50;
let separacion = 20; 
let botonY = height - 120;
let posXIzquierda = width / 2 - separacion / 2 - botonAncho;
let posXDerecha = width / 2 + separacion / 2;

if (overMouse(posXIzquierda, botonY, botonAncho, botonAlto)) {
boton_snd.play();
estado = 8; //Camino MUEREN SOLOS
return;
}
else if (overMouse(posXDerecha, botonY, botonAncho, botonAlto)) {
boton_snd.play();
estado = 9; //Camino HOLLIS SE ALEJA
return;
}
}

//Flujo de avance general (Flecha)
if (flechaDerechaClickada) {
boton_snd.play();

///Lógica de avance secuencial y bifurcaciones
if (estado === 1) { estado = 2; }
else if (estado === 3) { estado = 6; }
else if (estado === 4) { estado = 5; }
else if (estado === 5) { estado = 8; } 
else if (estado === 6) { estado = 7; }
else if (estado === 8) { 
estado = 12; 
creditosY = -50; 
finY = -50; 
}
else if (estado === 9 || estado === 10 || estado === 11) {
if (estado === 11) {
estado = 12; 
creditosY = -50; 
finY = -50; 
} else {
estado++; 
}
}
}
}

//FUNCIONES AUXILIARES

function manejarCreditos(yActual, yFinal, vel) { 
if (yActual >= yFinal) { 
yActual = yFinal;    
return yFinal;       
} else {                 
yActual += vel;      
return yActual;      
}
}

function botonilli(posX, posY, tamX, tamY, textoB) { 
let fontSize; 

if (estado === 7) {   
fontSize = 15;      
} else {              
fontSize = 18;      
}

let isHoverAllowed = true; 

if (isHoverAllowed && overMouse(posX, posY, tamX, tamY)) { 
fill(126, 153, 255); 
} else {                                                     
fill(200, 120, 0, 100); 
}
rect(posX, posY, tamX, tamY, tamY / 4); 

textSize(fontSize); 
textStyle(BOLD);    

fill(255);          
textAlign(CENTER, CENTER); 
text(textoB, posX + tamX / 2, posY + tamY / 2); 
}

function dibujarFlecha(cX, cY, diam) { 
let colorBase = color(200, 120, 0, 100); 
let colorHover = color(126, 153, 255);   

let tam = diam * 0.55;         
let desp = tam * 0.15;         

if (overMouseFlecha(cX, cY, diam)) { 
fill(colorHover); 
} else {                                           
fill(colorBase);  
}

noStroke();                          
circle(cX, cY, diam); 

fill(255); 

triangle(
cX - tam / 2 + desp, cY - tam / 2, 
cX - tam / 2 + desp, cY + tam / 2, 
cX + tam / 2 + desp, cY                   
);
}

function overMouse(posX, posY, tamX, tamY) { 
return mouseX > posX && mouseX < posX + tamX && mouseY > posY && mouseY < posY + tamY;
}

function overMouseFlecha(centerX, centerY, diameter) { 
let d = dist(mouseX, mouseY, centerX, centerY);
return d < diameter / 2;
}
