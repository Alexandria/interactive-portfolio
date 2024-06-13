import Phaser from "phaser";
import room from "../assets/room.png";
import wallTiles from "../../public/tiles/basic-wallpapper.png";
import edgeTiles from "../../public/tiles/basic-walledge.png";
import floorTiles from "../../public/tiles/basic-floor.png";
import decorTiles from "../../public/tiles/decorations.png";
import picutreTiles from "../../public/tiles/objects.png";
import storageTiles from "../../public/tiles/storage.png";
import tileMap from "../../public/tiles/room.json";
import charJSON from "../assets/aseprite/char_walk.json";
import charWalk from "../assets/aseprite/char_walk.png";
import picture from "../../public/tiles/objects.png";
import sign from "../../public/tiles/sign.png";
import lightPng from "../assets/aseprite/flashingLight.png";
import lightJSON from "../assets/aseprite/flashingLight.json";
import cursedPicturePNG from "../assets/aseprite/cursedPhoto.png";
import cursedPictureJSON from "../assets/aseprite/cursedPhoto.json";
import cabinetPNG from "../assets/aseprite/cabinet.png";
import cabinetJSON from "../assets/aseprite/cabinet.json";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    this.load.image("room", room);
    this.load.tilemapTiledJSON("tileMap", tileMap);
    this.load.aseprite("character", charWalk, charJSON);
    this.load.aseprite("light", lightPng, lightJSON);
    this.load.aseprite("cursedPicture", cursedPicturePNG, cursedPictureJSON);
    this.load.aseprite("cabinet", cabinetPNG, cabinetJSON);
    this.load.image("wallTiles", wallTiles);
    this.load.image("edgeTiles", edgeTiles);
    this.load.image("floorTiles", floorTiles);
    this.load.image("decorTiles", decorTiles);
    this.load.image("storageTiles", storageTiles);
    this.load.image("picutreTiles", picutreTiles);
    this.load.image("picture", picture);
    this.load.image("sign", sign);
    this.load.plugin(
      "rexvirtualjoystickplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js",
      true,
    );
  }

  create() {
    this.scene.start("game");
  }
}
