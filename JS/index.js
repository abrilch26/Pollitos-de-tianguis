// TRAER ELEMENTOS DEL DOM
const $canvas = document.querySelector("canvas");
const $startButton = document.querySelector("#start-button");
const ctx = $canvas.getContext("2d")

//variables globales
let frames = 0;
let intervalId;
const gravity = .78;
const deaths = []; //obstaculo
const elotitos = []
let youLost = false;



// DEFINIR CLASES Y MÉTODOS
class Background{
    constructor(){
        this.x = 0;
        this.y = 0;
        this.width = $canvas.width;
        this.height = $canvas.height;
        this.image = new Image();
        this.image.src = boardImage //instancia en linea 120 ...ish
    }

    draw() {
        this.x--; // infinite img
        if (this.x < -this.width) this.x=0;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(
			this.image,
			this.x + this.width,
			this.y,
			this.width,
			this.height
		);
    }
}


class Floor {
    constructor(){
        this.x = 0;
        this.y = 320;
        this.width = $canvas.width;
        this.height = 50;
        this.image = new Image();
        this.image.src = "/acr_images/floor.png"
        this.image.onload = this.draw()
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}


class Pollito {
    constructor () {
        this.x = 40;
        this.y = 280;
        this.width = 55;
        this.height = 55;
        this.image = new Image();
        this.image.src = "/acr_images/pink_pollito.PNG"
        this.image.onload = this.draw();
        // vertical  
        this.vy = 0
        this.vy= 0
        this.jumping = false
        this.jumpStrength = 12
    }

    draw () {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        if(this.y > $canvas.height - this.height) this.y = $canvas.height - this.height // Si 400 > (400-80) => this.y = 320
        if (this.y < 0 ) this.y = 0; // Si 400 < 0  => this.y = 0
        if( this.x > $canvas.width - this.width) this.x = $canvas.width - this.width // Si 600 > (600-80) => this.x = 520
        if (this.x < 0 ) this.x = 0;
    }

    jump(){
        this.vy -= 6;
    }

    moveLeft(){
        this.x -= 6
    }

    moveRight () {
        this.x += 6
    }

    isTouching (death) {
        return (
            this.x < death.x + death.width &&
            this.x + this.width > death.x &&
            this.y < death.y + death.height &&
            this.y + this.height > death.y
        );
    }
}


class Death {
    constructor () {
        this.x = 970
        this.y = 280; 
        this.width = 60; 
        this.height = 60; 
        this.image = new Image(); 
        this.image.src = "/acr_images/Death10px.png"
        this.image.onload = this.draw();
    }
    
    draw() {
        this.x -= 6
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}


class Elotito {
    constructor () {
        this.x = 970;
        this.y =  100;
        this.width = 40;
        this.height = 40;
        this.image = new Image();
        this.image.src = "/acr_images/elotito_hd.png"
    } 

    draw() {
        this.x -= 4;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}


//-----------------------------------------   CREAR INSTANCIAS DE LAS CLASES     -----------------------------------//
boardImage = "/acr_images/skyline.purple.jpeg"
const background = new Background(0,0, $canvas.width, $canvas.height, boardImage);
const pollito = new Pollito();
const death = new Death();
const floor = new Floor();
const elotito = new Elotito();



// ----------------------------   FUNCIONES DE FLUJO   --------------------------------//
function start() {
    if (intervalId) return;
    intervalId = setInterval(() => {
        update ();
    }, 1000 / 60);
}

function isTouching () {
    death.forEach((death) => {
        if(pollito.isTouching(death)) {
            gameOver()
        }
    })
}

function update () {
    frames++
    checkKeys();
    clearCanvas();
    background.draw(); // fondo
    floor.draw(); // piso estático
    pollito.draw(); //character
    if (frames % Math.floor(Math.random() * 4) === 0) { //obstáculos
        drawDeath();
    }
    death.draw();

    if(frames % Math.floor(Math.random() * 2) === 0) { // food
        drawElotito ();
    }
    elotito.draw();
 

}

function gameOver() {
    youLost = true
    if (youLost = true) { // FALTA AGREGAR IMAGEN Y DISEÑARLA PARA QUE SE MUESTRE CUANDO PIERDAS
        ctx.font = "60px bold sans-serif";
        ctx.fillText("GAME OVER", $canvas.width / 2, $canvas.height / 2);
    }
}



//-----------------------------FUNCIONES DE APOYO-----------------------//
function clearCanvas() {
    ctx.clearRect(0, 0, $canvas.width, $canvas.height);
}

function movePollito () {
     if (pollito.y > floor - pollito.height) {
        pollito.jumping = false
        pollito.y = floor.y - pollito.height
    } 


   if (!pollito.jumping) {
       jump.
       pollito.vy = 0
       pollito.jumping = true
       pollito.vy += -pollito.jumpStrength * 2
   }
}


function generateDeath() { //GENERAR ENEMIGOS
    if (frames % 100 !== 0) return
    new Death()
    deaths.push(death++)
}


function drawDeath() { // DIBUJAR ENEMIGOS
    deaths.forEach((death, index) => {
        if (death.x  > 700) {
            deaths.splice(index,1)
        }
        death.draw()
    })
}


function generateElotito() { // DIBUJAR AMIGO
    if(frames % 100 !== 0) return
    new Elotito()
    elotitos.push(elotito++)
}

function drawElotito() { // DIBUJAR AMIGOS
    elotitos.forEach((elotito, index) => {
        if (death.x > 700) {
            elotitos.splice(index, 1)
        }
        elotito.draw()
    })
}


function deathCollition() {
    deaths.forEach((death) => {
        if (pollito.isTouching(death)) {
            gameOver();
            youLost = true
        }
    })
}




//------------------------------------   USUARIO & KEYS   -----------------------------------//
function checkKeys() {
document.onkeyup = (event) => { 
   switch (event.key) {
        case "ÀrrowUp":
            pollito.jump();
            break;
            default:
            break;
        }
    }
}

        


//iniciar juego
$startButton.addEventListener ("click", event => {
    start();
});