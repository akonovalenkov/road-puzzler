
import {TileType, InternalTileType, TileOpType} from './enums';


export interface SideConnection {
    readonly top?: Node;
    readonly bot?: Node;
    readonly left?: Node;
    readonly right?: Node;
}

export interface Tile {
    readonly name: string;
    readonly type: TileType | InternalTileType;
    readonly rotationAngle: number;
    sideConn: SideConnection;
}

export interface TileTypesWithCount {
    tileType: TileType;
    count: number;
}

export interface Node {
    connected: Set<Node>;
    tile: Tile;
}

export interface TileSetItem {
    orientedTiles: Tile[];
    count: number;
}

export interface TileInfo {
    type: TileType;
    rotationAngle: number;
}

export interface TileOp {
    boardI: number;
    boardJ: number;
    tileInfo: TileInfo;
    type: TileOpType;
}
