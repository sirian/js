// tslint:disable:max-line-length

export type Numbers = { "0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, "11": 11, "12": 12, "13": 13, "14": 14, "15": 15 };
export type Increments = { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 10: 11, 11: 12, 12: 13, 13: 14, 14: 15 };
export type Decrements = { 0: unknown, 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7, 9: 8, 10: 9, 11: 10, 12: 11, 13: 12, 14: 13, 15: 14 };

export type Inc<N extends number> = N extends keyof Increments ? Increments[N] : number;
export type Dec<N extends number> = N extends keyof Decrements ? Decrements[N] : number;

export type Add<X extends number, Y extends number> =
    X extends 0 ? Y :
    Y extends 0 ? X :
    {
        0: number,
        1: Add<Inc<X>, Dec<Y>>,
    }[number extends X | Y ? 0 : 1];
