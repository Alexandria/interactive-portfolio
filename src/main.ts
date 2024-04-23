import Phaser from "phaser";

import Example from "./scenes/Example";
import Preloader from "./scenes/Preloader";
import Game from "./scenes/Game";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  scale: {
    mode: Phaser.Scale.FIT,
  },
  width: 1000,
  height: 350,
  pixelArt: true, // Makes the pixel art have clear resolution
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: true,
    },
  },
  scene: [Preloader, Game],
};

export default new Phaser.Game(config);
