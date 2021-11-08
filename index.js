const $canvas=document.querySelector("canvas1");
const $startButton = document.querySelector("start-button");
const ctx = $canvas.getContext("2d");

let frames = 0;

window.onload = () => {
    document.getElementById("start-button").onclick = () => {
        startGame();
    };

    class Board {
        constructor () {
            this.x = 0;
            this.y = 0;
            this.width = $canvas.width;
            this.heigth = $canvas.height;
            this.image = new Image();
           // this.image.src = "/ FALTA IMAGEN DE BOARD!
        }
        
        draw() {
            this.y
        }
    }
}