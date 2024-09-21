import Phaser from "phaser";

class EndGame extends Phaser.Scene {
  private background: Phaser.GameObjects.Image;
  private UIText: Phaser.GameObjects.Text;
  private UISubText: Phaser.GameObjects.Text;

  private btn;
  constructor(data) {
    super("endGame");
  }

  create() {
    const container = this.add.container(0, 0);

    const textContainer = this.add.container(0, 0);

    this.background = this.add.image(650, 400, "uiBackground");
    container.add(this.background);

    this.background.scale = 0.4;

    this.UIText = this.add.text(520, 320, "You've escaped!", {
      fontSize: 30,
      wordWrap: {
        width: 300,
      },
    });
    this.UISubText = this.add.text(520, 370, "Thanks For Playing!", {
      fontSize: 25,
    });

    textContainer.add(this.UIText);

    this.btn = this.add.image(650, 500, "playAgain").setInteractive();

    this.btn.scale = 0.75;

    this.add.zone;

    this.add.text(575, 485, "Play Again", { fontSize: 27 });
    this.btn.on("pointerdown", () => {
      this.scene.start("game");
    });

    this.btn.on("pointerover", () => {
      this.btn.setTint(0xf4cccc);
    });
    this.btn.on("pointerout", () => {
      this.btn.clearTint();
    });
  }
}

export default EndGame;
