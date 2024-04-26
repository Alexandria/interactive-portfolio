import Phaser from "phaser";
import { debugDraw } from "../utils/debugDraw";

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
  constructor(
    scene: Phaser.Scene,
    map: Phaser.Tilemaps.Tilemap,
    scale?: number,
  ) {
    super(scene, map);
    this.scene = scene;
    const wallTileset = map.addTilesetImage("basic-wallpapper", "wallTiles")!;
    const edgeTileset = map.addTilesetImage("basic-wall-edges", "edgeTiles")!;
    const floorTileSet = map.addTilesetImage("basic-floors", "floorTiles")!;
    const decorTileSet = map.addTilesetImage("decorations", "decorTiles")!;
    const storageTileSet = map.addTilesetImage("storage", "storageTiles")!;

    this.wallLayer = map.createLayer(
      "walls",
      [wallTileset, edgeTileset],
      100,
      110,
    )!;
    const decor = map.createLayer(
      "decor",
      [decorTileSet, storageTileSet],
      100,
      110,
    )!;
    const floor = map.createLayer("ground", floorTileSet, 100, 110)!;

    if (scale) {
      this.wallLayer.scale = scale;
      decor.scale = scale;
      floor.scale = scale;
    }

    this.wallLayer.setCollisionByProperty({ collides: true });
  }

  worldDebug() {
    debugDraw(this.scene, this.wallLayer);
    // this.scene.input.keyboard?.once("keydown-D", (event) => {
    //   debugDraw(this.scene, this.wallLayer);
    // });
  }

  addCollision(player: Phaser.Types.Physics.Arcade.ArcadeColliderType) {
    this.scene.physics.add.collider(player, this.wallLayer);
  }
}

export default WorldMap;
