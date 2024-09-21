import Phaser from "phaser";

interface Config {
  scene: Phaser.Scene;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

class ExitZone extends Phaser.GameObjects.Zone {
  constructor(config: Config) {
    super(config.scene, config.x, config.y, config.width, config.height);
    config.scene.physics.add.existing(this, false);
  }

  addOverlap(player: Phaser.Types.Physics.Arcade.ArcadeColliderType) {
    this.scene.physics.add.overlap(this, player, () => {
      console.log("Overlap happened!");
    });
  }
}

export default ExitZone;
