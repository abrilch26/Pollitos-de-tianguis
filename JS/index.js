// TRAER ELEMENTOS DEL DOM
const $canvas = document.querySelector("canvas");
const $startButton = document.querySelector("#start-button");
const ctx = $canvas.getContext("2d")

// ---------------------------- VARIABLES GLOBALES ------------------------------//
let frames = 0;
let intervalId;
const gravity = 1.3;
const friction = .97;
const keys = {}
const deaths = []; //obstaculo
const elotitos = [] // friend



//--------------------------   DEFINIR CLASES Y MÉTODOS   --------------------------//
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
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}


class Pollito {
    constructor (x,y) {
        this.x = x;
        this.y = y;
        this.width = 55;
        this.height = 55;
        this.image = new Image();
        this.image.src = "/acr_images/pink_pollito.PNG"
        // vertical  
        this.vx = 0
        this.vy= 0
        this.jumping = false
        this.jumps = 0
        this.jumpStrength = 26
    }

    draw () {
        this.vy += gravity;
        this.vx *= friction;
        this.y += this.vy;
        this.x += this.vx

        if (this.y > $canvas.height - this.height) {
            this.y = $canvas.height- this.height-15;
            this.jumps = 0;
            this.jumping = false
        } 
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    

    jump(){
        if (this.jumps >= 1) {
            this.jumping = true
        }
        if(!this.jumping) {
            this.jumps++;
            this.vy = -this.jumpStrength
        }
}

    moveLeft() {
        this.vx--;
    }

    moveRight () {
        this.vx++;
    }

    stop () {
        this.vx = 0
    }

    isTouchingDeath (death) {
        return (
            this.x < death.x + death.width &&
            this.x + this.width > death.x &&
            this.y < death.y + death.height &&
            this.y + this.height > death.y
        );
    }

    isTouchingElotito (elotito) {
        return (
            this.x < elotito.x + elotito.width &&
            this.x + this.width > elotito.x &&
            this.y < elotito.y + elotito.height &&
            this.y + this.height > elotito.y
        );  
    }
}


class Death {
    constructor () {
        this.x = 900
        this.y = 0; 
        this.width = 60; 
        this.height = 60; 
        this.image = new Image(); 
        this.image.src = "/acr_images/Death10px.png"
    }
    
    draw() {
        this.x -= 6
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }

    isTouchingPollito(pollito) {
        return (
            this.x < pollito.x + pollito.width &&
            this.x + this.width > pollito.x &&
            this.y < pollito.y + pollito.height &&
            this.y + this.height > pollito.y
        )
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

    isTouchingPollito2(pollito) {
        return (
            this.x < pollito.x + pollito.width &&
            this.x + this.width > pollito.x &&
            this.y < pollito.y + pollito.height &&
            this.y + this.height > pollito.y
        )
    }
}


class Score {
    constructor() {
        this.x = $canvas.width-50
        this.y = $canvas.height-40
        this.score = 0
        this.image = new Image()
        this.image.src = "/acr_images/elotito_hd.png"
    }
    draw() {
        ctx.font = "30px helvetica"
        ctx.fillStyle = "white"
        ctx.fillText(this.score, $canvas.width-70, 40) 
        ctx.drawImage (this.image,$canvas.width-125, 15, 30,30)}
}

class WonGame {
    constructor () {
        this.x = 0
        this.y = 0
        this.width = $canvas.width
        this.height = $canvas.height
        this.image = new Image ()
        this.image.src = "/acr_images/you_won.JPEG"
         //this.audio = new Audio ------------------------------------------------------AUDIO PENDIENTE
        //this.audio.src = 
    }
    draw () {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    //overSound () { -----------------------------------------------------------CONFIGURACIÓN DE AUDIO PENDIENTE
      //  this.audio.volume = 0.5;
        //this.audio.play()
    //}
}



class LostGame {
    constructor () {
        this.x = 0
        this.y = 0
        this.width = $canvas.width
        this.height = $canvas.height
        this.image = new Image ()
        this.image.src = "/acr_images/you_lost.JPEG"
        //this.audio = new Audio ------------------------------------------------AUDIO PENDIENTE
        //this.audio.src = 
    }
    draw () {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    //overSound () { -----------------------------------------------------------CONFIGURACIÓN DE AUDIO PENDIENTE
      //  this.audio.volume = 0.5;
        //this.audio.play()
    //}
}



//-----------------------------------------CREAR INSTANCIAS DE LAS CLASES
boardImage = "/acr_images/skyline.purple.jpeg"
pollitoImage = "/acr_images/pink_pollito.PNG"

const background = new Background(0,0, $canvas.width, $canvas.height, boardImage);
const floor = new Floor();
const pollito = new Pollito(50,0, $canvas.width, $canvas.height, pollitoImage);
let score = new Score;
const wonGame = new WonGame();
const lostGame = new LostGame();



// ----------------------------   FUNCIONES DE FLUJO   --------------------------------//
function start() {
    if(intervalId) return
    intervalId = setInterval(() => {
        update ();
    }, 1000 / 60);
}

function update () {
    checkKeys(); 
    //frames++; 
    clearCanvas(); 
    background.draw(); 
    floor.draw(); 
    pollito.draw(); 
    generateDeath();
    drawDeath();
    generateElotito();
    drawElotito();
    friendCollition();
    enemyCollition();
    drawScore();
    

}

function enemyCollition() {
    deaths.forEach((death) => {
        if(pollito.isTouchingDeath(death)) {
            gameOver();
        }
    })
}


function friendCollition() {
    elotitos.forEach((elotito) => {
        if (pollito.isTouchingElotito(elotito)) {
            score.score++
        }
    })
}

function drawScore() {
    score.draw()
}


function gameOver() {
    if (pollito.isTouchingDeath) {
clearInterval(intervalId)
lostGame.draw();
//youLost.overSound()----------------------------------------------> SONIDO PENDIENTE
    }
}

function youWon() {
    if(score.score === 10)
    clearInterval(intervalId)
    wonGame.draw();
    //wonGame.overSound()-------------------------------------SONIDO PENDIENTE

}


//-----------------------------FUNCIONES DE APOYO-----------------------
function clearCanvas() { // LIMPIA CANVAS
    ctx.clearRect(0, 0, $canvas.width, $canvas.height);
}

function checkKeys () {
    if(keys.ArrowLeft) pollito.moveLeft();
    if(keys.ArrowRight) pollito.moveRight();
    if(keys.ArrowUp) pollito.jump();
}


function generateDeath() { //GENERAR ENEMIGOS
    if (frames % 300 === 0) {
        const y = Math.floor(Math.random() * 2);
        const death = new Death (800, y);
            deaths.push(death);
            // para limpiar el array de los enemigos.
            deaths.forEach((death, index) => {
                if (death.x + death.width < 0) deaths.splice(1, index);
            });
    }
}

function drawDeath() { // DIBUJAR ENEMIGOS
    deaths.forEach((death) => {
        death.draw()
    })
}


function generateElotito() { // DIBUJAR AMIGO
    if (frames % 300 === 0) {
        const y = Math.floor(Math.random() * 5);
        const elotito = new Elotito (200, y);
            deaths.push(elotito);
            deaths.forEach((elotito, index) => {
                if (elotito.x + elotito.width < 0) elotitos.splice(1, index);
            });
    }
}

function drawElotito() { // DIBUJAR AMIGOS
    elotitos.forEach((elotito, index) => {
        if (elotitos.x > 700) {
            elotitos.splice(index, 1)
        }
        elotito.draw()
    })
}



//------------------------------------   USUARIO & KEYS   -----------------------------------//

document.onkeydown = (event) => { 
   switch (event.key) {
       case "ArrowRight":
           pollito.moveRight()
            break;
        case "ArrowLeft":
            pollito.moveLeft()
            break;
        case "ArrowUp":
            pollito.jump();
            break;
            default:
                break;
        }
    }   


//iniciar juego
$startButton.addEventListener ("click", event => {
    start();
});