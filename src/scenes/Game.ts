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

const isMobile = () => {
  // https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a,
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4),
      )
    )
      check = true;
  })(navigator.userAgent);
  return check;
};

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
  private isMobile: boolean;

  constructor() {
    // https://stackoverflow.com/questions/52864250/what-is-the-function-of-super-in-phaser-frameworks
    super("game");
  }

  preload() {}

  create() {
    this.resizeScale = SCALE;
    this.isMobile = false;
    const speed = 100;
    const yPosition = 100;
    const safeAreaX =
      this.cameras.main.width / 2.5 - +this.game.config.width / 2.5;
    const safeAreaY =
      this.cameras.main.height / 2.5 - +this.game.config.height / 4.5 - 5;
    const joyStickPosX = safeAreaX + 300;
    const joyStickPosY = safeAreaY + 450;
    const actionButtonX = joyStickPosX + 500;
    const actionButtonY = joyStickPosY;

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
    // Likely will need to remove button and have player press on things to interact with them
    var actionButton = this.add
      .circle(actionButtonX, actionButtonY, 40, 0x888888)
      .setStrokeStyle(2, 0x888888)
      .setInteractive()
      .setScrollFactor(0)
      .on("pointerdown", () => {
        console.log("is Pressed!");
      });

    const resize = (displaySize?: any, gameSize?: any) => {
      this.isMobile = isMobile();
      if (!this.isMobile) {
        this.joyStick.setVisible(false);
        actionButton.setVisible(false);
      } else {
        this.joyStick.setVisible(true);
        actionButton.setVisible(true);
      }
      console.log("isMobile", this.isMobile);
      // handle landscape versus Portrait

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
        actionButton.x = window.innerWidth / 3 + 600;
        actionButton.y = joyStickPosY;
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
