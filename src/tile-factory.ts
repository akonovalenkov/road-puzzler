import { TileType, HeroPosition, InternalTileType } from "./enums";
import { Tile, Node, TileSetItem, SideConnection, TileTypesWithCount } from "./interfaces";



export function createTileSet(tileTypesWithCount: TileTypesWithCount[]) : TileSetItem[] {
    const factories = new Map();
    factories.set(TileType.Arc1, createOrientedTilesFor1Arc);
    factories.set(TileType.Arcs2, createOrientedTilesFor2Arcs);
    factories.set(TileType.Bird, createOrientedTilesForBird);
    factories.set(TileType.BridgeCross, createOrientedTilesForBridgeCross);
    factories.set(TileType.Cross, createOrientedTilesForCross);

    return tileTypesWithCount.map(twc => ({
            orientedTiles: factories.get(twc.tileType)(),
            count: twc.count
        })
    );
}

export function createHeroTile(heroName: string, pos: HeroPosition) {
    const tile: Tile = {
        name: heroName,
        rotationAngle: 0,
        type: InternalTileType.Hero,
        sideConn: { }
    }

    const node: Node = { connected: new Set(), tile };

    if (pos == HeroPosition.Top) tile.sideConn = {bot: node};
    else if (pos == HeroPosition.Bot) tile.sideConn = {top: node};
    else if (pos == HeroPosition.Left) tile.sideConn = {right: node};
    else if (pos == HeroPosition.Right) tile.sideConn = {left: node};

    return tile;
}

function createOrientedTilesForCross() {
    return [createTileCrossRotation0()];
}

function createTileCrossRotation0() {
    const tile: Tile = {
        name: 'road tile cross',
        type: TileType.Cross,
        rotationAngle: 0,
        sideConn: {}
    };

    const top: Node = { connected: new Set(), tile };
    const right: Node = {connected: new Set(), tile };
    const bot: Node = {connected: new Set(), tile };
    const left: Node = {connected: new Set(), tile };

    connect(top, left);
    connect(top, right);
    connect(top, bot);

    const sideConn: SideConnection = { top, bot, right, left };

    tile.sideConn = sideConn;

    return tile;
}

function createOrientedTilesForBridgeCross() {
    const rotation0 = createTileBridgeCrossRotation0();
    const rotation90 = rotate(rotation0);
    return [rotation0, rotation90];
}

function createTileBridgeCrossRotation0() {
    const tile: Tile = {
        name: 'road tile bridge cross',
        type: TileType.BridgeCross,
        rotationAngle: 0,
        sideConn: {}
    };

    const top: Node = { connected: new Set(), tile };
    const right: Node = {connected: new Set(), tile };
    const bot: Node = {connected: new Set(), tile };
    const left: Node = {connected: new Set(), tile };

    connect(top, bot);
    connect(left, right);

    const sideConn: SideConnection = { top, bot, right, left };

    tile.sideConn = sideConn;

    return tile;
}

function createOrientedTilesForBird() {
    const rotation0 = createTileBirdRotation0();
    const rotation90 = rotate(rotation0);
    const rotation180 = rotate(rotation90);
    const rotation270 = rotate(rotation180);

    return [rotation0, rotation90, rotation180, rotation270];
}

function createTileBirdRotation0() {
    const tile: Tile = {
        name: 'road tile bird',
        type: TileType.Bird,
        rotationAngle: 0,
        sideConn: {}
    };

    const top: Node = { connected: new Set(), tile };
    const right: Node = {connected: new Set(), tile };
    const left: Node = {connected: new Set(), tile };

    connect(top, left);
    connect(top, right);

    const sideConn: SideConnection = { top, right, left };

    tile.sideConn = sideConn;

    return tile;
}

function createOrientedTilesFor2Arcs() {
    const rotation0 = createTile2ArcsRotation0();
    const rotation90 = rotate(rotation0);

    return [ rotation0, rotation90 ];
}

function createTile2ArcsRotation0() {
    const tile: Tile = {
        name: 'road tile 2 arcs',
        type: TileType.Arcs2,
        rotationAngle: 0,
        sideConn: {}
    };

    const top: Node = { connected: new Set(), tile };
    const bot: Node = { connected: new Set(), tile };
    const right: Node = {connected: new Set(), tile };
    const left: Node = {connected: new Set(), tile };

    connect(top, left);
    connect(bot, right);

    const sideConn: SideConnection = { top, right, left, bot };

    tile.sideConn = sideConn;

    return tile;
}

function createOrientedTilesFor1Arc() {
    const rotation0 = createTile1Arc0Rotation();
    const rotation90 = rotate(rotation0);
    const rotation180 = rotate(rotation90);
    const rotation270 = rotate(rotation180);

    return [ rotation0, rotation90, rotation180, rotation270 ];
}

function createTile1Arc0Rotation() {
    const tile: Tile = {
        name: 'road tile 1 arc',
        type: TileType.Arc1,
        rotationAngle: 0,
        sideConn: {}
    };

    const top: Node = { connected: new Set(), tile };
    const left: Node = {connected: new Set(), tile };

    connect(top, left);

    const sideConn: SideConnection = { top, left };

    tile.sideConn = sideConn;

    return tile;
}

function rotate(tile: Tile) {
    const rotatedTile: Tile = {
        name: tile.name,
        type: tile.type,
        rotationAngle: (tile.rotationAngle + 90) % 360,
        sideConn: {}
    };

    const originTop = tile.sideConn.top;
    const originBot = tile.sideConn.bot;
    const originLeft = tile.sideConn.left;
    const originRight = tile.sideConn.right;

    const top: Node | undefined = originLeft ? { connected: new Set(), tile: rotatedTile } : undefined;
    const bot: Node | undefined = originRight ? { connected: new Set(), tile: rotatedTile } : undefined;
    const left: Node | undefined = originBot ? { connected: new Set(), tile: rotatedTile } : undefined;
    const right: Node | undefined = originTop ? { connected: new Set(), tile: rotatedTile } : undefined;

    if (isConnected(originLeft, originTop)) connect(top, right);
    if (isConnected(originLeft, originRight)) connect(top, bot);
    if (isConnected(originLeft, originBot)) connect(left, top);
    if (isConnected(originTop, originRight)) connect(right, bot);
    if (isConnected(originTop, originBot)) connect(right, left);
    if (isConnected(originRight, originBot)) connect(left, bot);

    const sideConn: SideConnection = { top, bot, right, left };

    rotatedTile.sideConn = sideConn;

    return rotatedTile;
}

function connect(node1?: Node, node2?: Node) {
    if (node1 && node2) {
        node1.connected.add(node2);
        node2.connected.add(node1);
    }
}

function isConnected(node1?: Node, node2?: Node) {
    return node1 && node2 && node1.connected.has(node2) && node2.connected.has(node1);
}
