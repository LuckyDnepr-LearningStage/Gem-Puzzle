class Game15 {
    constructor(target, cellSize, cellsByEdge, cellFillColor, numberColor) {
        this.cellsByEdge = cellsByEdge;
        this.winState = this.generateWinState().flat();
        this.state = this.generateStartState();
        //this.state = this.generateWinState();
        this.target = target;
        this.cellSize = +cellSize;
        this.clicks = 0;
        this.cellColor = cellFillColor;
        this.numberColor = numberColor;
        this.nullCell = {
            rowIndex: this.cellsByEdge - 1,
            colIndex: this.cellsByEdge - 1,
        };
    }
    generateStartState() {
        let isStateUnResolvable, startState;

        do {
            const winState = [...this.winState];
            winState.pop();
            startState = [];
            for (let i = 0; i < this.cellsByEdge; i++) {
                startState[i] = [];
                for (let j = 0; j < this.cellsByEdge; j++) {
                    if (
                        i !== this.cellsByEdge - 1 ||
                        j !== this.cellsByEdge - 1
                    ) {
                        const ind = Math.floor(
                            Math.random() * (winState.length - 1)
                        );
                        startState[i].push(...winState.splice(ind, 1));
                    } else {
                        startState[i].push(0);
                    }
                }
            }
            isStateUnResolvable = isUnresolvable(startState, this.cellsByEdge);
            console.log(isStateUnResolvable);
        } while (isStateUnResolvable);

        return startState;

        function isUnresolvable(state, holeRow) {
            const demoState = state.map((row) => row.map((el) => el)).flat();
            let count = 0;
            demoState.forEach((el, i, arr) => {
                for (let j = i + 1; j < demoState.length - 2; j++) {
                    if (arr[j] < el) {
                        count++;
                    }
                }
            });
            return (count + holeRow) % 2 !== 0;
        }
    }

    generateWinState() {
        return new Array(this.cellsByEdge)
            .fill(new Array(this.cellsByEdge).fill(0))
            .map((row, i) => {
                return row.map((col, j) =>
                    i === this.cellsByEdge - 1 && j === this.cellsByEdge - 1
                        ? 0
                        : j + 1 + this.cellsByEdge * i
                );
            });
    }

    getClicks() {
        return this.clicks;
    }
    cellRender(x, y) {
        this.target.fillStyle = this.cellColor;
        this.target.fillRect(
            x + 2,
            y + 2,
            this.cellSize - 4,
            this.cellSize - 4
        );
    }
    numberStyle(color) {
        this.target.font = "bold " + this.cellSize / 2 + "px system-ui";
        this.target.textAlign = "center";
        this.target.textBaseline = "middle";
        this.target.fillStyle = this.numberColor;
    }
    draw() {
        this.target.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < this.cellsByEdge; i++) {
            for (let j = 0; j < this.cellsByEdge; j++) {
                if (this.state[i][j] > 0) {
                    this.cellRender(j * this.cellSize, i * this.cellSize);
                    this.numberStyle();
                    this.target.fillText(
                        this.state[i][j],
                        j * this.cellSize + this.cellSize / 2,
                        i * this.cellSize + this.cellSize / 2
                    );
                }
            }
        }
    }

    moveBone(row, col) {
        const isMovebleVertical =
            (row - 1 == this.nullCell.rowIndex ||
                row + 1 == this.nullCell.rowIndex) &&
            col == this.nullCell.colIndex;
        const isMovebleHorisintal =
            (col - 1 == this.nullCell.colIndex ||
                col + 1 == this.nullCell.colIndex) &&
            row == this.nullCell.rowIndex;

        if (isMovebleVertical || isMovebleHorisintal) {
            [
                this.state[this.nullCell.rowIndex][this.nullCell.colIndex],
                this.state[row][col],
            ] = [
                this.state[row][col],
                this.state[this.nullCell.rowIndex][this.nullCell.colIndex],
            ];
            [this.nullCell.rowIndex, this.nullCell.colIndex] = [row, col];

            this.clicks++;
        }
        this.draw();
        this.winCheck();
    }

    winCheck() {
        const currState = this.state.map((row) => row.map((el) => el)).flat(),
            check =
                currState.filter((el, i) => el !== this.winState[i]).length ===
                0;
        if (check) alert("win!");
    }
}

const body = document.querySelector("body");
const canvas = document.createElement("canvas");
canvas.setAttribute("width", "330");
canvas.setAttribute("height", "330");

body.appendChild(canvas);

let context = canvas.getContext("2d");
/*
  context.fillRect(0, 0, canvas.width, canvas.height);

  let cellSize = canvas.width / 4;

  let game = new Game(context, cellSize);
  game.mix(300);
  game.draw();
 */

const game = new Game15(context, 110, 3, "#deb887", "#000000");
game.draw();
/* game.moveBone(2, 1);
game.moveBone(1, 1);
game.moveBone(1, 0);
game.moveBone(0, 0); */
console.log(game.state);
