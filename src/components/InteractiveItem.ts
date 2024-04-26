import Phaser from "phaser";

interface Config {
  scene: Phaser.Scene;
  x: number;
  y: number;
  key: string;
}

class Picture extends Phaser.GameObjects.Sprite {
  constructor(config: Config, scale?: number, link?: string) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.add.existing(this);
    this.setScale(scale);
  }
}

export default Picture;
