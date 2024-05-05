import Phaser from "phaser";

interface Config {
  scene: Phaser.Scene;
  x: number;
  y: number;
  key: string;
}

class Picture extends Phaser.Physics.Arcade.Sprite {
  private inInteractZone = false;
  private link?: string;
  constructor(config: Config, scale?: number, link?: string) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.add.existing(this);
    config.scene.physics.add.existing(this, true);
    this.body!.setSize(this.width * 2, this.height * 6.5);
    this.body!.setOffset(-5, 7);

    this.link = link;
    this.setScale(scale);
    this.setInteractive().on("keydown-SPACE", (event) => {
      console.log("There was an interactive event spacebar down.");
    });
  }

  setInInteractZone(inZone: boolean) {
    this.inInteractZone = inZone;
  }

  isInInteractZone() {
    return this.inInteractZone;
  }

  addCollision(player: Phaser.Types.Physics.Arcade.ArcadeColliderType) {
    this.scene.physics.add.overlap(player, this, () => {
      console.log("interaction");
      this.inInteractZone = true;
    });
  }

  getLink() {
    return this.link;
  }
}

export default Picture;
