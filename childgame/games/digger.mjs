/**
 * Digger game.
 * 
 * This story is
 * 
 */

import { Speaker } from "../module/speaker.mjs";
import { 
    Stage, 
    Sprite, 
    NPC_SPRITE, 
    MOVEABLE_SPRITE, 
    AUTO_MOVED_EVENT 
} from "../module/stage.mjs";


const GOLD_MINE_COLLAPSE_EVENT = "goldMineCollapseEvent";
const SCORE_UP_EVENT = "scoreUpEvent";
const SCORE_DOWN_EVENT = "scoreDownEvent";
const SCORE_CHANGE_EVENT = "scoreChangeEvent";

const GAME_PAUSED_EVENT = "gamePaused";
const GAME_RESUME_EVENT = "gameResume";
const GAME_SUCCESS_EVENT = "gameSuccess";
const GAME_FAILED_EVENT = "gameFailed";

const GUARD_NUMBER = 10;
const GOLD_MINE_NUMBER = 30;

// The sound object for invoking by the game
var soundEffect = null;

/**
 * Sound, loader and player
 * 
 */
class SoundEffect {

    soundSources = {
        background: "./assets/digger/background.wav",
        failed: "./assets/digger/failed.wav",
        success: "./assets/digger/success.wav",
        scoreUp: "./assets/digger/scoreup.wav",
        scoreDown: "./assets/digger/scoredown.wav",
    };

    count = 5;

    backgroundSound;
    failedSound;
    successSound;
    scoreUpSound;
    scoreDownSound;

    onReady = () => {};

    constructor() {
    }

    loadSourceCallback() {
        this.count--;
        if (this.count === 0) {
            this.onReady();
        }
    }

    loadSounds() {
        let _this = this;
        this.backgroundSound = new Speaker(this.soundSources.background, true, 0.2);
        this.backgroundSound.loadSound(() => {
            _this.loadSourceCallback();
        });
        this.successSound = new Speaker(this.soundSources.success, false);
        this.successSound.loadSound(() => {
            _this.loadSourceCallback();
        });
        this.failedSound = new Speaker(this.soundSources.failed, false);
        this.failedSound.loadSound(() => {
            _this.loadSourceCallback();
        });
        this.scoreUpSound = new Speaker(this.soundSources.scoreUp, false);
        this.scoreUpSound.loadSound(() => {
            _this.loadSourceCallback();
        });
        this.scoreDownSound = new Speaker(this.soundSources.scoreDown, false);
        this.scoreDownSound.loadSound(() => {
            _this.loadSourceCallback();
        });
    }
}

/**
 * The target of player to collect for scoring up
 * 
 */
class GoldMine extends Sprite {
    
    // Dig timer for changing shape
    diggingCounter = 0;

    // compare to the target's same property for score
    powerLevel = 0;

    constructor() {
        let data = [
            [1,1,1],
            [1,1,1],
            [1,1,1],
        ];
        super(3, 3, "yellow", data);
        this.powerLevel = 0;
    }

    lose() {
        // When the mine be digged, the first time the player will get a score.
        // If they do it more than one time, the mine will display in different shape.
        switch (this.diggingCounter) {
            case 0:
                document.dispatchEvent(new CustomEvent(SCORE_UP_EVENT, {
                    detail: {
                        score: 1,
                    }
                }));
                this.color = "gray";
                break;
            case 1:
                this.setData([
                    [0,1,1],
                    [1,1,1],
                    [1,1,1],
                ]);
                break;
            case 2:
                this.setData([
                    [0,1,1],
                    [1,1,0],
                    [1,1,1],
                ]);
                break;
            case 3:
                this.setData([
                    [0,1,1],
                    [1,1,0],
                    [1,0,1],
                ]);
                break;
            default:
                let id = this.id;
                document.dispatchEvent(new CustomEvent(GOLD_MINE_COLLAPSE_EVENT, {
                    detail: {
                        id: id,
                    },
                }));
        }

        this.diggingCounter++;
    }
}

/**
 * A hunter for digger
 * 
 */ 
class Guard extends Sprite {

    // For fighting
    powerLevel = 2;

    constructor() {
        let data = [
            [0,1,0],
            [1,1,1],
            [0,1,0],
        ];
        super(3, 3, "red", data);
        this.autoMoveable = true;
        let _this = this;
        document.addEventListener(SCORE_UP_EVENT, () => {
            _this.speedUp();
        });
    }

    win() {
        document.dispatchEvent(new CustomEvent(SCORE_DOWN_EVENT, {
            detail: {
                score: -1,
            }
        }));
    }
    lose() {
        this.autoMoveable = false;
        this.color = "gray";
        document.dispatchEvent(new CustomEvent(SCORE_UP_EVENT, {
            detail: {
                score: 2,
            }
        }));
    }
}


/**
 * The digger controlled by player
 * This name because of its shape
 */
class Tank extends Sprite {

    NORMAL_COLOR;
    LIGHT_COLOR;
    
    powerLevel = 1;

    flashingAnimationTimer = null;

    // The first indicates X, the second indicates Y
    direction = [0, -1];

    constructor() {
        const NORMAL_COLOR = "green";
        const LIGHT_COLOR = "lightgreen";
        const SUPPER_COLOR = "orange";


        let data = [
            [0,1,0],
            [1,1,1],
            [1,0,1],
        ];
        super(3, 3, NORMAL_COLOR, data);

        this.NORMAL_COLOR = NORMAL_COLOR;
        this.LIGHT_COLOR = LIGHT_COLOR;
    }

    move(x, y) {
        this.moveTo(x, y);
    }

    turnRight() {
        this.direction = [1, 0];
        this.setData([
            [1,1,0],
            [0,1,1],
            [1,1,0],
        ]);
    }
    turnLeft() {
        this.direction = [-1, 0];
        this.setData([
            [0,1,1],
            [1,1,0],
            [0,1,1],
        ]);
    }
    turnUp() {
        this.direction = [0, -1];
        this.setData([
            [0,1,0],
            [1,1,1],
            [1,0,1],
        ]);
    }
    turnDown() {
        this.direction = [0, 1];
        this.setData([
            [1,0,1],
            [1,1,1],
            [0,1,0],
        ]);
    }

    // The action make this sprite to change its color continually
    flashing() {
        if (this.flashingAnimationTimer === null) {
            this.flashingAnimationTimer = setInterval(() => {
                this.switchColor(this.NORMAL_COLOR, this.LIGHT_COLOR);
            }, 100);
        }
    }
    stopFlashing() {
        clearInterval(this.flashingAnimationTimer);
        this.flashingAnimationTimer = null;
        this.color = this.NORMAL_COLOR;
    }

    upgrade() {
        this.powerLevel = 3;
    }

    win() {
        this.stopFlashing();
    }
    lose() {
        this.flashing();
    }
}

class Scenes extends Stage {

    tank;

    constructor(screen) {
        super(screen);
        let _this = this;

        // when a guard movement, it will dispatch this event
        document.addEventListener(AUTO_MOVED_EVENT, (e) => {
            let guard = e.detail.target;
            if (_this.figureTouch(guard, _this.tank)) {
                if (_this.tank.powerLevel < guard.powerLevel) {
                    _this.tank.lose();
                    guard.win();
                } else {
                    _this.tank.win();
                    guard.lose();
                }
                document.dispatchEvent(new Event(SCORE_CHANGE_EVENT));
            }
        });

        document.addEventListener(GOLD_MINE_COLLAPSE_EVENT, (e) => {
            let id = e.detail.id;
            _this.deleteGoldStone(id);
        });

        this.drawBackground();
    }

    deleteGoldStone(id) {
        this.deleteNPCSprite(id);
    }

    generateGoldStone(n) {
        for (let i = 0; i < n; i++) {
            this.appendSpiritWithRandomPosition(new GoldMine(), NPC_SPRITE);
        }
    }

    generateGoldGuard(n) {
        for (let i = 0; i < n; i++) {
            this.appendSpiritWithRandomPosition(new Guard(), NPC_SPRITE);
        }
    }

    fight(trigger) {

        let target = this.findTo(trigger, trigger.direction[0], trigger.direction[1]);
        //console.log("fight", trigger, target);
        if (target === null) {
            return;
        }

        if (trigger.powerLevel > target.powerLevel) {
            //console.log("trigger win");
            target.lose();
            trigger.win();
        } else {
            //console.log("trigger lose");
            target.win();
            trigger.lose();
        }

        document.dispatchEvent(new Event(SCORE_CHANGE_EVENT));
    }

    addTank() {
        let tank = new Tank();
        this.appendSpiritWithRandomPosition(tank, MOVEABLE_SPRITE);
        this.tank = tank;
    }

}

// next limited timer
class Digger {
    
    scenes;
    
    // total score 
    score = 0;

    // digged mine for ending game before the time limit 
    diggedMine = 0;

    // In the limited game 
    lastTimeTimer;
    gameOverTimeTimer;
    isGameOver = false;

    // When the player sets the time of minutes
    // the game will record the time as seconds 
    isLimitedTime = false;
    lastSeconds = 0;
    challengeMinutes = 0;

    constructor(screen, callback) {
        let _this = this;
        this.scenes = new Scenes(screen);
        soundEffect = new SoundEffect();
        soundEffect.onReady = () => {
            callback();
        };

        soundEffect.loadSounds();

        document.addEventListener(SCORE_CHANGE_EVENT, () => {
            
            _this.genInformation();
            
            // digging every mine without hurt by guard
            if (this.score === GOLD_MINE_NUMBER && !this.isLimitedTime) {
                this.scenes.tank.upgrade();
            }

            // if this is a limited challenge, the player gets full score will win otherwise fail
            if (this.diggedMine === GOLD_MINE_NUMBER && this.isLimitedTime) {
                if (this.score === GOLD_MINE_NUMBER) {
                    this.gameOverWithSuccess();
                } else {
                    this.gameOverWithFailed();
                }
            }
        });
    }

    genInformation() {
        let lastSeconds = this.lastSeconds;
        if (!this.isLimitedTime) {
            lastSeconds = "INFINITE";
        }
        let info = `DIGGER GAME   |   SCORE:  ${this.score}`;
        let lastTime = `   LEFT SECONDS: ${lastSeconds}`;
        
        this.scenes.setInformation(info + lastTime);
    }

    updateTime() {
        this.lastSeconds -= 1;
        this.genInformation();
    }

    runOutTime() {
        if (this.score == GOLD_MINE_NUMBER) {
            this.gameOverWithSuccess();
        } else {
            this.gameOverWithFailed();
        }
    }
    stopGame() {
        this.isGameOver = true;
        soundEffect.backgroundSound.stop();
        setTimeout(()=>{
            this.scenes.terminate();
        }, 1000);
    }
    gameOverWithSuccess() {
        this.stopGame();
        soundEffect.successSound.play();
        document.dispatchEvent(new CustomEvent(GAME_SUCCESS_EVENT, {
            detail: {
                score: this.score,
                total: GOLD_MINE_NUMBER,
            }
        }));
        console.log("Game over with success.")
    }
    gameOverWithFailed() {
        this.stopGame();
        soundEffect.failedSound.play();
        document.dispatchEvent(new CustomEvent(GAME_FAILED_EVENT, {
            detail: {
                score: this.score,
                total: GOLD_MINE_NUMBER,
            }
        }));
        console.log("Game over with fail.");
    }

    // listening keyboard input
    listenKeyEvent() {
        let tank = this.scenes.tank;
        let scenes = this.scenes;

        document.addEventListener("keydown", (keyEvent) => {
            if (this.isGameOver) {
                return;
            }
            switch (keyEvent.key) {
                case "ArrowUp":
                case "w":
                    tank.turnUp();
                    scenes.moveTo(tank, 0, -1);
                    break;
                case "ArrowDown":
                case "s":
                    tank.turnDown();
                    scenes.moveTo(tank, 0, 1);
                    break;
                case "ArrowRight":
                case "d":
                    tank.turnRight();
                    scenes.moveTo(tank, 1, 0);
                    break;
                case "ArrowLeft":
                case "a":
                    tank.turnLeft();
                    scenes.moveTo(tank, -1, 0);
                    break;
                case " ":
                    scenes.fight(tank)
                    break;
                case "Enter":
                    let isRunning = scenes.pause();
                    if(isRunning) {
                        document.dispatchEvent(new Event(GAME_RESUME_EVENT));
                        soundEffect.backgroundSound.play();
                        if (this.isLimitedTime) {
                            this.setTimeoutForLimitedGame();
                        }
                    } else {
                        document.dispatchEvent(new Event(GAME_PAUSED_EVENT));
                        soundEffect.backgroundSound.stop();
                        if (this.isLimitedTime) {
                            this.clearTimeoutForLimitedGame();
                        }
                    }
            }
        });
    }

    setTimeoutForLimitedGame() {
        this.gameOverTimeTimer = setTimeout(() => {
            this.runOutTime();
        }, (this.lastSeconds + 1) * 1000);

        this.lastTimeTimer = setInterval(() => {
            this.updateTime();
        }, 1000);
    }
    clearTimeoutForLimitedGame() {
        clearTimeout(this.gameOverTimeTimer);
        clearInterval(this.lastTimeTimer);
    }

    play(minutes) {

        if (minutes > 0) {
            this.challengeMinutes = minutes;
            this.isLimitedTime = true;
            this.lastSeconds = minutes * 60;
            this.setTimeoutForLimitedGame();
        }

        this.scenes.generateGoldStone(GOLD_MINE_NUMBER);
        this.scenes.generateGoldGuard(GUARD_NUMBER);
        this.scenes.addTank();
        this.scenes.run();
        this.genInformation();
        this.listenKeyEvent();

        soundEffect.backgroundSound.play();

        document.addEventListener(SCORE_UP_EVENT, (evt) => {
            this.score += evt.detail.score;
            this.diggedMine++;
            soundEffect.scoreUpSound.play();
        });
        document.addEventListener(SCORE_DOWN_EVENT, (evt) => {
            this.score += evt.detail.score;
            soundEffect.scoreDownSound.play();
        });
        
        
    }

    // still not work, because of addEventListener
    // replay() {
    //     this.isGameOver = false;
    //     this.scenes.reset();
    //     this.play(this.challengeMinutes, true);
    // }
}

export {
    Digger,
    GAME_PAUSED_EVENT,
    GAME_RESUME_EVENT,
    GAME_FAILED_EVENT,
    GAME_SUCCESS_EVENT,
}