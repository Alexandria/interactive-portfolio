import Phaser, { LEFT } from "phaser";
import Player from "../components/Player";
import { debugDraw } from "../utils/debugDraw";
import WorldMap from "../components/WorldMap";
// https://newdocs.phaser.io/docs/3.80.0/Phaser.Animations.AnimationManager#create

export default class Game extends Phaser.Scene {
  private player: Player;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  constructor() {
    // https://stackoverflow.com/questions/52864250/what-is-the-function-of-super-in-phaser-frameworks
    super("game");
  }

  preload() {}

  create() {
    const scale = 4;
    const speed = 100;
    const map2 = new WorldMap(
      this,
      this.make.tilemap({ key: "tileMap" }),
      scale,
    );

    this.player = new Player(
      { scene: this, x: 1088, y: 440, key: "character" },
      scale,
      speed,
    );
    map2.addCollision(this.player);
    map2.worldDebug();

    this.cursors = this.input.keyboard?.createCursorKeys();

    // Camera
    const cam = this.cameras.main;

    cam.startFollow(this.player);

    cam.setBounds(110, 110, 1900, 720);
    cam.setViewport(0, 0, 500, 500);
    //cam.zoom = 0.3;

    // EndCamera
  }

  update(time: number, delta: number): void {
    // Player Movement
    this.player.stopMoving();

    if (this.cursors && this.cursors.left.isDown) {
      this.player.moveLeft(delta);
    } else if (this.cursors && this.cursors.right.isDown) {
      this.player.moveRight(delta);
    } else if (this.cursors && this.cursors.up.isDown) {
      this.player.moveUp(delta);
    } else if (this.cursors && this.cursors.down.isDown) {
      this.player.moveDown(delta);
    }
    //End Player Movement
  }
}
