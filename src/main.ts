import { game } from "./game";
import { TileType, TileOpType } from "./enums";
import { TileOp } from "./interfaces";

export async function runNewGame() {
    const myGameId = ++currentGameId;

    const boardRowsEl = <HTMLInputElement> document.getElementById('board-rows-count');
    const boardColsEl = <HTMLInputElement> document.getElementById('board-cols-count');

    const boardRows = parseInt(boardRowsEl.value);
    const boardCols = parseInt(boardColsEl.value);

    refreshBoard(boardRows, boardCols);

    const arc1Count = <HTMLInputElement> document.getElementById('arc1-count');
    const arcs2Count = <HTMLInputElement> document.getElementById('arcs2-count');
    const birdCount = <HTMLInputElement> document.getElementById('bird-count');
    const bridgeCrossCount = <HTMLInputElement> document.getElementById('bridge-cross-count');
    const crossCount = <HTMLInputElement> document.getElementById('cross-count');


    const tileSet = [
        {
            tileType: TileType.Arc1,
            count: parseInt(arc1Count.value)
        },
        {
            tileType: TileType.Arcs2,
            count: parseInt(arcs2Count.value)
        },
        {
            tileType: TileType.Bird,
            count: parseInt(birdCount.value)
        },
        {
            tileType: TileType.BridgeCross,
            count: parseInt(bridgeCrossCount.value)
        },
        {
            tileType: TileType.Cross,
            count: parseInt(crossCount.value)
        }
    ];

    shuffle(tileSet);

    const gameSteps = game(
        tileSet,
        boardRows,
        boardCols
    );
    const delayedGameSteps = delayed(gameSteps, 100);
    for await (let step of delayedGameSteps) {
        if (currentGameId != myGameId) {
            return;
        }
        render(step, boardRows);
    }
}

function render(tileOp: TileOp, boardRows: number) {
    const { boardI, boardJ, tileInfo, type } = tileOp;

    let el = document.getElementsByClassName('tile');

    const gridTileIndex = (boardI-1)*boardRows + boardJ - 1;

    switch (type) {
        case TileOpType.Placed: 
            el[gridTileIndex].setAttribute('tile-type', tileInfo.type.toLowerCase());
            if (tileInfo.rotationAngle != 0) {
                el[gridTileIndex].setAttribute('tile-rotation-angle', tileInfo.rotationAngle.toString());
            }
        break;
        case TileOpType.Rotated:
            el[gridTileIndex].setAttribute('tile-animate-rotation', 'true');
            el[gridTileIndex].setAttribute('tile-rotation-angle', tileInfo.rotationAngle.toString());
        break;
        case TileOpType.Removed:
            el[gridTileIndex].removeAttribute('tile-type');
            el[gridTileIndex].removeAttribute('tile-animate-rotation');
            el[gridTileIndex].removeAttribute('tile-rotation-angle');
        break;
    }
}

function* delayed<T, TNext, TReturn>(gen: Generator<T,TNext,TReturn>, time: number) {
    let state = gen.next();
    while (!state.done) {
        yield delay<T>(state.value, time);
        state = gen.next();
    }
}

function delay<T>(value: T, time: number) {
    return new Promise<T>(resolve => setTimeout(resolve, time, value));
}

function shuffle(array: any[]) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

function refreshBoard(rows: number, cols: number) {
    const board = <HTMLElement> document.getElementById('board');
    board.innerHTML = "";

    const buffer = [];

    for (let i = 0; i < rows + 2; i++) {
        for (let j = 0; j < cols + 2; j++) {
            if (i > 0 && j > 0 && i <= rows && j <= cols) {
                buffer.push('<div class="tile"></div>');
            } else {
                buffer.push('<div class="hero">hero</div>');
            }
        }
    }
    board.innerHTML = buffer.join('\n');
}

let currentGameId = 0;