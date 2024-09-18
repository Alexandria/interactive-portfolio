import Phaser from "phaser";
import Player from "../components/Player";
import WorldMap from "../components/WorldMap";
import Picture from "../components/Picture";
import Light from "../components/Light";
import { BreakPoints, PictureNames } from "../types";
import VirtualJoystick from "phaser3-rex-plugins/plugins/virtualjoystick.js";
import { SCALE } from "../main";
import { portraitBreakPoints, landscapeBreakPoints } from "../utils/fixtures";
import { isMobile } from "../utils/isMobile";
import CursedPicture from "../components/CursedPicture";
import Cabinet from "../components/Cabinet";
import RedSmile from "../components/RedSmile";

// https://newdocs.phaser.io/docs/3.80.0/Phaser.Animations.AnimationManager#create

type Orientation = "Portrait" | "Landscape" | "Web";

export default class Game extends Phaser.Scene {
  private player: Player;
  private redSmile: RedSmile;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys?;
  private joyStick;
  private matchThreePic: Picture;
  private fnafPic: Picture;
  private inTheWoodsPic: Picture;
  private candyHadPic: Picture;
  private cursedPic: Picture;
  private cursedPicture: CursedPicture;
  private cabinet: Cabinet;
  private resizeScale: number;
  private isMobile: boolean;
  private windowOrientation: Orientation;

  constructor() {
    // https://stackoverflow.com/questions/52864250/what-is-the-function-of-super-in-phaser-frameworks
    super("game");
  }

  createAllPictures(picPos, yPosition) {
    this.matchThreePic = new Picture(
      {
        scene: this,
        x: picPos.matchThreePosition.x! * SCALE,
        y: picPos.matchThreePosition.y! * SCALE + yPosition,
        key: "sign",
      },
      this.resizeScale,
      "https://match-three-game.netlify.app/",
    );

    this.fnafPic = new Picture(
      {
        scene: this,
        x: picPos.fnafPosition.x! * this.resizeScale,
        y: picPos.fnafPosition.y! * this.resizeScale + yPosition,
        key: "sign",
      },
      this.resizeScale,
      "https://www.pixilart.com/art/fnaf-favs-a5042ea5c957897",
    );

    this.inTheWoodsPic = new Picture(
      {
        scene: this,
        x: picPos.inTheWoodsPos.x! * this.resizeScale,
        y: picPos.inTheWoodsPos.y! * this.resizeScale + yPosition,
        key: "sign",
      },
      this.resizeScale,
      "https://www.pixilart.com/art/rainy-forest-596e36029c4f600",
    );

    this.candyHadPic = new Picture(
      {
        scene: this,
        x: picPos.candyHagDashPos.x! * SCALE,
        y: picPos.candyHagDashPos.y! * SCALE + yPosition,
        key: "sign",
      },
      this.resizeScale,
      "https://coffeeghoststudios.itch.io/candy-hag-dash",
    );

    this.cursedPic = new Picture(
      {
        scene: this,
        x: picPos.cursedPicPos.x! * this.resizeScale,
        y: picPos.cursedPicPos.y! * this.resizeScale + yPosition,
        key: "sign",
      },
      this.resizeScale,
    );
  }

  create() {
    this.resizeScale = SCALE;
    this.isMobile = false;
    const speed = 100;
    const yPosition = 100;
    const safeAreaX = window.innerWidth / 3;
    const safeAreaY = yPosition + 20;
    this.cameras.main.height / 2.5 - +this.game.config.height / 4.5 - 5;
    const joyStickPosX = safeAreaX;
    const joyStickPosY = safeAreaY + 500;
    this.windowOrientation === "Web";

    const worldMap = new WorldMap(
      this,
      this.make.tilemap({ key: "tileMap" }),
      this.resizeScale,
    );

    const worldMapHtWd = worldMap.getWallLayerSize();

    const world = {
      width: worldMapHtWd.width,
      height: worldMapHtWd.height,
    };

    const playerPos = worldMap.getMarkerPositionByName("player")!;

    // worldMap.worldDebug();

    this.cursors = this.input.keyboard?.createCursorKeys();

    const lightPosition = worldMap.getMarkerPositionByName(PictureNames.Light)!;
    const cabinetPos = worldMap.getMarkerPositionByName("cabinetMarker")!;

    const cursedPicturePos = worldMap.getMarkerPositionByName("cursed")!;
    console.log("cursedPicturePos", cursedPicturePos);

    const matchThreePosition = worldMap.getMarkerPositionByName(
      PictureNames.MatchThree,
    )!;
    const fnafPosition = worldMap.getMarkerPositionByName(PictureNames.FNAF)!;
    const inTheWoodsPos = worldMap.getMarkerPositionByName(
      PictureNames.InTheWoods,
    )!;
    const candyHagDashPos = worldMap.getMarkerPositionByName(
      PictureNames.CandyHagDash,
    )!;
    const cursedPicPos = worldMap.getMarkerPositionByName(
      PictureNames.CursedPic,
    )!;

    this.wasdKeys = this.input.keyboard?.addKeys("W,S,A,D");

    new Light(
      {
        scene: this,
        x: lightPosition.x! * SCALE,
        y: lightPosition.y! * SCALE + yPosition,
        key: "light",
      },
      this.resizeScale * 0.95,
    );

    this.cursedPicture = new CursedPicture(
      {
        scene: this,
        x: cursedPicturePos.x! * SCALE,
        y: cursedPicturePos.y! * SCALE + yPosition,
        key: "cursedPicture",
      },
      this.resizeScale,
    );

    this.cabinet = new Cabinet(
      {
        scene: this,
        x: cabinetPos.x! * SCALE,
        y: cabinetPos.y! * SCALE + yPosition,
        key: "cabinet",
      },
      this.resizeScale,
    );

    this.createAllPictures(
      {
        matchThreePosition,
        fnafPosition,
        inTheWoodsPos,
        candyHagDashPos,
        cursedPicPos,
      },
      yPosition,
    );

    this.player = new Player(
      {
        scene: this,
        x: playerPos.x! * this.resizeScale - 100,
        y: playerPos.y! * this.resizeScale + yPosition,
        key: "character",
      },
      this.resizeScale,
      speed,
    );

    this.redSmile = new RedSmile(
      {
        scene: this,
        x: cabinetPos.x! * SCALE - 20,
        y: cabinetPos.y! * SCALE + yPosition,
        key: "redSmile",
      },
      this.resizeScale,
      speed,
    );

    worldMap.addCollision(this.player, this.redSmile);

    //this.redSmile.chasePlayer(this.player);
    this.redSmile.visible = false;

    this.matchThreePic.on("pointerdown", () => {
      if (this.matchThreePic.isPlayerPostionNear(this.player)) {
        console.log("position is true matchthree");
        this.playerPicInteraction(this.matchThreePic);
      }
    });
    this.fnafPic.on("pointerdown", () => {
      if (this.fnafPic.isPlayerPostionNear(this.player)) {
        console.log("position is true fnaf");
        this.playerPicInteraction(this.fnafPic);
      }
    });
    this.inTheWoodsPic.on("pointerdown", () => {
      if (this.inTheWoodsPic.isPlayerPostionNear(this.player)) {
        console.log("position is true inthewoods");
        this.playerPicInteraction(this.inTheWoodsPic);
      }
    });
    this.candyHadPic.on("pointerdown", () => {
      if (this.candyHadPic.isPlayerPostionNear(this.player)) {
        console.log("position is true candyHag");
        this.playerPicInteraction(this.candyHadPic);
      }
    });
    this.cursedPic.on("pointerdown", () => {
      if (this.cursedPic.isPlayerPostionNear(this.player)) {
        console.log("position is true cursed pic");
        this.cursedPicInteraction();
      }
    });

    // Camera
    const cam = this.cameras.main;

    // cam.setBounds(-400, 0, 3270, 1050);
    // cam.setViewport(-400, 0, 2000, 1000);
    cam.setBounds(
      -400,
      0,
      world.width * SCALE + 900,
      world.height * SCALE,
      true,
    );
    //this.physics.world.setBounds(0, 0, world.width, world.height);
    cam.startFollow(this.player, true);

    this.joyStick = new VirtualJoystick(this, {
      x: joyStickPosX,
      y: joyStickPosY,
      base: this.add.circle(0, 0, 50, 0x888888),
      thumb: this.add.circle(0, 0, 25, 0xcccccc),
      radius: 50,
      dir: "4dir",
    });

    const resize = () => {
      this.isMobile = isMobile();

      // Mobile Controls
      this.setMobileControls();

      // setOritentation
      this.setWindowOrientation();

      const joyStickPos = { x: joyStickPosX, y: joyStickPosY };

      if (this.windowOrientation === "Web") {
        const newScale = Math.max(this.cameras.main.height / 250, 1);
        this.setNewScale(newScale, yPosition, playerPos, worldMap);
        this.updatePhotoPositions(
          {
            matchThreePosition,
            fnafPosition,
            inTheWoodsPos,
            candyHagDashPos,
            cursedPicPos,
          },
          newScale,
          yPosition,
        );
      }

      if (this.windowOrientation === "Portrait") {
        const newScale = Math.max(this.cameras.main.height / 200, 1);
        console.log("portraitBreakPoints", portraitBreakPoints);
        this.updateMobileControls(portraitBreakPoints, joyStickPos);
        this.updateCameraBounds(cam, -800, 0, world, newScale);
        this.setNewScale(newScale, yPosition, playerPos, worldMap);
        this.updatePhotoPositions(
          {
            matchThreePosition,
            fnafPosition,
            inTheWoodsPos,
            candyHagDashPos,
            cursedPicPos,
          },
          newScale,
          yPosition,
        );
      }

      if (this.windowOrientation === "Landscape") {
        const newYPosition = 175;
        const newScale = 2.5;
        this.updateMobileControls(landscapeBreakPoints, joyStickPos);
        this.updateCameraBounds(cam, -800, 0, world, newScale);
        console.log("landscapeBreakPoints", landscapeBreakPoints);
        this.setNewScale(newScale, newYPosition, playerPos, worldMap);

        this.updatePhotoPositions(
          {
            matchThreePosition,
            fnafPosition,
            inTheWoodsPos,
            candyHagDashPos,
            cursedPicPos,
          },
          newScale,
          newYPosition,
        );
      }
    };

    this.scale.on("resize", (gameSize, baseSize, displaySize, resolution) => {
      this.cameras.resize(gameSize.width, gameSize.height);
      console.log("resize in scene");
      resize();
    });

    resize();

    this.anims.addMix("dead", "idle", 1000);
  }

  updateCameraBounds(cam, x, y, world, newScale) {
    cam.setBounds(
      x,
      y,
      world.width * newScale + 1050,
      world.height * newScale + 800,
      true,
    );
  }

  updateMobileControls(breakPoints: BreakPoints, joyStickPos) {
    if (breakPoints.XLargeBreakPoint.meetsThreshold) {
      this.joyStick.x = breakPoints.XLargeBreakPoint.joyStickPos.x;
      this.joyStick.y = breakPoints.XLargeBreakPoint.joyStickPos.y;
    } else if (breakPoints.LargeBreakPoint.meetsThreshold) {
      this.joyStick.x = breakPoints.LargeBreakPoint.joyStickPos.x;
      this.joyStick.y = breakPoints.LargeBreakPoint.joyStickPos.y;
    } else if (breakPoints.MediumBreakPoint.meetsThreshold) {
      this.joyStick.x = breakPoints.MediumBreakPoint.joyStickPos.x;
      this.joyStick.y = breakPoints.MediumBreakPoint.joyStickPos.y;
      this.joyStick.base.radius = 40;
      this.joyStick.thumb.radius = 25;
    } else if (breakPoints.SmallBreakPoint.meetsThreshold) {
      this.joyStick.x = breakPoints.SmallBreakPoint.joyStickPos.x;
      this.joyStick.y = breakPoints.SmallBreakPoint.joyStickPos.y;
      this.joyStick.base.radius = 40;
      this.joyStick.thumb.radius = 25;
    } else if (breakPoints.XSmallBreakPoint.meetsThreshold) {
      this.joyStick.x = breakPoints.XSmallBreakPoint.joyStickPos.x;
      this.joyStick.y = breakPoints.XSmallBreakPoint.joyStickPos.y;
      this.joyStick.base.radius = 40;
      this.joyStick.thumb.radius = 25;
    }
  }

  updatePhotoPositionsLandscape(positions, newScale, yPosition) {
    const innerWith = window.innerWidth;
    const bodySize = {
      width: 14 * newScale,
      height: 14 * newScale,
      center: undefined,
    };
    const yOffSet = 30;
    this.matchThreePic
      .setPosition(
        positions.matchThreePosition.x! * newScale,
        positions.matchThreePosition.y! * newScale + yPosition,
      )
      .setBodySize(bodySize.width, bodySize.height)
      .setOffset(innerWith / positions.matchThreePosition.x! - 80, yOffSet);

    this.fnafPic
      .setPosition(
        positions.fnafPosition.x! * newScale,
        positions.fnafPosition.y! * newScale + yPosition,
      )
      .setBodySize(bodySize.width, bodySize.height)
      .setOffset(innerWith / positions.fnafPosition.x! - 120, yOffSet);
    this.inTheWoodsPic
      .setPosition(
        positions.inTheWoodsPos.x! * newScale,
        positions.inTheWoodsPos.y! * newScale + yPosition,
      )
      .setBodySize(bodySize.width, bodySize.height)
      .setOffset(innerWith / positions.inTheWoodsPos.x! - 167, yOffSet);

    this.candyHadPic
      .setPosition(
        positions.candyHagDashPos.x! * newScale,
        positions.candyHagDashPos.y! * newScale + yPosition,
      )
      .setBodySize(bodySize.width, bodySize.height)
      .setOffset(innerWith / positions.candyHagDashPos.x! - 206, yOffSet);
    this.cursedPic
      .setPosition(
        positions.cursedPicPos.x! * newScale,
        positions.cursedPicPos.y! * newScale + yPosition,
      )
      .setBodySize(bodySize.width, bodySize.height)
      .setOffset(innerWith / positions.cursedPicPos.x! - 245, yOffSet);
  }

  updatePhotoPositionsPortrait(positions, newScale, yPosition) {
    const innerWith = window.innerWidth;
    const bodySize = {
      width: 14 * newScale,
      height: 14 * newScale,
      center: undefined,
    };
    const yOffSet = 30;

    console.log("portrait stuff");
    this.matchThreePic
      .setPosition(
        positions.matchThreePosition.x! * newScale,
        positions.matchThreePosition.y! * newScale + yPosition,
      )
      .setBodySize(bodySize.width, bodySize.height)
      .setOffset(positions.matchThreePosition.x! - 70, yOffSet);

    this.fnafPic
      .setPosition(
        positions.fnafPosition.x! * newScale,
        positions.fnafPosition.y! * newScale + yPosition,
      )
      .setBodySize(bodySize.width, bodySize.height)
      .setOffset(positions.fnafPosition.x! - 100, yOffSet);
    this.inTheWoodsPic
      .setPosition(
        positions.inTheWoodsPos.x! * newScale,
        positions.inTheWoodsPos.y! * newScale + yPosition,
      )
      .setBodySize(bodySize.width, bodySize.height)
      .setOffset(positions.inTheWoodsPos.x! - 150, yOffSet);

    this.candyHadPic
      .setPosition(
        positions.candyHagDashPos.x! * newScale,
        positions.candyHagDashPos.y! * newScale + yPosition,
      )
      .setBodySize(bodySize.width, bodySize.height)
      .setOffset(positions.candyHagDashPos.x! - 175, yOffSet);
    this.cursedPic
      .setPosition(
        positions.cursedPicPos.x! * newScale,
        positions.cursedPicPos.y! * newScale + yPosition,
      )
      .setBodySize(bodySize.width, bodySize.height)
      .setOffset(positions.cursedPicPos.x! - 200, yOffSet);
  }

  updatePhotoPositions(positions, newScale, yPosition) {
    if (this.windowOrientation === "Landscape") {
      this.updatePhotoPositionsLandscape(positions, newScale, yPosition);
      return;
    }
    if (this.windowOrientation === "Portrait") {
      this.updatePhotoPositionsPortrait(positions, newScale, yPosition);
      return;
    }
  }

  setNewScale(newScale: number, yPosition, playerPos, worldMap) {
    // player scale
    this.player.setScale(newScale);
    this.player.setPosition(
      playerPos.x! * newScale,
      playerPos.y! * newScale + yPosition,
    );

    //pictureScale
    this.matchThreePic.setScale(newScale);
    this.fnafPic.setScale(newScale);
    this.inTheWoodsPic.setScale(newScale);
    this.candyHadPic.setScale(newScale);
    this.cursedPic.setScale(newScale);

    //adjust the world scale
    worldMap.setWorldScale(newScale);
    worldMap.setWorldYPosition(yPosition);
    // this.resizeScale = Math.max(this.cameras.main.height / 600, 1);
  }

  setWindowOrientation() {
    if (!this.isMobile) return this.windowOrientation === "Web";
    if (window.matchMedia("(orientation: landscape)").matches) {
      return (this.windowOrientation = "Landscape");
    }
    if (window.matchMedia("(orientation: portrait)").matches) {
      return (this.windowOrientation = "Portrait");
    }
  }

  setMobileControls() {
    if (!this.isMobile) {
      this.joyStick.setVisible(false);
    } else {
      this.joyStick.setVisible(true);
    }
  }

  cursedPicInteraction() {
    // enable dresser animation opening
    this.cursedPicture.play({ key: "fall" });
    this.cabinet.play({ key: "open", delay: 1000 });
    this.time.delayedCall(4000, () => {
      this.redSmile.visible = true;
      this.redSmile.addCollision(this.player);
    });

    this.time.delayedCall(4500, () => {
      this.redSmile.setIsChasing(true);
    });
  }

  playerPicInteraction(pic: Picture) {
    if (pic.getLink()) {
      window.open(pic.getLink());
    }
  }

  update(time: number, delta: number): void {
    const touching = !this.player.body?.touching.none;
    const wasTouching = !this.player.body?.wasTouching.none;
    const spaceIsDown = this.cursors?.space.isDown;

    if (touching && !wasTouching) this.player.emit("overlapstart");
    if (!touching && wasTouching) this.player.emit("overlapend");

    // Player Movements
    this.player.stopMoving();
    if (this.cursors && this.cursors.left.isDown) {
      this.player.moveLeft(delta);
    } else if (this.cursors && this.cursors.right.isDown) {
      this.player.moveRight(delta);
    } else if (this.cursors && this.cursors.up.isDown) {
      this.player.moveUp(delta);
    } else if (this.cursors && this.cursors.down.isDown) {
      this.player.moveDown(delta);
    }

    if (this.cursors && this.wasdKeys.A.isDown) {
      this.player.moveLeft(delta);
    } else if (this.cursors && this.wasdKeys.D.isDown) {
      this.player.moveRight(delta);
    } else if (this.cursors && this.wasdKeys.W.isDown) {
      this.player.moveUp(delta);
    } else if (this.cursors && this.wasdKeys.S.isDown) {
      this.player.moveDown(delta);
    }

    if (this.cursors && this.joyStick.left) {
      this.player.moveLeft(delta);
    } else if (this.cursors && this.joyStick.right) {
      this.player.moveRight(delta);
    } else if (this.cursors && this.joyStick.up) {
      this.player.moveUp(delta);
    } else if (this.cursors && this.joyStick.down) {
      this.player.moveDown(delta);
    }

    if (this.matchThreePic.isPlayerPostionNear(this.player)) {
      this.matchThreePic.setTint(0xf79489);
    } else if (this.fnafPic.isPlayerPostionNear(this.player)) {
      this.fnafPic.setTint(0xf79489);
    } else if (this.inTheWoodsPic.isPlayerPostionNear(this.player)) {
      this.inTheWoodsPic.setTint(0xf79489);
    } else if (this.candyHadPic.isPlayerPostionNear(this.player)) {
      this.candyHadPic.setTint(0xf79489);
    } else if (this.cursedPic.isPlayerPostionNear(this.player)) {
      this.cursedPic.setTint(0xf79489);
    } else {
      this.matchThreePic.clearTint();
      this.inTheWoodsPic.clearTint();
      this.candyHadPic.clearTint();
      this.fnafPic.clearTint();
      this.cursedPic.clearTint();
    }

    // RedSmile Movemment

    console.log("velocity", this.redSmile.body?.velocity.x);
    if (this.redSmile.getIsChasing()) {
      this.redSmile.chasePlayer(this.player);
    }
    if (
      this.redSmile.body?.velocity.x !== 0 ||
      this.redSmile.body?.velocity.x < 0
    ) {
      console.log("Should be running!");
      this.redSmile.play("run", true);
    }
  }
}
