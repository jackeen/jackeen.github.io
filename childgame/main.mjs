import { Screen } from "./module/screen.mjs";
import {
    Digger,
    GAME_PAUSED_EVENT,
    GAME_RESUME_EVENT,
    GAME_SUCCESS_EVENT,
    GAME_FAILED_EVENT,
} from "./games/digger.mjs";

// init screen
const width = document.body.clientWidth * devicePixelRatio;
const height = document.body.clientHeight * devicePixelRatio;

// init game
let screen = new Screen("canvas", width, height);
screen.generatePixels(10, 1, "#222");
let intro = document.getElementById("introduce");
let btnStart = document.getElementById("btn_start");
let gameReady = false;
let digger = new Digger(screen, () => {
    gameReady = true;
    btnStart.disabled = false;
});

// Time setting
var limitedGame = false;
var playMinutes = 0;
function setTimeMode(mode) {
    let time = document.getElementById("time_min");
    if (mode === "limited") {
        time.disabled = false;
        limitedGame = true;
        playMinutes = 5;
        time.value = 5;
    } else {
        limitedGame = false;
        time.disabled = true;
    }
}
document.getElementById("time_min").addEventListener("change", (e) => {
    let time = e.target;
    let m = parseInt(time.value);
    if (isNaN(m)) {
        time.value = 5;
        playMinutes = 5;
    } else {
        playMinutes = m;
    }
});
document.getElementById("infinite_min").addEventListener("change", (e) => {
    let radio = e.target;
    if (radio.checked) {
        setTimeMode(radio.value);
    }
});
document.getElementById("fixed_min").addEventListener("change", (e) => {
    let radio = e.target;
    if (radio.checked) {
        setTimeMode(radio.value);
    }
});

// game event actions
var pauseCover = document.getElementById("pause");
var gameOver = document.getElementById("game_over");
document.addEventListener(GAME_PAUSED_EVENT, () => {
    pauseCover.showModal();
});
document.addEventListener(GAME_RESUME_EVENT, () => {
    pauseCover.close();
});
document.addEventListener(GAME_FAILED_EVENT, () => {
    game_over.showModal();
    gameOver.classList.remove("success");
    gameOver.classList.add("failed");
});
document.addEventListener(GAME_SUCCESS_EVENT, () => {
    game_over.showModal();
    gameOver.classList.remove("failed");
    gameOver.classList.add("success");
});

// replay
document.getElementById("replay_failed").addEventListener("click", () => {
    document.location.reload();
});
document.getElementById("replay_success").addEventListener("click", () => {
    document.location.reload();
});

btnStart.addEventListener("click", () => {
    if (!gameReady) {
        return;
    }
    let playTime = 0;
    if (limitedGame) {
        playTime = playMinutes;
    }
    digger.play(playTime, false);
    screen.canvas.focus();
});
intro.showModal();

