// TRAER ELEMENTOS DEL DOM
const $canvas = document.querySelector("canvas");
const $startButton = document.querySelector("button");
const ctx = $canvas.getContext("2d")

//variables globales
let frames = 0;
let intervalId;
const gravity = 9.8;
const death = [];
let youlost = false;


// DEFINIR CLASES Y MÉTODOS
class Background{
    constructor(){
        this.x = 0;
        this.y = 0;
        this.width = $canvas.width;
        this.height = $canvas.height;
        this.image = new Image();
        this.image.src = "/acr_images/lvl1Board.PNG"
    }

    draw() {
        this.x--;
        if (this.x < -this.width) thisx=0;
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


class Pollito {
    constructor () {
        this.x = 0;
        this.y = 0;
        this.width = 60;
        this.height = 60;
        this.vy = 3;
        this.image = new Image();
        this.image.src = "/acr_images/blue_pollito.png"
    }

    draw () {
        this.vy += gravity
        this.y += this.vy;
    }

    crash() {
        return this.y < 0 || this.y + this.height > $canvas.height;
    }

    jump() {
        this.vy -= 3;
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
        this.y = 30; 
        this.width = 60; 
        this.height = 60; 
        this.image = new Image(); 
        this.image.src = "/acr_images/Death10px.png"
}

draw() {
    this.x--;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
}
}


// CREAR INSTANCIAS DE LAS CLASES
const background = new Background();
const pollito = new Pollito();

// FUNCIONES DE INTERACCION CON EL USUARIO
function start() {
    if (intervalId) return;
    intervalId = setInterval(() => {
        update ();
    }, 1000 / 60);
}

function update () {
    frames++
    generateDeath();
    clearCanvas();
    background.draw();
    pollito.draw();
    drawDeath();
    gameOver();
}

function clearCanvas() {
    ctx.clearRect(0, 0, $canvas.width, $canvas.height);
}

function generateDeath() {
    if(frames % 200 === 0) {
        const // FALTA GENERAR OBSTÁCULOS SOBRE EL PISO DE MANERA RANDOM EN EJE DE X Y EJE DE Y
    }
}