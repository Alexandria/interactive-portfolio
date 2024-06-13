import Phaser from "phaser";

import Preloader from "./scenes/Preloader";
import Game from "./scenes/Game";

// Responzise Game mode
// https://stackoverflow.com/questions/51518818/how-to-make-canvas-responsive-using-phaser-3
// https://www.emanueleferonato.com/2018/02/16/how-to-scale-your-html5-games-if-your-framework-does-not-feature-a-scale-manager-or-if-you-do-not-use-any-framework/
export const SCALE = 3;
//export const CANVAS_SCALE = SCALE / 1.4;
export const DEFAULT_WIDTH = 1280;
export const DEFAULT_HEIGHT = 720;

export const MAX_WIDTH = 1580;
export const MAX_HEIGHT = 920;

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  scale: {
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    resizeInterval: 50,
  },
  // parent: "phaser-game",
  height: DEFAULT_HEIGHT,
  backgroundColor: "#36454F",
  pixelArt: true, // Makes the pixel art have clear resolution
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: { x: 0, y: 0 },
    },
  },
  scene: [Preloader, Game],
};

window.onload = function () {
  const game = new Phaser.Game(config);
};

export default new Phaser.Game(config);
