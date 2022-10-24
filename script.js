import { Game15 } from "./game15/game15.js";

const body = document.body;
const contentWidth = document.documentElement.clientWidth,
    contentHeight = document.documentElement.clientHeight;
let canvasSize;

globalThis.cellsPerEdge = 3;
globalThis.timerID = 0;
const padding = 10;

document.addEventListener("wingame", () => {
    clearInterval(globalThis.timerID);
    const count = +document.querySelector("#moves_count").textContent + 1,
        time =
            document.querySelector("#minutes").textContent +
            ":" +
            document.querySelector("#seconds").textContent;
    document.querySelector("#wincount").innerHTML = count;
    document.querySelector("#wintime").innerHTML = time;
    timer(false);
    switchWinPopup();
    let storage = window.localStorage.getItem("winners");
    if (storage) {
        storage += `${count}|${time}|`;
    } else {
        storage = `${count}|${time}|`;
    }
    localStorage.setItem("winners", storage);
    localStorage.removeItem("state");
    localStorage.removeItem("cellsPerEdge");
    localStorage.removeItem("time");
});

alert("Изначально сделал сюда deploy, но заканчивал в приватном школьном репозитории. Сейчас произойдет redirect на актуальную версию выполненного задания. Спасибо за понимание :)");
window.location.replace("https://rolling-scopes-school.github.io/luckydnepr-JSFE2022Q3/RSS-Gem-Puzzle/");

pageInit();

function pageInit() {
    if (contentHeight < 1181 || contentWidth < 1181) {
        canvasSize = Math.min(0.6 * contentHeight, 0.6 * contentWidth);
    };
    if (contentHeight < 768 || contentWidth < 768) {
        canvasSize = Math.min(0.8 * contentHeight, 0.8 * contentWidth);
    } else {
        canvasSize = Math.min(0.5 * contentHeight, 0.5 * contentWidth);
    }
    body.innerHTML = createHTML(canvasSize - 2 * padding);
    const canvas = document.querySelector("canvas");
    gameInit(canvas, canvasSize, "#6495ed", "#deb887", "#000000");
    addMenuClickListeners();
}

function gameInit(target, canvasSize, bgColor, cellColor, numberColor) {
    if (localStorage.getItem("cellsPerEdge")) {
        globalThis.cellsPerEdge = +localStorage.getItem("cellsPerEdge");
    }
    let moves = 0;
    if (localStorage.getItem("moves")) {
        moves = +localStorage.getItem("moves");
    }
    const cellSize = Math.floor(
        (canvasSize - 2 * padding) / globalThis.cellsPerEdge
    );
    const game = new Game15(
        target,
        cellSize,
        globalThis.cellsPerEdge,
        bgColor,
        cellColor,
        numberColor
    );
    game.draw();
    document.querySelector("#moves_count").innerHTML = game.clicks;
    addCanvasListeners(target, game);
    timer(true);
}

function addCanvasListeners(target, gameObj) {
    target.addEventListener("click", (e) => {
        const col = Math.floor(
                (e.pageX - target.offsetLeft) / gameObj.cellSize
            ),
            row = Math.floor((e.pageY - target.offsetTop) / gameObj.cellSize);
        eventHandler(row, col, gameObj);
    });

    target.addEventListener("touchend", (e) => {
        const col = Math.floor(
                (e.touches[0].pageX - target.offsetLeft) / gameObj.cellSize
            ),
            row = Math.floor(
                (e.touches[0].pageY - target.offsetTop) / gameObj.cellSize
            );
        eventHandler(row, col, gameObj);
    });

    function eventHandler(row, col, gameObj) {
        const isMoveDone = gameObj.moveBone(row, col);
        if (!document.querySelector("#sound_onoff").checked && isMoveDone) {
            document.querySelector("#audio").play();
        }
        updateStatus(gameObj);
    }
}

function createAddonsHTML() {
    return `<audio id="audio" src="./sounds/move.wav"></audio>
    <div class="shadow hide">
    </div>
    <div class="results_table hide">
        <button class="close_popup">Close results</button>
        <div class="results_div"></div>
    </div>
    <div class="menu">
        <ul class="game_menu">
            <li class="game_menu_item start">Shuffle & Restart</li>
            <input type="checkbox" id="sound_onoff"></input>
            <label for="sound_onoff" class="sound_onoff_label">Sound</label>
            <li class="game_menu_item results">Results</li>
        </ul>
        <ul class="game_status">
            <li class="game_status_item"> Moves: <span id="moves_count">0</span></li>
            <li class="game_status_item"> Time: <span id="minutes">00</span> : <span id="seconds">00</span></li>
        </ul>
        <ul class="game_settings">
            <input type="radio" id="cells3" class="game_settings_item_radio" data-size="3" name="cellsPerEdge"></input>
            <label for="cells3" class="game_settings_item">3 x 3</label>
            <input type="radio" id="cells4" class="game_settings_item_radio" data-size="4" name="cellsPerEdge"></radio>
            <label for="cells4" class="game_settings_item">4 x 4</label>
            <input type="radio" id="cells5" class="game_settings_item_radio" data-size="5" name="cellsPerEdge"></radio>
            <label for="cells5" class="game_settings_item">5 x 5</label>
            <input type="radio" id="cells6" class="game_settings_item_radio" data-size="6" name="cellsPerEdge"></radio>
            <label for="cells6" class="game_settings_item">6 x 6</label>
            <input type="radio" id="cells7" class="game_settings_item_radio" data-size="7" name="cellsPerEdge"></radio>
            <label for="cells7" class="game_settings_item">7 x 7</label>
            <input type="radio" id="cells8" class="game_settings_item_radio" data-size="8" name="cellsPerEdge"></radio>
            <label for="cells8" class="game_settings_item">8 x 8</label>
        </ul>
    </div>`;
}

function createHTML(canvasSize) {
    return `
    <div class="main">
        ${createAddonsHTML()}
        <div class="canvas_div">
            <canvas class="canvas" width="${canvasSize}" height="${canvasSize}">
            </canvas>
            <div class="win_popup hide">
                <p>"Hooray!</br>You solved the puzzle in </br><span id="wintime"></span> </br>and </br><span id="wincount"></span> moves!"
                </p>
            </div>
        </div>
    </div>
    `;
}

function updateStatus(game) {
    document.querySelector("#moves_count").innerHTML = game.clicks;
}

function addMenuClickListeners() {
    document.querySelector(".start").addEventListener("click", () => {
        clearInterval(globalThis.timerID);
        localStorage.removeItem("state");
        localStorage.removeItem("cellsPerEdge");
        localStorage.removeItem("moves");
        localStorage.removeItem("time");
        const canvas = document.querySelector("canvas");
        pageInit(canvas, canvasSize, "#6495ed", "#deb887", "#000000");
        timer(true);
        document.querySelector(".canvas").classList.remove("hide");
        document.querySelector(".win_popup").classList.add("hide");
    });

    document.querySelector(".game_settings").addEventListener("input", (e) => {
        if (e.target.classList.contains("game_settings_item_radio")) {
            clearInterval(globalThis.timerID);
            globalThis.cellsPerEdge = +e.target.dataset.size;
            localStorage.removeItem("state");
            localStorage.removeItem("time");
            localStorage.removeItem("moves");
            localStorage.setItem("cellsPerEdge", globalThis.cellsPerEdge);
            const canvas = document.querySelector("canvas");
            pageInit(canvas, canvasSize, "#6495ed", "#deb887", "#000000");
            timer(true);
        }
    });

    document.querySelector(".results").addEventListener("click", () => {
        const winners = localStorage.getItem("winners").split("|");
        winners.pop();
        winners.reverse();
        const winGamesTable = winners
            .map((el, i) => {
                if (i % 2 !== 0) {
                    return `Moves: ${el}</p>`;
                } else {
                    return `<p><span>game ${
                        winners.length / 2 - i / 2
                    }:   </span>Time: ${el} -> `;
                }
            })
            .join("");
        const resultDiv = document.querySelector(".results_div");
        resultDiv.innerHTML = winGamesTable;
        switchPopup();
    });

    document.querySelector(".shadow").addEventListener("click", switchPopup);
    document
        .querySelector(".close_popup")
        .addEventListener("click", switchPopup);
}

function timer(onOff) {
    let dm = 0,
        ds = 0;
    if (onOff) {
        if (localStorage.getItem("time")) {
            const time = localStorage.getItem("time").split(":");
            dm = +time[0];
            ds = +time[1];
            localStorage.removeItem("time");
        }
        const minContainer = document.querySelector("#minutes"),
            secContainer = document.querySelector("#seconds");
        const startTime = new Date();
        globalThis.timerID = setInterval(() => {
            let currTime = new Date(),
                dTime = currTime - startTime + dm * 60000 + ds * 1000,
                dMinutes = Math.floor(dTime / 60000),
                dSeconds = Math.floor(dTime / 1000) - dMinutes * 60;
            dMinutes = dMinutes < 10 ? "0" + dMinutes : dMinutes;
            dSeconds = dSeconds < 10 ? "0" + dSeconds : dSeconds;
            minContainer.innerHTML = dMinutes;
            secContainer.innerHTML = dSeconds;
            localStorage.setItem("time", `${dMinutes}:${dSeconds}`);
        }, 1000);
    } else {
        clearInterval(globalThis.timerID);
    }
}

function switchWinPopup() {
    document.querySelector(".canvas").classList.toggle("hide");
    document.querySelector(".win_popup").classList.toggle("hide");
}

function switchPopup() {
    document.querySelector(".shadow").classList.toggle("hide");
    document.querySelector(".results_table").classList.toggle("hide");
}
