import Phaser from "phaser";
// https://newdocs.phaser.io/docs/3.80.0/Phaser.Animations.AnimationManager#create

export default class Game extends Phaser.Scene {
  private player: Phaser.Physics.Arcade.Sprite;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private speed = 500;
  constructor() {
    // https://stackoverflow.com/questions/52864250/what-is-the-function-of-super-in-phaser-frameworks
    super("game");
  }

  preload() {}

  create() {
    const scale = 4;
    const map = this.make.tilemap({ key: "tileMap" });
    const wallTileset = map.addTilesetImage("basic-wallpapper", "wallTiles")!;
    const edgeTileset = map.addTilesetImage("basic-wall-edges", "edgeTiles")!;
    const floorTileSet = map.addTilesetImage("basic-floors", "floorTiles")!;
    const decorTileSet = map.addTilesetImage("decorations", "decorTiles")!;
    const storageTileSet = map.addTilesetImage("storage", "storageTiles")!;

    const walls = map.createLayer(
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
    walls.scale = scale;
    decor.scale = scale;
    floor.scale = scale;

    walls.setCollisionByProperty({ collides: true });

    this.player = this.physics.add.sprite(1088, 440, "character");
    this.player.anims.createFromAseprite("character", [
      "front",
      "back",
      "left",
      "right",
    ]);
    this.player.body?.setSize(
      this.player.width * 0.5,
      this.player.height * 0.3,
    );
    this.player.body!.offset.y = 22;

    this.player.scale = scale;
    this.cursors = this.input.keyboard?.createCursorKeys();
    const cam = this.cameras.main;
    cam.startFollow(this.player);

    // const debugGraphics = this.add.graphics().setAlpha(0.75);
    // walls.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    // });

    this.physics.add.collider(this.player, walls);
    cam.setBounds(110, 110, 1900, 720);
    cam.setViewport(0, 0, 500, 500);
    //cam.zoom = 0.3;
  }

  update(time: number, delta: number): void {
    //this.player.play("front", true);

    if (this.cursors && this.cursors.left.isDown) {
      this.player.setVelocityX(-this.speed);
      this.player.play("left", true);
    } else if (this.cursors && this.cursors.right.isDown) {
      this.player.setVelocityX(this.speed);
      this.player.play("right", true);
    } else if (this.cursors && this.cursors.up.isDown) {
      this.player.setVelocityY(-this.speed);
      this.player.play("back", true);
    } else if (this.cursors && this.cursors.down.isDown) {
      this.player.setVelocityY(this.speed);
      this.player.play("front", true);
    } else {
      this.player.setVelocityX(0);
      this.player.setVelocityY(0);
    }
  }
}
