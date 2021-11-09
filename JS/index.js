// TRAER ELEMENTOS DEL DOM
const $canvas = document.querySelector("canvas");
const $startButton = document.querySelector("#start-button");
const ctx = $canvas.getContext("2d")

//variables globales
let frames = 0;
let intervalId;
const gravity = .78;
const friction =.8
const deaths = []; //obstaculo
let youLost = false;


// DEFINIR CLASES Y MÉTODOS
class Background{
    constructor(){
        this.x = 0;
        this.y = 0;
        this.width = $canvas.width;
        this.height = $canvas.height;
        this.image = new Image();
        this.image.src = boardImage //instancia en linea 94
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


class Pollito {
    constructor () {
        this.x = 0;
        this.y = 0;
        this.width = 60;
        this.height = 60;
        this.vy = 3;
        this.jumpStrength = 20;
        this.image = new Image();
        this.image.src = "/acr_images/blue_pollito.png"
        this.image.onclick = this.draw();
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
boardImage = "/acr_images/skyline.purple.jpeg"
const background = new Background(0,0, $canvas.width, $canvas.height, boardImage);
const pollito = new Pollito();

// FUNCIONES DE FLUJO
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

function gameOver() {
    if (youLost) { // FALTA AGREGAR IMAGEN Y DISEÑARLA QUE SE MUESTRE CUANDO PIERDAS
        ctx.font = "60px bold sans-serif";
        ctx.fillText("GAME OVER", $canvas.width / 3, $canvas.height / 3);
    }
}



//FUNCIONES DE APOYO
function clearCanvas() {
    ctx.clearRect(0, 0, $canvas.width, $canvas.height);
}

function generateDeath() {
    if(frames % 200 === 0) {
        const limitHeight = 300;
		const window = 200;
		const randomHeight = Math.floor(Math.random() * limitHeight);
		const skull1 = new Death(0, 50, randomHeight);
		const skull2 = new Death(randomHeight + window, 50, $canvas.height - (randomHeight + window)
		);

		deaths.push(skull1);
		deaths.push(skull2);
	}
// const obstaculo // FALTA GENERAR OBSTÁCULOS SOBRE EL PISO DE MANERA RANDOM (REVISAR)
	deaths.forEach((obs, index) => {
		if (obs.x + obs.width < 0) deaths.splice(1, index);
	});
}

function crashes () {
    if(pollito.crash()) {
        clearInterval(intervalId);
        youLost = true
    }
    deaths.forEach((obs) => {
        clearInterval(intervalId);
        youLost = true;
    });
}

function drawDeath () {
    deaths.forEach((death) => {
        death.draw();
    })
}


//USUARIO & KEYS
document.onekeyup = (event) => {
    switch (event.key) {
        case " ":
            pollito.jump();
            break;
            default:
            break;
    }
}
        


//iniciar juego
$startButton.addEventListener ("click",event => {
    start();
});