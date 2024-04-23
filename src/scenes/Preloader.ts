import Phaser from "phaser";
import room from "../assets/room.png";
import charJSON from "../assets/aseprite/char_walk.json";
import charWalk from "../assets/aseprite/char_walk.png";

const walkPng = require("url:../assets/aseprite/char_walk.png");
const walkJSON = require("url:../assets/aseprite/char_walk.json");

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    this.load.json = walkJSON;
    this.load.image("room", room);
    this.load.aseprite("character", charWalk, charJSON);
  }

  create() {
    this.scene.start("game");
  }
}
