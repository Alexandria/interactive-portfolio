import Phaser from "phaser";
import { Config } from "~/types";

class RedSmile extends Phaser.Physics.Arcade.Sprite {
  private speed;
  private isChasing;
  constructor(config: Config, scale: number, speed?: number) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.add.existing(this);
    config.scene.physics.add.existing(this, false);

    this.setScale(scale * 2.5);
    this.body!.setSize(this.width * 0.5, this.height * 0.3);
    this.body!.offset.y = 18;
    this.speed = speed;
    this.isChasing = false;

    this.anims.createFromAseprite("redSmile", [
      "idle",
      "dead",
      "run",
      "attack",
    ]);
  }

  getIsChasing() {
    return this.isChasing;
  }

  setIsChasing(chasing: boolean) {
    this.isChasing = chasing;
  }

  addCollision(
    player: Phaser.Types.Physics.Arcade.ArcadeColliderType,
    callback: () => void,
  ) {
    this.scene.physics.add.collider(player, this, () => {
      callback();
    });
  }

  chasePlayer(player: Phaser.Types.Physics.Arcade.ArcadeColliderType) {
    this.scene.physics.moveToObject(this, player, this.speed);
  }
}

export default RedSmile;
