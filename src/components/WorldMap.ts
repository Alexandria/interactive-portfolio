import Phaser from "phaser";
import { debugDraw } from "../utils/debugDraw";
import { PictureOptions } from "../types";

class Map {
  public scene: Phaser.Scene;
  public map: Phaser.Tilemaps.Tilemap;
  constructor(scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap) {
    this.scene = scene;
    this.map = map;
  }
  worldDebug() {}
  addCollision(
    object1: Phaser.Types.Physics.Arcade.ArcadeColliderType,
    object2: Phaser.Types.Physics.Arcade.ArcadeColliderType,
  ) {}
}

class WorldMap extends Map {
  private wallLayer: Phaser.Tilemaps.TilemapLayer;
  private decorLayer: Phaser.Tilemaps.TilemapLayer;
  private floorLayer: Phaser.Tilemaps.TilemapLayer;
  private pictureObjects: Phaser.Tilemaps.ObjectLayer | null;
  private yPosition: number;
  constructor(
    scene: Phaser.Scene,
    map: Phaser.Tilemaps.Tilemap,
    scale?: number,
  ) {
    super(scene, map);
    this.scene = scene;
    const xPosition = 0;
    this.yPosition = 100;
    const wallTileset = map.addTilesetImage("basic-wallpapper", "wallTiles")!;
    const edgeTileset = map.addTilesetImage("basic-wall-edges", "edgeTiles")!;
    const floorTileSet = map.addTilesetImage("basic-floor", "floorTiles")!;
    const decorTileSet = map.addTilesetImage("decorations", "decorTiles")!;
    const storageTileSet = map.addTilesetImage("storage", "storageTiles")!;

    this.pictureObjects = map.getObjectLayer("markers");
    console.log("picuture objects", this.pictureObjects);

    this.wallLayer = map.createLayer(
      "walls",
      [wallTileset, edgeTileset],
      xPosition,
      this.yPosition,
    )!;
    this.decorLayer = map.createLayer(
      "decor",
      [decorTileSet, storageTileSet],
      xPosition,
      this.yPosition,
    )!;

    this.floorLayer = map.createLayer(
      "ground",
      floorTileSet,
      xPosition,
      this.yPosition,
    )!;

    if (scale) {
      this.wallLayer.scale = scale;
      this.decorLayer.scale = scale;
      this.floorLayer.scale = scale;
    }

    this.wallLayer.setOrigin(0, 0);

    this.wallLayer.setCollisionByProperty({ collides: true });
  }

  getWallLayerSize() {
    return {
      width: this.wallLayer.width,
      height: this.wallLayer.height,
    };
  }

  worldDebug() {
    debugDraw(this.scene, this.wallLayer);
  }

  addCollision(player: Phaser.Types.Physics.Arcade.ArcadeColliderType) {
    this.scene.physics.add.collider(player, this.wallLayer);
  }

  getPictureObjects() {
    return this.pictureObjects;
  }

  getMarkerPositionByName(name: PictureOptions) {
    return this.pictureObjects?.objects.find(
      (picture) => picture.name === name,
    );
  }

  setWorldScale(scaleNumber: number) {
    this.wallLayer.scale = scaleNumber;
    this.decorLayer.scale = scaleNumber;
    this.floorLayer.scale = scaleNumber;
  }

  setWorldYPosition(newYPos: number) {
    this.wallLayer.y = newYPos;
    this.decorLayer.y = newYPos;
    this.floorLayer.y = newYPos;
  }
}

export default WorldMap;
