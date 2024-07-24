import Phaser from "phaser";
import { Config } from "~/types";

class RedSmile extends Phaser.Physics.Arcade.Sprite {
  constructor(config: Config, scale: number, speed?: number) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.add.existing(this);
    config.scene.physics.add.existing(this, false);

    this.setScale(scale * 2.5);
    this.anims.createFromAseprite("redSmile", [
      "idle",
      "dead",
      "run",
      "attack",
    ]);

    this.body!.offset.y = 22;
  }
}

export default RedSmile;
