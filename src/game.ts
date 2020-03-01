import { TileTypesWithCount, Tile, TileSetItem, TileOp, TileInfo, Node } from "./interfaces";
import { createTileSet, createHeroTile } from "./tile-factory";
import { TileOpType, InternalTileType, HeroPosition, TileType } from "./enums";


export function* game(tileTypesWithCount: TileTypesWithCount[], boardRows: number, boardCols: number) {
    const tileSet = createTileSet(tileTypesWithCount.filter(twc => twc.count > 0));
    const board = createBoard(boardRows, boardCols);
    yield* gameStepRoutine(board, tileSet, 1, 1, 0);
}

function* gameStepRoutine(board: Tile[][], tileSet : TileSetItem[], nextBoardI: number, nextBoardJ: number, currTileIdx: number)
    : Generator<TileOp, any, void> {

    if (nextBoardI > board.length - 2) {
        // onValidBoardFound(board);
        return;
    }

    while (currTileIdx < tileSet.length && tileSet[currTileIdx].count == 0) {
        currTileIdx++;
    }

    if (currTileIdx >= tileSet.length) {
        // out of tiles
        return;
    }

    for (let k = currTileIdx; k < tileSet.length; k++) {
        if (tileSet[k].count == 0) {
            continue;
        }
        swap(tileSet, k, currTileIdx);
        const tileSetItem = tileSet[currTileIdx];

        const validOrientedTiles = tileSetItem.orientedTiles.filter(tile => canSetTile(board, nextBoardI, nextBoardJ, tile))

        for (const tile of validOrientedTiles) {

            setTile(board, nextBoardI, nextBoardJ, tile);
            tileSetItem.count--;

            if (isRoadTileType(tile.type)) {
                const tileInfo: TileInfo = { type: tile.type, rotationAngle: tile.rotationAngle };
                const tileOpType = tile == validOrientedTiles[0] ? TileOpType.Placed : TileOpType.Rotated;
                const tileOp: TileOp = {boardI: nextBoardI, boardJ: nextBoardJ, tileInfo, type: tileOpType} ;
                yield tileOp;
            } else {
                throw new Error('Illegal tile type');
            }

            const { nextI, nextJ } = getNextBoardIndices(board, nextBoardI, nextBoardJ);
            yield* gameStepRoutine(board, tileSet, nextI, nextJ, currTileIdx);

            tileSetItem.count++;
            removeTile(board, nextBoardI, nextBoardJ);
        }

        swap(tileSet, k, currTileIdx);

        const placedTilesCount = validOrientedTiles.length;
        if (placedTilesCount > 0) {
            const lastOrientedTile = validOrientedTiles[placedTilesCount - 1];
            if (isRoadTileType(lastOrientedTile.type)) {
                const tileInfo: TileInfo = { type: lastOrientedTile.type, rotationAngle: lastOrientedTile.rotationAngle };
                const tileOp: TileOp = {boardI: nextBoardI, boardJ: nextBoardJ, tileInfo, type: TileOpType.Removed};
                yield tileOp;
            }
        }
    }
}

function swap(arr: any[], i: number, j: number) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
}

function getNextBoardIndices(board: Tile[][], i: number, j: number) {
    const tileColsCount = board[0].length - 2;
    let nextI = i;
    let nextJ = j + 1;

    if (nextJ > tileColsCount) {
        nextJ = 1;
        nextI = i + 1;
    }

    return { nextI, nextJ };
}

function canSetTile(board: Tile[][], i: number, j:number, tile: Tile) {
    const boardTopTile = board[i-1][j];
    const boardLeftTile = board[i][j-1];
    const isTopValid = boardTopTile.type == InternalTileType.Hero || !!tile.sideConn.top == !!board[i-1][j].sideConn.bot;
    const isLeftValid = boardLeftTile.type == InternalTileType.Hero || !!tile.sideConn.left == !!board[i][j-1].sideConn.right;
    return isTopValid && isLeftValid;
}

function runNodeOp(board: Tile[][], i: number, j: number, tile: Tile, op: (node1?: Node, node2?: Node) => void ) {
    const sideConn = tile.sideConn;
    if (sideConn.top) op(sideConn.top, board[i-1][j].sideConn.bot);
    if (sideConn.left) op(sideConn.left, board[i][j-1].sideConn.right);
    if (board[i+1][j] && sideConn.bot) op(sideConn.bot, board[i+1][j].sideConn.top);
    if (board[i][j+1] && sideConn.right) op(sideConn.right, board[i][j+1].sideConn.left);
}

function setTile(board: Tile[][], i: number, j: number, tile: Tile) {
    board[i][j] = tile;
    runNodeOp(board, i, j, tile, connect);
}

function removeTile(board: Tile[][], i: number, j: number) {
    const tile = board[i][j];
    runNodeOp(board, i, j, tile, disconnect);
    board[i][j] = nullTile;
}

function disconnect(node1?: Node, node2?: Node) {
    if (node1 && node2) {
        node1.connected.delete(node2);
        node2.connected.delete(node1);
    }
}

function connect(node1?: Node, node2?: Node) {
    if (node1 && node2) {
        node1.connected.add(node2);
        node2.connected.add(node1);
    }
}

const nullTile: Tile = {
    name: 'null tile',
    rotationAngle: 0,
    type: InternalTileType.Null,
    sideConn: {}
};

function createBoard(boardRows: number, boardCols: number): Tile[][] {
    const board = new Array<Tile[]>(boardRows + 2);

    for (let i = 0; i < board.length; i++) {
        board[i] = new Array<Tile>(boardCols + 2);
    }

    for (let i = 1; i < board.length - 1; i++) {
        board[i][0] = createHeroTile(`hero-${i}-${0}`, HeroPosition.Left);
        board[i][board[0].length-1] = createHeroTile(`hero-${i}-${board[0].length - 1}`, HeroPosition.Right);
    }

    for (let j = 1; j < board[0].length - 1; j++) {
        board[0][j] = createHeroTile(`hero-${0}-${j}`, HeroPosition.Top);
        board[board.length-1][j] = createHeroTile(`hero-${board.length-1}-${j}`, HeroPosition.Bot);
    }

    return board;
}

function isRoadTileType(tileType: TileType | InternalTileType): tileType is TileType {
    return tileType in TileType;
}