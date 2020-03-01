export var TileType;
(function (TileType) {
    TileType["Arc1"] = "Arc1";
    TileType["Arcs2"] = "Arcs2";
    TileType["Bird"] = "Bird";
    TileType["BridgeCross"] = "BridgeCross";
    TileType["Cross"] = "Cross";
})(TileType || (TileType = {}));
export var InternalTileType;
(function (InternalTileType) {
    InternalTileType["Hero"] = "Hero";
    InternalTileType["Null"] = "Null";
})(InternalTileType || (InternalTileType = {}));
export var HeroPosition;
(function (HeroPosition) {
    HeroPosition[HeroPosition["Top"] = 0] = "Top";
    HeroPosition[HeroPosition["Bot"] = 1] = "Bot";
    HeroPosition[HeroPosition["Left"] = 2] = "Left";
    HeroPosition[HeroPosition["Right"] = 3] = "Right";
})(HeroPosition || (HeroPosition = {}));
export var TileOpType;
(function (TileOpType) {
    TileOpType[TileOpType["Placed"] = 0] = "Placed";
    TileOpType[TileOpType["Rotated"] = 1] = "Rotated";
    TileOpType[TileOpType["Removed"] = 2] = "Removed";
})(TileOpType || (TileOpType = {}));
