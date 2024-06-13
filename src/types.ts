export const PictureNames = {
  MatchThree: "matchThree",
  FNAF: "fnaf",
  InTheWoods: "inTheWoods",
  CandyHagDash: "candyHagDash",
  CursedPic: "cursedPic",
  Light: "light",
};

export type PictureNamesType = typeof PictureNames;

export type PictureOptions = PictureNamesType[keyof PictureNamesType];

type BreakPoint = {
  meetsThreshold: boolean;
  joyStickPos: {
    x: number;
    y: number;
  };
};

export type BreakPoints = {
  XLargeBreakPoint: BreakPoint;
  LargeBreakPoint: BreakPoint;
  MediumBreakPoint: BreakPoint;
  SmallBreakPoint: BreakPoint;
  XSmallBreakPoint: BreakPoint;
};

export interface Config {
  scene: Phaser.Scene;
  x: number;
  y: number;
  key: string;
}
