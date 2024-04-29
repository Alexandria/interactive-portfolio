import Phaser, { LEFT } from "phaser";
import Player from "../components/Player";
import { debugDraw } from "../utils/debugDraw";
import WorldMap from "../components/WorldMap";
import Picture from "../components/Picture";
import { PictureNames } from "../types";
import VirtualJoystick from "phaser3-rex-plugins/plugins/virtualjoystick.js";
import { CANVAS_SCALE, SCALE } from "../main";

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

  constructor() {
    // https://stackoverflow.com/questions/52864250/what-is-the-function-of-super-in-phaser-frameworks
    super("game");
  }

  preload() {}

  create() {
    console.log("scale", SCALE);
    const speed = 200;
    const worldMap = new WorldMap(
      this,
      this.make.tilemap({ key: "tileMap" }),
      SCALE,
    );

    const playerPos = worldMap.getMarkerPositionByName("player")!;

    this.player = new Player(
      {
        scene: this,
        x: playerPos.x! * SCALE,
        y: playerPos.y! * SCALE,
        key: "character",
      },
      SCALE,
      speed,
    );

    const joyStickPos = worldMap.getMarkerPositionByName("joyStick")!;

    this.joyStick = new VirtualJoystick(this, {
      x: joyStickPos.x! * CANVAS_SCALE,
      y: joyStickPos.y! * 7.5,
      base: this.add.circle(0, 0, 50, 0x888888),
      thumb: this.add.circle(0, 0, 25, 0xcccccc),
      radius: 50,
      dir: "4dir",
    });
    this.joyCursors = this.joyStick.createCursorKeys();

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

    console.log("matthree", matchThreePosition);
    this.wasdKeys = this.input.keyboard?.addKeys("W,S,A,D");

    this.matchThreePic = new Picture(
      {
        scene: this,
        x: matchThreePosition.x! * SCALE,
        y: matchThreePosition.y! * SCALE,
        key: "picture",
      },
      SCALE,
      "https://match-three-game.netlify.app/",
    );

    this.fnafPic = new Picture(
      {
        scene: this,
        x: fnafPosition.x! * SCALE,
        y: fnafPosition.y! * SCALE,
        key: "picture",
      },
      SCALE,
      "https://www.pixilart.com/art/fnaf-favs-a5042ea5c957897",
    );

    this.inTheWoodsPic = new Picture(
      {
        scene: this,
        x: inTheWoodsPos.x! * SCALE,
        y: inTheWoodsPos.y! * SCALE,
        key: "picture",
      },
      SCALE,
      "https://www.pixilart.com/art/rainy-forest-596e36029c4f600",
    );

    this.candyHadPic = new Picture(
      {
        scene: this,
        x: candyHagDashPos.x! * SCALE,
        y: candyHagDashPos.y! * SCALE,
        key: "picture",
      },
      SCALE,
      "https://coffeeghoststudios.itch.io/candy-hag-dash",
    );

    this.cursedPic = new Picture(
      {
        scene: this,
        x: cursedPicPos.x! * SCALE,
        y: cursedPicPos.y! * SCALE,
        key: "picture",
      },
      SCALE,
    );

    this.matchThreePic.addCollision(this.player);
    this.fnafPic.addCollision(this.player);
    this.inTheWoodsPic.addCollision(this.player);
    this.candyHadPic.addCollision(this.player);
    this.cursedPic.addCollision(this.player);

    // Camera
    const cam = this.cameras.main;

    cam.startFollow(this.player);
    cam.setBounds(-400, 0, 4900, 1440);
    cam.setViewport(-400, 50, 2000, 1000);
    //cam.zoom = 0.3;

    // EndCamera
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
