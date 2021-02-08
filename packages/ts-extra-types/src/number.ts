import {ToString} from "./cast";

export type Numbers = {
    "0": 0, "1": 1, "2": 2, "3": 3, "4": 4,
    "5": 5, "6": 6, "7": 7, "8": 8, "9": 9,
    "10": 10, "11": 11, "12": 12, "13": 13, "14": 14, "15": 15,
};

export type SNumber = ToString<number>;

export type Increments = {
    0: 1, 1: 2, 2: 3, 3: 4, 4: 5,
    5: 6, 6: 7, 7: 8, 8: 9, 9: 10,
    10: 11, 11: 12, 12: 13, 13: 14, 14: 15,
};
export type Decrements = {
    0: -1, 1: 0, 2: 1, 3: 2, 4: 3,
    5: 4, 6: 5, 7: 6, 8: 7, 9: 8,
    10: 9, 11: 10, 12: 11, 13: 12, 14: 13, 15: 14,
};

export type Decs = keyof Decrements;
export type Incs = keyof Increments;

export type Inc<N extends number> = N extends Incs ? Increments[N] : number;
export type Dec<N extends number> = N extends Decs ? Decrements[N] : number;

export type Add<X extends number, Y extends number> =
    X extends 0 ? Y :
    Y extends 0 ? X :
    X extends Incs
    ? Y extends Decs
      ? Add<Inc<X>, Dec<Y>>
      : number
    : number;
