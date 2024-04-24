import Phaser from "phaser";

import Example from "./scenes/Example";
import Preloader from "./scenes/Preloader";
import Game from "./scenes/Game";

// Responzise Game mode
// https://stackoverflow.com/questions/51518818/how-to-make-canvas-responsive-using-phaser-3
// https://www.emanueleferonato.com/2018/02/16/how-to-scale-your-html5-games-if-your-framework-does-not-feature-a-scale-manager-or-if-you-do-not-use-any-framework/

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 464,
    height: 200,
  },
  backgroundColor: "#fff7e4",
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
