import Phaser from "phaser";

export const debugDraw = (
  scene: Phaser.Scene,
  mapLayer: Phaser.Tilemaps.TilemapLayer,
) => {
  const debugGraphics = scene.add.graphics().setAlpha(0.75);

  mapLayer.renderDebug(debugGraphics, {
    tileColor: null, // Color of non-colliding tiles
    collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
    faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
  });
};
