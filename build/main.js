var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import { game } from "./game.js";
import { TileType, TileOpType } from "./enums.js";
export function runNewGame() {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        const myGameId = ++currentGameId;
        const boardRowsEl = document.getElementById('board-rows-count');
        const boardColsEl = document.getElementById('board-cols-count');
        const boardRows = parseInt(boardRowsEl.value);
        const boardCols = parseInt(boardColsEl.value);
        refreshBoard(boardRows, boardCols);
        const arc1Count = document.getElementById('arc1-count');
        const arcs2Count = document.getElementById('arcs2-count');
        const birdCount = document.getElementById('bird-count');
        const bridgeCrossCount = document.getElementById('bridge-cross-count');
        const crossCount = document.getElementById('cross-count');
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
        const gameSteps = game(tileSet, boardRows, boardCols);
        const delayedGameSteps = delayed(gameSteps, 100);
        try {
            for (var delayedGameSteps_1 = __asyncValues(delayedGameSteps), delayedGameSteps_1_1; delayedGameSteps_1_1 = yield delayedGameSteps_1.next(), !delayedGameSteps_1_1.done;) {
                let step = delayedGameSteps_1_1.value;
                if (currentGameId != myGameId) {
                    return;
                }
                render(step, boardRows);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (delayedGameSteps_1_1 && !delayedGameSteps_1_1.done && (_a = delayedGameSteps_1.return)) yield _a.call(delayedGameSteps_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
function render(tileOp, boardRows) {
    const { boardI, boardJ, tileInfo, type } = tileOp;
    let el = document.getElementsByClassName('tile');
    const gridTileIndex = (boardI - 1) * boardRows + boardJ - 1;
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
function* delayed(gen, time) {
    let state = gen.next();
    while (!state.done) {
        yield delay(state.value, time);
        state = gen.next();
    }
}
function delay(value, time) {
    return new Promise(resolve => setTimeout(resolve, time, value));
}
function shuffle(array) {
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
function refreshBoard(rows, cols) {
    const board = document.getElementById('board');
    board.innerHTML = "";
    const buffer = [];
    for (let i = 0; i < rows + 2; i++) {
        for (let j = 0; j < cols + 2; j++) {
            if (i > 0 && j > 0 && i <= rows && j <= cols) {
                buffer.push('<div class="tile"></div>');
            }
            else {
                buffer.push('<div class="hero">hero</div>');
            }
        }
    }
    board.innerHTML = buffer.join('\n');
}
let currentGameId = 0;
