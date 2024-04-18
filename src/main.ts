import Phaser from "phaser";

import Example from "./scenes/Example";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 50, y: 200 },
      debug: true,
    },
  },
  scene: [Example],
};

export default new Phaser.Game(config);
