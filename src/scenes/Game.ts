import Phaser from "phaser";
// https://newdocs.phaser.io/docs/3.80.0/Phaser.Animations.AnimationManager#create

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  preload() {}

  create() {
    this.add.image(580, 190, "room");
    this.anims.createFromAseprite("character");
    const player = this.add.sprite(388, 180, "character");
    const cam = this.cameras.main;
    cam.zoom = 3;

    player.anims.play("front");
  }
}
