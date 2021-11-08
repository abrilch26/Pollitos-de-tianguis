const $canvas=document.querySelector("canvas");
const ctx = $canvas.getContext("2d");

// VARIABLES GLOBALES
let frames = 0;
const friction = 0.9;
const keys = {};

// CLASES
    class GameAsset {
        constructor (x, y, width, height, img) {
            this.x = x;
            this.y = y;
            this.width = width;
            this. heigth = height;
            this.image = new Image ();
            this.image.src = img;
        }

        draw () {
            ctx.drawImage (this.image, this.x, this.y, this.width, this.height);
        }
    }
// ^ clase genérica ^

class Board extends GameAsset {
    constructor (x, y, width, height, img) {
        super (x,y, width, height, img);
    }
}
