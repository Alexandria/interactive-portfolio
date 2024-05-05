import Phaser, { LEFT } from "phaser";
import Player from "../components/Player";
import { debugDraw } from "../utils/debugDraw";
import WorldMap from "../components/WorldMap";
import Picture from "../components/Picture";
import { PictureNames } from "../types";
import VirtualJoystick from "phaser3-rex-plugins/plugins/virtualjoystick.js";
import { SCALE } from "../main";
import Preloader from "./Preloader";

// https://newdocs.phaser.io/docs/3.80.0/Phaser.Animations.AnimationManager#create

export default class Game extends Phaser.Scene {
  private player: Player;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys?;
  private joyCursors?;
  private joyStick;
  private matchThreePic: Picture;
  private fnafPic: Picture;
  private inTheWoodsPic: Picture;
  private candyHadPic: Picture;
  private cursedPic: Picture;
  private resizeScale: number;

  constructor() {
    // https://stackoverflow.com/questions/52864250/what-is-the-function-of-super-in-phaser-frameworks
    super("game");
  }

  preload() {}

  create() {
    this.resizeScale = SCALE;
    const speed = 100;
    const yPosition = 100;
    const safeAreaX =
      this.cameras.main.width / 2.5 - +this.game.config.width / 2.5;
    const safeAreaY =
      this.cameras.main.height / 2.5 - +this.game.config.height / 4.5 - 5;
    const joyStickPosX = safeAreaX + 300;
    const joyStickPosY = safeAreaY + 450;

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

    console.log("world specs", world);

    const playerPos = worldMap.getMarkerPositionByName("player")!;

    this.player = new Player(
      {
        scene: this,
        x: playerPos.x! * this.resizeScale,
        y: playerPos.y! * this.resizeScale + yPosition,
        key: "character",
      },
      this.resizeScale,
      speed,
    );

    worldMap.addCollision(this.player);
    //worldMap.worldDebug();

    this.cursors = this.input.keyboard?.createCursorKeys();

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

    this.matchThreePic = new Picture(
      {
        scene: this,
        x: matchThreePosition.x! * this.resizeScale,
        y: matchThreePosition.y! * this.resizeScale + yPosition,
        key: "picture",
      },
      this.resizeScale,
      "https://match-three-game.netlify.app/",
    );

    this.fnafPic = new Picture(
      {
        scene: this,
        x: fnafPosition.x! * this.resizeScale,
        y: fnafPosition.y! * this.resizeScale + yPosition,
        key: "picture",
      },
      this.resizeScale,
      "https://www.pixilart.com/art/fnaf-favs-a5042ea5c957897",
    );

    this.inTheWoodsPic = new Picture(
      {
        scene: this,
        x: inTheWoodsPos.x! * this.resizeScale,
        y: inTheWoodsPos.y! * this.resizeScale + yPosition,
        key: "picture",
      },
      this.resizeScale,
      "https://www.pixilart.com/art/rainy-forest-596e36029c4f600",
    );

    this.candyHadPic = new Picture(
      {
        scene: this,
        x: candyHagDashPos.x! * this.resizeScale,
        y: candyHagDashPos.y! * this.resizeScale + yPosition,
        key: "picture",
      },
      this.resizeScale,
      "https://coffeeghoststudios.itch.io/candy-hag-dash",
    );

    this.cursedPic = new Picture(
      {
        scene: this,
        x: cursedPicPos.x! * this.resizeScale,
        y: cursedPicPos.y! * this.resizeScale + yPosition,
        key: "picture",
      },
      this.resizeScale,
    );

    this.matchThreePic.addCollision(this.player);
    this.fnafPic.addCollision(this.player);
    this.inTheWoodsPic.addCollision(this.player);
    this.candyHadPic.addCollision(this.player);
    this.cursedPic.addCollision(this.player);

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
    //cam.zoom = 0.3;

    // EndCamera

    // draw safe area
    let safeArea = this.add
      .rectangle(
        safeAreaX,
        safeAreaY,
        +this.game.config.width / 1.3,
        +this.game.config.height / 1.3,
        0xff00ff,
        0.08,
      )
      .setStrokeStyle(4, 0xff00ff, 0.25)
      .setOrigin(0)
      .setDepth(2)
      .setScrollFactor(0);

    this.joyStick = new VirtualJoystick(this, {
      x: joyStickPosX,
      y: joyStickPosY,
      base: this.add.circle(0, 0, 50, 0x888888),
      thumb: this.add.circle(0, 0, 25, 0xcccccc),
      radius: 50,
      dir: "4dir",
    });
    this.joyCursors = this.joyStick.createCursorKeys();
    console.log("joystick xy", this.joyStick.x, ": ", this.joyStick.y);

    const resize = (displaySize?: any, gameSize?: any) => {
      const newScale = Math.max(this.cameras.main.height / 200, 1);

      // update position of safe area
      if (window.innerWidth < 840 && window.innerWidth > 700) {
        safeArea.x = window.innerWidth / 3;
        safeArea.width = +this.game.config.width;
        safeArea.y = safeAreaY;
        // adjust the controls section
        this.joyStick.x = window.innerWidth / 3 + 100;
        this.joyStick.y = joyStickPosY;
      } else if (window.innerWidth < 700 && window.innerWidth > 645) {
        safeArea.x = window.innerWidth / 3;
        safeArea.width = +this.game.config.width;
        safeArea.y = safeAreaY;
        // adjust the controls section
        this.joyStick.x = window.innerWidth / 3 + 150;
        this.joyStick.y = joyStickPosY;
      } else if (window.innerWidth < 645 && window.innerWidth > 440) {
        safeArea.x = window.innerWidth / 3;
        safeArea.width = +this.game.config.width;
        safeArea.y = safeAreaY;
        // adjust the controls section
        this.joyStick.x = window.innerWidth / 3 + 200;
        this.joyStick.base.radius = 40;
        this.joyStick.thumb.radius = 25;
        this.joyStick.y = joyStickPosY;
      } else if (window.innerWidth < 440 && window.innerWidth > 400) {
        safeArea.x = window.innerWidth / 3;
        safeArea.width = +this.game.config.width;
        safeArea.y = safeAreaY;
        // adjust the controls section
        this.joyStick.x = window.innerWidth / 3 + 400;
        this.joyStick.base.radius = 40;
        this.joyStick.thumb.radius = 25;
        this.joyStick.y = joyStickPosY;
      } else if (window.innerWidth < 400) {
        safeArea.x = window.innerWidth / 3;
        safeArea.width = +this.game.config.width;
        safeArea.y = safeAreaY;
        // adjust the controls section
        this.joyStick.x = window.innerWidth / 3 + 430;
        this.joyStick.base.radius = 40;
        this.joyStick.thumb.radius = 25;
        cam.setBounds(
          -800,
          0,
          world.width * SCALE + 900,
          world.height * SCALE,
          true,
        );
        this.joyStick.y = joyStickPosY;
      } else {
        safeArea.x = safeAreaX;
        safeArea.y = safeAreaY;
        // adjust the controls section
        this.joyStick.x = joyStickPosX;
        this.joyStick.y = joyStickPosY;
      }

      console.log("window inner width", window.innerWidth);

      // // adjust the controls section
      // this.joyStick.x = joyStickPosX;
      // this.joyStick.y = joyStickPosY;

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
      // this.resizeScale = Math.max(this.cameras.main.height / 600, 1);
    };

    this.scale.on("resize", (gameSize, baseSize, displaySize, resolution) => {
      this.cameras.resize(gameSize.width, gameSize.height);
      console.log("gameSize", gameSize.height);
      console.log("baseSize", baseSize);
      console.log("resolution", resolution);
      console.log("✨ safe area x", safeArea.x);
      resize(displaySize, gameSize);
    });

    console.log("resize in scene");
    resize();
  }

  cursedPicInteraction() {
    // enable dresser animation opening
  }

  playerPicInteraction(pic: Picture) {
    // if player is with in the object hitbox AND presses
    // the space bar. Then open an separate link
    console.log("Start player interaction!");
    if (pic.getLink()) {
      window.open(pic.getLink());
    }
  }

  update(time: number, delta: number): void {
    // Player Movement
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

    //End Player Movement

    if (this.matchThreePic.isInInteractZone() && this.cursors?.space.isDown) {
      // Perhaps also check if player is not moving?
      //Handle Player interaction
      this.playerPicInteraction(this.matchThreePic);
    }
    if (this.fnafPic.isInInteractZone() && this.cursors?.space.isDown) {
      // Perhaps also check if player is not moving?
      //Handle Player interaction
      this.playerPicInteraction(this.fnafPic);
    }

    if (this.inTheWoodsPic.isInInteractZone() && this.cursors?.space.isDown) {
      // Perhaps also check if player is not moving?
      //Handle Player interaction
      this.playerPicInteraction(this.inTheWoodsPic);
    }

    if (this.candyHadPic.isInInteractZone() && this.cursors?.space.isDown) {
      // Perhaps also check if player is not moving?
      //Handle Player interaction
      this.playerPicInteraction(this.candyHadPic);
    }

    this.candyHadPic.setInInteractZone(false);
    this.inTheWoodsPic.setInInteractZone(false);
    this.fnafPic.setInInteractZone(false);
    this.matchThreePic.setInInteractZone(false);
  }
}
