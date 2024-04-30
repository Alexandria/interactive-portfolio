import Phaser from "phaser";

import Preloader from "./scenes/Preloader";
import Game from "./scenes/Game";

// Responzise Game mode
// https://stackoverflow.com/questions/51518818/how-to-make-canvas-responsive-using-phaser-3
// https://www.emanueleferonato.com/2018/02/16/how-to-scale-your-html5-games-if-your-framework-does-not-feature-a-scale-manager-or-if-you-do-not-use-any-framework/
export const SCALE = 4.5;
export const CANVAS_SCALE = SCALE / 1.4;

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 608,
    height: 144,
  },
  //backgroundColor: "#fff7e4",
  pixelArt: true, // Makes the pixel art have clear resolution
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: [Preloader, Game],
};
const canvas = document.getElementsByTagName("canvas");
const gameContainer = document.createElement("div");
//gameContainer.appendChild(canvas);
window.onload = function () {
  const game = new Phaser.Game(config);
};

//export default new Phaser.Game(config);
