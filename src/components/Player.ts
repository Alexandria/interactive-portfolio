import Phaser from "phaser";

interface Config {
  scene: Phaser.Scene;
  x: number;
  y: number;
  key: string;
}

class Player extends Phaser.Physics.Arcade.Sprite {
  private speed;
  constructor(config: Config, scale: number, speed) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.add.existing(this);
    config.scene.physics.add.existing(this, false);

    this.setScale(scale);
    this.speed = speed;
    this.anims.createFromAseprite("character", [
      "front",
      "back",
      "left",
      "right",
    ]);

    this.body!.setSize(this.width * 0.5, this.height * 0.3);
    this.body!.offset.y = 22;
  }

  moveRight(delta?: number) {
    this.anims.play("right", true);
    this.setVelocityX(this.speed);
  }

  moveLeft(delta: number) {
    this.anims.play("left", true);
    this.setVelocityX(-this.speed);
  }

  moveUp(delta: number) {
    this.anims.play("back", true);
    this.setVelocityY(-this.speed);
  }

  moveDown(delta: number) {
    this.anims.play("front", true);
    this.setVelocityY(this.speed);
  }

  stopMoving() {
    this.setVelocityX(0);
    this.setVelocityY(0);
  }
}

export default Player;
