// Traer los elementos del DOM (En especial el canvas)
const $canvas = document.getElementById("canvas");
const ctx = $canvas.getContext("2d");

//VARIABLES GLOBALES
let gameStarted = false
let interval
let frames = 0
let images = {
    level1Board: "/acr_images/level1Board.png",
    death: "/acr_images/Death10px.png",
    pinkPollito: "/acr_images/pink_pollito.png",
    bluePollito: "/acr_images/blue_pollito.png",
    elotito: "/acr_images/elotito_hd.png",
    winnerChicken: "/acr_images/gallo_HD.png"
}

let frictionDeath = .84;
let frictionPollito = .8;
let keys = {}
let deathsCounter = 0;



// CLASES
class Board {
    constructor () {
        this.x = 0
        this.y = 300
        this.width = $canvas.width
        this.heigth = $canvas.height
        this.image = new Image ()
        this.image.src = images.level1Board
        this.image.onload = this.draw()
    }
    draw(){
        ctx.drawImage(this.image, this.x, this.y,this.width, this.height)
    }
}

class PinkPollito {
    constructor (){
        this.x = 0;
        this.y = 0;
        this.width = 40;
        this.height = 50;
        this.image = new Image ();
        this.image.src = images.pinkPollito;
        this.image.onload = this.draw();
        this.vx = 0;
        this.vy = 0;
    }
    draw () {
        this.vy += frictionPollito;
        this.vx *= frictionPollito;
        this.y += this.vy;
        this.x += this.vx;
//Respectar limite del canvas
        if (this.y > $canvas.height - this.height){
            this.vy = 0
            this.vx= 0
    }

    ctx.drawImage(this.image, this.x, this.y,this.width, this.height);
}

moveLeft(){
    this.vx--;
}
moveRight() {
    this.vx++;
}

moveUp(){
    this.vy++;
}
moveDown () {
    this.vy--;
}

stop() {
    this.vx = 0;
    this.vy = 0;
}
}



// INSTANCIAS 
const pollito = new PinkPollito(40,0);


//FLUJO DEL JUEGO
function start() {
    setInterval(() => {
        update ();
    }, 1000 / 60);
 }

 function update () {
     frames++;
     checkKeys();
     clearCanvas();
     pollito.draw();
 }


 //FUNCIONES DE APOYO
 function clearCanvas() {
     ctx.clearCanvas(0, 0, $canvas.width, $canvas.height);
 }


 function checkKeys() {
     if (keys.ArrowLeft) pollito.moveLeft();
     if (keys.ArrowRight) pollito.moveLeft();
     if(keys.ArrowUp) pollito.moveUp();
     if(keys.ArrowDown) pollito.moveDown ();
 }


 // FUNCIONES DE INTERACCION CON EL USER
 document.onkeydown = (event) => {
 keys[event.key] = true;
 };

 document.onkeyup = (event) => {
     keys[event.key] = false;
     pollito.stop();
 }

 start();
