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
let win = false;
let lose = false;



//--------------------------   DEFINIR CLASES Y MÉTODOS   --------------------------//

class Background{
    constructor(x,y, width, height, image){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = image;
    }

    draw() {
        this.x--; 
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
    constructor(x,y){
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
        this.image.src = "/acr_images/pollito_azul.PNG"
        // vertical  physics
        this.vx = 0
        this.vy= 0
        this.jumping = false
        this.jumps = 0
        this.jumpStrength = 27
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
    constructor (x, y) {
        this.x = x;
        this.y = y; 
        this.width = 60; 
        this.height = 60; 
        this.image = new Image(); 
        this.image.src = "/acr_images/Death10px.png"
    }
    
    draw() {
        this.x -= 3
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
    constructor (x, y) {
        this.x = x;
        this.y =  y;
        this.width = 40;
        this.height = 40;
        this.image = new Image();
        this.image.src = "/acr_images/elotito_hd.png"
    } 

    draw() {
        this.x -= 5;
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
        this.x = 0 //---------------------------------> lkjoi
        this.y = 0
        this.width = $canvas.width
        this.height = $canvas.height
        this.image = new Image ()
        this.image.src = "/acr_images/you_won.JPEG"
        this.audio = new Audio 
        this.audio.src = "/sounds/animals_cockrel_crow_001.mp3"
    }
    draw () {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    overSound () { 
    this.audio.volume = 0.3;
    this.audio.play()
    }
}



class LostGame {
    constructor () {
        this.x = 0
        this.y = 0
        this.width = $canvas.width
        this.height = $canvas.height
        this.image = new Image ()
        this.image.src = "/acr_images/you_lost.JPEG"
        this.audio = new Audio 
        this.audio.src = "/sounds/zapsplat_cartoon_chicken_cluck_loud_001_51362.mp3"
    }

    draw () {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    overSound () { 
        this.audio.volume = 0.3;
        this.audio.play()
    }
}



//-----------------------------------------CREAR INSTANCIAS DE LAS CLASES
boardImage = "/acr_images/skyline.purple.jpeg"
pollitoImage = "/acr_images/pink_pollito.PNG"
instructionsImage ="/acr_images/instructions.jpg"

const background = new Background(0,0, $canvas.width, $canvas.height, boardImage);
const floor = new Floor();
const pollito = new Pollito(50,0, $canvas.width, $canvas.height, pollitoImage);
let score = new Score;
const wonGame = new WonGame();
const lostGame = new LostGame();
const instructions = new Background(0, 0, $canvas.width, $canvas.height, instructionsImage);


// ----------------------------   FUNCIONES DE FLUJO   --------------------------------//
function start() {
    if(intervalId) return
    intervalId = setInterval(() => {
        update ();
    }, 1000 / 60);
}

function update () {
    checkKeys(); 
    frames++; 
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
    youWon() 
}


function enemyCollition() {
    deaths.forEach((death) => {
        if(pollito.isTouchingDeath(death)) {
            gameOver();
        }
    })
}


function friendCollition() {
    elotitos.forEach ((elotito, index) => {
        if (pollito.isTouchingElotito(elotito)) {
            elotitos.splice(index, 1)
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
lostGame.overSound();
setTimeout(function() {
    location.reload() 
     }, 5000)
    }
} 


function youWon() {
    if(score.score === 5) {
    clearInterval(intervalId)
    wonGame.draw();
    wonGame.overSound()
    setTimeout(function() {
        location.reload() 
         }, 5000)
        }
    }


//-----------------------------FUNCIONES DE APOYO-----------------------
function clearCanvas() { 
    ctx.clearRect(0, 0, $canvas.width, $canvas.height);
}

function checkKeys () {
    if(keys.ArrowLeft) pollito.moveLeft();
    if(keys.ArrowRight) pollito.moveRight();
    if(keys.ArrowUp) pollito.jump();
}


function generateDeath() { 
    if (frames % 140 === 0) {
        const y = Math.floor(Math.random() * 270);
        const death = new Death (900, y);
            deaths.push(death);
            deaths.forEach((death, index) => {
                if (death.x + death.width < 0) deaths.splice(1, index);
            });
    }
}

function drawDeath() { 
    deaths.forEach((death) => {
        death.draw()
    })
}



function generateElotito() { 
    if (frames % 60 === 0) {
        const y = Math.floor(Math.random() * 200);
        const elotito = new Elotito (900, y);
            elotitos.push(elotito);
            elotitos.forEach((elotito, index) => {
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

window.onload = function () {
    instructions.draw();
}