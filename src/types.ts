export const PictureNames = {
  MatchThree: "matchThree",
  FNAF: "fnaf",
  InTheWoods: "inTheWoods",
  CandyHagDash: "candyHagDash",
  CursedPic: "cursedPic",
};

export type PictureNamesType = typeof PictureNames;

export type PictureOptions = PictureNamesType[keyof PictureNamesType];
