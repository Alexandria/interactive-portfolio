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

let SCALE_MODE = "SMOOTH";

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  scale: {
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
  // parent: "phaser-game",
  height: DEFAULT_HEIGHT,
  backgroundColor: "#fff7e4",
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

window.addEventListener("load", () => {
  const game = new Phaser.Game(config);
  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    let width = DEFAULT_WIDTH;
    let height = DEFAULT_HEIGHT;
    let maxWidth = MAX_WIDTH;
    let maxHeight = MAX_HEIGHT;
    let scaleMode = SCALE_MODE;
    let scale = Math.min(w / width, h / height);
    let newWidth = Math.min(w / scale, maxWidth);
    let newHeight = Math.min(h / scale, maxHeight);
    let defaultRatio = DEFAULT_WIDTH / DEFAULT_HEIGHT;
    let maxRatioWidth = MAX_WIDTH / DEFAULT_HEIGHT;
    let maxRatioHeight = DEFAULT_WIDTH / MAX_HEIGHT;
    // smooth scaling
    let smooth = 1;
    if (scaleMode === "SMOOTH") {
      const maxSmoothScale = 1.15;
      const normalize = (value, min, max) => {
        return (value - min) / (max - min);
      };
      if (width / height < w / h) {
        smooth =
          -normalize(newWidth / newHeight, defaultRatio, maxRatioWidth) /
            (1 / (maxSmoothScale - 1)) +
          maxSmoothScale;
      } else {
        smooth =
          -normalize(newWidth / newHeight, defaultRatio, maxRatioHeight) /
            (1 / (maxSmoothScale - 1)) +
          maxSmoothScale;
      }
    }
    // resize the game
    game.scale.resize(newWidth * smooth, newHeight * smooth);
    // scale the width and height of the css
    game.canvas.style.width = newWidth * scale + "px";
    game.canvas.style.height = newHeight * scale + "px";
    // center the game with css margin
    game.canvas.style.marginTop = `${(h - newHeight * scale) / 2}px`;
    game.canvas.style.marginLeft = `${(w - newWidth * scale) / 2}px`;
  };
  window.addEventListener("resize", (event) => {
    console.log("resize event");
    resize();
  });
  console.log("resize at start");
  resize();
});
export default new Phaser.Game(config);
