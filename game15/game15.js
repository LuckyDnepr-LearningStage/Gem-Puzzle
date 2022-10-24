export class Game15 {
    constructor(
        target,
        cellSize,
        cellsByEdge,
        bgColor,
        cellFillColor,
        numberColor
    ) {
        this.cellsByEdge = cellsByEdge;
        this.winState = this.generateWinState();
        this.state = this.generateStartState();
        this.target = target;
        this.context = this.target.getContext("2d");
        this.cellSize = +cellSize;
        this.clicks = 0;
        this.cellColor = cellFillColor;
        this.numberColor = numberColor;
        this.bgColor = bgColor;
        this.nullCell = {
            rowIndex: this.cellsByEdge - 1,
            colIndex: this.cellsByEdge - 1,
        };
        this.getStateFromLocalStorage();
        this.setStateToLocalStorage(this.state);
    }
    generateStartState() {
        let isStateUnResolvable, startState;

        do {
            const winState = this.winState
                .map((row) => row.map((el) => el))
                .flat();
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
            isStateUnResolvable = isUnResolvable(startState, this.cellsByEdge);
        } while (isStateUnResolvable);

        return startState;

        function isUnResolvable(state, holeRow) {
            const demoState = state.map((row) => row.map((el) => el)).flat();
            let count = 0;
            demoState.forEach((el, i, arr) => {
                for (let j = i + 1; j < demoState.length - 2; j++) {
                    if (arr[j] < el) {
                        count++;
                    }
                }
            });
            return holeRow % 2 === 0
                ? (count + holeRow) % 2 !== 0
                : (count + holeRow) % 2 === 0;
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
        this.context.fillStyle = this.cellColor;
        this.context.fillRect(
            x + 2,
            y + 2,
            this.cellSize - 4,
            this.cellSize - 4
        );
    }
    numberStyle(color) {
        this.context.font = "bold " + this.cellSize / 2 + "px system-ui";
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.context.fillStyle = this.numberColor;
    }
    draw() {
        this.context.fillStyle = this.bgColor;
        this.context.fillRect(0, 0, this.target.width, this.target.height);
        for (let i = 0; i < this.cellsByEdge; i++) {
            for (let j = 0; j < this.cellsByEdge; j++) {
                if (this.state[i][j] > 0) {
                    this.cellRender(j * this.cellSize, i * this.cellSize);
                    this.numberStyle();
                    this.context.fillText(
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
            localStorage.setItem("moves", this.clicks);
            this.draw();
            this.setStateToLocalStorage(this.state);
            this.winCheck();
            return true;
        }
    }

    winCheck() {
        const currState = this.state.map((row) => row.map((el) => el)).flat(),
            winState = this.winState.map((row) => row.map((el) => el)).flat(),
            check =
                currState.filter((el, i) => el !== winState[i]).length === 0;
        if (check) {
            const wingame = new Event("wingame");
            document.dispatchEvent(wingame);
        }
    }

    setStateToLocalStorage(state) {
        const localState = this.state.map((el) => el.map((ell) => ell)).flat();
        localStorage.setItem("state", localState.join(";"));
        localStorage.setItem("cellsPerEdge", this.cellsByEdge);
    }

    getStateFromLocalStorage() {
        if (localStorage.getItem("state")) {
            const lastState = localStorage.getItem("state").split(";");
            this.state = [];
            for (let i = 0; i < lastState.length; i++) {
                this.state[i] = [];
                for (let j = 0; j < this.cellsByEdge; j++) {
                    this.state[i].push(+lastState.shift());
                }
            }
            this.draw();
        }
        this.findHole();
        if (localStorage.getItem("moves")) {
            this.clicks = +localStorage.getItem("moves");
        }
    }

    findHole() {
        for (let i = 0; i < this.cellsByEdge; i++) {
            for (let j = 0; j < this.cellsByEdge; j++) {
                if (this.state[i][j] === 0) {
                    this.nullCell.rowIndex = i;
                    this.nullCell.colIndex = j;
                    break;
                }
            }
        }
    }
}
