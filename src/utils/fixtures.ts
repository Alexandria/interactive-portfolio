import { BreakPoints } from "~/types";

// Portrait Break points
const XLargeBreakPoint = window.innerWidth < 840 && window.innerWidth > 700;
const LargeBreakPoint = window.innerWidth < 700 && window.innerWidth > 645;
const MediumBreakPoint = window.innerWidth < 645 && window.innerWidth > 440;
const SmallBreakPoint = window.innerWidth < 440 && window.innerWidth > 400;
const XSmallBreakPoint = window.innerWidth < 400;

//Landscape Break points

const XLargeBreakPointLS = window.innerWidth < 940 && window.innerWidth > 850;
const LargeBreakPointLS = window.innerWidth < 850 && window.innerWidth > 750;
const MediumBreakPointLS = window.innerWidth < 750 && window.innerWidth > 700;
const SmallBreakPointLS = window.innerWidth < 700 && window.innerWidth > 600;
const XSmallBreakPointLS = window.innerWidth < 600;

export const portraitBreakPoints: BreakPoints = {
  XLargeBreakPoint: {
    meetsThreshold: XLargeBreakPoint,
    joyStickPos: {
      x: window.innerWidth / 3 + 100,
      y: 620,
    },
  },
  LargeBreakPoint: {
    meetsThreshold: LargeBreakPoint,
    joyStickPos: {
      x: window.innerWidth / 3 + 150,
      y: 620,
    },
  },
  MediumBreakPoint: {
    meetsThreshold: MediumBreakPoint,
    joyStickPos: {
      x: window.innerWidth / 3 + 200,
      y: 620,
    },
  },
  SmallBreakPoint: {
    meetsThreshold: SmallBreakPoint,
    joyStickPos: {
      x: window.innerWidth / 3 + 400,
      y: 620,
    },
  },
  XSmallBreakPoint: {
    meetsThreshold: XSmallBreakPoint,
    joyStickPos: {
      x: window.innerWidth / 3 + 500,
      y: 620,
    },
  },
};

export const landscapeBreakPoints: BreakPoints = {
  XLargeBreakPoint: {
    meetsThreshold: XLargeBreakPointLS,
    joyStickPos: {
      x: window.innerWidth - 650,
      y: window.innerHeight + 50,
    },
  },
  LargeBreakPoint: {
    meetsThreshold: LargeBreakPointLS,
    joyStickPos: {
      x: window.innerWidth / 3 + 50,
      y: window.innerHeight + 70,
    },
  },
  MediumBreakPoint: {
    meetsThreshold: MediumBreakPointLS,
    joyStickPos: {
      x: window.innerWidth / 3 + 100,
      y: window.innerHeight + 90,
    },
  },
  SmallBreakPoint: {
    meetsThreshold: SmallBreakPointLS,
    joyStickPos: {
      x: window.innerWidth / 3 + 150,
      y: window.innerHeight + 90,
    },
  },
  XSmallBreakPoint: {
    meetsThreshold: XSmallBreakPointLS,
    joyStickPos: {
      x: window.innerWidth / 3 + 430,
      y: 620,
    },
  },
};
