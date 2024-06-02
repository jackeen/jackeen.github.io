/**
 * Screen is the device layer for drawing canvas.
 * 
 * 
 */

class Pixel {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Screen {

    canvas = null;
    ctx = null;
    deviceWidth;
    deviceHeight;

    xPixelNum;
    yPixelNum;

    defaultColor = "gray";
    pixels = [];

    penalHight = 200;

    constructor(canvasId, width, height) {
        let playAreaHight = height - this.penalHight;
        this.deviceWidth = width;
        this.deviceHeight = playAreaHight
        this.canvas = document.getElementById(canvasId);
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = canvas.getContext("2d");
    }

    generatePixels(pixelSize, pixelGap, defaultColor) {

        this.pixelSize = pixelSize;
        this.pixelGap = pixelGap;
        this.defaultColor = defaultColor;

        let wn = Math.floor(this.deviceWidth / (pixelSize + pixelGap));
        let hn = Math.floor(this.deviceHeight / (pixelSize + pixelGap));

        let pixelArray = new Array(wn);
        for(let i = 0; i < wn; i++) {
            let colum = new Array(hn);
            for(let j = 0; j < hn; j++) {
                let x = i*(pixelSize+pixelGap);
                let y = j*(pixelSize+pixelGap) + this.penalHight;
                let pixel = new Pixel(x, y);
                colum[j] = pixel;
            }

            pixelArray[i] = colum;
        }

        this.pixels = pixelArray;
        this.xPixelNum = wn;
        this.yPixelNum = hn;
    }

    light() {
        this.pixels.forEach((colum, i)=> {
            colum.forEach((pixel, j) => {
                this.display(i, j, this.defaultColor);
            });
        });
    }

    clean(x, y) {
        this.display(x, y, this.defaultColor);
    }

    display(x, y, color) {
        let p = this.pixels[x][y];
        this.ctx.fillStyle = color || this.defaultColor;
        this.ctx.fillRect(p.x, p.y, this.pixelSize, this.pixelSize);
    }

    displayInformation(s) {
        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(s, 20, 110, this.deviceWidth);
    }
    cleanInformation() {
        this.ctx.clearRect(0, 0, this.deviceWidth, this.penalHight);
    }
}

export {
    Screen,
};