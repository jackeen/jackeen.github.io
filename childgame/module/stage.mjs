/**
 * Stage
 * 
 */

const NPC_SPRITE = "1";
const MOVEABLE_SPRITE = "0";

const SPRITE_BLOCKED_EVENT = "spriteBlockedEvent";
const AUTO_MOVED_EVENT = "autoMovedEvent";

class Stage {

    animationId = null;
    
    //
    sprites = [];

    //
    NPCSprites = new Map();

    //
    xPixelNum = 0;
    yPixelNum = 0;
    
    //
    screen = null;

    // The information area for score and other messages for player
    information = "";

    // This status for pausing the game
    isRunning = true;

    // When the game terminated, this status will open and cannot closed
    isTerminated = false;

    // The movement inputting is messy, so to keep them in order is necessary.
    // This queue makes sure all the movement displayed on the screen as their happened order.
    moveQueueTimer;
    moveQueue = [];

    constructor(screen) {
        this.xPixelNum = screen.xPixelNum;
        this.yPixelNum = screen.yPixelNum;
        this.screen = screen;
        this.moveQueueTimer = setInterval(()=>{
            this.consumeMoveQueue();
        }, 50);
    }

    setInformation(s) {
        this.information = s;
    }

    drawBackground() {
        this.screen.light();
    }

    reDrawInformation() {
        this.screen.cleanInformation();
        this.screen.displayInformation(this.information);
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    appendSpiritWithRandomPosition(sprite, type) {

        let id = Math.floor(Math.random() * new Date().getTime()).toString();

        let x = this.randomInt(0, this.xPixelNum - sprite.w);
        let y = this.randomInt(0, this.yPixelNum - sprite.h);
        sprite.x0 = x;
        sprite.y0 = y;
        sprite.x = x;
        sprite.y = y;
        sprite.id = id;
        
        
        if (type === MOVEABLE_SPRITE) {
            this.sprites.push(sprite);
        }
        
        if (type === NPC_SPRITE) {
            this.NPCSprites.set(`${id}`, sprite);
            if (sprite.autoMoveable) {
                // auto active moveable NPC
                sprite.active(this.xPixelNum, this.yPixelNum);
            }
        }
    }

    deleteNPCSprite(id) {
        // not implement yet
    }

    figureTouch(sprite, target) {
        let xGap = Math.abs(sprite.x - target.x);
        let yGap = Math.abs(sprite.y - target.y);
        if (
            (xGap <= sprite.w || xGap <= target.w) &&
            (yGap <= sprite.h || yGap <= target.h)
        ) {
            return true;
        }
        return false;
    }

    // Find the specific target in sprite's direction
    findTo(sprite, xForward, yForward) {
        for (let [id, target] of this.NPCSprites) {

            let xDistance = Math.abs(sprite.x - target.x);
            let yDistance = Math.abs(sprite.y - target.y);

            if (
                xForward > 0 && 
                sprite.x + sprite.w === target.x && 
                yDistance < Math.max(sprite.h, target.h)
            ) {
                return target;
            }
            if (
                xForward < 0 && 
                target.x + target.w === sprite.x && 
                yDistance < Math.max(sprite.h, target.h)
            ) {
                return target;
            }
            if (
                yForward > 0 && 
                sprite.y + sprite.h === target.y && 
                xDistance < Math.max(sprite.w, target.w)
            ) {
                return target;
            }
            if (
                yForward < 0 && 
                target.y + target.h === sprite.y && 
                xDistance < Math.max(sprite.w, target.w)
            ) {
                return target;
            }
        }
        return null;
    }

    dealMove(sprite, x, y) {
        let afterX = sprite.x + x;
        let afterY = sprite.y + y;

        if (!this.isRunning) {
            return;
        }

        // check block
        for (let [id, targetSprite] of this.NPCSprites) {
            if(
                Math.abs(afterX - targetSprite.x) < sprite.w && 
                Math.abs(afterY - targetSprite.y) < sprite.h
            ) {
                return;
            }
        }
        
        // check border
        if (afterX + sprite.w <= this.xPixelNum && afterX >= 0) {
            sprite.x0 = sprite.x;
            sprite.x = afterX;
        }
        
        // check border
        if (afterY + sprite.h <= this.yPixelNum && afterY >= 0) {
            sprite.y0 = sprite.y;
            sprite.y = afterY;
        }
    }

    consumeMoveQueue() {
        let movement = this.moveQueue.shift();
        if (movement) {
            this.dealMove(movement.sprite, movement.x, movement.y);
        }
    }

    // add the movement to the queue
    moveTo(sprite, x, y) {
        this.moveQueue.push({
            sprite: sprite,
            x: x,
            y: y,
        });
    }

    // for something moveable actor
    reDrawSprit(sprite) {
        this.cleanSprite(sprite);
        this.drawSprite(sprite);
    }

    // For drawing something auto controlled
    drawNPCSprite() {
        for (let [id, sprite] of this.NPCSprites) {
            if (sprite.autoMoveable) {
                sprite.autoMove();
                sprite.data.forEach((colum, i) => {
                    colum.forEach((_, j) => {
                        this.screen.clean(sprite.x0+j, sprite.y0+i,);
                    });
                });
            }

            this.drawSprite(sprite);
        }
    }
    drawSprite(sprite) {
        sprite.data.forEach((colum, i) => {
            colum.forEach((v, j) => {
                this.screen.display(sprite.x+j, sprite.y+i, (v)?sprite.color:null);
            });
        });
    }
    cleanSprite(sprite) {
        sprite.data.forEach((colum, i) => {
            colum.forEach((_, j) => {
                this.screen.clean(sprite.x0+j, sprite.y0+i);
            });
        });
    }

    pause() {
        if (this.isTerminated) {
            return;
        }

        this.isRunning = !this.isRunning;
        if (this.isRunning) {
            this.run();
        } else {
            window.cancelAnimationFrame(this.animationId);
        }
        return this.isRunning;
    }

    run() {
        if (this.isTerminated) {
            return;
        }
        
        this.reDrawInformation();
        this.drawNPCSprite();
        this.sprites.forEach((sprite) => {
            this.reDrawSprit(sprite);
        });
        
        let _this = this;
        this.animationId = window.requestAnimationFrame(() => {
            _this.run();
        });
    }

    // reset the stage work
    reset() {

        this.isTerminated = false;
        this.NPCSprites.clear();
        this.sprites = [];
        this.moveQueue = [];
        this.screen.light();
        //this.screen.setInformation("");
        //this.screen.cleanInformation();
    }

    //
    terminate() {
        this.isTerminated = true;
        window.cancelAnimationFrame(this.animationId);
    }
}

class Sprite {
    
    id = "";

    x0 = 0;
    y0 = 0;
    x = 0;
    y = 0;
    w = 0;
    h = 0;
    color;

    // The shape illustrated by binary matrix
    // 0 means empty
    // 1 means solid
    data;

    autoMoveable = false;
    autoMoveCounter = 0;
    autoMovePerSomeFrame = 50;
    
    // auto move border
    xBorder = 0;
    yBorder = 0;

    // 1 or -1 to indicate directions
    yForward;
    xForward;

    constructor(w, h, color, data) {
        this.w = w;
        this.h = h;
        this.color = color;
        this.data = data;
        this.xForward = this.genForward();
        this.yForward = this.genForward();
    }

    speedUp() {
        if (this.autoMovePerSomeFrame > 10) {
            this.autoMovePerSomeFrame -= 4;
        }
    }

    genForward() {
        return (parseInt(Math.random().toString()[2]) % 2 === 0) ? 1 : -1;
    }

    // active auto move
    active(x, y) {
        this.xBorder = x;
        this.yBorder = y;
    }

    autoMove() {
        // slow down the moving speed
        if (this.autoMoveCounter < this.autoMovePerSomeFrame) {
            this.autoMoveCounter++;
            return;
        } else {
            this.autoMoveCounter = 0;
        }

        if (this.x + this.w >= this.xBorder) {
            this.xForward = -1;
        } else if (this.x <= 0) {
            this.xForward = 1;
        }

        if (this.y + this.h >= this.yBorder) {
            this.yForward = -1;
        } else if (this.y <= 0) {
            this.yForward = 1;
        }

        this.x0 = this.x;
        this.y0 = this.y;
        this.x += this.xForward;
        this.y += this.yForward;

        let _this = this;
        document.dispatchEvent(new CustomEvent(AUTO_MOVED_EVENT, {
            detail: {
                target: _this,
            }
        }));
    }

    setData(d) {
        this.data = d;
    }

    switchColor(c1, c2) {
        if (this.color === c1) {
            this.color = c2;
        } else {
            this.color = c1;
        }
    }
}

export {
    Stage,
    Sprite,
    NPC_SPRITE,
    MOVEABLE_SPRITE,
    AUTO_MOVED_EVENT,
};