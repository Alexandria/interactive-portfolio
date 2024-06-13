import Phaser from "phaser";
import { Config } from "../types";

class CursedPicture extends Phaser.Physics.Arcade.Sprite {
  constructor(config: Config, scale: number) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.add.existing(this);
    this.setScale(scale);

    this.anims.createFromAseprite("cursedPicture", ["fall"]);
  }
}

export default CursedPicture;
