import Phaser from "phaser";
import Player from "./Player";

interface Config {
  scene: Phaser.Scene;
  x: number;
  y: number;
  key: string;
}

class Picture extends Phaser.Physics.Arcade.Sprite {
  private inInteractZone = false;
  private link?: string;
  constructor(config: Config, scale: number, link?: string) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.add.existing(this);
    config.scene.physics.add.existing(this, true);
    this.body!.setSize(this.width * 3, this.height * 3);

    this.link = link;
    this.setScale(scale);
    this.setInteractive();
  }

  setInInteractZone(inZone: boolean) {
    this.inInteractZone = inZone;
  }

  isInInteractZone() {
    return this.inInteractZone;
  }

  isPlayerPostionNear(player: Player) {
    const playerXPos = player.body?.position.x! + 10;
    const playerYPos = player.body?.position.y! - 8;
    const picPosX = this.body?.position.x!;
    const picPosY = this.body?.position.y!;

    console.log("Position Check", {
      playerXPos,
      playerYPos,
      picPosX,
      picPosY,
    });
    console.log("picPosX + this.width * 3", picPosX + this.width * 3);

    if (playerXPos > picPosX && playerXPos < picPosX + this.width * 3) {
      console.log("Player has x position");
      if (playerYPos > picPosY && playerYPos < picPosY + this.width * 3) {
        console.log("Player has y position");
        return true;
      }
    }
    return false;
  }

  getLink() {
    return this.link;
  }
}

export default Picture;
